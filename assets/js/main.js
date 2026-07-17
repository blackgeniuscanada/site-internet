// BlackGenius Canada — interactions
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    // Injecte la structure groupée pour mobile (comme le footer)
    function injectGroupedMenu() {
      if (nav.querySelector('.menu-grouped')) return;
      const ul = nav.querySelector('ul');
      if (ul) ul.classList.add('has-grouped');
      const grouped = document.createElement('div');
      grouped.className = 'menu-grouped';
      grouped.innerHTML = ''
        + '<div class="menu-section"><h5>Mission</h5>'
        +   '<a href="mission.html">Notre mission</a>'
        +   '<a href="mission.html#vision">Vision 2035</a>'
        +   '<a href="mission.html#valeurs">Nos valeurs</a>'
        +   '<a href="equipe.html">Équipe et gouvernance</a>'
        +   '<a href="impact.html">Notre impact</a>'
        + '</div>'
        + '<div class="menu-section"><h5>Programmes</h5>'
        +   '<a href="programmes.html">Tous les programmes</a>'
        +   '<a href="https://maths.blackgeniuscanada.org/" target="_blank" rel="noopener">Jeux Maths</a>'
        +   '<a href="evenements.html">Événements</a>'
        +   '<a href="actualites.html">Journal</a>'
        + '</div>'
        + '<div class="menu-section"><h5>S\'engager</h5>'
        +   '<a href="inscription.html">Inscrire un enfant</a>'
        +   '<a href="benevoles.html">Devenir bénévole</a>'
        +   '<a href="don.html">Faire un don</a>'
        +   '<a href="contact.html">Partenariats</a>'
        + '</div>'
        + '<div class="menu-section"><h5>Espace membres</h5>'
        +   '<a href="https://parents.blackgeniuscanada.org/" target="_blank" rel="noopener" style="color: var(--gold);">Espace famille →</a>'
        +   '<a href="contact.html">Formulaire de contact</a>'
        +   '<a href="mailto:contact@blackgeniuscanada.org">Nous écrire</a>'
        + '</div>';
      nav.appendChild(grouped);
    }
    if (window.matchMedia && window.matchMedia('(max-width: 899px)').matches) {
      injectGroupedMenu();
    }
    window.addEventListener('resize', () => {
      if (window.matchMedia('(max-width: 899px)').matches) injectGroupedMenu();
    });
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
  }

  document.querySelectorAll('.don-options input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.don-options label').forEach(l => l.classList.remove('selected'));
      const label = document.querySelector('label[for="' + input.id + '"]');
      if (label) label.classList.add('selected');
    });
  });

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.endsWith(currentPath)) a.classList.add('active');
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll('form[data-formspree]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const msg = form.querySelector('.form-feedback');
      const button = form.querySelector('button[type="submit"]');
      const action = form.getAttribute('action') || '';
      const showMessage = (text, isError) => {
        if (!msg) return;
        msg.textContent = text;
        msg.style.display = 'block';
        msg.style.borderLeftColor = isError ? '#A04E2E' : '#2E8B3F';
      };
      if (action.includes('YOUR_FORM_ID')) {
        showMessage("Formulaire en mode démonstration. Écrivez à contact@blackgeniuscanada.org.");
        return;
      }
      if (button) { button.disabled = true; button.textContent = "Envoi en cours..."; }
      try {
        const formData = new FormData(form);
        const response = await fetch(action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          showMessage("Merci. Votre message est bien reçu. Un coordinateur revient vers vous sous 5 jours ouvrables.");
          form.reset();
        } else {
          const data = await response.json();
          showMessage(data.error || "Erreur d'envoi. Réessayez ou écrivez à contact@blackgeniuscanada.org.", true);
        }
      } catch (err) {
        showMessage("Connexion impossible. Réessayez ou écrivez à contact@blackgeniuscanada.org.", true);
      } finally {
        if (button) { button.disabled = false; button.textContent = button.dataset.originalText || "Envoyer"; }
      }
    });
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.dataset.originalText = btn.textContent;
  });

  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      const wrapper = img.parentElement;
      img.remove();
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-img';
      wrapper.appendChild(placeholder);
    });
  });

  // Fade-in au scroll — désactivé sur mobile pour éviter les vides si l'observateur rate
  const isMobile = window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
  if (!isMobile && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.pillar, .feature-row, .article-card, .testimonial, .value-row, .event-item, .stat').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      observer.observe(el);
    });
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(fadeStyle);
  }

  // ===== WhatsApp flottant =====
  const WA_NUM = '14386221262';
  const WA_MSG = "Bonjour BlackGenius Canada, j\'aimerais en savoir plus sur le collectif.";
  if (!document.querySelector('.wa-float')) {
    const wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(WA_MSG);
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.5 2.1 7.9L.5 31.5l7.8-2c2.3 1.2 4.9 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.4c-2.5 0-5-.7-7.1-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5C3 20.6 2.4 18.3 2.4 16c0-7.5 6.1-13.6 13.6-13.6S29.6 8.5 29.6 16 23.5 28.9 16 28.9zm7.5-9.7c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-2-1-3.3-1.8-4.7-4-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6s-.9-2.1-1.2-2.9c-.3-.7-.6-.6-.9-.7h-.7c-.3 0-.7.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.3 2.6 4 6.3 5.6 2.4 1 3.3 1.1 4.5.9.7-.1 2.4-1 2.7-1.9.3-.9.3-1.8.2-1.9-.1-.2-.3-.3-.7-.4z"/></svg><span class="wa-label">Nous écrire</span>';
    document.body.appendChild(wa);
  }

  // ===== Barre collante mobile =====
  if (!document.querySelector('.mobile-stickbar')) {
    const bar = document.createElement('div');
    bar.className = 'mobile-stickbar';
    bar.innerHTML = '<a href="inscription.html" class="msb-btn msb-primary">S\'inscrire</a><a href="don.html" class="msb-btn msb-secondary">Faire un don</a>';
    document.body.appendChild(bar);
  }

  // ===== Banniere consentement Loi 25 =====
  const CK = 'bg_consent_v1';
  let stored = null;
  try { stored = localStorage.getItem(CK); } catch (e) {}
  if (!stored && !document.querySelector('.consent-banner')) {
    const b = document.createElement('div');
    b.className = 'consent-banner';
    b.setAttribute('role', 'dialog');
    b.innerHTML = '<div class="consent-inner"><div class="consent-text"><strong>Confidentialité (Loi 25)</strong><p>Nous utilisons des cookies techniques essentiels au fonctionnement du site et, avec votre accord, des cookies d\'analyse pour comprendre l\'usage des pages. Aucune donnée n\'est partagée avec des tiers à des fins publicitaires. <a href="confidentialite.html">En savoir plus</a>.</p></div><div class="consent-actions"><button type="button" class="consent-btn consent-refuse">Refuser</button><button type="button" class="consent-btn consent-accept">Accepter</button></div></div>';
    document.body.appendChild(b);
    setTimeout(() => b.classList.add('show'), 200);
    b.querySelector('.consent-accept').addEventListener('click', () => {
      try { localStorage.setItem(CK, 'accepted'); } catch (e) {}
      b.classList.remove('show');
      setTimeout(() => b.remove(), 350);
    });
    b.querySelector('.consent-refuse').addEventListener('click', () => {
      try { localStorage.setItem(CK, 'refused'); } catch (e) {}
      b.classList.remove('show');
      setTimeout(() => b.remove(), 350);
    });
  }
})();
