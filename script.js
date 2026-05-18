// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  '.hero-inner, .section-head, .card, .showcase-card, .contact-copy, .stat'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => io.observe(el));

// Count-up animation for stats
const countEls = document.querySelectorAll('.stat strong[data-count]');
const easeOut = t => 1 - Math.pow(1 - t, 3);

const countIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const value = target * easeOut(t);
      el.textContent = Math.round(value) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
    countIo.unobserve(el);
  });
}, { threshold: 0.4 });

countEls.forEach(el => countIo.observe(el));

// Smooth anchor offset (sticky nav)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// Contact form
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const message = (data.get('message') || '').toString().trim();

  if (!name || !email || !message) {
    status.style.color = '#ff7676';
    status.textContent = 'Please fill in name, email, and a short message.';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    status.style.color = '#ff7676';
    status.textContent = 'That email doesn\'t look right.';
    return;
  }

  status.style.color = '';
  status.textContent = 'Thanks — we\'ll be in touch within one business day.';
  form.reset();
});
