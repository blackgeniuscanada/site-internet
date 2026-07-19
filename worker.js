import { EmailMessage } from "cloudflare:email";

const NOTION_DATABASE_ID = "05ba84c1850c4f088fb2bec9ec0da244"; // Database "site internet"
const NOTIFY_FROM = "noreply@blackgeniuscanada.org";
const NOTIFY_TO = "blackgenius225@gmail.com";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/submit") {
      return handleSubmit(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleSubmit(request, env, ctx) {
  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    return jsonResponse({ error: "Requête invalide." }, 400);
  }

  // Honeypot anti-bot : si rempli, on prétend que tout s'est bien passé sans rien faire.
  if ((formData.get("website_url") || "").toString().trim() !== "") {
    return jsonResponse({ ok: true });
  }

  const formType = (formData.get("form_type") || "").toString();

  try {
    if (formType === "don") {
      await handleDon(formData, env, ctx);
    } else if (formType === "benevole") {
      await handleBenevole(formData, env, ctx);
    } else if (formType === "contact") {
      await handleContact(formData, env, ctx);
    } else if (formType === "newsletter") {
      await handleNewsletter(formData, env, ctx);
    } else if (formType === "consentement") {
      await handleConsentement(formData, env, ctx, request);
    } else if (formType === "autorisation_image") {
      await handleAutorisationImage(formData, env, ctx, request);
    } else {
      return jsonResponse({ error: "Type de formulaire inconnu." }, 400);
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      return jsonResponse({ error: err.message }, 400);
    }
    return jsonResponse({
      error: "Erreur d'envoi. Réessayez ou écrivez à contact@blackgeniuscanada.org.",
    }, 500);
  }

  return jsonResponse({ ok: true });
}

// Erreur de validation métier (montant, champs requis...) : distincte des erreurs
// techniques (Notion/Brevo indisponibles) pour renvoyer un message précis (400)
// au lieu du message générique "Erreur d'envoi" (500).
class ValidationError extends Error {}

async function handleDon(formData, env, ctx) {
  const prenom = str(formData, "prenom");
  const nom = str(formData, "nom");
  const email = str(formData, "email");
  const autreMontant = str(formData, "autre_montant");

  // BUG FIX (sécurité/intégrité des données) : le formulaire valide le montant
  // côté navigateur (min/max/step), mais rien n'empêchait un appel direct à
  // /api/submit de soumettre un montant négatif, nul ou aberrant — le
  // navigateur peut être contourné, le serveur doit revalider.
  let montant;
  if (autreMontant) {
    const n = parseFloat(autreMontant.replace(",", "."));
    if (isNaN(n) || n < 5 || n > 999999.99) {
      throw new ValidationError("Montant de don invalide (minimum 5 $, maximum 999 999,99 $).");
    }
    montant = `${n.toFixed(2)} $`;
  } else {
    montant = str(formData, "amount");
  }

  const freq = str(formData, "freq");
  const affectation = str(formData, "affectation");

  const noteInterne = [
    `Montant : ${montant || "non précisé"}`,
    `Fréquence : ${freq || "non précisée"}`,
    `Affectation : ${affectation || "non précisée"}`,
  ].join("\n");

  await createNotionPage(env, {
    "Nom de l'enfant": title(`${prenom} ${nom}`.trim() || "Don sans nom"),
    "Nom parent": richText(nom),
    "Courriel parent": email ? { email } : undefined,
    "Type": select("Don"),
    "Source": select("Site web"),
    "Statut": select("Nouveau"),
    "Note interne": richText(noteInterne),
  });

  ctx.waitUntil(
    sendNotificationEmail(
      env,
      `Nouveau don — ${prenom} ${nom}`.trim(),
      `Nouvelle intention de don reçue sur le site.\n\nNom : ${prenom} ${nom}\nCourriel : ${email}\n\n${noteInterne}`
    ).catch(() => {})
  );
}

async function handleBenevole(formData, env, ctx) {
  const prenom = str(formData, "prenom");
  const nom = str(formData, "nom");
  const email = str(formData, "email");
  const telephone = str(formData, "telephone");
  const profession = str(formData, "profession");
  const missions = formData.getAll("missions").map((m) => m.toString());
  const motivation = str(formData, "motivation");

  const noteInterne = [
    `Profession : ${profession || "non précisée"}`,
    `Mission(s) : ${missions.length ? missions.join(", ") : "non précisée(s)"}`,
  ].join("\n");

  await createNotionPage(env, {
    "Nom de l'enfant": title(`${prenom} ${nom}`.trim() || "Bénévole sans nom"),
    "Nom parent": richText(nom),
    "Courriel parent": email ? { email } : undefined,
    "Téléphone parent": telephone ? { phone_number: telephone } : undefined,
    "Type": select("Bénévole"),
    "Source": select("Site web"),
    "Statut": select("Nouveau"),
    "Motivations": richText(motivation),
    "Note interne": richText(noteInterne),
  });

  ctx.waitUntil(
    sendNotificationEmail(
      env,
      `Nouvelle candidature bénévole — ${prenom} ${nom}`.trim(),
      `Nouvelle candidature bénévole reçue sur le site.\n\nNom : ${prenom} ${nom}\nCourriel : ${email}\nTéléphone : ${telephone || "non précisé"}\n\n${noteInterne}\n\nMotivation :\n${motivation || "(non précisée)"}`
    ).catch(() => {})
  );
}

