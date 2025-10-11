// script.js
// Slide deck navigation + resilient image galleries (3 sources) + active nav
document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sections and nav (5 slides for this deck)
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  const linkFor = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);
  const indexOfSection = (el) => sections.findIndex(s => s === el);

  // Smooth nav clicks
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

  // Scroll spy
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

  // Slide nav helpers
  function goTo(index) {
    const i = Math.max(0, Math.min(sections.length - 1, index));
    sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;
    if (['PageDown', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(sections.length - 1); }
  });

  // Floating Prev/Next buttons
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

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }), 0);
  }

  // -------- Topic-aware Image galleries (3 sources per slide) --------
  // Stable mix of Unsplash (with params) + Wikimedia PNG/SVG thumbs.
  const galleries = {
    // Slide 1 — Why Recruitment is Crucial
    title: [
      { src:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', alt:'Team planning hiring needs around a table', link:'https://unsplash.com/photos/3fPXt37X6UQ' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Handshake_icon.svg/640px-Handshake_icon.svg.png', alt:'Handshake icon representing agreement and hiring', link:'https://commons.wikimedia.org/wiki/File:Handshake_icon.svg' },
      { src:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', alt:'Interview discussion with candidate', link:'https://unsplash.com/photos/cZVthlrnlnQ' },
    ],
    // Slide 2 — The Why & How of Hiring
    problem: [
      { src:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', alt:'Candidate interview illustrating effectiveness', link:'https://unsplash.com/photos/u3WmDyKGsrY' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Checklist_NounProject.svg/640px-Checklist_NounProject.svg.png', alt:'Checklist icon representing hiring process clarity', link:'https://commons.wikimedia.org/wiki/File:Checklist_NounProject.svg' },
      { src:'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=1200&q=80', alt:'Team aligning on roles and requirements', link:'https://unsplash.com/photos/7KLa-xLbSXA' },
    ],
    // Slide 3 — Example: The Simple Truth
    aim: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Graph_icon.svg/640px-Graph_icon.svg.png', alt:'Graph icon for ROI vs cost of hire', link:'https://commons.wikimedia.org/wiki/File:Graph_icon.svg' },
      { src:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80', alt:'High-performing team as outcome of good hire', link:'https://unsplash.com/photos/KE0nC8-58MQ' },
      { src:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', alt:'Wasted time symbolizing bad hire costs', link:'https://unsplash.com/photos/gcsNOsPEXfs' },
    ],
    // Slide 4 — Techniques for Effective Staff
    rq: [
      { src:'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=80', alt:'Work sample task at a desk', link:'https://unsplash.com/photos/7omHUGhhmZ0' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bow_and_arrow_icon.svg/640px-Bow_and_arrow_icon.svg.png', alt:'Precision icon metaphor for targeted skills', link:'https://commons.wikimedia.org/wiki/File:Bow_and_arrow_icon.svg' },
      { src:'https://images.unsplash.com/photo-1524567497590-6a2a7f01007c?auto=format&fit=crop&w=1200&q=80', alt:'Team culture conversation for fit', link:'https://unsplash.com/photos/ibpzzTR3sxg' },
    ],
    // Slide 5 — Techniques for Efficient Staff
    scope: [
      { src:'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80', alt:'Colleagues sharing referrals', link:'https://unsplash.com/photos/6U5AEmQIajg' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Megaphone_icon.svg/640px-Megaphone_icon.svg.png', alt:'Megaphone icon symbolizing clear job ads', link:'https://commons.wikimedia.org/wiki/File:Megaphone_icon.svg' },
      { src:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', alt:'Shortlist of candidates ready on a waiting list', link:'https://unsplash.com/photos/u3WmDyKGsrY' },
    ],
  };

  // Setup gallery per figure
  const states = new Map(); // galleryKey -> index
  document.querySelectorAll('figure[data-gallery]').forEach(fig => {
    const key = fig.getAttribute('data-gallery');
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');
    const btn = fig.querySelector('.fig-next-btn');
    const list = galleries[key] || [];
    if (!img || !cap || !btn || list.length === 0) return;

    states.set(key, 0);
    applyImage(key, 0);

    btn.addEventListener('click', () => {
      const i = (states.get(key) + 1) % list.length;
      states.set(key, i);
      applyImage(key, i);
    });

    function applyImage(k, i) {
      const item = galleries[k][i];
      img.setAttribute('referrerpolicy', 'no-referrer');
      img.onerror = function () {
        this.onerror = null;
        this.src = `https://placehold.co/800x500?text=${encodeURIComponent(item.alt || 'Slide Image')}`;
      };
      img.src = item.src;
      img.alt = item.alt || '';
      const span = cap.querySelector('.figcap-text');
      const link = cap.querySelector('.figcap-link');
      if (span) span.textContent = item.alt || 'Image';
      if (link && item.link) link.href = item.link;
    }
  });
});
