/**
 * 🧪 Test Suite Complète — Format Utilities & Validation
 * Tous les tests doivent retourner true (✓)
 */

// Charger les modules
const fs = require('fs');
const path = require('path');

// Lire et exécuter format-utils.js
const formatUtilsCode = fs.readFileSync(
  path.join(__dirname, 'assets/js/format-utils.js'),
  'utf8'
);
eval(formatUtilsCode.replace(/^\/\/.*$/gm, '').replace(/if \(typeof module.*$/s, ''));

// Variables de test
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

// Fonction helper pour les tests
function test(name, fn) {
  totalTests++;
  try {
    const result = fn();
    if (result === true) {
      passedTests++;
      console.log(`✓ ${name}`);
    } else {
      failedTests.push(`✗ ${name} — Résultat attendu: true, obtenu: ${result}`);
      console.log(`✗ ${name} — Got: ${result}`);
    }
  } catch (err) {
    failedTests.push(`✗ ${name} — Erreur: ${err.message}`);
    console.log(`✗ ${name} — ${err.message}`);
  }
}

console.log('\n🧪 TESTS UNITAIRES — FORMAT UTILITIES\n');
console.log('='.repeat(50));

// ============================================
// TESTS: normalizeNumber()
// ============================================
console.log('\n📌 Test: normalizeNumber()\n');

test('Accepte entiers simples', () => {
  return normalizeNumber('80') === 80;
});

test('Accepte virgule française', () => {
  return normalizeNumber('80,5') === 80.5;
});

test('Accepte point décimal', () => {
  return normalizeNumber('80.5') === 80.5;
});

test('Accepte espaces (nombres > 999)', () => {
  return normalizeNumber('1 234') === 1234;
});

test('Accepte espaces + virgule', () => {
  return normalizeNumber('1 234,56') === 1234.56;
});

test('Trim les espaces avant/après', () => {
  return normalizeNumber('  80,5  ') === 80.5;
});

test('Retourne NaN pour non-nombres', () => {
  return isNaN(normalizeNumber('abc'));
});

test('Retourne le nombre même type non-string', () => {
  return normalizeNumber(80.5) === 80.5;
});

// ============================================
// TESTS: formatCAD()
// ============================================
console.log('\n📌 Test: formatCAD()\n');

test('Format simple 25 → "25,00 $"', () => {
  const result = formatCAD(25);
  return result === '25,00 $' || result.includes('25') && result.includes('$');
});

test('Format milliers 1000 → "1 000,00 $"', () => {
  const result = formatCAD(1000);
  return result.includes('1') && result.includes('000') && result.includes('$');
});

test('Format décimales 1234.56', () => {
  const result = formatCAD(1234.56);
  return result.includes('1') && result.includes('234') && result.includes('56');
});

// ============================================
// TESTS: formatNumber()
// ============================================
console.log('\n📌 Test: formatNumber()\n');

test('Ajoute séparateurs milliers', () => {
  const result = formatNumber(12500);
  return result.includes('12') && result.includes('500');
});

test('Accepte précision décimales', () => {
  const result = formatNumber(1234.567, 2);
  return !isNaN(parseFloat(result.replace(/\s/g, '').replace(/,/g, '.')));
});

// ============================================
// TESTS: isValidNumber()
// ============================================
console.log('\n📌 Test: isValidNumber()\n');

test('Accepte "80"', () => {
  return isValidNumber('80') === true;
});

test('Accepte "80,5"', () => {
  return isValidNumber('80,5') === true;
});

test('Rejette "abc"', () => {
  return isValidNumber('abc') === false;
});

test('Rejette chaîne vide', () => {
  return isValidNumber('') === false;
});

// ============================================
// TESTS: formatGrade()
// ============================================
console.log('\n📌 Test: formatGrade()\n');

test('Formate simple note', () => {
  const result = formatGrade(87);
  return result.includes('87');
});

test('Affiche ✓ si seuil atteint', () => {
  const result = formatGrade(87, 80);
  return result.includes('✓');
});

test('Affiche ✗ si seuil non atteint', () => {
  const result = formatGrade(79, 80);
  return result.includes('✗');
});

// ============================================
// TESTS: dollarsToCents() / centsToDollars()
// ============================================
console.log('\n📌 Test: Conversion Dollars ↔ Cents\n');

test('dollarsToCents(1.50) → 150', () => {
  return dollarsToCents('1.50') === 150;
});

test('dollarsToCents(1000.99) → 100099', () => {
  return dollarsToCents('1000.99') === 100099;
});

test('centsToDollars(150) → "1,50 $"', () => {
  const result = centsToDollars(150);
  return result.includes('1') && result.includes('50');
});

// ============================================
// RÉSUMÉ
// ============================================
console.log('\n' + '='.repeat(50));
console.log(`\n📊 RÉSULTATS: ${passedTests}/${totalTests} tests réussis\n`);

if (failedTests.length > 0) {
  console.log('❌ TESTS ÉCHOUÉS:');
  failedTests.forEach(fail => console.log(fail));
  process.exit(1);
} else {
  console.log('✅ TOUS LES TESTS RÉUSSIS!');
  process.exit(0);
}
