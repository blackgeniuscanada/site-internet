// Assemblage des courriels sortants du Worker (notifications de formulaire et
// signalements de triage). Partage entre worker.js et email-inscriptions.js.
//
// Pourquoi ce module : les messages etaient assembles a la main en UTF-8 brut,
// sans encodage d'entete ni Content-Transfer-Encoding. Resultat : les objets
// accentues arrivaient mutiles, et les entetes Date / Message-ID — attendus par
// la plupart des serveurs de reception — etaient absents.

function bytesToBase64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/** Objet de courriel encode en RFC 2047 si (et seulement si) il sort de l'ASCII. */
export function encodeMailSubject(subject) {
  const clean = String(subject).replace(/[\r\n]/g, " ");
  if (/^[\x20-\x7E]*$/.test(clean)) return clean;
  return `=?UTF-8?B?${bytesToBase64(new TextEncoder().encode(clean))}?=`;
}

/** Message RFC 5322 complet, corps en base64 (UTF-8 preserve). */
export function buildRawEmail(from, to, subject, body) {
  const b64 = bytesToBase64(new TextEncoder().encode(String(body)));
  const wrapped = (b64.match(/.{1,76}/g) || [""]).join("\r\n");
  return (
    `From: BlackGenius Canada <${from}>\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${encodeMailSubject(subject)}\r\n` +
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}\r\n` +
    `Message-ID: <${crypto.randomUUID()}@blackgeniuscanada.org>\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/plain; charset=UTF-8\r\n` +
    `Content-Transfer-Encoding: base64\r\n\r\n` +
    wrapped +
    `\r\n`
  );
}
