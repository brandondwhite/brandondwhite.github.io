const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll('.content-section, .hero-card, .hero-metrics li, .timeline-item, .skill-icon-card, .shutdown-card, .ai-card')
  .forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
