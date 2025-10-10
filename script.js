// Year stamp + smooth navigation + scroll spy + slide navigation (keys & buttons)
// + Gallery cycling with resilient image sources (3 per slide)
document.addEventListener('DOMContentLoaded', () => {
  // -------- Year --------
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // -------- Slides / Nav --------
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const linkFor = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);
  const indexOfSection = (el) => sections.findIndex(s => s === el);

  // Smooth nav
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

  // Keyboard
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

  // -------- Image galleries (3 sources per slide) --------
  // Stable mix of Unsplash (with explicit params) + Wikimedia PNGs.
  const galleries = {
    title: [
      { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
        alt: 'Tutoring support (Unsplash)', link: 'https://unsplash.com/photos/9o8YdYGTT64' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Study_group_02.jpg/640px-Study_group_02.jpg',
        alt: 'Study group (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Study_group_02.jpg' },
      { src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
        alt: 'Students learning together (Unsplash)', link: 'https://unsplash.com/photos/PQEOQHZnGBw' },
    ],
    problem: [
      { src: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1200&q=80',
        alt: 'Busy academic corridor (Unsplash)', link: 'https://unsplash.com/photos/VpOeXr5wmR4' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Time_management_%28Unsplash%29.jpg/640px-Time_management_%28Unsplash%29.jpg',
        alt: 'Time management (Wikimedia mirrored)', link: 'https://commons.wikimedia.org/wiki/File:Time_management_(Unsplash).jpg' },
      { src: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
        alt: 'Student under pressure (Unsplash)', link: 'https://unsplash.com/photos/7JX0-bfiuxQ' },
    ],
    aim: [
      { src: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=1200&q=80',
        alt: 'Process documentation (Unsplash)', link: 'https://unsplash.com/photos/7KLa-xLbSXA' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sticky_notes_on_board.jpg/640px-Sticky_notes_on_board.jpg',
        alt: 'Sticky notes planning (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Sticky_notes_on_board.jpg' },
      { src: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=80',
        alt: 'Team workshop (Unsplash)', link: 'https://unsplash.com/photos/7omHUGhhmZ0' },
    ],
    rq: [
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Checklist_icon.svg/640px-Checklist_icon.svg.png',
        alt: 'Quality assurance checklist (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Checklist_icon.svg' },
      { src: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1200&q=80',
        alt: 'Team reviewing checklist (Unsplash)', link: 'https://unsplash.com/photos/7QU7I5KZoM4' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/ISO_9001_certified.svg/640px-ISO_9001_certified.svg.png',
        alt: 'Standards badge (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:ISO_9001_certified.svg' },
    ],
    scope: [
      { src: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1200&q=80',
        alt: 'Exam & invigilation (Unsplash)', link: 'https://unsplash.com/photos/xkBaqlcqeb4' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Exam_time.jpg/640px-Exam_time.jpg',
        alt: 'Exam time (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Exam_time.jpg' },
      { src: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Online class setup (Unsplash)', link: 'https://unsplash.com/photos/-uHVRvDr7pg' },
    ],
    design: [
      { src: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&w=1200&q=80',
        alt: 'Policies & standards (Unsplash)', link: 'https://unsplash.com/photos/7VDoqI4P3n4' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Document_icon_%28the_Noun_Project_15515%29.svg/640px-Document_icon_%28the_Noun_Project_15515%29.svg.png',
        alt: 'Document icon (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Document_icon_(the_Noun_Project_15515).svg' },
      { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
        alt: 'Standards review (Unsplash)', link: 'https://unsplash.com/photos/cO2eCuEtnYI' },
    ],
    methods: [
      { src: 'https://images.unsplash.com/photo-1581375221564-2fe02eb47702?auto=format&fit=crop&w=1200&q=80',
        alt: 'Tutoring session (Unsplash)', link: 'https://unsplash.com/photos/uXnCqj6GpG0' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Interview_icon.png/640px-Interview_icon.png',
        alt: 'Interview icon (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Interview_icon.png' },
      { src: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Focus group discussion (Unsplash)', link: 'https://unsplash.com/photos/u0vgcIOQG08' },
    ],
    kpi: [
      { src: 'https://images.unsplash.com/photo-1551281044-8b39f77b0d5c?auto=format&fit=crop&w=1200&q=80',
        alt: 'KPI dashboard (Unsplash)', link: 'https://unsplash.com/photos/3Mhgvrk4tjM' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Graph_icon.svg/640px-Graph_icon.svg.png',
        alt: 'Graph icon (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Graph_icon.svg' },
      { src: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        alt: 'Charts on laptop (Unsplash)', link: 'https://unsplash.com/photos/mR1CIDduGLc' },
    ],
    plan: [
      { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        alt: 'Team planning (Unsplash)', link: 'https://unsplash.com/photos/3fPXt37X6UQ' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Calendar_icon_2.svg/640px-Calendar_icon_2.svg.png',
        alt: 'Calendar icon (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Calendar_icon_2.svg' },
      { src: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=1200&q=80',
        alt: 'Project planning (Unsplash)', link: 'https://unsplash.com/photos/cvBBO4PzWPg' },
    ],
    ask: [
      { src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
        alt: 'Decision & approval (Unsplash)', link: 'https://unsplash.com/photos/UcfKYTan-LU' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Handshake_icon.svg/640px-Handshake_icon.svg.png',
        alt: 'Handshake icon (Wikimedia)', link: 'https://commons.wikimedia.org/wiki/File:Handshake_icon.svg' },
      { src: 'https://images.unsplash.com/photo-1551836022-4c4fae74f77b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Agreement in meeting (Unsplash)', link: 'https://unsplash.com/photos/1K9T5YiZ2WU' },
    ],
  };

  // Setup each figure with a gallery
  const states = new Map(); // galleryKey -> index
  document.querySelectorAll('figure[data-gallery]').forEach(fig => {
    const key = fig.getAttribute('data-gallery');
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');
    const btn = fig.querySelector('.fig-next-btn');
    const list = galleries[key] || [];
    if (!img || !cap || !btn || list.length === 0) return;

    // init from current image if it matches, else force first
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
        this.src = `https://placehold.co/800x500?text=${encodeURIComponent(item.alt || 'LSC Image')}`;
      };
      img.src = item.src;
      img.alt = item.alt || '';
      // Update source link text
      const span = cap.querySelector('.figcap-text');
      const link = cap.querySelector('.figcap-link');
      if (span) span.textContent = item.alt || 'Image';
      if (link) link.href = item.link || '#';
    }
  });
});
