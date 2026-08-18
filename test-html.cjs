/**
 * 🧪 Test Suite HTML Validation
 */

const fs = require('fs');
const path = require('path');

let issues = [];

// Test 1: Vérifier que don.html inclut format-utils.js
console.log('\n🧪 TESTS HTML\n');
console.log('='.repeat(50));

console.log('\n📌 Test: don.html\n');

const donHtml = fs.readFileSync(
  path.join(__dirname, 'don.html'),
  'utf8'
);

if (donHtml.includes('format-utils.js')) {
  console.log('✓ Inclut format-utils.js');
} else {
  issues.push('don.html: Manque format-utils.js');
  console.log('✗ Manque format-utils.js');
}

if (donHtml.includes('id="amount-custom"') && donHtml.includes('inputmode="decimal"')) {
  console.log('✓ Champ « autre montant » en texte + inputmode="decimal" (virgule acceptee)');
} else {
  issues.push('don.html: champ autre montant sans inputmode="decimal"');
  console.log('✗ Champ « autre montant » sans inputmode="decimal"');
}

if (donHtml.includes('id="donationTotal"')) {
  console.log('✓ Affichage total du don (id="donationTotal")');
} else {
  issues.push('don.html: Pas d\'affichage total (id="donationTotal")');
  console.log('✗ Pas d\'affichage total');
}

if (donHtml.includes('step="0.01"') || donHtml.includes('inputmode="decimal"')) {
  console.log('✓ Support des décimales (step ou inputmode)');
} else {
  issues.push('don.html: Pas de support décimales');
  console.log('✗ Pas de support décimales');
}

// Test 2: Vérifier inscription.html
console.log('\n📌 Test: inscription.html\n');

const inscriptionHtml = fs.readFileSync(
  path.join(__dirname, 'inscription.html'),
  'utf8'
);

// Faux positif : le wizard utilise data-step="1" pour numeroter ses etapes.
// On ne cherche que l'attribut step d'un champ de saisie.
if (/(?<!data-)step="1"/.test(inscriptionHtml)) {
  issues.push('inscription.html: Encore step="1" (devrait être step="0.01")');
  console.log('✗ Encore step="1" (devrait être step="0.01")');
} else {
  console.log('✓ Pas de step="1" (peut être corrigé)');
}

if (inscriptionHtml.includes('placeholder="H1A 1A1"')) {
  console.log('✓ Placeholder code postal H1A 1A1');
} else {
  console.log('⚠ Pas de placeholder code postal H1A 1A1 (peut être ajouté)');
}

if (inscriptionHtml.includes('maxlength=')) {
  console.log('✓ Au moins un champ avec maxlength');
} else {
  console.log('⚠ Aucun maxlength (peut être ajouté)');
}

// Test 3: Vérifier inscription.js
console.log('\n📌 Test: inscription.js\n');

const inscriptionJs = fs.readFileSync(
  path.join(__dirname, 'assets/js/inscription.js'),
  'utf8'
);

if (inscriptionJs.includes('normalizeNumber')) {
  console.log('✓ Utilise normalizeNumber()');
} else {
  issues.push('inscription.js: N\'utilise pas normalizeNumber()');
  console.log('✗ N\'utilise pas normalizeNumber()');
}

if (inscriptionJs.includes('parseFloat(input.value)') && !inscriptionJs.includes('normalizeNumber(input.value)')) {
  issues.push('inscription.js: Utilise toujours parseFloat() au lieu de normalizeNumber()');
  console.log('✗ Utilise parseFloat() au lieu de normalizeNumber()');
} else {
  console.log('✓ Utilise normalizeNumber()');
}

// Test 4: Vérifier validation-extended.js
console.log('\n📌 Test: validation-extended.js\n');

const validationExtJs = fs.readFileSync(
  path.join(__dirname, 'assets/js/validation-extended.js'),
  'utf8'
);

const functions = [
  'validateGrade',
  'validateDonation',
  'validatePhoneCA',
  'validatePostalCodeCA',
  'validateEmail'
];

let funcCount = 0;
functions.forEach(fn => {
  if (validationExtJs.includes(`function ${fn}`)) {
    console.log(`✓ Contient fonction ${fn}()`);
    funcCount++;
  } else {
    issues.push(`validation-extended.js: Manque fonction ${fn}()`);
    console.log(`✗ Manque fonction ${fn}()`);
  }
});

// Test 5: Vérifier format-utils.js
console.log('\n📌 Test: format-utils.js\n');

const formatJs = fs.readFileSync(
  path.join(__dirname, 'assets/js/format-utils.js'),
  'utf8'
);

const formatFuncs = [
  'normalizeNumber',
  'formatCAD',
  'formatNumber',
  'isValidNumber',
  'formatGrade'
];

let formatFuncCount = 0;
formatFuncs.forEach(fn => {
  if (formatJs.includes(`function ${fn}`)) {
    console.log(`✓ Contient fonction ${fn}()`);
    formatFuncCount++;
  } else {
    issues.push(`format-utils.js: Manque fonction ${fn}()`);
    console.log(`✗ Manque fonction ${fn}()`);
  }
});

// RÉSUMÉ
console.log('\n' + '='.repeat(50));

if (issues.length === 0) {
  console.log('\n✅ TOUS LES TESTS HTML RÉUSSIS!\n');
  process.exit(0);
} else {
  console.log(`\n⚠️ ${issues.length} PROBLÈME(S) DÉTECTÉ(S):\n`);
  issues.forEach(issue => console.log(`  • ${issue}`));
  console.log();
  process.exit(1);
}
