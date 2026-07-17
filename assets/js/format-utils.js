// 🔧 Utilitaires de formatage numérique pour BlackGenius Canada
// Gère les formats français (virgule) et anglais (point)

/**
 * Normalise une chaîne numérique (accepte virgule ET point)
 * "12,5" → 12.5
 * "1 500,50" → 1500.5
 * "1500.5" → 1500.5
 */
function normalizeNumber(str) {
  if (typeof str !== 'string') return str;
  return parseFloat(str.trim().replace(/\s/g, '').replace(/,/g, '.'));
}

/**
 * Formate un montant en devise CAD avec séparateurs de milliers
 * 1500 → "1 500,00 $"
 * 1500.5 → "1 500,50 $"
 */
function formatCAD(amount, includeSymbol = true) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0,00 $';

  // Utilise le format français pour les séparateurs
  const formatted = num.toLocaleString('fr-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return includeSymbol ? formatted + ' $' : formatted;
}

/**
 * Formate un nombre avec séparateurs de milliers (format français)
 * 12500 → "12 500"
 * 12500.5 → "12 500,5"
 */
function formatNumber(num, decimals = null) {
  const n = parseFloat(num);
  if (isNaN(n)) return '0';

  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals !== null ? decimals : 20,
  };

  return n.toLocaleString('fr-CA', options);
}

/**
 * Valide qu'une entrée est un nombre valide (virgule ou point acceptés)
 */
function isValidNumber(str) {
  return !isNaN(normalizeNumber(str)) && str.trim() !== '';
}

/**
 * Formate une note avec un seuil (pour l'affichage)
 * note: 12, seuil: 80
 * output: "12/100" ou "12 ✓" si ok
 */
function formatGrade(grade, threshold = null) {
  const num = normalizeNumber(grade);
  if (isNaN(num)) return '—';

  if (threshold) {
    const t = normalizeNumber(threshold);
    const status = num >= t ? ' ✓' : ' ✗';
    return num + status;
  }
  return num.toString();
}

/**
 * Convertit un montant de dollars à centimes (pour API)
 * "$1,50" → 150
 * "1.5" → 150
 */
function dollarsToCents(amount) {
  const num = normalizeNumber(amount);
  return Math.round(num * 100);
}

/**
 * Convertit des centimes à dollars formatés
 * 150 → "1,50 $"
 */
function centsToDollars(cents) {
  return formatCAD(cents / 100);
}

// Export pour Node.js/modules (si utilisé dans un bundler)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    normalizeNumber,
    formatCAD,
    formatNumber,
    isValidNumber,
    formatGrade,
    dollarsToCents,
    centsToDollars,
  };
}
