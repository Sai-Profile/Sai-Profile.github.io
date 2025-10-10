document.addEventListener('DOMContentLoaded', () => {
  // ========= Tron: Ares – Red Running Lines over Glassy Black =========
  const canvas = document.getElementById('tronGrid');
  const ctx = canvas.getContext('2d', { alpha: true });

  // Colors tuned for Ares vibe
  const ARES = {
    bgTop:    '#10121c',
    bgBottom: '#0c0d16',
    red:   (a=1)=>`rgba(255,0,85,${a})`,
    core:  (a=1)=>`rgba(255,80,140,${a})`,
    glow:  'rgba(255,0,85,1)',
    glassTint: 'rgba(0,0,0,0.25)', // very light vignette
    scanAlpha: 0.03
  };

  // Line field (just the “running lines”, crisp & bright)
  const LINES = {
    max: 180,                 // plenty so it's obvious
    speed: [1.2, 2.8],        // px/ms (after scaling)
    width: [2, 4],            // line thickness (CSS px)
    length: [80, 380],        // px
    glow: 24,                 // canvas shadow blur
    baseAlpha: [0.55, 0.9],   // visibility range
    pulseAmp: 0.25            // pulsation intensity
  };

  // Hi-DPI sizing (draw in CSS pixels)
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function sizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildScanlines();
    buildVignette();
  }
  window.addEventListener('resize', () => {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    sizeCanvas();
  });
  sizeCanvas();

  // Background gradient + subtle scanlines
  let scanPattern = null;
  function buildScanlines() {
    const p = document.createElement('canvas');
    p.width = 2; p.height = 3;
    const pctx = p.getContext('2d');
    pctx.fillStyle = 'rgba(255,255,255,0.08)';
    pctx.fillRect(0, 1, 2, 1);
    scanPattern = p;
  }
  function drawBackground() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, ARES.bgTop);
    g.addColorStop(1, ARES.bgBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (scanPattern) {
      ctx.globalAlpha = ARES.scanAlpha;
      ctx.fillStyle = ctx.createPattern(scanPattern, 'repeat');
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  }

  // Vignette (very light so background stays "glassy")
  let vignette = null;
  function buildVignette() {
    const w = canvas.width / dpr, h = canvas.height / dpr;
    const c = document.createElement('canvas');
    c.width = Math.max(1, w);
    c.height = Math.max(1, h);
    const x = c.getContext('2d');
    const r = Math.hypot(w, h) * 0.75;
    const grad = x.createRadialGradient(w/2, h/2, r*0.5, w/2, h/2, r);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, ARES.glassTint);
    x.fillStyle = grad;
    x.fillRect(0, 0, w, h);
    vignette = c;
  }

  // ----- Running Lines -----
  class RunningLine {
    constructor(w, h) { this.w = w; this.h = h; this.reset(true); }
    reset(first=false) {
      // Randomize attributes
      const [minW, maxW] = LINES.width;
      const [minL, maxL] = LINES.length;
      const [minS, maxS] = LINES.speed;
      const [minA, maxA] = LINES.baseAlpha;

      this.width = rand(minW, maxW);
      this.length = rand(minL, maxL);
      this.speed = rand(minS, maxS) * (Math.random()<0.5?1:-1); // left or right
      this.y = rand(0, this.h);
      this.phase = Math.random() * Math.PI * 2;
      this.alphaBase = rand(minA, maxA);

      // Start just off-screen depending on direction
      this.x = this.speed > 0 ? -this.length - rand(0, 80) : this.w + this.length + rand(0, 80);

      // Spread them evenly on first seed
      if (first) this.x = Math.random() * this.w;
    }
    update(dt) {
      this.x += this.speed * (dt * 60); // scale to 60fps feel
      if (this.speed > 0 && this.x > this.w + this.length + 100) this.reset();
      if (this.speed < 0 && this.x < -this.length - 100) this.reset();
    }
    draw(t) {
      const pulse = Math.min(1, this.alphaBase + Math.sin(t * 2 + this.phase) * LINES.pulseAmp);
      const x2 = this.speed > 0 ? this.x + this.length : this.x - this.length;

      // Outer red glow
      ctx.save();
      ctx.lineWidth = this.width;
      ctx.shadowBlur = LINES.glow;
      ctx.shadowColor = ARES.glow;
      ctx.strokeStyle = ARES.red(pulse);
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(x2, this.y); ctx.stroke();

      // Inner bright core
      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1, this.width * 0.65);
      ctx.strokeStyle = ARES.core(Math.min(1, pulse * 1.15));
      ctx.stroke();
      ctx.restore();
    }
  }

  // helpers
  const rand = (a, b) => a + Math.random() * (b - a);

  const lines = [];
  function seedLines() {
    lines.length = 0;
    const w = canvas.width / dpr, h = canvas.height / dpr;
    for (let i = 0; i < LINES.max; i++) lines.push(new RunningLine(w, h));
  }
  seedLines();

  // Animate
  let raf = null;
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last)/1000); last = now;
    const t = now * 0.001;

    drawBackground();

    // Draw all running lines
    for (let i = 0; i < lines.length; i++) {
      lines[i].update(dt);
      lines[i].draw(t);
    }

    // Soft vignette last
    if (vignette) ctx.drawImage(vignette, 0, 0);

    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // Re-seed lines on resize so distribution stays nice
  window.addEventListener('resize', seedLines);

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { last = performance.now(); raf = requestAnimationFrame(tick); }
  });

  // ---------------- Your site logic (unchanged) ----------------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.tron-section');
  function highlightNavLink() {
    let currentActive = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (pageYOffset >= top - height / 3) currentActive = section.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentActive)) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', highlightNavLink);
  highlightNavLink();

  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
});
