/**
 * 🧪 Test Suite Validation Extended
 */

const fs = require('fs');
const path = require('path');

// Mock document object
global.document = {
  readyState: 'complete',
  getElementById: () => null,
  querySelector: () => null,
  addEventListener: () => null
};

// Charger les modules
const formatUtilsCode = fs.readFileSync(
  path.join(__dirname, 'assets/js/format-utils.js'),
  'utf8'
);
eval(formatUtilsCode.replace(/^\/\/.*$/gm, '').replace(/if \(typeof module.*$/s, ''));

// Charger validation-extended mais sans l'initialisation auto
const validationCode = fs.readFileSync(
  path.join(__dirname, 'assets/js/validation-extended.js'),
  'utf8'
);
// Enlever la partie auto-initialization
const cleanValidationCode = validationCode.replace(/if \(document\.readyState.*$/s, '');
eval(cleanValidationCode.replace(/^\/\/.*$/gm, ''));

let totalTests = 0;
let passedTests = 0;
let failedTests = [];

function test(name, fn) {
  totalTests++;
  try {
    const result = fn();
    if (result === true) {
      passedTests++;
      console.log(`✓ ${name}`);
    } else {
      failedTests.push(`✗ ${name}`);
      console.log(`✗ ${name}`);
    }
  } catch (err) {
    failedTests.push(`✗ ${name} — ${err.message}`);
    console.log(`✗ ${name} — ${err.message}`);
  }
}

console.log('\n🧪 TESTS UNITAIRES — VALIDATION EXTENDED\n');
console.log('='.repeat(50));

// ============================================
// TESTS: validateGrade()
// ============================================
console.log('\n📌 Test: validateGrade()\n');

test('Note 80 avec seuil 80 → status "passed"', () => {
  const result = validateGrade(80, 80);
  return result.status === 'passed' && result.isValid === true;
});

test('Note 79,5 avec seuil 80 → status "failed"', () => {
  const result = validateGrade(79.5, 80);
  return result.status === 'failed' && result.isValid === true;
});

test('Note "80,5" (string) → 80.5', () => {
  const result = validateGrade('80,5', 80);
  return result.value === 80.5 && result.status === 'passed';
});

test('Note négative → isValid false', () => {
  const result = validateGrade(-10, 80);
  return result.isValid === false && result.status === 'out_of_range';
});

test('Note > 100 → isValid false', () => {
  const result = validateGrade(150, 80);
  return result.isValid === false && result.status === 'out_of_range';
});

// ============================================
// TESTS: validateDonation()
// ============================================
console.log('\n📌 Test: validateDonation()\n');

test('Montant 5 $ → valide', () => {
  const result = validateDonation(5);
  return result.isValid === true && result.value === 5;
});

test('Montant 1000,50 → valide et arrondi', () => {
  const result = validateDonation('1000,50');
  return result.isValid === true && result.value === 1000.50;
});

test('Montant 999999.99 → valide (max)', () => {
  const result = validateDonation(999999.99);
  return result.isValid === true;
});

test('Montant 3 → invalide (< 5)', () => {
  const result = validateDonation(3);
  return result.isValid === false && result.error.includes('minimum');
});

test('Montant 1000001 → invalide (> max)', () => {
  const result = validateDonation(1000001);
  return result.isValid === false && result.error.includes('maximum');
});

// ============================================
// TESTS: validatePhoneCA()
// ============================================
console.log('\n📌 Test: validatePhoneCA()\n');

test('Téléphone "514 555 1234" → valide', () => {
  const result = validatePhoneCA('514 555 1234');
  return result.isValid === true && result.cleaned.length === 10;
});

test('Téléphone "514-555-1234" → valide', () => {
  const result = validatePhoneCA('514-555-1234');
  return result.isValid === true;
});

test('Téléphone "+1 514 555 1234" → valide', () => {
  const result = validatePhoneCA('+1 514 555 1234');
  return result.isValid === true;
});

test('Téléphone "5145551234" → valide (sans séparateurs)', () => {
  const result = validatePhoneCA('5145551234');
  return result.isValid === true;
});

test('Téléphone "abc123" → invalide', () => {
  const result = validatePhoneCA('abc123');
  return result.isValid === false;
});

test('Format retourné "(514) 555-1234"', () => {
  const result = validatePhoneCA('514 555 1234');
  return result.formatted && result.formatted.includes('514');
});

// ============================================
// TESTS: validatePostalCodeCA()
// ============================================
console.log('\n📌 Test: validatePostalCodeCA()\n');

test('Code postal "H1A 1A1" → valide', () => {
  const result = validatePostalCodeCA('H1A 1A1');
  return result.isValid === true;
});

test('Code postal "H1A1A1" (sans espace) → valide', () => {
  const result = validatePostalCodeCA('H1A1A1');
  return result.isValid === true;
});

test('Code postal minuscule "h1a 1a1" → converti en majuscule', () => {
  const result = validatePostalCodeCA('h1a 1a1');
  return result.isValid === true && result.formatted === 'H1A 1A1';
});

test('Code postal "12A 1A1" (commence chiffre) → invalide', () => {
  const result = validatePostalCodeCA('12A 1A1');
  return result.isValid === false;
});

test('Code postal "H1A A1" (mauvais format) → invalide', () => {
  const result = validatePostalCodeCA('H1A A1');
  return result.isValid === false;
});

// ============================================
// TESTS: validateEmail()
// ============================================
console.log('\n📌 Test: validateEmail()\n');

test('Email "test@example.com" → valide', () => {
  const result = validateEmail('test@example.com');
  return result.isValid === true;
});

test('Email "user+tag@domain.co.uk" → valide', () => {
  const result = validateEmail('user+tag@domain.co.uk');
  return result.isValid === true;
});

test('Email "invalid.email" (pas @) → invalide', () => {
  const result = validateEmail('invalid.email');
  return result.isValid === false;
});

test('Email "user@domain" (pas extension) → invalide', () => {
  const result = validateEmail('user@domain');
  return result.isValid === false;
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
