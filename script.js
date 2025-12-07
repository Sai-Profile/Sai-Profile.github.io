// script.js
// Solar System deck with "Source  Next" per figure (5 images per slide) and robust image failover.
document.addEventListener('DOMContentLoaded', () => {
  /* 0) niceties */
  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();

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

  /* 1) CONTENT — from your slides */
  const CONTENT = {
    "contents": {
      kicker: "Slide 1 — Contents",
      h2: "What We’ll Cover: The Solar System Overview",
      bulletsTop: ["<strong>Key points:</strong>"],
      bullets: [
        "<strong>What is the Solar System?</strong> — Basic idea and what it includes.",
        "<strong>The Sun</strong> — Our central star.",
        "<strong>Inner planets</strong> — Rocky worlds close to the Sun.",
        "<strong>Outer planets</strong> — Giants farther out.",
        "<strong>Dwarf planets & small bodies</strong> — Pluto and friends.",
        "<strong>Orbits & gravity</strong> — What holds it all together.",
        "<strong>Fun facts & recap</strong> — Cool details and summary."
      ],
      script: "“Here’s what we’ll cover today: from the Sun, to the planets, to the tiny objects that share our Solar System.”",
      figure: { alt: "Collage of the Sun and major Solar System bodies", cap: "Today’s roadmap: the Solar System at a glance" }
    },
    "what-is": {
      kicker: "Slide 2 — What Is the Solar System?",
      h2: "Definition and Main Members",
      bullets: [
        "<strong>Definition</strong> — The Solar System is the Sun plus everything that orbits it.",
        "<strong>Main members</strong> — Planets, dwarf planets, moons, asteroids, comets, and dust.",
        "<strong>Location</strong> — It sits inside a galaxy called the Milky Way."
      ],
      script: "“The Solar System is simply our Sun and all the objects that move around it inside the Milky Way.”",
      figure: { alt: "Diagram showing the Sun and orbiting planets", cap: "The Solar System and its members" }
    },
    "sun": {
      kicker: "Slide 3 — The Sun: Our Star",
      h2: "Huge, Hot, and the System’s Engine",
      bullets: [
        "<strong>Huge and hot</strong> — The Sun is a giant ball of hot gas (plasma).",
        "<strong>Energy source</strong> — Produces light and heat via nuclear fusion.",
        "<strong>Center of gravity</strong> — Its gravity keeps all planets in orbit."
      ],
      script: "“The Sun is the powerful star at the center, giving us light, heat, and the gravity that holds everything together.”",
      figure: { alt: "Close-up of the Sun’s surface and prominences", cap: "Our local star: the Sun" }
    },
    "inner": {
      kicker: "Slide 4 — Inner Rocky Planets",
      h2: "Mercury, Venus, Earth, and Mars",
      bullets: [
        "<strong>Members</strong> — Mercury, Venus, Earth, and Mars.",
        "<strong>Rocky worlds</strong> — Solid surfaces of rock and metal.",
        "<strong>Closer to the Sun</strong> — Smaller and warmer than the outer planets."
      ],
      script: "“The four inner planets are small, rocky worlds that orbit close to the Sun.”",
      figure: { alt: "Montage of the four inner rocky planets", cap: "The inner Solar System" }
    },
    "earth-mars": {
      kicker: "Slide 5 — A Closer Look at Earth and Mars",
      h2: "Earth & Mars Highlights",
      bullets: [
        "<strong>Earth</strong> — Our home planet with liquid water and life.",
        "<strong>Protective atmosphere</strong> — Helps keep temperatures stable.",
        "<strong>Mars</strong> — Cold, dry, explored by robots and rovers."
      ],
      script: "“Earth is the only known planet with life, and Mars is our main target for future exploration.”",
      figure: { alt: "Earth and Mars side-by-side comparison", cap: "Earth vs. Mars" }
    },
    "gas-giants": {
      kicker: "Slide 6 — The Gas Giants: Jupiter and Saturn",
      h2: "Jupiter & Saturn",
      bullets: [
        "<strong>Very large planets</strong> — Mostly hydrogen and helium.",
        "<strong>Thick atmospheres</strong> — No solid surface like Earth.",
        "<strong>Rings and moons</strong> — Saturn’s rings; both have many moons."
      ],
      script: "“Jupiter and Saturn are huge gas giants with thick atmospheres, many moons, and in Saturn’s case, beautiful rings.”",
      figure: { alt: "Jupiter and Saturn with visible bands and rings", cap: "The gas giants" }
    },
    "ice-giants": {
      kicker: "Slide 7 — The Ice Giants: Uranus and Neptune",
      h2: "Uranus & Neptune",
      bullets: [
        "<strong>Colder and farther</strong> — Orbit much farther from the Sun.",
        "<strong>Icy mix</strong> — Hydrogen, helium, and ‘ices’ like water, methane, ammonia.",
        "<strong>Unique features</strong> — Uranus tilts on its side; Neptune has strong winds."
      ],
      script: "“Uranus and Neptune are distant, icy giants with strange tilts, strong winds, and very cold temperatures.”",
      figure: { alt: "Uranus and Neptune in deep blue hues", cap: "The ice giants" }
    },
    "dwarf-kuiper": {
      kicker: "Slide 8 — Dwarf Planets and the Kuiper Belt",
      h2: "Pluto and Beyond",
      bullets: [
        "<strong>Dwarf planets</strong> — Smaller worlds like Pluto, Eris, Ceres.",
        "<strong>Kuiper Belt</strong> — Beyond Neptune, full of icy bodies.",
        "<strong>Not full planets</strong> — Round but share orbits with other objects."
      ],
      script: "“Beyond Neptune lies the Kuiper Belt, home to Pluto and many other small, icy dwarf planets.”",
      figure: { alt: "New Horizons image of Pluto / Kuiper Belt artist impression", cap: "Dwarf planets and the Kuiper Belt" }
    },
    "small-bodies": {
      kicker: "Slide 9 — Asteroids, Comets, and Other Small Bodies",
      h2: "Rocks, Ice, and Shooting Stars",
      bullets: [
        "<strong>Asteroids</strong> — Rocky objects; many in the asteroid belt.",
        "<strong>Comets</strong> — Icy bodies with bright tails near the Sun.",
        "<strong>Meteoroids</strong> — Small rocks that create meteors (shooting stars)."
      ],
      script: "“The Solar System is also filled with smaller visitors like asteroids, comets, and the meteors we see as shooting stars.”",
      figure: { alt: "Asteroid close-up, comet with tail, and meteor shower", cap: "Small bodies of the Solar System" }
    },
    "orbits": {
      kicker: "Slide 10 — Orbits and Gravity",
      h2: "Gravity, Ellipses, and Motion",
      bullets: [
        "<strong>Gravity rules</strong> — The Sun’s gravity pulls planets into orbits.",
        "<strong>Elliptical orbits</strong> — Slightly oval, not perfect circles.",
        "<strong>Balance</strong> — Forward motion + gravity = stable paths."
      ],
      script: "“Gravity pulls the planets toward the Sun while their motion carries them forward, creating stable orbits.”",
      figure: { alt: "Diagram of elliptical orbit around the Sun", cap: "How orbits work" }
    },
    "recap": {
      kicker: "Slide 11 — Fun Facts and Recap",
      h2: "Quick Facts & Wrap-Up",
      bullets: [
        "<strong>Size difference</strong> — The Sun holds almost all the mass.",
        "<strong>Distances</strong> — Light takes ~8 minutes Sun→Earth.",
        "<strong>Quick recap</strong> — Sun, planets, dwarf planets, and smaller objects."
      ],
      script: "“To recap, our Solar System is a huge family of worlds, all held together by the Sun’s gravity and energy.”",
      figure: { alt: "Scale illustration of Sun vs planets", cap: "Recap: our Solar System family" }
    }
  };

  /* 2) RELATED IMAGES — 5 per slide (royalty-free sources). Prefer JPG/PNG for reliability. */
  const RI = (urls) => {
    const arr = urls.filter(Boolean).slice(0,5);
    while (arr.length && arr.length < 5) arr.push(arr[0]);
    return arr;
  };

  const RELATED_IMAGES = {
    "contents": RI([
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Solar_sys8.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Solar_system_scale.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f9/Solar_system_true_color.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Planets_and_dwarf_planets_of_the_Solar_System.png",
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Solar_System_Outer_Planets.jpg"
    ]),
    "what-is": RI([
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/PIA03153_InnerSolarSystem.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Solar_system_scale.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5f/Solar_System_size_to_scale.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Solar_System_Outer_Planets.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/Planets2013.svg.png"
    ]),
    "sun": RI([
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Solar_prominence_2010-08-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/Sun_in_true_color.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Granulation_on_the_solar_surface.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Solar_corona_eclipse_2017.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Sun_white.jpg"
    ]),
    "inner": RI([
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Terrestrial_planet_sizes2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/InnerPlanets2008.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Mercury_in_true_color.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
    ]),
    "earth-mars": RI([
      "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/29/PIA23764-MarsInSight-Lander-20190530.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Mars_Rover_Curiosity.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/Mars_atmosphere.jpg"
    ]),
    "gas-giants": RI([
      "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f7/Jupiter_Great_Red_Spot.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Saturn_Rings_Cassini_2007.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Saturn%2C_Earth-size_compared.jpg"
    ]),
    "ice-giants": RI([
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/68/Uranus_and_rings.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/20/Neptune_clouds.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Color_Neptune.jpg"
    ]),
    "dwarf-kuiper": RI([
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Nh-pluto-in-true-color_2x_JPEG-edit-frame.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/Ceres_Dawn_RC3_image_colorized.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/81/Eris_and_dysnomia2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Kuiper_belt_plot_objects.png",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Pluto-01_Stern_03_Pluto_Color_TXT.jpg"
    ]),
    "small-bodies": RI([
      "https://upload.wikimedia.org/wikipedia/commons/5/58/Comet_67P_Churyumov-Gerasimenko.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Vesta_full_mosaic.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Hale-Bopp_1995O1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Perseid_meteor_shower.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4a/Asteroid_Bennu_NASA_OSIRIS-REx.png"
    ]),
    "orbits": RI([
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/Orbit1.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Ellipse-def.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Kepler-second-law.gif",
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Newton%27s_cannon.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/8/86/Titius-Bode_law_orbits.svg.png"
    ]),
    "recap": RI([
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/Solar_System_size_to_scale.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Solar_system_scale.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Planets_and_dwarf_planets_of_the_Solar_System.png",
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Solar_sys8.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f9/Solar_system_true_color.jpg"
    ])
  };

  /* 3) render slides (figures get Source + Next + robust loading) */
  const renderSlide = (id, data) => {
    const sec = document.getElementById(id); if (!sec || !data) return;

    const kicker = data.kicker ? `<div class="kicker">${data.kicker}</div>` : '';
    const subtitle = data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : '';
    const bulletsTop = data.bulletsTop?.length ? `<ul>${data.bulletsTop.map(li => `<li>${li}</li>`).join('')}</ul>` : '';
    const bullets = data.bullets?.length ? `<ul>${data.bullets.map(li => `<li>${li}</li>`).join('')}</ul>` : '';
    const explain = data.explain ? `<div class="explain">${data.explain}</div>` : '';
    const script = data.script ? `<p class="script">${data.script}</p>` : '';

    let figure = '';
    if (data.figure) {
      const imgId = `main-image-${id}`;
      const btnId = `next-related-${id}`;
      const capText = data.figure.cap || '';
      const capLink = data.figure.link
        ? `<a target="_blank" rel="noopener" href="${data.figure.link}">Source</a>`
        : '<span>Source</span>';
      const actions = `${capLink} <button type="button" class="fig-next-btn" id="${btnId}">Next</button>`;

      figure = `
        <figure>
          <img id="${imgId}" src="" alt="${data.figure.alt || ''}" loading="lazy" referrerpolicy="no-referrer" />
          <figcaption>
            <span class="figcap-text">${capText}</span>
            <span>${actions}</span>
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

  /* 4) Image utilities: preload + failover to next */
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
      try { const ok = await preloadOnce(u); return ok; } catch (_) {}
    }
    return null;
  }

  /* 5) Next logic for ALL slides with figures (exactly 5 images, wrap, with error recovery) */
  (async function initAllNextButtons(){
    for (const id of Object.keys(CONTENT)) {
      const img = document.getElementById(`main-image-${id}`);
      const btn = document.getElementById(`next-related-${id}`);
      if (!img || !btn) continue;

      // Build list: prefer RELATED_IMAGES; pad to 5 (function RI already pads if possible)
      let list = (RELATED_IMAGES[id] || []).slice(0, 5);
      // If still empty, try figure.src as last resort
      const initialSrc = CONTENT[id]?.figure?.src || '';
      if (!list.length && initialSrc) list = RI([initialSrc]);
      if (!list.length) list = [""]; // absolute fallback to avoid errors

      // Choose the first that actually loads
      const good = await firstWorking(list);
      img.src = good || list[0];

      // Maintain index aligned to current src
      let idx = list.findIndex(u => u && img.src.endsWith(u));
      if (idx < 0) idx = 0;

      // Click handler with preload & skip broken
      btn.addEventListener('click', async () => {
        for (let step = 0; step < list.length; step++) {
          const nextIdx = (idx + 1) % list.length;
          try {
            const ok = await preloadOnce(list[nextIdx]);
            img.src = ok;
            idx = nextIdx;
            break;
          } catch { idx = nextIdx; }
        }
      });

      // Auto-advance on runtime error
      img.addEventListener('error', async () => {
        for (let step = 0; step < list.length; step++) {
          const nextIdx = (idx + 1) % list.length;
          try {
            const ok = await preloadOnce(list[nextIdx]);
            img.src = ok;
            idx = nextIdx;
            break;
          } catch { idx = nextIdx; }
        }
      });
    }
  })();

  /* 6) Backgrounds (pleasant defaults) */
  const SLIDE_BG = {
    contents:   { type: 'class', className: 'bg-spotlight' },
    "what-is":  { type: 'class', className: 'bg-soft-gradient' },
    sun:        { type: 'class', className: 'bg-grid' },
  };
  const toDirectDrive = (url) => { const m = url && url.match(/\/d\/([^/]+)\//); return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url; };
  const clearBg = (el) => { el.classList.remove('bg-img','bg-solid','bg-soft-gradient','bg-grain','bg-grid','bg-spotlight','bg-mesh'); el.style.removeProperty('--bg-image'); el.style.removeProperty('--bg-dim'); };
  const applyBg = (sec, cfg) => {
    clearBg(sec); if (!cfg) return;
    if (cfg.type === 'class' && cfg.className) { sec.classList.add(cfg.className); }
    else if (cfg.type === 'img' && cfg.image) {
      sec.classList.add('bg-img');
      sec.style.setProperty('--bg-image', `url('${toDirectDrive(cfg.image)}')`);
      sec.style.setProperty('--bg-dim', String(cfg.dim ?? 0.55));
    }
  };
  Object.entries(SLIDE_BG).forEach(([id, cfg]) => { const sec = document.getElementById(id); if (sec) applyBg(sec, cfg); });
  // Ensure first 3 slides have a background if none applied
  (function presetIfNone(){
    const slides = document.querySelectorAll('main section');
    const hasBg = s => s && (s.className.match(/\bbg-/) || s.classList.contains('bg-img'));
    const first = slides[0], second = slides[1], third = slides[2];
    if (first  && !hasBg(first))  applyBg(first,  { type:'class', className:'bg-spotlight' });
    if (second && !hasBg(second)) applyBg(second, { type:'class', className:'bg-soft-gradient' });
    if (third  && !hasBg(third))  applyBg(third,  { type:'class', className:'bg-grid' });
  })();

  /* 7) Prev / Next slide controls + keyboard */
  const controls = document.createElement('div');
  controls.className = 'slide-controls';
  controls.innerHTML = `
    <button type="button" aria-label="Previous slide">‹ Prev</button>
    <button type="button" aria-label="Next slide">Next ›</button>
  `;
  document.body.appendChild(controls);
  const [btnPrev, btnNext] = controls.querySelectorAll('button');

  const getSections = () => Array.from(document.querySelectorAll('main section'));
  const goToIndex = (i) => { const s = getSections(); if (i >= 0 && i < s.length) s[i].scrollIntoView({ behavior:'smooth', block:'start' }); };
  const currentIndex = () => { const s=getSections(), y=window.scrollY + window.innerHeight*0.35; let idx=0; for(let i=0;i<s.length;i++){ if (s[i].offsetTop <= y) idx=i; } return idx; };

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

  // Reflow once images load (for smooth snapping)
  window.addEventListener('load', () => setTimeout(() => window.dispatchEvent(new Event('resize')), 60));
});