async function handleContact(formData, env, ctx) {
  const prenom = str(formData, "prenom");
  const nom = str(formData, "nom");
  const email = str(formData, "email");
  const telephone = str(formData, "telephone");
  const sujet = str(formData, "sujet");
  const message = str(formData, "message");

  const noteInterne = [
    `Sujet : ${sujet || "non précisé"}`,
    `Message : ${message || "non précisé"}`,
  ].join("\n");

  await createNotionPage(env, {
    "Nom de l'enfant": title(`${prenom} ${nom}`.trim() || "Contact sans nom"),
    "Nom parent": richText(nom),
    "Courriel parent": email ? { email } : undefined,
    "Téléphone parent": telephone ? { phone_number: telephone } : undefined,
    "Type": select("Contact"),
    "Source": select("Site web"),
    "Statut": select("Nouveau"),
    "Motivations": richText(message),
    "Note interne": richText(noteInterne),
  });

  ctx.waitUntil(
    sendNotificationEmail(
      env,
      `Nouveau message de contact — ${prenom} ${nom}`.trim(),
      `Nouveau message reçu via le formulaire de contact du site.\n\nNom : ${prenom} ${nom}\nCourriel : ${email}\nTéléphone : ${telephone || "non précisé"}\n\n${noteInterne}`
    ).catch(() => {})
  );
}

async function handleConsentement(formData, env, ctx, request) {
  const nomParent = str(formData, "nom_parent");
  const lienEnfant = str(formData, "lien_enfant");
  const nomEnfant = str(formData, "nom_enfant");
  const email = str(formData, "email");
  const telephone = str(formData, "telephone");
  const signature = str(formData, "signature");
  const versionPolitique = str(formData, "version_politique");
  const ip = request.headers.get("CF-Connecting-IP") || "";

  if (!nomParent || !email || !signature) {
    throw new Error("Champs obligatoires manquants (nom, courriel ou signature).");
  }

  const noteInterne = [
    `Consentement Loi 25 donné en ligne le ${new Date().toISOString()}.`,
    `Enfant : ${nomEnfant || "non précisé"}`,
    `Lien avec l'enfant : ${lienEnfant || "non précisé"}`,
    `Version de la politique acceptée : ${versionPolitique || "non précisée"}`,
    `Adresse IP : ${ip || "non précisée"}`,
  ].join("\n");

  await createNotionPage(env, {
    "Nom de l'enfant": title(nomEnfant || `Consentement — ${nomParent}`),
    "Nom parent": richText(nomParent),
    "Courriel parent": email ? { email } : undefined,
    "Téléphone parent": telephone ? { phone_number: telephone } : undefined,
    "Lien avec enfant": select(lienEnfant),
    "Type": select("Consentement"),
    "Source": select("Site web"),
    "Statut": select("Nouveau"),
    "Loi 25 consentement": checkbox(true),
    "Version politique acceptée": richText(versionPolitique),
    "Signature électronique": richText(signature),
    "Adresse IP": richText(ip),
    "Note interne": richText(noteInterne),
  });

  ctx.waitUntil(
    sendNotificationEmail(
      env,
      `Nouveau consentement Loi 25 — ${nomParent}`,
      `Un parent a donné son consentement en ligne à la politique de confidentialité.\n\nParent : ${nomParent} (${lienEnfant || "lien non précisé"})\nEnfant : ${nomEnfant || "non précisé"}\nCourriel : ${email}\nTéléphone : ${telephone || "non précisé"}\nSignature électronique : ${signature}\nVersion de la politique acceptée : ${versionPolitique || "non précisée"}\nAdresse IP : ${ip || "non précisée"}`
    ).catch(() => {})
  );
}

