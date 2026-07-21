// ─────────────────────────────────────────────────────────────────────────
// Automatisation des bulletins reçus sur inscriptions@blackgeniuscanada.org
// ─────────────────────────────────────────────────────────────────────────
//
// Cloudflare Email Routing peut invoquer un Worker à chaque courriel entrant
// (au lieu de simplement le rediriger). Ce module fournit le handler `email`
// branché dans worker.js, qui, pour chaque courriel reçu sur
// inscriptions@blackgeniuscanada.org :
//
//   1. Transfère une copie vers la boîte principale (blackgenius225@gmail.com)
//   2. Retrouve la fiche Notion "Inscription" correspondante (base "site
//      internet") via le courriel du parent (repli sur le nom de l'enfant
//      dans l'objet) et coche "Bulletins joints"
//   3. Dépose chaque pièce jointe dans le dossier Google Drive de l'enfant,
//      sous 02_Portfolio des enfants/<Enfant>/01_DOSSIER_ACADÉMIQUE
//      (crée le dossier enfant + ses 9 sous-dossiers standards s'il n'existe
//      pas encore)
//   4. Si aucune correspondance fiable n'est trouvée, n'invente rien : le
//      courriel est transféré normalement (étape 1) et un signalement est
//      envoyé au coordinateur pour un rattachement manuel.
//
// ─────────────────────────────────────────────────────────────────────────
// CONFIGURATION REQUISE AVANT DÉPLOIEMENT (aucune de ces étapes n'est faite
// automatiquement — elles demandent un accès que ce Worker n'a pas) :
//
//   A. Règle de routage Cloudflare Email Routing
//      Dashboard Cloudflare > blackgeniuscanada.org > Email > Email Routing
//      > Routing rules > associer inscriptions@blackgeniuscanada.org à
//      "Send to a Worker" > sélectionner ce Worker (site-internet).
//
//   B. Autorisation OAuth Google (pour écrire dans Drive sans intervention
//      humaine à chaque fois) :
//
//      IMPORTANT : un compte de service seul (sans Google Workspace) n'a PAS
//      de quota de stockage Drive — il peut créer des dossiers mais pas y
//      déposer de fichiers (erreur 403 "Service Accounts do not have
//      storage quota"). On utilise donc une autorisation OAuth classique au
//      nom du compte Google réel (blackgenius225@gmail.com), qui lui a du
//      quota.
//
//      1. Google Cloud Console > Google Auth Platform > créer un écran de
//         consentement OAuth (Externe), ajouter le scope
//         https://www.googleapis.com/auth/drive, puis "Publier l'application"
//         (sinon le refresh token expire au bout de 7 jours en mode Test).
//      2. Clients > Créer un client OAuth > type "Application Web", avec
//         comme URI de redirection autorisé :
//         https://developers.google.com/oauthplayground
//      3. Sur https://developers.google.com/oauthplayground : icône
//         d'engrenage (haut droite) > cocher "Use your own OAuth
//         credentials" > coller le Client ID et le Client Secret obtenus à
//         l'étape 2.
//      4. Dans la liste des scopes à gauche, entrer
//         https://www.googleapis.com/auth/drive > Authorize APIs > se
//         connecter avec blackgenius225@gmail.com > accepter l'avertissement
//         "Google n'a pas validé cette appli" (normal pour une appli à usage
//         interne) > Autoriser.
//      5. Cliquer "Exchange authorization code for tokens" et copier le
//         "Refresh token" affiché.
//      6. Enregistrer trois secrets Worker :
//         wrangler secret put GOOGLE_OAUTH_CLIENT_ID
//         wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET
//         wrangler secret put GOOGLE_OAUTH_REFRESH_TOKEN
//      7. Enregistrer l'ID du dossier racine comme variable :
//         GOOGLE_PORTFOLIO_FOLDER_ID = "1aOTlAwKMFHKK2DlsVkmtUtOFjmbH0QzU"
//         (déjà l'ID actuel de "02_Portfolio des enfants")
//      8. Partager le dossier Drive "02_Portfolio des enfants" avec
//         blackgenius225@gmail.com n'est pas nécessaire (c'est déjà son
//         propre compte) — si un autre compte Google est utilisé pour
//         l'autorisation, partager le dossier avec ce compte en Éditeur.
//
//   C. Secret Notion déjà existant (NOTION_TOKEN) — aucune action requise,
//      réutilisé tel quel depuis worker.js.
//
// Tant que B n'est pas fait, l'étape 3 (dépôt Drive) échoue silencieusement
// (voir uploadAttachmentsToDrive : si les secrets OAuth sont absents, la
// fonction ne fait rien plutôt que de planter tout le traitement du
// courriel — le transfert et la mise à jour Notion continuent de fonctionner
// même sans Drive configuré). En cas d'échec d'upload (ex. token expiré),
// un courriel de triage est envoyé automatiquement au coordinateur.
// ─────────────────────────────────────────────────────────────────────────

