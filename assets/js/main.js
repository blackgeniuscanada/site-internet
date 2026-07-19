// BlackGenius Canada — interactions
(function () {
  // ===== i18n =====
  const LANG = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const T = {
    fr: {
      menuMission: 'Mission', menuNotreMission: 'Notre mission', menuVision: 'Vision 2035', menuValeurs: 'Nos valeurs',
      menuEquipe: 'Équipe et gouvernance', menuImpact: 'Notre impact',
      menuProgrammes: 'Programmes', menuTousProgrammes: 'Tous les programmes', menuJeuxMaths: 'Jeux Maths',
      menuEvenements: 'Événements', menuJournal: 'Journal',
      menuEngager: "S'engager", menuInscrireEnfant: 'Inscrire un enfant', menuBenevole: 'Devenir bénévole',
      menuDon: 'Faire un don', menuPartenariats: 'Partenariats',
      menuEspaceMembres: 'Espace membres', menuEspaceFamille: 'Espace famille →', menuFormulaireContact: 'Formulaire de contact', menuEcrire: 'Nous écrire',
      ctaSinscrire: "S'inscrire",
      langLabel: '<a href="__ALT__">EN</a> · <strong>FR</strong>',
      waLabel: 'Nous écrire',
      waMsg: "Bonjour BlackGenius Canada, j'aimerais en savoir plus sur le collectif.",
      mobileCta: '<a href="inscription.html" class="btn btn-primary">S\'inscrire</a><a href="don.html" class="btn btn-outline-green">Faire un don</a>',
      consentTitle: 'Confidentialité (Loi 25)',
      consentText: 'Nous utilisons des cookies techniques essentiels au fonctionnement du site et, avec votre accord, des cookies d\'analyse pour comprendre l\'usage des pages. Aucune donnée n\'est partagée avec des tiers à des fins publicitaires. <a href="confidentialite.html">En savoir plus</a>.',
      consentRefuse: 'Refuser', consentAccept: 'Accepter',
      formDemo: 'Formulaire en mode démonstration. Écrivez à contact@blackgeniuscanada.org.',
      formSending: 'Envoi en cours...',
      formSuccess: 'Merci. Votre message est bien reçu. Un coordinateur revient vers vous sous 5 jours ouvrables.',
      formSuccessNewsletter: 'Merci ! Vous êtes bien abonné(e) à notre infolettre.',
      formSuccessConsentement: 'Merci. Votre consentement a bien été enregistré et archivé de façon sécurisée.',
      formSuccessAutorisationImage: 'Merci. Votre réponse au sujet du droit à l\'image a bien été enregistrée.',
      formErrorGeneric: "Erreur d'envoi. Réessayez ou écrivez à contact@blackgeniuscanada.org.",
      formErrorConnection: 'Connexion impossible. Réessayez ou écrivez à contact@blackgeniuscanada.org.',
      formSendDefault: 'Envoyer'
    },
    en: {
      menuMission: 'Mission', menuNotreMission: 'Our mission', menuVision: 'Vision 2035', menuValeurs: 'Our values',
      menuEquipe: 'Team and governance', menuImpact: 'Our impact',
      menuProgrammes: 'Programs', menuTousProgrammes: 'All programs', menuJeuxMaths: 'Math Games',
      menuEvenements: 'Events', menuJournal: 'Newsroom',
      menuEngager: 'Get involved', menuInscrireEnfant: 'Enroll a child', menuBenevole: 'Become a volunteer',
      menuDon: 'Donate', menuPartenariats: 'Partnerships',
      menuEspaceMembres: 'Members area', menuEspaceFamille: 'Family space →', menuFormulaireContact: 'Contact form', menuEcrire: 'Write to us',
      ctaSinscrire: 'Enroll',
      langLabel: '<strong>EN</strong> · <a href="__ALT__">FR</a>',
      waLabel: 'Message us',
      waMsg: "Hello BlackGenius Canada, I'd like to learn more about the collective.",
      mobileCta: '<a href="inscription.html" class="btn btn-primary">Enroll</a><a href="don.html" class="btn btn-outline-green">Donate</a>',
      consentTitle: 'Privacy (Bill 25)',
      consentText: 'We use technical cookies essential to the site\'s operation and, with your consent, analytics cookies to understand page usage. No data is shared with third parties for advertising purposes. <a href="confidentialite.html">Learn more</a>.',
      consentRefuse: 'Decline', consentAccept: 'Accept',
      formDemo: 'Form in demo mode. Write to contact@blackgeniuscanada.org.',
      formSending: 'Sending...',
      formSuccess: 'Thank you. Your message has been received. A coordinator will get back to you within 5 business days.',
      formSuccessNewsletter: "Thank you! You're now subscribed to our newsletter.",
      formSuccessConsentement: 'Thank you. Your consent has been recorded and securely archived.',
      formSuccessAutorisationImage: 'Thank you. Your response about image rights has been recorded.',
      formErrorGeneric: 'Submission error. Please try again or write to contact@blackgeniuscanada.org.',
      formErrorConnection: 'Connection failed. Please try again or write to contact@blackgeniuscanada.org.',
      formSendDefault: 'Send'
    }
  }[LANG];

  function altLangHref() {
    const path = window.location.pathname;
    if (path.startsWith('/en/')) return path.replace('/en/', '/') || '/';
    const file = path.split('/').pop() || 'index.html';
    return '/en/' + file;
  }

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
        + '<div class="menu-section"><h5>' + T.menuMission + '</h5>'
        +   '<a href="mission.html">' + T.menuNotreMission + '</a>'
        +   '<a href="mission.html#vision">' + T.menuVision + '</a>'
        +   '<a href="mission.html#valeurs">' + T.menuValeurs + '</a>'
        +   '<a href="equipe.html">' + T.menuEquipe + '</a>'
        +   '<a href="impact.html">' + T.menuImpact + '</a>'
        + '</div>'
        + '<div class="menu-section"><h5>' + T.menuProgrammes + '</h5>'
        +   '<a href="programmes.html">' + T.menuTousProgrammes + '</a>'
        +   '<a href="https://maths.blackgeniuscanada.org/" target="_blank" rel="noopener">' + T.menuJeuxMaths + '</a>'
        +   '<a href="evenements.html">' + T.menuEvenements + '</a>'
        +   '<a href="actualites.html">' + T.menuJournal + '</a>'
        + '</div>'
        + '<div class="menu-section"><h5>' + T.menuEngager + '</h5>'
        +   '<a href="inscription.html">' + T.menuInscrireEnfant + '</a>'
        +   '<a href="benevoles.html">' + T.menuBenevole + '</a>'
        +   '<a href="don.html">' + T.menuDon + '</a>'
        +   '<a href="contact.html">' + T.menuPartenariats + '</a>'
        + '</div>'
        + '<div class="menu-section"><h5>' + T.menuEspaceMembres + '</h5>'
        +   '<a href="https://parents.blackgeniuscanada.org/" target="_blank" rel="noopener" style="color: var(--gold);">' + T.menuEspaceFamille + '</a>'
        +   '<a href="contact.html">' + T.menuFormulaireContact + '</a>'
        +   '<a href="mailto:contact@blackgeniuscanada.org">' + T.menuEcrire + '</a>'
        + '</div>'
        + '<a class="cta-nav" href="inscription.html">' + T.ctaSinscrire + '</a>'
        + '<div class="lang-switch">' + T.langLabel.replace('__ALT__', altLangHref()) + '</div>';
      nav.appendChild(grouped);
    }
    if (window.matchMedia && window.matchMedia('(max-width: 899px)').matches) {
      injectGroupedMenu();
    }
    window.addEventListener('resize', () => {
      if (window.matchMedia('(max-width: 899px)').matches) injectGroupedMenu();
    });
    const header = document.querySelector('.site-header');
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // .site-header a son propre stacking context (position:sticky + z-index) :
      // le z-index du menu plein écran ne peut pas, à lui seul, passer au-dessus
      // des éléments flottants (barre CTA, WhatsApp, bandeau consentement) qui
      // sont des enfants directs de <body>. On relève donc le header entier.
      if (header) header.classList.toggle('menu-open', isOpen);
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
        msg.style.borderLeftColor = isError ? '#7D2438' : '#16324D';
      };
      if (action.includes('YOUR_FORM_ID')) {
        showMessage(T.formDemo);
        return;
      }
      if (button) { button.disabled = true; button.textContent = T.formSending; }
      try {
        const formData = new FormData(form);
        const response = await fetch(action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          const formType = (formData.get('form_type') || '').toString();
          const successByType = {
            newsletter: T.formSuccessNewsletter,
            consentement: T.formSuccessConsentement,
            autorisation_image: T.formSuccessAutorisationImage,
          };
          const successMsg = successByType[formType] || T.formSuccess;
          showMessage(successMsg);
          form.reset();
        } else {
          const data = await response.json();
          showMessage(data.error || T.formErrorGeneric, true);
        }
      } catch (err) {
        showMessage(T.formErrorConnection, true);
      } finally {
        if (button) { button.disabled = false; button.textContent = button.dataset.originalText || T.formSendDefault; }
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

  // Fade-in au scroll — avec filet de sécurité pour ne jamais laisser du contenu invisible
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    const revealTargets = document.querySelectorAll('.pillar, .feature-row, .article-card, .testimonial, .value-row, .event-item, .stat');
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      observer.observe(el);
    });
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(fadeStyle);
    // Filet de sécurité : si l'observateur rate un élément (ex. ancre de page, navigateur atypique),
    // on force l'affichage après 1.5s pour éviter un contenu qui reste invisible en permanence.
    setTimeout(() => {
      revealTargets.forEach(el => el.classList.add('in-view'));
      observer.disconnect();
    }, 1500);
  }

  // ===== WhatsApp flottant =====
  const WA_NUM = '14386221262';
  if (!document.querySelector('.whatsapp-float')) {
    const wa = document.createElement('a');
    wa.className = 'whatsapp-float';
    wa.href = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(T.waMsg);
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.5 2.1 7.9L.5 31.5l7.8-2c2.3 1.2 4.9 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.4c-2.5 0-5-.7-7.1-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5C3 20.6 2.4 18.3 2.4 16c0-7.5 6.1-13.6 13.6-13.6S29.6 8.5 29.6 16 23.5 28.9 16 28.9zm7.5-9.7c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-2-1-3.3-1.8-4.7-4-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6s-.9-2.1-1.2-2.9c-.3-.7-.6-.6-.9-.7h-.7c-.3 0-.7.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.3 2.6 4 6.3 5.6 2.4 1 3.3 1.1 4.5.9.7-.1 2.4-1 2.7-1.9.3-.9.3-1.8.2-1.9-.1-.2-.3-.3-.7-.4z"/></svg><span class="wa-label">' + T.waLabel + '</span>';
    document.body.appendChild(wa);
  }

  // ===== Barre collante mobile =====
  if (!document.querySelector('.mobile-cta-bar')) {
    const bar = document.createElement('div');
    bar.className = 'mobile-cta-bar';
    bar.innerHTML = T.mobileCta;
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
    b.innerHTML = '<div class="consent-text"><strong>' + T.consentTitle + '</strong><p>' + T.consentText + '</p></div><div class="consent-btns"><button type="button" class="consent-refuse">' + T.consentRefuse + '</button><button type="button" class="consent-accept">' + T.consentAccept + '</button></div>';
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
