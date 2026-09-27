document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Progressive scroll entrances based on the motion patterns in /Referencias.
  // Motion is enabled only after JS starts, so content remains accessible if
  // scripts or IntersectionObserver are unavailable.
  const revealElements = [];
  const registerReveal = (element, variant = 'up', delay = 0) => {
    if (!element || element.classList.contains('reveal-on-scroll')) return;

    element.classList.add('reveal-on-scroll');
    if (variant !== 'up') element.classList.add(`reveal-${variant}`);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    revealElements.push(element);
  };

  document.querySelectorAll('.hero-content > *').forEach((element, index) => {
    registerReveal(element, 'up', Math.min(index * 90, 450));
  });

  document.querySelectorAll('.text-center').forEach(element => registerReveal(element));

  const revealGroups = [
    '.hero-stats-banner',
    '.dores-grid',
    '.method-steps-grid',
    '.develop-grid',
    '.target-audience-wrapper',
    '.modules-timeline',
    '.diff-grid',
    '.included-list',
    '.offer-checklist',
    '.testimonials-grid',
    '.bonus-grid',
    '.faq-container'
  ];

  revealGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach(group => {
      Array.from(group.children).forEach((element, index) => {
        const direction = index % 2 === 0 ? 'left' : 'right';
        registerReveal(element, direction, Math.min(index * 70, 280));
      });
    });
  });

  document.querySelectorAll(
    '.dores-closing, .method-subtitle, .included-box-header, .tcc-card, .specialist-card, .pricing-card-main, .guarantee-card, .final-cta-section .container'
  ).forEach(element => registerReveal(element, 'tilt'));

  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }

  // Cursor-following spotlight inspired by the Saulo Tenório cards.
  document.querySelectorAll('.pain-card').forEach(card => {
    const updateSpotlight = event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mx', `${Math.max(0, Math.min(100, x))}%`);
      card.style.setProperty('--my', `${Math.max(0, Math.min(100, y))}%`);
    };

    card.addEventListener('pointerenter', updateSpotlight);
    card.addEventListener('pointermove', updateSpotlight);
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
