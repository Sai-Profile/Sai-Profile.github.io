// script.js
// Slide deck navigation + resilient image galleries (3 sources) + active nav
document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sections and nav
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

  // -------- Image galleries (3 sources per slide) --------
  // Use robust Wikimedia PNG/SVG thumbs and neutral Unsplash analogues.
  const galleries = {
    title: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Alpha_Centauri_AB_and_Proxima_Centauri_%28annotation%29.jpg/640px-Alpha_Centauri_AB_and_Proxima_Centauri_%28annotation%29.jpg', alt:'Alpha Centauri system context (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Alpha_Centauri_AB_and_Proxima_Centauri_(annotation).jpg' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Polyphemus_%28moon_illustration%29.png/640px-Polyphemus_%28moon_illustration%29.png', alt:'Gas giant concept art analogue (Wikimedia)', link:'https://commons.wikimedia.org/wiki/Main_Page' },
      { src:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80', alt:'Alien skies—analogue mood (Unsplash)', link:'https://unsplash.com/photos/ln5drpv_ImI' },
    ],
    problem: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Hallelujah_Mountains%2C_Zhangjiajie%2C_Hunan.jpg/640px-Hallelujah_Mountains%2C_Zhangjiajie%2C_Hunan.jpg', alt:'Zhangjiajie pillars—floating mountains inspiration', link:'https://commons.wikimedia.org/wiki/File:Hallelujah_Mountains,_Zhangjiajie,_Hunan.jpg' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Exoskeleton_breathing_mask_symbol.svg/640px-Exoskeleton_breathing_mask_symbol.svg.png', alt:'Breathing apparatus symbol (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Exoskeleton_breathing_mask_symbol.svg' },
      { src:'https://images.unsplash.com/photo-1496302662116-85c3b55f09b4?auto=format&fit=crop&w=1200&q=80', alt:'Magnetic lab analogue (Unsplash)', link:'https://unsplash.com/photos/BCCtC9b2F8A' },
    ],
    aim: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bioluminescence_in_Mushrooms.jpg/640px-Bioluminescence_in_Mushrooms.jpg', alt:'Bioluminescent fungi (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Bioluminescence_in_Mushrooms.jpg' },
      { src:'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80', alt:'Waterfalls & canopies (Unsplash)', link:'https://unsplash.com/photos/JmuyB_LibRo' },
      { src:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', alt:'Misty highlands (Unsplash)', link:'https://unsplash.com/photos/2LowviVHZ-E' },
    ],
    rq: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Tree_roots_in_the_forest.jpg/640px-Tree_roots_in_the_forest.jpg', alt:'Interconnected roots network (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Tree_roots_in_the_forest.jpg' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Seed_on_moss.jpg/640px-Seed_on_moss.jpg', alt:'Seed symbolizing balance (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Seed_on_moss.jpg' },
      { src:'https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?auto=format&fit=crop&w=1200&q=80', alt:'Sacred grove analogue (Unsplash)', link:'https://unsplash.com/photos/0nJ6eJtC6t4' },
    ],
    scope: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Horse_and_rider_silhouette.jpg/640px-Horse_and_rider_silhouette.jpg', alt:'Rider & mount bond (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Horse_and_rider_silhouette.jpg' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Eagle_in_flight.jpg/640px-Eagle_in_flight.jpg', alt:'Aerial mobility analogue (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Eagle_in_flight.jpg' },
      { src:'https://images.unsplash.com/photo-1476067897447-d0c5df27b5df?auto=format&fit=crop&w=1200&q=80', alt:'Predator presence analogue (Unsplash)', link:'https://unsplash.com/photos/4W5bQ4Q6Q1g' },
    ],
    design: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Indigenous_people_in_ceremony.jpg/640px-Indigenous_people_in_ceremony.jpg', alt:'Community & ceremony (Wikimedia)', link:'https://commons.wikimedia.org/wiki/Main_Page' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bow_and_arrow_icon.svg/640px-Bow_and_arrow_icon.svg.png', alt:'Hunter-gatherer skills icon (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Bow_and_arrow_icon.svg' },
      { src:'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80', alt:'Forest agility analogue (Unsplash)', link:'https://unsplash.com/photos/2LowviVHZ-E' },
    ],
    methods: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Choir_singing.jpg/640px-Choir_singing.jpg', alt:'Song & ritual (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Choir_singing.jpg' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Dance_icon.svg/640px-Dance_icon.svg.png', alt:'Rite of passage icon (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Dance_icon.svg' },
      { src:'https://images.unsplash.com/photo-1520975693413-c59b3e538c79?auto=format&fit=crop&w=1200&q=80', alt:'Sacred site analogue (Unsplash)', link:'https://unsplash.com/photos/8manzosRGPE' },
    ],
    kpi: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Open_pit_mine.jpg/640px-Open_pit_mine.jpg', alt:'Open-pit mining (Wikimedia)', link:'https://commons.wikimedia.org/wiki/Main_Page' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Stop_hand_sign_icon.svg/640px-Stop_hand_sign_icon.svg.png', alt:'Conflict/stop icon (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Stop_hand_sign_icon.svg' },
      { src:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80', alt:'Forest at risk analogue (Unsplash)', link:'https://unsplash.com/photos/Nl7eLS8E2Ss' },
    ],
    plan: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Hands_forming_heart_shape.jpg/640px-Hands_forming_heart_shape.jpg', alt:'Connection & care (Wikimedia)', link:'https://commons.wikimedia.org/wiki/Main_Page' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Scales_of_Justice.svg/640px-Scales_of_Justice.svg.png', alt:'Ethics and balance (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Scales_of_Justice.svg' },
      { src:'https://images.unsplash.com/photo-1499744632587-7f0a15f5b2c4?auto=format&fit=crop&w=1200&q=80', alt:'Belonging and home analogue (Unsplash)', link:'https://unsplash.com/photos/jbtfM0XBeRc' },
    ],
    ask: [
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Blue_planet_Earth.jpg/640px-Blue_planet_Earth.jpg', alt:'Blue planet—environmental storytelling (Wikimedia)', link:'https://commons.wikimedia.org/wiki/Main_Page' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Handshake_icon.svg/640px-Handshake_icon.svg.png', alt:'Handshake—agreement (Wikimedia)', link:'https://commons.wikimedia.org/wiki/File:Handshake_icon.svg' },
      { src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', alt:'Inspiration and resonance (Unsplash)', link:'https://unsplash.com/photos/kcW4X5zL6Bk' },
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
        this.src = `https://placehold.co/800x500?text=${encodeURIComponent(item.alt || 'Image')}`;
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
