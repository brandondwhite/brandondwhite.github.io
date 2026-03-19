const animateCountUp = (el) => {
  if (el.dataset.animated === 'true') return;
  el.dataset.animated = 'true';

  const target = Number(el.dataset.target || 0);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1100;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('count-up')) {
          animateCountUp(entry.target);
        }
      }
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll('.content-section, .hero-card, .proof-card, .count-up, .timeline-item, .skill-icon-card, .shutdown-card, .ai-card')
  .forEach((el) => {
    if (!el.classList.contains('count-up')) {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });
