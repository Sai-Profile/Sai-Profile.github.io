// script.js
// Backgrounds from JavaScript + smooth navigation + slide controls + optional figure galleries.

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Smooth in-page anchor nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  });

  // Scroll-spy
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  const linkFor = (id) => navLinks.find(a => a.getAttribute('href') === `#${id}`);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px', threshold: [0, 1] });
  sections.forEach(sec => io.observe(sec));

  // ---------------- Slide backgrounds from JS ----------------
  // Pick a CSS background class OR an image background per slide.
  const SLIDE_BG = {
    // First three – “surprise” preset; change any time:
    title:   { type: "class", className: "bg-spotlight" },
    problem: { type: "class", className: "bg-soft-gradient" },
    aim:     { type: "class", className: "bg-grid" },

    // Examples:
    // rq:    { type: "img", image: "assets/backgrounds/ribbon.jpg", dim: 0.55 },
    // scope: { type: "class", className: "bg-mesh" },
  };

  const toDirectDrive = (url) => {
    const m = url && url.match(/\/d\/([^/]+)\//);
    return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
  };

  const applyBackground = (sec, cfg) => {
    sec.classList.remove(
      "bg-img","bg-solid","bg-soft-gradient","bg-grain","bg-grid","bg-spotlight","bg-mesh"
    );
    sec.style.removeProperty("--bg-image");
    sec.style.removeProperty("--bg-dim");

    if (!cfg) return;
    if (cfg.type === "class" && cfg.className) {
      sec.classList.add(cfg.className);
    } else if (cfg.type === "img" && cfg.image) {
      sec.classList.add("bg-img");
      const url = toDirectDrive(cfg.image);
      sec.style.setProperty("--bg-image", `url('${url}')`);
      sec.style.setProperty("--bg-dim", String(cfg.dim ?? 0.55));
    }
  };

  (function initBackgrounds(){
    const slides = document.querySelectorAll('main section');
    // From map:
    Object.entries(SLIDE_BG).forEach(([id, cfg]) => {
      const sec = document.getElementById(id);
      if (sec) applyBackground(sec, cfg);
    });
    // If first 3 not set, apply pleasant defaults:
    const first = slides[0], second = slides[1], third = slides[2];
    const hasBg = s => s && (s.className.match(/\bbg-/) || s.classList.contains('bg-img'));
    if (first  && !hasBg(first))  applyBackground(first,  { type:"class", className:"bg-spotlight" });
    if (second && !hasBg(second)) applyBackground(second, { type:"class", className:"bg-soft-gradient" });
    if (third  && !hasBg(third))  applyBackground(third,  { type:"class", className:"bg-grid" });
  })();

  // ---------------- Slide controls (Prev / Next) ----------------
  const controls = document.createElement('div');
  controls.className = 'slide-controls';
  controls.innerHTML = `
    <button type="button" aria-label="Previous slide">‹ Prev</button>
    <button type="button" aria-label="Next slide">Next ›</button>
  `;
  document.body.appendChild(controls);
  const [btnPrev, btnNext] = controls.querySelectorAll('button');

  const getSections = () => Array.from(document.querySelectorAll('main section'));
  const scrollToIndex = (i) => {
    const secs = getSections();
    if (i < 0 || i >= secs.length) return;
    secs[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const currentIndex = () => {
    const secs = getSections();
    const y = window.scrollY + window.innerHeight * 0.35;
    let idx = 0;
    for (let i = 0; i < secs.length; i++) {
      if (secs[i].offsetTop <= y) idx = i;
    }
    return idx;
  };

  btnPrev.addEventListener('click', () => scrollToIndex(currentIndex() - 1));
  btnNext.addEventListener('click', () => scrollToIndex(currentIndex() + 1));

  // Keyboard nav
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;
    if (['PageDown','ArrowDown',' '].includes(e.key)) { e.preventDefault(); scrollToIndex(currentIndex()+1); }
    else if (['PageUp','ArrowUp'].includes(e.key))   { e.preventDefault(); scrollToIndex(currentIndex()-1); }
    else if (e.key==='Home') { e.preventDefault(); scrollToIndex(0); }
    else if (e.key==='End')  { e.preventDefault(); scrollToIndex(getSections().length-1); }
  });

  // ---------------- Optional: figure galleries ----------------
  const galleries = window.galleries || null; // if you already define one elsewhere
  const states = new Map();
  document.querySelectorAll('figure[data-gallery]').forEach(fig => {
    const key = fig.getAttribute('data-gallery');
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');
    const btn = fig.querySelector('.fig-next-btn');
    if (!img || !cap || !btn || !galleries || !galleries[key]) return;

    const list = galleries[key];
    states.set(key, 0);
    const apply = (i) => {
      const item = list[i];
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
      if (link) link.href = item.link || item.src;
    };
    apply(0);
    btn.addEventListener('click', () => {
      const i = (states.get(key) + 1) % list.length;
      states.set(key, i); apply(i);
    });
  });

  // Reflow after images load
  window.addEventListener('load', () => setTimeout(() => window.dispatchEvent(new Event('resize')), 50));
});