import PostalMime from "postal-mime";

const NOTION_DATABASE_URL_SOURCE = "6493824d-ccc1-400c-9e54-5e94234492f8"; // data source "site internet"
const INSCRIPTIONS_ADDRESS = "inscriptions@blackgeniuscanada.org";
const MAIN_MAILBOX = "blackgenius225@gmail.com";

const CHILD_SUBFOLDERS = [
  "01_DOSSIER_ACADÉMIQUE",
  "02_CONCOURS_ET_COMPÉTITIONS",
  "03_PRIX_ET_DISTINCTIONS",
  "04_ACTIVITÉS_PARASCOLAIRES_ET_LEADERSHIP",
  "05_PROJETS_DE_RECHERCHE_ET_CRÉATION",
  "06_LETTRES_DE_RECOMMANDATION_STRATÉGIQUES",
  "07_JOURNAL_DE_BORD_PERSONNEL",
  "08_DOSSIER_FINANCIER_ET_BOURSES",
  "09_AUTRES",
];

export async function handleInscriptionEmail(message, env, ctx) {
  const to = (message.to || "").toLowerCase();
  if (to !== INSCRIPTIONS_ADDRESS) {
    // Pas notre adresse (ne devrait pas arriver si la règle de routage est
    // bien scopée) — on transfère par prudence sans traitement particulier.
    await safeForward(message, MAIN_MAILBOX);
    return;
  }

  // 1. Toujours transférer vers la boîte principale, quoi qu'il arrive
  //    ensuite. On ne veut jamais qu'un bug dans les étapes 2-3 fasse
  //    disparaître un courriel de parent.
  await safeForward(message, MAIN_MAILBOX);

  // 2. Parser le courriel brut (sujet, expéditeur, pièces jointes)
  let parsed;
  try {
    const rawBuffer = await streamToArrayBuffer(message.raw);
    parsed = await PostalMime.parse(rawBuffer);
  } catch (err) {
    await notifyTriage(env, "Échec d'analyse d'un courriel reçu sur inscriptions@", String(err));
    return;
  }

  const attachments = (parsed.attachments || []).filter(
    (a) => a.disposition !== "inline" && a.content && a.content.byteLength > 0
  );
  if (attachments.length === 0) {
    // Courriel sans pièce jointe (question, suivi, etc.) : rien de plus à
    // automatiser, le transfert de l'étape 1 suffit.
    return;
  }

  const subject = parsed.subject || "";
  const fromEmail = (message.from || "").toLowerCase();
  const { childNameGuess, parentEmailGuess } = parseSubjectHints(subject);

  // 3. Retrouver la fiche Notion "Inscription" correspondante.
  //    Priorité au courriel du parent (expéditeur, ou celui indiqué dans
  //    l'objet si différent) ; on affine par nom d'enfant si plusieurs
  //    fiches partagent le même parent.
  let page;
  try {
    page = await findInscriptionPage(env, {
      candidateEmails: [fromEmail, parentEmailGuess].filter(Boolean),
      childNameGuess,
    });
  } catch (err) {
    await notifyTriage(env, "Erreur Notion en traitant un bulletin", String(err));
    page = null;
  }

  if (!page) {
    await notifyTriage(
      env,
      "Bulletin reçu — enfant non identifié automatiquement",
      `Un courriel avec ${attachments.length} pièce(s) jointe(s) est arrivé sur inscriptions@ ` +
        `mais n'a pas pu être rattaché automatiquement à une fiche Notion.\n\n` +
        `Expéditeur : ${fromEmail}\nObjet : ${subject}\n\n` +
        `Le courriel a bien été transféré à la boîte principale — un rattachement manuel est nécessaire.`
    );
    return;
  }

  const childName =
    page.properties?.["Nom de l'enfant"]?.title?.[0]?.plain_text || childNameGuess || "Enfant (nom inconnu)";

  // 4. Cocher "Bulletins joints" sur la fiche
  try {
    await updateNotionCheckbox(env, page.id, "Bulletins joints", true);
  } catch (err) {
    await notifyTriage(env, `Échec de mise à jour Notion pour ${childName}`, String(err));
  }

  // 5. Déposer les pièces jointes dans le bon dossier Drive
  try {
    await uploadAttachmentsToDrive(env, childName, attachments);
  } catch (err) {
    await notifyTriage(env, `Échec de dépôt Google Drive pour ${childName}`, String(err));
  }
}

