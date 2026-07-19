// BlackGenius Canada — Wizard d'inscription
// Multi-étapes, validation, soumission vers le Worker API → Notion

const INSCRIPTION_API_URL = 'https://inscription-api.blackgenius225.workers.dev/';

(function () {
  const wizard = document.getElementById('wizard');
  if (!wizard) return;

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const T = {
    fr: {
      missingOne: (n) => 'Il manque ' + n + ' information' + (n > 1 ? 's' : '') + ' pour continuer : ',
      field: 'champ',
      thresholdWarn: '<strong>Attention.</strong> Les notes saisies ne respectent pas tous les seuils. La candidature sera examinée à titre exceptionnel.',
      thresholdOk: '<strong>Parfait.</strong> Toutes les notes respectent les seuils d\'admission.',
      mentionMissing: 'Mention "Lu et approuvé"',
      sending: 'Envoi en cours…',
      submit: "Soumettre l'inscription →",
      fallbackMsg: 'La connexion à la base est momentanément indisponible. Cliquez ci-dessous pour transmettre votre dossier par courriel.<br><br>',
      fallbackBtn: 'Envoyer par courriel →',
      unknownError: 'Erreur inconnue',
      genericError: 'Une erreur est survenue. Réessayez ou écrivez à inscriptions@blackgeniuscanada.org.',
      subjectPrefix: 'Inscription — ',
      firstName: 'Prénom : ', lastName: 'Nom : ', parentEmail: 'Courriel parent : ', phone: 'Téléphone : ', city: 'Ville : ',
      source: 'site web inscription'
    },
    en: {
      missingOne: (n) => n + ' piece' + (n > 1 ? 's' : '') + ' of information ' + (n > 1 ? 'are' : 'is') + ' missing to continue: ',
      field: 'field',
      thresholdWarn: '<strong>Note.</strong> The grades entered do not meet all thresholds. The application will be reviewed as an exception.',
      thresholdOk: '<strong>Great.</strong> All grades meet the admission thresholds.',
      mentionMissing: '"Read and approved" statement',
      sending: 'Sending…',
      submit: 'Submit enrollment →',
      fallbackMsg: 'The connection to our database is temporarily unavailable. Click below to send your file by email.<br><br>',
      fallbackBtn: 'Send by email →',
      unknownError: 'Unknown error',
      genericError: 'An error occurred. Please try again or write to inscriptions@blackgeniuscanada.org.',
      subjectPrefix: 'Enrollment — ',
      firstName: 'First name: ', lastName: 'Last name: ', parentEmail: 'Parent email: ', phone: 'Phone: ', city: 'City: ',
      source: 'website enrollment'
    }
  }[LANG];

  const form = document.getElementById('inscription-form');
  const steps = Array.from(wizard.querySelectorAll('.wizard-step'));
  const dots = Array.from(wizard.querySelectorAll('.wizard-dot'));
  const fill = document.getElementById('progressFill');
  const totalSteps = 6;
  let current = 1;

  function showStep(n) {
    current = n;
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
    dots.forEach(d => {
      const i = Number(d.dataset.go);
      d.classList.toggle('active', i === n);
      d.classList.toggle('done', i < n);
    });
    if (fill) fill.style.width = (Math.min(n, totalSteps) / totalSteps) * 100 + '%';
    if (n > 1) wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showStepError(step, missingLabels) {
    let banner = step.querySelector('.step-error-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'step-error-banner';
      const head = step.querySelector('.wizard-step-head');
      if (head) head.after(banner); else step.prepend(banner);
    }
    if (missingLabels.length === 0) {
      banner.style.display = 'none';
      return;
    }
    banner.style.display = 'block';
    banner.innerHTML = '<strong>' + T.missingOne(missingLabels.length) + '</strong> ' + missingLabels.join(' · ') + '.';
  }

  function labelOf(input) {
    const field = input.closest('.field');
    if (field) {
      const lbl = field.querySelector('label');
      if (lbl) return lbl.textContent.replace('*','').trim();
    }
    const rg = input.closest('[role="radiogroup"]');
    if (rg) {
      const lbl = rg.previousElementSibling;
      if (lbl && lbl.tagName === 'LABEL') return lbl.textContent.replace('*','').trim();
    }
    return input.name || T.field;
  }

  function validateStep(n) {
    const step = steps.find(s => Number(s.dataset.step) === n);
    if (!step) return true;
    let valid = true;
    let firstInvalid = null;
    const missing = [];

    step.querySelectorAll('[required]').forEach(input => {
      let ok = input.checkValidity();
      if (input.type === 'radio' && input.required) {
        const name = input.name;
        const checked = step.querySelector('input[name="' + name + '"]:checked');
        ok = !!checked;
      }
      input.classList.toggle('invalid', !ok);
      if (!ok) {
        if (!firstInvalid) firstInvalid = input;
        const lbl = labelOf(input);
        if (lbl && missing.indexOf(lbl) === -1) missing.push(lbl);
        valid = false;
      }
    });

    step.querySelectorAll('[data-required-group]').forEach(group => {
      const name = group.dataset.requiredGroup;
      const checked = group.querySelectorAll('input[name="' + name + '"]:checked').length;
      const ok = checked > 0;
      group.classList.toggle('invalid-group', !ok);
      if (!ok) {
        valid = false;
        const parent = group.parentElement;
        const lblEl = parent ? parent.querySelector('label') : null;
        const lbl = lblEl ? lblEl.textContent.replace('*','').split('—')[0].trim() : name;
        if (missing.indexOf(lbl) === -1) missing.push(lbl);
        if (!firstInvalid) firstInvalid = group.querySelector('input');
      }
    });

    if (n === 2) {
      const feedback = document.getElementById('thresholdFeedback');
      const inputs = step.querySelectorAll('input[data-threshold]');
      const failed = [];
      inputs.forEach(input => {
        const v = parseFloat(input.value);
        const t = parseFloat(input.dataset.threshold);
        input.classList.remove('threshold-ok', 'threshold-fail');
        if (!isNaN(v)) {
          if (v < t) { input.classList.add('threshold-fail'); failed.push(t); }
          else input.classList.add('threshold-ok');
        }
      });
      if (feedback) {
        const anyFilled = Array.from(inputs).some(i => i.value);
        if (failed.length > 0) {
          feedback.style.display = 'block';
          feedback.classList.remove('ok');
          feedback.innerHTML = T.thresholdWarn;
        } else if (anyFilled) {
          feedback.style.display = 'block';
          feedback.classList.add('ok');
          feedback.innerHTML = T.thresholdOk;
        } else {
          feedback.style.display = 'none';
        }
      }
    }

    if (n === 6) {
      const mention = step.querySelector('input[name="mention"]');
      if (mention) {
        const mentionRe = LANG === 'en' ? /^read and approved$/i : /^lu et approuvé$/i;
        const ok = mentionRe.test(mention.value.trim());
        mention.classList.toggle('invalid', !ok);
        if (!ok) {
          valid = false;
          if (!firstInvalid) firstInvalid = mention;
          if (missing.indexOf(T.mentionMissing) === -1) missing.push(T.mentionMissing);
        }
      }
    }

    showStepError(step, missing);

    if (firstInvalid) {
      try { firstInvalid.focus({ preventScroll: false }); } catch (e) {}
    }
    return valid;
  }

  wizard.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(current)) showStep(current + 1);
    });
  });
  wizard.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => showStep(current - 1));
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = Number(dot.dataset.go);
      if (target < current) { showStep(target); return; }
      if (target === current) return;
      let canJump = true;
      for (let i = current; i < target; i++) {
        if (!validateStep(i)) { canJump = false; break; }
      }
      if (canJump) showStep(target);
    });
  });

  document.querySelectorAll('input[name="whatsapp_meme"]').forEach(input => {
    input.addEventListener('change', () => {
      const other = document.getElementById('whatsapp-other');
      if (other) other.style.display = (input.value === 'non' && input.checked) ? 'block' : 'none';
    });
  });

  document.querySelectorAll('input[data-threshold]').forEach(input => {
    input.addEventListener('blur', () => {
      const step = input.closest('.wizard-step');
      if (step) validateStep(Number(step.dataset.step));
    });
  });

  document.querySelectorAll('input[name="date_signature"]').forEach(input => {
    if (!input.value) input.value = new Date().toISOString().split('T')[0];
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Anti-bot honeypot — si le champ caché est rempli, c'est un bot. On simule un succès silencieux.
    const hp = form.querySelector('input[name="website_url"]');
    if (hp && hp.value.trim() !== '') {
      console.log('[security] honeypot triggered, silent reject');
      showStep(7);
      return;
    }

    if (!validateStep(6)) return;

    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = T.sending; }

    const fd = new FormData(form);
    const data = {};
    fd.forEach((value, key) => {
      if (data[key] !== undefined) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    ['jours', 'tache'].forEach(k => {
      if (data[k] && !Array.isArray(data[k])) data[k] = [data[k]];
    });

    ['eng_kit','eng_exclusion','eng_seuils','eng_confidentialite','eng_taches','eng_cotisation','loi_25','bulletins_joints'].forEach(k => {
      data[k] = !!data[k];
    });

    data._source = T.source;
    data._submittedAt = new Date().toISOString();

    function showError(msg) {
      if (!feedback) return;
      feedback.style.display = 'block';
      feedback.style.borderLeftColor = 'var(--rust)';
      feedback.textContent = msg;
    }

    function handleFallback(d) {
      const subject = encodeURIComponent(T.subjectPrefix + (d.prenom_enfant || '') + ' ' + (d.nom_enfant || ''));
      const parts = [];
      parts.push(T.firstName + (d.prenom_enfant || ''));
      parts.push(T.lastName + (d.nom_enfant || ''));
      parts.push(T.parentEmail + (d.parent_email || ''));
      parts.push(T.phone + (d.parent_telephone || ''));
      parts.push(T.city + (d.parent_ville || ''));
      const body = encodeURIComponent(parts.join('\n'));
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.borderLeftColor = 'var(--gold)';
        feedback.innerHTML = T.fallbackMsg + '<a href="mailto:inscriptions@blackgeniuscanada.org?subject=' + subject + '&body=' + body + '" class="btn btn-primary" style="margin-top: 8px;">' + T.fallbackBtn + '</a>';
      }
    }

    try {
      const response = await fetch(INSCRIPTION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        const refEl = document.getElementById('refId');
        if (refEl) refEl.textContent = result.reference || ('BG-' + Date.now().toString().slice(-6));
        showStep(7);
      } else {
        const err = await response.json().catch(() => ({ error: T.unknownError }));
        if (response.status === 501 || response.status === 503 || response.status === 404) {
          handleFallback(data);
        } else {
          showError(err.error || T.genericError);
        }
      }
    } catch (err) {
      handleFallback(data);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = T.submit; }
    }
  });

  showStep(1);
})();
