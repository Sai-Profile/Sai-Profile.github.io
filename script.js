// Year stamp + smooth navigation + scroll spy + slide navigation (keys & buttons)
document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sections and nav links
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const linkFor = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);
  const indexOfSection = (el) => sections.findIndex(s => s === el);

  // Smooth scroll for nav clicks
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  });

  // Scroll spy (highlight current slide link)
  let currentIndex = 0;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        currentIndex = indexOfSection(entry.target);
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px', threshold: [0, 1] });
  sections.forEach(sec => observer.observe(sec));

  // ------- Slide navigation helpers -------
  function goTo(index) {
    const i = Math.max(0, Math.min(sections.length - 1, index));
    sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // Keyboard: PgDn/↓/Space => next, PgUp/↑ => prev, Home/End => first/last
  window.addEventListener('keydown', (e) => {
    // avoid stealing focus when typing inside inputs
    const tag = (e.target && e.target.tagName) || '';
    if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;

    if (['PageDown', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault(); next();
    } else if (['PageUp', 'ArrowUp'].includes(e.key)) {
      e.preventDefault(); prev();
    } else if (e.key === 'Home') {
      e.preventDefault(); goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault(); goTo(sections.length - 1);
    }
  });

  // Floating Prev/Next buttons (no HTML change required)
  const controls = document.createElement('div');
  controls.className = 'slide-controls';
  controls.innerHTML = `
    <button type="button" aria-label="Previous slide">‹ Prev</button>
    <button type="button" aria-label="Next slide">Next ›</button>
  `;
  document.body.appendChild(controls);
  const [btnPrev, btnNext] = controls.querySelectorAll('button');
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  // If there is a hash on load, jump to that slide nicely
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }), 0);
    }
  }
});