async function safeForward(message, to) {
  try {
    await message.forward(to);
  } catch (err) {
    // Le transfert peut échouer si l'adresse de destination n'est pas
    // vérifiée dans Cloudflare Email Routing — on ne bloque pas le reste
    // du traitement pour autant.
  }
}

async function streamToArrayBuffer(stream) {
  return await new Response(stream).arrayBuffer();
}

// Objet attendu (convention ajoutée sur le site) :
//   "Bulletin Prénom Nom — parent@courriel.com"
function parseSubjectHints(subject) {
  const emailMatch = subject.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const parentEmailGuess = emailMatch ? emailMatch[0].toLowerCase() : null;

  let childNameGuess = subject
    .replace(/bulletin/gi, "")
    .replace(emailMatch ? emailMatch[0] : "", "")
    .replace(/[—–\-:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return { childNameGuess: childNameGuess || null, parentEmailGuess };
}

// ─── Notion ─────────────────────────────────────────────────────────────

async function queryNotionDataSource(env, filter) {
  const res = await fetch(`https://api.notion.com/v1/data_sources/${NOTION_DATABASE_URL_SOURCE}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": "2025-09-03",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter }),
  });
  if (!res.ok) {
    throw new Error(`Notion query error (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.results || [];
}

async function findInscriptionPage(env, { candidateEmails, childNameGuess }) {
  for (const email of candidateEmails) {
    const results = await queryNotionDataSource(env, {
      and: [
        { property: "Type", select: { equals: "Inscription" } },
        { property: "Courriel parent", email: { equals: email } },
      ],
    });
    if (results.length === 1) return results[0];
    if (results.length > 1 && childNameGuess) {
      const normalized = normalize(childNameGuess);
      const match = results.find((p) => {
        const name = p.properties?.["Nom de l'enfant"]?.title?.[0]?.plain_text || "";
        return normalize(name).includes(normalized) || normalized.includes(normalize(name));
      });
      if (match) return match;
    }
    if (results.length >= 1) return results[0]; // dernier repli : la plus récente correspondance sur ce courriel
  }
  return null;
}

async function updateNotionCheckbox(env, pageId, propertyName, value) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties: { [propertyName]: { checkbox: value } } }),
  });
  if (!res.ok) {
    throw new Error(`Notion update error (${res.status}): ${await res.text()}`);
  }
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacritiques combinants après NFD
    .replace(/[^a-z0-9]/g, "");
}

// ─── Google Drive ───────────────────────────────────────────────────────

