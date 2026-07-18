import { EmailMessage } from "cloudflare:email";

const NOTION_DATABASE_ID = "05ba84c1850c4f088fb2bec9ec0da244"; // Database "site internet"
const NOTIFY_FROM = "noreply@blackgeniuscanada.org";
const NOTIFY_TO = "blackgenius225@gmail.com";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/submit") {
      return handleSubmit(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleSubmit(request, env) {
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
    } else {
      return jsonResponse({ error: "Type de formulaire inconnu." }, 400);
    }
  } catch (err) {
    return jsonResponse({
      error: "Erreur d'envoi. Réessayez ou écrivez à contact@blackgeniuscanada.org.",
    }, 500);
  }

  return jsonResponse({ ok: true });
}

async function handleDon(formData, env, ctx) {
  const prenom = str(formData, "prenom");
  const nom = str(formData, "nom");
  const email = str(formData, "email");
  const autreMontant = str(formData, "autre_montant");
  const montant = autreMontant ? `${autreMontant} $` : str(formData, "amount");
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