async function handleAutorisationImage(formData, env, ctx, request) {
  const nomParent = str(formData, "nom_parent");
  const lienEnfant = str(formData, "lien_enfant");
  const nomEnfant = str(formData, "nom_enfant");
  const email = str(formData, "email");
  const telephone = str(formData, "telephone");
  const signature = str(formData, "signature");
  const autorisation = str(formData, "autorisation"); // "Accordée" ou "Refusée"
  const contextes = formData.getAll("contextes").map((c) => c.toString());
  const versionDocument = str(formData, "version_document");
  const ip = request.headers.get("CF-Connecting-IP") || "";

  if (!nomParent || !email || !signature || !autorisation) {
    throw new Error("Champs obligatoires manquants (nom, courriel, signature ou choix d'autorisation).");
  }

  const noteInterne = [
    `Autorisation droit à l'image donnée en ligne le ${new Date().toISOString()}.`,
    `Décision : ${autorisation}`,
    `Enfant : ${nomEnfant || "non précisé"}`,
    `Lien avec l'enfant : ${lienEnfant || "non précisé"}`,
    `Contextes autorisés : ${contextes.length ? contextes.join(", ") : "non précisé"}`,
    `Version du document accepté : ${versionDocument || "non précisée"}`,
    `Adresse IP : ${ip || "non précisée"}`,
  ].join("\n");

  await createNotionPage(env, {
    "Nom de l'enfant": title(nomEnfant || `Autorisation image — ${nomParent}`),
    "Nom parent": richText(nomParent),
    "Courriel parent": email ? { email } : undefined,
    "Téléphone parent": telephone ? { phone_number: telephone } : undefined,
    "Lien avec enfant": select(lienEnfant),
    "Type": select("Autorisation image"),
    "Source": select("Site web"),
    "Statut": select("Nouveau"),
    "Autorisation image": select(autorisation),
    "Version document accepté": richText(versionDocument),
    "Signature électronique": richText(signature),
    "Adresse IP": richText(ip),
    "Note interne": richText(noteInterne),
  });

  ctx.waitUntil(
    sendNotificationEmail(
      env,
      `Autorisation image (${autorisation}) — ${nomParent}`,
      `Un parent a répondu au formulaire d'autorisation droit à l'image.\n\nDécision : ${autorisation}\nParent : ${nomParent} (${lienEnfant || "lien non précisé"})\nEnfant : ${nomEnfant || "non précisé"}\nCourriel : ${email}\nTéléphone : ${telephone || "non précisé"}\nContextes autorisés : ${contextes.length ? contextes.join(", ") : "non précisé"}\nSignature électronique : ${signature}\nVersion du document accepté : ${versionDocument || "non précisée"}\nAdresse IP : ${ip || "non précisée"}`
    ).catch(() => {})
  );
}

async function handleNewsletter(formData, env, ctx) {
  const email = str(formData, "email");
  if (!email) throw new Error("Courriel manquant.");

  // On envoie en parallèle vers Notion (suivi interne) et Brevo (envoi réel des
  // courriels). Si l'un des deux échoue, on ne bloque pas l'autre : l'abonné
  // ne doit pas voir une erreur juste parce qu'un des deux systèmes a un pépin.
  const results = await Promise.allSettled([
    createNotionPage(env, {
      "Nom de l'enfant": title(`Infolettre — ${email}`),
      "Courriel parent": { email },
      "Type": select("Infolettre"),
      "Source": select("Site web"),
      "Statut": select("Nouveau"),
    }),
    addToBrevo(env, email),
  ]);

  if (results.every((r) => r.status === "rejected")) {
    throw new Error("Notion et Brevo ont échoué : " + results.map((r) => r.reason).join(" | "));
  }
}

async function addToBrevo(env, email) {
  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
    throw new Error("Brevo non configuré (BREVO_API_KEY ou BREVO_LIST_ID manquant).");
  }
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email,
      listIds: [Number(env.BREVO_LIST_ID)],
      updateEnabled: true,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    // Déjà abonné = pas une vraie erreur, l'important c'est qu'il soit dans la liste.
    if (!errText.includes("duplicate_parameter")) {
      throw new Error(`Brevo API error (${res.status}): ${errText}`);
    }
  }
}

function str(formData, key) {
  const v = formData.get(key);
  return v ? v.toString().trim() : "";
}

function title(text) {
  return { title: [{ text: { content: text.slice(0, 2000) } }] };
}

function richText(text) {
  if (!text) return undefined;
  return { rich_text: [{ text: { content: text.slice(0, 2000) } }] };
}

function select(name) {
  if (!name) return undefined;
  return { select: { name } };
}

function checkbox(value) {
  return { checkbox: !!value };
}

async function createNotionPage(env, propertiesRaw) {
  const properties = {};
  for (const [k, v] of Object.entries(propertiesRaw)) {
    if (v !== undefined) properties[k] = v;
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Notion API error (${res.status}): ${errText}`);
  }
}

async function sendNotificationEmail(env, subject, body) {
  if (!env.SEB) return;
  const safeSubject = subject.replace(/[\r\n]/g, " ");
  const raw =
    `From: BlackGenius Canada <${NOTIFY_FROM}>\r\n` +
    `To: ${NOTIFY_TO}\r\n` +
    `Subject: ${safeSubject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
    body;

  const message = new EmailMessage(NOTIFY_FROM, NOTIFY_TO, raw);
  await env.SEB.send(message);
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