async function uploadAttachmentsToDrive(env, childName, attachments) {
  // DEBUG TEMPORAIRE — à retirer une fois le pipeline confirmé fonctionnel.
  // On ne log jamais les valeurs des secrets, seulement leur présence.
  console.log(
    "[bulletin-debug] guard check:",
    JSON.stringify({
      hasClientId: !!env.GOOGLE_OAUTH_CLIENT_ID,
      hasClientSecret: !!env.GOOGLE_OAUTH_CLIENT_SECRET,
      hasRefreshToken: !!env.GOOGLE_OAUTH_REFRESH_TOKEN,
      hasFolderId: !!env.GOOGLE_PORTFOLIO_FOLDER_ID,
    })
  );

  if (
    !env.GOOGLE_OAUTH_CLIENT_ID ||
    !env.GOOGLE_OAUTH_CLIENT_SECRET ||
    !env.GOOGLE_OAUTH_REFRESH_TOKEN ||
    !env.GOOGLE_PORTFOLIO_FOLDER_ID
  ) {
    // Pas encore configuré (voir en-tête du fichier) — on n'échoue pas fort,
    // le transfert courriel + Notion ont déjà eu lieu.
    console.log("[bulletin-debug] early return: au moins un secret OAuth/dossier manquant");
    return;
  }

  console.log("[bulletin-debug] tous les secrets présents, demande de jeton d'accès...");
  const accessToken = await getGoogleAccessToken(env);
  console.log("[bulletin-debug] jeton d'accès obtenu:", !!accessToken);

  const childFolderId = await findOrCreateFolder(accessToken, childName, env.GOOGLE_PORTFOLIO_FOLDER_ID);
  console.log("[bulletin-debug] dossier enfant:", childFolderId);

  // S'assurer que la structure standard à 9 sous-dossiers existe
  let academicFolderId = null;
  for (const subfolder of CHILD_SUBFOLDERS) {
    const id = await findOrCreateFolder(accessToken, subfolder, childFolderId);
    if (subfolder === CHILD_SUBFOLDERS[0]) academicFolderId = id;
  }
  console.log("[bulletin-debug] dossier académique:", academicFolderId);

  for (const att of attachments) {
    await uploadFileToDrive(accessToken, academicFolderId, att.filename || "bulletin.pdf", att.mimeType, att.content);
    console.log("[bulletin-debug] fichier téléversé:", att.filename);
  }
}

async function findOrCreateFolder(accessToken, name, parentId) {
  const q = encodeURIComponent(
    `name = '${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!searchRes.ok) throw new Error(`Drive search error (${searchRes.status}): ${await searchRes.text()}`);
  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) return searchData.files[0].id;

  const createRes = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    }),
  });
  if (!createRes.ok) throw new Error(`Drive create folder error (${createRes.status}): ${await createRes.text()}`);
  const created = await createRes.json();
  return created.id;
}

async function uploadFileToDrive(accessToken, parentId, filename, mimeType, contentArrayBuffer) {
  const metadata = { name: filename, parents: [parentId] };
  const boundary = "blackgenius225-boundary";
  const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const filePartHeader = `--${boundary}\r\nContent-Type: ${mimeType || "application/octet-stream"}\r\n\r\n`;
  const closing = `\r\n--${boundary}--`;

  const encoder = new TextEncoder();
  const body = concatArrayBuffers([
    encoder.encode(metadataPart).buffer,
    encoder.encode(filePartHeader).buffer,
    contentArrayBuffer,
    encoder.encode(closing).buffer,
  ]);

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });
  if (!res.ok) throw new Error(`Drive upload error (${res.status}): ${await res.text()}`);
}

function concatArrayBuffers(buffers) {
  const total = buffers.reduce((sum, b) => sum + b.byteLength, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const b of buffers) {
    result.set(new Uint8Array(b), offset);
    offset += b.byteLength;
  }
  return result;
}

// Jeton d'accès Google obtenu via un refresh token OAuth2 standard (compte
// Google réel, pas un compte de service — voir en-tête du fichier pour
// pourquoi). Le refresh token ne change pas ; on échange contre un nouveau
// access_token (valide ~1h) à chaque envoi de courriel.
async function getGoogleAccessToken(env) {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Google OAuth error (${tokenRes.status}): ${await tokenRes.text()}`);
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// ─── Notifications de triage manuel ────────────────────────────────────

async function notifyTriage(env, subject, body) {
  if (!env.SEB) return;
  const { EmailMessage } = await import("cloudflare:email");
  const raw =
    `From: BlackGenius Canada <noreply@blackgeniuscanada.org>\r\n` +
    `To: ${MAIN_MAILBOX}\r\n` +
    `Subject: [Bulletin] ${subject.replace(/[\r\n]/g, " ")}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
    body;
  const message = new EmailMessage("noreply@blackgeniuscanada.org", MAIN_MAILBOX, raw);
  await env.SEB.send(message);
}
