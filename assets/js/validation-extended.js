/**
 * 🔐 Validation Extended — Règles métier robustes
 * BlackGenius Canada · Inscription & Donations
 * Importer après format-utils.js
 */

// ============================================
// 1. VALIDATEURS NUMÉRIQUES
// ============================================

/**
 * Valide une note (0-100) avec seuil
 * @param {number|string} note - La note saisie
 * @param {number|string} threshold - Le seuil minimum
 * @returns {object} { isValid, value, threshold, status }
 */
function validateGrade(note, threshold) {
  const n = normalizeNumber(note);
  const t = normalizeNumber(threshold);

  if (isNaN(n) || isNaN(t)) {
    return { isValid: false, value: n, threshold: t, status: 'invalid' };
  }

  if (n < 0 || n > 100) {
    return { isValid: false, value: n, threshold: t, status: 'out_of_range' };
  }

  const passed = n >= t;
  return {
    isValid: true,
    value: n,
    threshold: t,
    status: passed ? 'passed' : 'failed',
    percentage: (n / 100 * 100).toFixed(1),
  };
}

/**
 * Valide un montant de donation
 * @param {number|string} amount - Montant à valider
 * @returns {object} { isValid, value, error }
 */
function validateDonation(amount) {
  const a = normalizeNumber(amount);

  if (isNaN(a)) {
    return { isValid: false, value: a, error: 'Montant invalide' };
  }

  if (a < 5) {
    return { isValid: false, value: a, error: 'Montant minimum: 5,00 $' };
  }

  if (a > 999999.99) {
    return { isValid: false, value: a, error: 'Montant maximum: 999 999,99 $' };
  }

  // Arrondir à 2 décimales (prévenir les erreurs float)
  const rounded = Math.round(a * 100) / 100;

  return {
    isValid: true,
    value: rounded,
    error: null,
  };
}

// ============================================
// 2. VALIDATEURS TEXTE
// ============================================

/**
 * Valide un numéro de téléphone canadien
 * Accepte: 514 555 1234, 514-555-1234, +1 514 555 1234, 5145551234
 */
function validatePhoneCA(phone) {
  const cleaned = phone.replace(/\D/g, '');

  // Numéro CA: 10 chiffres (514...) ou 11 avec +1 (1514...)
  const isValid = cleaned.length === 10 || cleaned.length === 11;

  return {
    isValid,
    original: phone,
    cleaned,
    formatted: isValid ? formatPhoneCA(cleaned) : null,
    error: !isValid ? 'Format invalide. Utilisez: 514 555 1234' : null,
  };
}

/**
 * Formate un téléphone CA vers (514) 555-1234
 */
function formatPhoneCA(digits) {
  const cleaned = digits.replace(/\D/g, '');

  if (cleaned.length === 11 && cleaned[0] === '1') {
    // +1 514 555 1234
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  if (cleaned.length === 10) {
    // (514) 555-1234
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return null;
}

/**
 * Valide un code postal canadien
 * Format: A1A 1A1 (lettre-chiffre-lettre espace chiffre-lettre-chiffre)
 */
function validatePostalCodeCA(postal) {
  const cleaned = postal.toUpperCase().replace(/\s+/g, ' ').trim();
  const pattern = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/;

  const isValid = pattern.test(cleaned);

  return {
    isValid,
    original: postal,
    cleaned: cleaned.replace(/\s/g, ''),
    formatted: isValid ? cleaned.match(/[A-Z\d]{3}\s?[A-Z\d]{3}/)[0] : null,
    error: !isValid ? 'Format: H1A 1A1' : null,
  };
}

/**
 * Valide une adresse email
 */
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: pattern.test(email),
    original: email,
    error: !pattern.test(email) ? 'Adresse email invalide' : null,
  };
}

// ============================================
// 3. VALIDATEURS DONNÉES COMPOSÉES
// ============================================

/**
 * Valide tout le formulaire d'inscription (Step 2)
 */
function validateInscriptionStep2(step) {
  const results = {};
  const errors = [];

  const subjects = [
    { name: 'note_math', threshold: 80, label: 'Mathématiques' },
    { name: 'note_sciences', threshold: 80, label: 'Sciences' },
    { name: 'note_francais', threshold: 70, label: 'Français' },
    { name: 'note_anglais', threshold: 70, label: 'Anglais' },
  ];

  subjects.forEach(({ name, threshold, label }) => {
    const input = step.querySelector(`input[name="${name}"]`);
    if (!input) return;

    const validation = validateGrade(input.value, threshold);
    results[name] = validation;

    if (!validation.isValid) {
      errors.push(`${label}: saisie invalide`);
    } else if (validation.status === 'failed') {
      errors.push(`${label}: ${validation.value}/100 (seuil ${threshold} requis)`);
    }
  });

  return { isValid: errors.length === 0, results, errors };
}

