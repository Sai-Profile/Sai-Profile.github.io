// Year stamp + smooth in-page navigation + simple scroll spy
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Smooth scroll for hash links
  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  });

  // Scroll spy to highlight current nav link
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const linkFor = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, 1] });

  sections.forEach(sec => observer.observe(sec));
});
