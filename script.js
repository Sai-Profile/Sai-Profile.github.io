// script.js
// Injects your slides, applies per-slide backgrounds, smooth nav, slide controls,
// and (NEW) Source + Next per figure with one option per provider + robust failover.

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------
   * 0) Small niceties
   * -------------------------------------------*/
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Smooth anchor nav
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

  /* ---------------------------------------------
   * 1) Slide content
   * -------------------------------------------*/
  const CONTENT = {
    contents: {
      kicker: 'Slide 1 — Contents',
      h2: 'What We’ll Cover: The Solar System Overview',
      bulletsTop: ['<strong>Key points:</strong>'],
      bullets: [
        '<strong>What is the Solar System?</strong> — Basic idea and what it includes.',
        '<strong>The Sun</strong> — Our central star.',
        '<strong>Inner planets</strong> — Rocky worlds close to the Sun.',
        '<strong>Outer planets</strong> — Giants farther out.',
        '<strong>Dwarf planets & small bodies</strong> — Pluto and friends.',
        '<strong>Orbits & gravity</strong> — What holds it all together.',
        '<strong>Fun facts & recap</strong> — Cool details and summary.'
      ],
      script: '“Here’s what we’ll cover today: from the Sun, to the planets, to the tiny objects that share our Solar System.”',
      figure: { alt: 'Collage of the Sun and major Solar System bodies', cap: 'Today’s roadmap: the Solar System at a glance' }
    },

    'what-is': {
      kicker: 'Slide 2 — What Is the Solar System?',
      h2: 'Definition and Main Members',
      bullets: [
        '<strong>Definition</strong> — The Solar System is the Sun plus everything that orbits it.',
        '<strong>Main members</strong> — Planets, dwarf planets, moons, asteroids, comets, and dust.',
        '<strong>Location</strong> — It sits inside a galaxy called the Milky Way.'
      ],
      script: '“The Solar System is simply our Sun and all the objects that move around it inside the Milky Way.”',
      figure: { alt: 'Diagram showing the Sun and orbiting planets', cap: 'The Solar System and its members' }
    },

    sun: {
      kicker: 'Slide 3 — The Sun: Our Star',
      h2: 'Huge, Hot, and the System’s Engine',
      bullets: [
        '<strong>Huge and hot</strong> — The Sun is a giant ball of hot gas (plasma).',
        '<strong>Energy source</strong> — Produces light and heat via nuclear fusion.',
        '<strong>Center of gravity</strong> — Its gravity keeps all planets in orbit.'
      ],
      script: '“The Sun is the powerful star at the center, giving us light, heat, and the gravity that holds everything together.”',
      figure: { alt: 'Close-up of the Sun’s surface and prominences', cap: 'Our local star: the Sun' }
    },

    inner: {
      kicker: 'Slide 4 — Inner Rocky Planets',
      h2: 'Mercury, Venus, Earth, and Mars',
      bullets: [
        '<strong>Members</strong> — Mercury, Venus, Earth, and Mars.',
        '<strong>Rocky worlds</strong> — Solid surfaces of rock and metal.',
        '<strong>Closer to the Sun</strong> — Smaller and warmer than the outer planets.'
      ],
      script: '“The four inner planets are small, rocky worlds that orbit close to the Sun.”',
      figure: { alt: 'Montage of the four inner rocky planets', cap: 'The inner Solar System' }
    },

    'earth-mars': {
      kicker: 'Slide 5 — A Closer Look at Earth and Mars',
      h2: 'Earth & Mars Highlights',
      bullets: [
        '<strong>Earth</strong> — Our home planet with liquid water and life.',
        '<strong>Protective atmosphere</strong> — Helps keep temperatures stable.',
        '<strong>Mars</strong> — Cold, dry, explored by robots and rovers.'
      ],
      script: '“Earth is the only known planet with life, and Mars is our main target for future exploration.”',
      figure: { alt: 'Earth and Mars side-by-side comparison', cap: 'Earth vs. Mars' }
    },

    'gas-giants': {
      kicker: 'Slide 6 — The Gas Giants: Jupiter and Saturn',
      h2: 'Jupiter & Saturn',
      bullets: [
        '<strong>Very large planets</strong> — Mostly hydrogen and helium.',
        '<strong>Thick atmospheres</strong> — No solid surface like Earth.',
        '<strong>Rings and moons</strong> — Saturn’s rings; both have many moons.'
      ],
      script: '“Jupiter and Saturn are huge gas giants with thick atmospheres, many moons, and in Saturn’s case, beautiful rings.”',
      figure: { alt: 'Jupiter and Saturn with visible bands and rings', cap: 'The gas giants' }
    },

    'ice-giants': {
      kicker: 'Slide 7 — The Ice Giants: Uranus and Neptune',
      h2: 'Uranus & Neptune',
      bullets: [
        '<strong>Colder and farther</strong> — Orbit much farther from the Sun.',
        '<strong>Icy mix</strong> — Hydrogen, helium, and ‘ices’ like water, methane, ammonia.',
        '<strong>Unique features</strong> — Uranus tilts on its side; Neptune has strong winds.'
      ],
      script: '“Uranus and Neptune are distant, icy giants with strange tilts, strong winds, and very cold temperatures.”',
      figure: { alt: 'Uranus and Neptune in deep blue hues', cap: 'The ice giants' }
    },

    'dwarf-kuiper': {
      kicker: 'Slide 8 — Dwarf Planets and the Kuiper Belt',
      h2: 'Pluto and Beyond',
      bullets: [
        '<strong>Dwarf planets</strong> — Smaller worlds like Pluto, Eris, Ceres.',
        '<strong>Kuiper Belt</strong> — Beyond Neptune, full of icy bodies.',
        '<strong>Not full planets</strong> — Round but share orbits with other objects.'
      ],
      script: '“Beyond Neptune lies the Kuiper Belt, home to Pluto and many other small, icy dwarf planets.”',
      figure: { alt: 'New Horizons image of Pluto / Kuiper Belt artist impression', cap: 'Dwarf planets and the Kuiper Belt' }
    },

    'small-bodies': {
      kicker: 'Slide 9 — Asteroids, Comets, and Other Small Bodies',
      h2: 'Rocks, Ice, and Shooting Stars',
      bullets: [
        '<strong>Asteroids</strong> — Rocky objects; many in the asteroid belt.',
        '<strong>Comets</strong> — Icy bodies with bright tails near the Sun.',
        '<strong>Meteoroids</strong> — Small rocks that create meteors (shooting stars).'
      ],
      script: '“The Solar System is also filled with smaller visitors like asteroids, comets, and the meteors we see as shooting stars.”',
      figure: { alt: 'Asteroid close-up, comet with tail, and meteor shower', cap: 'Small bodies of the Solar System' }
    },

    orbits: {
      kicker: 'Slide 10 — Orbits and Gravity',
      h2: 'Gravity, Ellipses, and Motion',
      bullets: [
        '<strong>Gravity rules</strong> — The Sun’s gravity pulls planets into orbits.',
        '<strong>Elliptical orbits</strong> — Slightly oval, not perfect circles.',
        '<strong>Balance</strong> — Forward motion + gravity = stable paths.'
      ],
      script: '“Gravity pulls the planets toward the Sun while their motion carries them forward, creating stable orbits.”',
      figure: { alt: 'Diagram of elliptical orbit around the Sun', cap: 'How orbits work' }
    },

    recap: {
      kicker: 'Slide 11 — Fun Facts and Recap',
      h2: 'Quick Facts & Wrap-Up',
      bullets: [
        '<strong>Size difference</strong> — The Sun holds almost all the mass.',
        '<strong>Distances</strong> — Light takes ~8 minutes Sun→Earth.',
        '<strong>Quick recap</strong> — Sun, planets, dwarf planets, and smaller objects.'
      ],
      script: '“To recap, our Solar System is a huge family of worlds, all held together by the Sun’s gravity and energy.”',
      figure: { alt: 'Scale illustration of Sun vs planets', cap: 'Recap: our Solar System family' }
    }
  };

  /* ---------------------------------------------
   * 1.5) One option per provider, with credits
   * -------------------------------------------*/
  const R = (items) => {
    const arr = items.filter(x => x && x.src).slice(0, 5);
    while (arr.length && arr.length < 5) arr.push(arr[0]);
    return arr;
  };

  const RELATED_IMAGES = {
    contents: R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/c/c3/Solar_sys8.jpg', credit:'https://commons.wikimedia.org/wiki/File:Solar_sys8.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA03153/PIA03153~orig.jpg', credit:'https://images.nasa.gov/details-PIA03153' },
      { src:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/Q1p7bh3SHj8' },
      { src:'https://images.pexels.com/photos/586030/pexels-photo-586030.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/astronomy-constellation-dark-586030/' }
    ]),
    'what-is': R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/6/6f/PIA03153_InnerSolarSystem.jpg', credit:'https://commons.wikimedia.org/wiki/File:PIA03153_InnerSolarSystem.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA03153/PIA03153~orig.jpg', credit:'https://images.nasa.gov/details-PIA03153' },
      { src:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/kcJsQ3PJrYU' },
      { src:'https://images.pexels.com/photos/1275413/pexels-photo-1275413.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/planets-display-1275413/' }
    ]),
    sun: R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/c/c3/Solar_prominence_2010-08-01.jpg', credit:'https://commons.wikimedia.org/wiki/File:Solar_prominence_2010-08-01.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg', credit:'https://images.nasa.gov/details-PIA03149' },
      { src:'https://images.unsplash.com/photo-1473929734679-bc191d45b403?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/Pw8C5DPOYwA' },
      { src:'https://images.pexels.com/photos/87611/sun-solar-flare-sunlight-heat-87611.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/yellow-sun-solar-flare-87611/' }
    ]),
    inner: R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/3/3f/Terrestrial_planet_sizes2.jpg', credit:'https://commons.wikimedia.org/wiki/File:Terrestrial_planet_sizes2.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA00452/PIA00452~orig.jpg', credit:'https://images.nasa.gov/details-PIA00452' },
      { src:'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/0o_GEzyargo' },
      { src:'https://images.pexels.com/photos/2694037/pexels-photo-2694037.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/photo-of-mars-2694037/' }
    ]),
    'earth-mars': R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg', credit:'https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA00407/PIA00407~orig.jpg', credit:'https://images.nasa.gov/details-PIA00407' },
      { src:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/Q1p7bh3SHj8' },
      { src:'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/planet-earth-220201/' }
    ]),
    'gas-giants': R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg', credit:'https://commons.wikimedia.org/wiki/File:Jupiter.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA12567/PIA12567~orig.jpg', credit:'https://images.nasa.gov/details-PIA12567' },
      { src:'https://images.unsplash.com/photo-1580428180163-3ea0c5a58e2f?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/1qL31aacAPA' },
      { src:'https://images.pexels.com/photos/2832081/pexels-photo-2832081.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/saturn-planet-2832081/' }
    ]),
    'ice-giants': R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg', credit:'https://commons.wikimedia.org/wiki/File:Uranus2.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg', credit:'https://images.nasa.gov/details-PIA01492' },
      { src:'https://images.unsplash.com/photo-1527827789610-1a21aab66e6c?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/ededxYVJ7X8' },
      { src:'https://images.pexels.com/photos/1933319/pexels-photo-1933319.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/blue-uranus-planet-1933319/' }
    ]),
    'dwarf-kuiper': R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/2/2a/Nh-pluto-in-true-color_2x_JPEG-edit-frame.jpg', credit:'https://commons.wikimedia.org/wiki/File:Nh-pluto-in-true-color_2x_JPEG-edit-frame.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg', credit:'https://images.nasa.gov/details-PIA19952' },
      { src:'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/o9JpXcYJvZk' },
      { src:'https://images.pexels.com/photos/220364/pexels-photo-220364.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/astronomy-cosmos-dark-220364/' }
    ]),
    'small-bodies': R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/5/58/Comet_67P_Churyumov-Gerasimenko.jpg', credit:'https://commons.wikimedia.org/wiki/File:Comet_67P_Churyumov-Gerasimenko.jpg' },
      { src:'https://images-assets.nasa.gov/image/PIA15415/PIA15415~orig.jpg', credit:'https://images.nasa.gov/details-PIA15415' },
      { src:'https://images.unsplash.com/photo-1476611338391-6f395a0ebc9a?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/5SX5F2qZx6I' },
      { src:'https://images.pexels.com/photos/127577/pexels-photo-127577.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/starry-sky-night-milky-way-127577/' }
    ]),
    orbits: R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/1/1a/Orbit1.svg.png', credit:'https://commons.wikimedia.org/wiki/File:Orbit1.svg' },
      { src:'https://images-assets.nasa.gov/image/PIA05152/PIA05152~orig.jpg', credit:'https://images.nasa.gov/details-PIA05152' },
      { src:'https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/y0AAqTL_f9k' },
      { src:'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/astronomy-orbit-2387873/' }
    ]),
    recap: R([
      { src:'https://upload.wikimedia.org/wikipedia/commons/5/5a/Solar_System_size_to_scale.svg.png', credit:'https://commons.wikimedia.org/wiki/File:Solar_System_size_to_scale.svg' },
      { src:'https://images-assets.nasa.gov/image/PIA17045/PIA17045~orig.jpg', credit:'https://images.nasa.gov/details-PIA17045' },
      { src:'https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=1600&auto=format', credit:'https://unsplash.com/photos/A1HC7fQ0b2A' },
      { src:'https://images.pexels.com/photos/60132/pexels-photo-60132.jpeg?auto=compress&cs=tinysrgb&w=1600', credit:'https://www.pexels.com/photo/astronomy-constellation-galaxy-60132/' }
    ])
  };

  /* ---------------------------------------------
   * 2) Render into existing <section id="...">
   *    (Source + Next for ALL figures; Source updates with image)
   * -------------------------------------------*/
  const renderSlide = (id, data) => {
    const sec = document.getElementById(id);
    if (!sec || !data) return;

    const kicker = data.kicker ? `<div class="kicker">${data.kicker}</div>` : '';
    const subtitle = data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : '';
    const bulletsTop = data.bulletsTop?.length
      ? `<ul>${data.bulletsTop.map(li => `<li>${li}</li>`).join('')}</ul>` : '';
    const bullets = data.bullets?.length
      ? `<ul>${data.bullets.map(li => `<li>${li}</li>`).join('')}</ul>` : '';
    const explain = data.explain ? `<div class="explain">${data.explain}</div>` : '';
    const script = data.script ? `<p class="script">${data.script}</p>` : '';

    let figure = '';
    if (data.figure) {
      const imgId = `main-image-${id}`;
      const btnId = `next-related-${id}`;
      const srcId = `source-${id}`;
      const capText = data.figure.cap || '';
      const capRight = `<a id="${srcId}" target="_blank" rel="noopener">Source</a> <button type="button" class="fig-next-btn" id="${btnId}">Next</button>`;

      figure = `
        <figure>
          <img id="${imgId}" src="" alt="${data.figure.alt || ''}" loading="lazy" referrerpolicy="no-referrer" />
          <figcaption>
            <span class="figcap-text">${capText}</span>
            <span>${capRight}</span>
          </figcaption>
        </figure>`;
    }

    sec.innerHTML = `
      ${kicker}
      <h2 class="slide-title">${data.h2 || ''}</h2>
      ${subtitle}
      <div class="grid">
        <div>
          ${bulletsTop}
          ${bullets}
          ${explain}
          ${script}
        </div>
        ${figure}
      </div>
    `;
  };

  Object.entries(CONTENT).forEach(([id, data]) => renderSlide(id, data));

  /* ---------------------------------------------
   * 2.5) Image utilities + Next wiring (robust)
   * -------------------------------------------*/
  function preloadOnce(url) {
    return new Promise((resolve, reject) => {
      if (!url) return reject(new Error('empty-url'));
      const probe = new Image();
      probe.referrerPolicy = 'no-referrer';
      probe.onload = () => resolve(url);
      probe.onerror = () => reject(new Error('load-failed'));
      probe.src = url;
    });
  }
  async function firstWorking(urls) {
    for (const u of urls) {
      try { return await preloadOnce(u); } catch (_) {}
    }
    return null;
  }

  (async function initAllNextButtons() {
    for (const id of Object.keys(CONTENT)) {
      const img = document.getElementById(`main-image-${id}`);
      const btn = document.getElementById(`next-related-${id}`);
      const sourceA = document.getElementById(`source-${id}`);
      if (!img || !btn || !sourceA) continue;

      const items = (RELATED_IMAGES[id] || []);
      let list = items.map(o => o.src).slice(0, 5);
      let credit = items.map(o => o.credit || o.src).slice(0, 5);

      // Fallback to figure.src if list empty
      const initialSrc = CONTENT[id]?.figure?.src || '';
      if (!list.length && initialSrc) {
        list = [initialSrc, initialSrc, initialSrc, initialSrc, initialSrc];
        credit = [initialSrc, initialSrc, initialSrc, initialSrc, initialSrc];
      }
      if (!list.length) { list = ['']; credit = ['#','#','#','#','#']; }

      // Choose first that actually loads
      const good = await firstWorking(list);
      img.src = good || list[0];

      let idx = list.findIndex(u => u && img.src.endsWith(u));
      if (idx < 0) idx = 0;
      sourceA.href = credit[idx] || '#';

      // Advance helper: preload-next, skip failures, update Source
      const advance = async () => {
        for (let step = 0; step < list.length; step++) {
          const nextIdx = (idx + 1) % list.length;
          try {
            const ok = await preloadOnce(list[nextIdx]);
            img.src = ok;
            idx = nextIdx;
            sourceA.href = credit[idx] || sourceA.href;
            break;
          } catch { idx = nextIdx; } // skip broken and continue
        }
      };

      btn.addEventListener('click', advance);
      img.addEventListener('error', advance);
    }
  })();

  /* ---------------------------------------------
   * 3) Backgrounds from JS (no HTML edits needed)
   * -------------------------------------------*/
  const SLIDE_BG = {
    contents:   { type: 'class', className: 'bg-spotlight' },
    'what-is':  { type: 'class', className: 'bg-soft-gradient' },
    sun:        { type: 'class', className: 'bg-grid' },
    // inner:   { type: 'class', className: 'bg-mesh' },
    // scope:   { type: 'img',   image: 'assets/bg-space.jpg', dim: 0.56 },
  };

  const toDirectDrive = (url) => {
    const m = url && url.match(/\/d\/([^/]+)\//);
    return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
  };
  const clearBg = (el) => {
    el.classList.remove('bg-img','bg-solid','bg-soft-gradient','bg-grain','bg-grid','bg-spotlight','bg-mesh');
    el.style.removeProperty('--bg-image');
    el.style.removeProperty('--bg-dim');
  };
  const applyBg = (sec, cfg) => {
    clearBg(sec);
    if (!cfg) return;
    if (cfg.type === 'class' && cfg.className) {
      sec.classList.add(cfg.className);
    } else if (cfg.type === 'img' && cfg.image) {
      sec.classList.add('bg-img');
      sec.style.setProperty('--bg-image', `url('${toDirectDrive(cfg.image)}')`);
      sec.style.setProperty('--bg-dim', String(cfg.dim ?? 0.55));
    }
  };

  Object.entries(SLIDE_BG).forEach(([id, cfg]) => {
    const sec = document.getElementById(id);
    if (sec) applyBg(sec, cfg);
  });

  // Pleasant default preset for first 3 if none set
  (function presetIfNone(){
    const slides = document.querySelectorAll('main section');
    const hasBg = s => s && (s.className.match(/\bbg-/) || s.classList.contains('bg-img'));
    const first = slides[0], second = slides[1], third = slides[2];
    if (first  && !hasBg(first))  applyBg(first,  { type:'class', className:'bg-spotlight' });
    if (second && !hasBg(second)) applyBg(second, { type:'class', className:'bg-soft-gradient' });
    if (third  && !hasBg(third))  applyBg(third,  { type:'class', className:'bg-grid' });
  })();

  /* ---------------------------------------------
   * 4) Prev / Next controls + keyboard
   * -------------------------------------------*/
  const controls = document.createElement('div');
  controls.className = 'slide-controls';
  controls.innerHTML = `
    <button type="button" aria-label="Previous slide">‹ Prev</button>
    <button type="button" aria-label="Next slide">Next ›</button>
  `;
  document.body.appendChild(controls);
  const [btnPrev, btnNext] = controls.querySelectorAll('button');

  const getSections = () => Array.from(document.querySelectorAll('main section'));
  const goToIndex = (i) => {
    const s = getSections();
    if (i >= 0 && i < s.length) s[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const currentIndex = () => {
    const s = getSections(), y = window.scrollY + window.innerHeight * 0.35;
    let idx = 0; for (let i=0;i<s.length;i++){ if (s[i].offsetTop <= y) idx = i; } return idx;
  };

  btnPrev.addEventListener('click', () => goToIndex(currentIndex() - 1));
  btnNext.addEventListener('click', () => goToIndex(currentIndex() + 1));

  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;
    if (['PageDown','ArrowDown',' '].includes(e.key)) { e.preventDefault(); goToIndex(currentIndex()+1); }
    else if (['PageUp','ArrowUp'].includes(e.key))     { e.preventDefault(); goToIndex(currentIndex()-1); }
    else if (e.key === 'Home') { e.preventDefault(); goToIndex(0); }
    else if (e.key === 'End')  { e.preventDefault(); goToIndex(getSections().length - 1); }
  });

  /* ---------------------------------------------
   * 5) Reflow after images load (keeps snap smooth)
   * -------------------------------------------*/
  window.addEventListener('load', () => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
  });
});