/**
 * Valide le formulaire parent (Step 3)
 */
function validateInscriptionStep3(step) {
  const errors = [];

  const phone = step.querySelector('input[name="parent_telephone"]')?.value;
  if (phone) {
    const phoneVal = validatePhoneCA(phone);
    if (!phoneVal.isValid) errors.push('Téléphone: ' + phoneVal.error);
  }

  const postal = step.querySelector('input[name="parent_code_postal"]')?.value;
  if (postal) {
    const postalVal = validatePostalCodeCA(postal);
    if (!postalVal.isValid) errors.push('Code postal: ' + postalVal.error);
  }

  const whatsapp = step.querySelector('input[name="whatsapp_autre"]')?.value;
  if (whatsapp) {
    const waVal = validatePhoneCA(whatsapp);
    if (!waVal.isValid) errors.push('WhatsApp: ' + waVal.error);
  }

  return { isValid: errors.length === 0, errors };
}

// ============================================
// 4. EVENT LISTENERS RÉUTILISABLES
// ============================================

/**
 * Attacha la validation temps réel aux champs de notes
 */
function setupGradeValidation(container) {
  container.querySelectorAll('input[data-threshold]').forEach(input => {
    const threshold = input.dataset.threshold;

    input.addEventListener('blur', function() {
      const validation = validateGrade(this.value, threshold);
      const hint = this.closest('.field')?.querySelector('.field-hint');

      if (hint) {
        if (!validation.isValid) {
          hint.textContent = '⚠ Format invalide (ex: 87 ou 87,5)';
          hint.style.color = 'var(--rust)';
        } else {
          const icon = validation.status === 'passed' ? '✓' : '✗';
          const color = validation.status === 'passed' ? 'var(--green)' : 'var(--rust)';
          hint.textContent = `${icon} ${validation.value}/100 – Seuil ${threshold} ${validation.status === 'passed' ? '✓' : 'requis'}`;
          hint.style.color = color;
        }
      }
    });

    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.classList.add('invalid');
      alert('Note: 0-100 (décimales autorisées, ex: 87,5)');
    });
  });
}

/**
 * Attacha la validation temps réel aux téléphones
 */
function setupPhoneValidation(container) {
  container.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
      const validation = validatePhoneCA(this.value);
      const hint = this.closest('.field')?.querySelector('.field-hint') ||
                   this.parentElement;

      if (hint) {
        if (!this.value) {
          hint.textContent = '';
        } else if (validation.isValid) {
          hint.textContent = `✓ Formé: ${validation.formatted}`;
          hint.style.color = 'var(--green)';
        } else {
          hint.textContent = `✗ ${validation.error}`;
          hint.style.color = 'var(--rust)';
        }
      }
    });
  });
}

/**
 * Attacha la validation temps réel aux codes postaux
 */
function setupPostalValidation(container) {
  container.querySelectorAll('input[data-postal]').forEach(input => {
    input.addEventListener('blur', function() {
      const validation = validatePostalCodeCA(this.value);
      const hint = this.closest('.field')?.querySelector('.field-hint') ||
                   this.parentElement;

      if (hint) {
        if (!this.value) {
          hint.textContent = '';
        } else if (validation.isValid) {
          hint.textContent = `✓ Format: ${validation.formatted}`;
          hint.style.color = 'var(--green)';
        } else {
          hint.textContent = `✗ Format: H1A 1A1`;
          hint.style.color = 'var(--rust)';
        }
      }
    });
  });
}

// ============================================
// 5. SETUP GLOBAL
// ============================================

/**
 * Initialise toutes les validations
 */
function initializeValidations() {
  const form = document.getElementById('inscription-form') || document.querySelector('form[data-formspree]');
  if (!form) return;

  setupGradeValidation(form);
  setupPhoneValidation(form);
  setupPostalValidation(form);

  // Force validation client avant soumission
  form.addEventListener('submit', function(e) {
    // Les validations HTML5 s'exécutent d'abord
    if (!this.checkValidity()) {
      e.preventDefault();
      console.warn('Validation client échouée');
    }
  });
}

// Auto-initialize si le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeValidations);
} else {
  initializeValidations();
}

// Export pour Node/Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateGrade,
    validateDonation,
    validatePhoneCA,
    formatPhoneCA,
    validatePostalCodeCA,
    validateEmail,
    validateInscriptionStep2,
    validateInscriptionStep3,
    setupGradeValidation,
    setupPhoneValidation,
    setupPostalValidation,
    initializeValidations,
  };
}
