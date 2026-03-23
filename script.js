const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateCountUp = (el) => {
  if (el.dataset.animated === 'true') return;
  el.dataset.animated = 'true';

  const target = Number(el.dataset.target || 0);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';

  if (prefersReducedMotion) {
    el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    return;
  }

  const duration = 1100;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('count-up')) animateCountUp(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll('.content-section, .hero-card, .proof-card, .count-up, .timeline-item, .skill-icon-card, .shutdown-card, .ai-card, .cert-badge, .section-nav')
  .forEach((el) => {
    if (!el.classList.contains('count-up') && !prefersReducedMotion) el.classList.add('reveal');
    if (prefersReducedMotion && !el.classList.contains('count-up')) el.classList.add('visible');
    observer.observe(el);
  });

const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
};

const trackOutboundClick = (el, eventName, params = {}) => {
  const href = el.getAttribute('href');
  if (!href) return;

  const target = el.getAttribute('target');
  const shouldDelayNavigation = !target || target === '_self';
  const rel = el.getAttribute('rel') || '';
  const features = rel.includes('noreferrer') ? 'noreferrer' : 'noopener';

  trackEvent(eventName, {
    ...params,
    transport_type: 'beacon',
    event_callback: () => {
      if (shouldDelayNavigation) {
        window.location.href = href;
      } else if (target === '_blank') {
        window.open(href, '_blank', features);
      }
    }
  });

  if (shouldDelayNavigation) {
    setTimeout(() => {
      window.location.href = href;
    }, 150);
  } else if (target === '_blank') {
    setTimeout(() => {
      window.open(href, '_blank', features);
    }, 150);
  }
};

const clickTrackingRules = [
  {
    selector: 'a[href="#wins"]',
    eventName: 'click_nav_cta',
    getParams: () => ({ event_category: 'navigation', event_label: 'see_signature_wins' })
  },
  {
    selector: 'a[href="#contact"]',
    eventName: 'click_nav_cta',
    getParams: () => ({ event_category: 'navigation', event_label: 'get_in_touch' })
  }
];

clickTrackingRules.forEach(({ selector, eventName, getParams }) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('click', () => {
      trackEvent(eventName, getParams(el));
    });
  });
});

const outboundTrackingRules = [
  {
    selector: 'a[href="https://linkedin.com/in/brandon-d-white"]',
    eventName: 'click_linkedin',
    getParams: () => ({ event_category: 'engagement', event_label: 'linkedin_profile' })
  },
  {
    selector: '.publication-link',
    eventName: 'click_publication',
    getParams: () => ({ event_category: 'engagement', event_label: 'aws_database_blog' })
  },
  {
    selector: '.credential-badge',
    eventName: 'click_credential',
    getParams: (el) => ({
      event_category: 'engagement',
      event_label: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 100)
    })
  }
];

outboundTrackingRules.forEach(({ selector, eventName, getParams }) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('click', (event) => {
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
      }

      trackOutboundClick(el, eventName, getParams(el));
    });
  });
});
