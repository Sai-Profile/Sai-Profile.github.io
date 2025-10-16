// script.js
// Backgrounds from JavaScript + smooth navigation + slide controls + header switcher.
// If you don’t touch anything, slides 1–3 get (spotlight → soft-gradient → grid).

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Smooth in-page nav
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

  // Scroll spy
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
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

  // ------------ Backgrounds from JS (per slide) ------------
  const SLIDE_BG = {
    title:   { type: "class", className: "bg-spotlight" },
    problem: { type: "class", className: "bg-soft-gradient" },
    aim:     { type: "class", className: "bg-grid" },
    // rq:    { type: "img", image: "assets/bg-ribbon.jpg", dim: 0.56 },
    // scope: { type: "class", className: "bg-mesh" },
  };

  const toDirectDrive = (url) => {
    const m = url && url.match(/\/d\/([^/]+)\//);
    return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
  };

  const clearBg = (el) => {
    el.classList.remove("bg-img","bg-solid","bg-soft-gradient","bg-grain","bg-grid","bg-spotlight","bg-mesh");
    el.style.removeProperty("--bg-image");
    el.style.removeProperty("--bg-dim");
  };

  const applyBg = (sec, cfg) => {
    clearBg(sec);
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

  // Apply map
  Object.entries(SLIDE_BG).forEach(([id, cfg]) => {
    const sec = document.getElementById(id);
    if (sec) applyBg(sec, cfg);
  });

  // If first 3 not set, apply pleasant defaults
  (function ensurePreset(){
    const slides = document.querySelectorAll('main section');
    const hasBg = s => s && (s.className.match(/\bbg-/) || s.classList.contains('bg-img'));
    const first = slides[0], second = slides[1], third = slides[2];
    if (first  && !hasBg(first))  applyBg(first,  { type:"class", className:"bg-spotlight" });
    if (second && !hasBg(second)) applyBg(second, { type:"class", className:"bg-soft-gradient" });
    if (third  && !hasBg(third))  applyBg(third,  { type:"class", className:"bg-grid" });
  })();

  // ------------ Header switcher (deck-wide) ------------
  const $sel = document.getElementById('bgSelect');
  const $reset = document.getElementById('bgReset');

  const bodyClear = () => {
    document.body.classList.remove("bg-img","bg-solid","bg-soft-gradient","bg-grain","bg-grid","bg-spotlight","bg-mesh");
    document.body.style.removeProperty("--bg-image");
    document.body.style.removeProperty("--bg-dim");
  };

  const saveChoice = (v, url, dim) => {
    localStorage.setItem('deckBgChoice', JSON.stringify({v, url:url||null, dim:dim||null}));
  };
  const loadChoice = () => {
    try { return JSON.parse(localStorage.getItem('deckBgChoice')||'{}'); }
    catch{ return {}; }
  };

  const applyDeckBg = async (value) => {
    bodyClear();
    const slides = document.querySelectorAll('main section');

    if (value === 'preset') {
      // Just clear deck-wide and keep per-slide mapping/preset 1-3
      saveChoice('preset');
      return;
    }

    if (value === 'none') {
      // Clear deck-wide; keep per-slide mapping as-is
      saveChoice('none');
      return;
    }

    if (value === 'img') {
      let url = prompt('Enter image URL (tip: use a repo asset like assets/bg.jpg). Google Drive viewer links OK.');
      if (!url) return; // cancel
      // Convert Drive viewer → direct
      url = toDirectDrive(url);
      let dim = parseFloat(prompt('Dim behind content (0.45–0.65 recommended). Default 0.55', '0.55'));
      if (isNaN(dim)) dim = 0.55;

      document.body.classList.add('bg-img');
      document.body.style.setProperty('--bg-image', `url('${url}')`);
      document.body.style.setProperty('--bg-dim', String(dim));
      saveChoice('img', url, dim);
      return;
    }

    // Deck-wide CSS class
    const map = {
      solid:'bg-solid', soft:'bg-soft-gradient', grid:'bg-grid',
      spotlight:'bg-spotlight', mesh:'bg-mesh', grain:'bg-grain'
    };
    const cls = map[value];
    if (cls) {
      document.body.classList.add(cls);
      saveChoice(value);
    }
  };

  // Load saved choice
  const saved = loadChoice();
  if (saved.v) {
    $sel.value = saved.v;
    if (saved.v === 'img' && saved.url) {
      document.body.classList.add('bg-img');
      document.body.style.setProperty('--bg-image', `url('${saved.url}')`);
      document.body.style.setProperty('--bg-dim', String(saved.dim ?? 0.55));
    } else if (saved.v !== 'preset' && saved.v !== 'none') {
      applyDeckBg(saved.v);
    }
  }

  $sel.addEventListener('change', (e)=> applyDeckBg(e.target.value));

  // Reset per-slide backgrounds to current deck-wide choice (clears classes on slides)
  $reset.addEventListener('click', ()=>{
    document.querySelectorAll('main section').forEach(sec => {
      // Clear slide classes and let deck-wide rule show
      sec.classList.remove("bg-img","bg-solid","bg-soft-gradient","bg-grain","bg-grid","bg-spotlight","bg-mesh");
      sec.style.removeProperty("--bg-image");
      sec.style.removeProperty("--bg-dim");
    });
  });

  // ------------ Prev/Next controls & keys ------------
  const controls = document.createElement('div');
  controls.className = 'slide-controls';
  controls.innerHTML = `
    <button type="button" aria-label="Previous slide">‹ Prev</button>
    <button type="button" aria-label="Next slide">Next ›</button>
  `;
  document.body.appendChild(controls);
  const [btnPrev, btnNext] = controls.querySelectorAll('button');

  const secs = () => Array.from(document.querySelectorAll('main section'));
  const goIdx = (i) => { const s = secs(); if (i>=0 && i<s.length) s[i].scrollIntoView({behavior:'smooth', block:'start'}); };
  const curIdx = () => {
    const s = secs(), y = window.scrollY + window.innerHeight*0.35;
    let idx = 0; for (let i=0;i<s.length;i++){ if (s[i].offsetTop <= y) idx = i; } return idx;
  };
  btnPrev.addEventListener('click', ()=> goIdx(curIdx()-1));
  btnNext.addEventListener('click', ()=> goIdx(curIdx()+1));
  window.addEventListener('keydown', (e)=>{
    const tag = (e.target && e.target.tagName) || '';
    if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;
    if (['PageDown','ArrowDown',' '].includes(e.key)) { e.preventDefault(); goIdx(curIdx()+1); }
    else if (['PageUp','ArrowUp'].includes(e.key))     { e.preventDefault(); goIdx(curIdx()-1); }
    else if (e.key==='Home') { e.preventDefault(); goIdx(0); }
    else if (e.key==='End')  { e.preventDefault(); goIdx(secs().length-1); }
  });

  // ------------ Optional gallery support (if present) ------------
  const galleries = window.galleries || null;
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
      img.onerror = function () { this.onerror=null; this.src=`https://placehold.co/800x500?text=${encodeURIComponent(item.alt||'Image')}`; };
      img.src = item.src; img.alt = item.alt || '';
      const span = cap.querySelector('.figcap-text'); const link = cap.querySelector('.figcap-link');
      if (span) span.textContent = item.alt || 'Image';
      if (link) link.href = item.link || item.src;
    };
    apply(0);
    btn.addEventListener('click', ()=> { const i=(states.get(key)+1)%list.length; states.set(key,i); apply(i); });
  });

  // Reflow
  window.addEventListener('load', ()=> setTimeout(()=> window.dispatchEvent(new Event('resize')), 50));
});
