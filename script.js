document.addEventListener('DOMContentLoaded', () => {
  // ===== TRON: Ares – Red Chamber background + bright red running lines =====
  const canvas = document.getElementById('tronGrid');
  const ctx = canvas.getContext('2d', { alpha: true });

  // Palette tuned to your reference (dark crimson room with hot neon)
  const ARES = {
    // background gradient (top = deep violet-red, bottom = near-black maroon)
    bgTop:    '#2a0a1a',  // wine-violet
    bgMid:    '#1e0812',  // inner crimson
    bgBottom: '#0c0509',  // almost-black maroon
    red:   (a=1)=>`rgba(255,0,85,${a})`,
    core:  (a=1)=>`rgba(255,180,200,${a})`, // bright pinkish core for contrast
    glow:  'rgba(255,0,85,1)',
    railOuter: (a=1)=>`rgba(255,40,90,${a})`,
    railCore:  (a=1)=>`rgba(255,80,140,${a})`,
    scanAlpha: 0.025,           // very light scanlines
    vignette:  'rgba(30,0,10,0.28)' // soft red vignette
  };

  // Running lines (clear + bright against a red scene)
  const LINES = {
    max: 180,
    speed: [1.2, 2.8],
    width: [2, 4],
    length: [80, 380],
    glow: 24,
    baseAlpha: [0.65, 0.95],
    pulseAmp: 0.25
  };

  // Hi-DPI sizing
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function sizeCanvas() {
    const w = window.innerWidth, h = window.innerHeight;
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
    seedLines();
  });
  sizeCanvas();

  // ---------- Background (crimson gradient + rails + soft vignette) ----------
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
    const w = canvas.width / dpr, h = canvas.height / dpr;

    // 1) Deep crimson vertical gradient
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0.0, ARES.bgTop);
    g.addColorStop(0.45, ARES.bgMid);
    g.addColorStop(1.0, ARES.bgBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // 2) Light scanlines
    if (scanPattern) {
      ctx.globalAlpha = ARES.scanAlpha;
      ctx.fillStyle = ctx.createPattern(scanPattern, 'repeat');
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // 3) Glowing structural rails (inspired by the photo)
    drawRails(w, h);

    // 4) Soft red vignette
    if (vignette) ctx.drawImage(vignette, 0, 0);
  }

  function drawRails(w, h) {
    ctx.save();

    // Helper to draw a glowing rail: thick red glow + inner hot core
    function rail(pathWidth, outerAlpha, coreAlpha, pathBuilder) {
      // Outer glow pass
      ctx.lineWidth = pathWidth;
      ctx.shadowBlur = pathWidth * 1.2;
      ctx.shadowColor = ARES.glow;
      ctx.strokeStyle = ARES.railOuter(outerAlpha);
      ctx.beginPath();
      pathBuilder(ctx);
      ctx.stroke();

      // Inner bright core
      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1, pathWidth * 0.55);
      ctx.strokeStyle = ARES.railCore(coreAlpha);
      ctx.beginPath();
      pathBuilder(ctx);
      ctx.stroke();
    }

    const pad = Math.min(w, h) * 0.03;
    const thick = Math.max(10, Math.min(28, w * 0.018));

    // Upper left sweeping arc
    rail(thick, 0.85, 1.0, (c) => {
      c.moveTo(pad, pad*2);
      c.bezierCurveTo(w*0.25, pad*0.8, w*0.42, pad*0.6, w*0.58, pad*0.9);
      c.bezierCurveTo(w*0.72, pad*1.2, w*0.84, pad*1.8, w - pad*1.5, pad*2.2);
    });

    // Right vertical rail with slight bend
    rail(thick, 0.8, 1.0, (c) => {
      c.moveTo(w - pad*1.3, pad*2);
      c.bezierCurveTo(w - pad*0.8, h*0.25, w - pad*0.6, h*0.55, w - pad*1.7, h*0.85);
    });

    // Lower diagonal deck line
    rail(thick, 0.75, 0.95, (c) => {
      c.moveTo(pad, h - pad*2.2);
      c.bezierCurveTo(w*0.35, h - pad*1.6, w*0.65, h - pad*1.2, w - pad*1.2, h - pad*1.8);
    });

    ctx.restore();
  }

  // Build vignette once per resize
  let vignette = null;
  function buildVignette() {
    const w = canvas.width / dpr, h = canvas.height / dpr;
    const c = document.createElement('canvas');
    c.width = Math.max(1, w);
    c.height = Math.max(1, h);
    const x = c.getContext('2d');
    const r = Math.hypot(w, h) * 0.8;
    const grad = x.createRadialGradient(w/2, h/2, r*0.4, w/2, h/2, r);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, ARES.vignette);
    x.fillStyle = grad;
    x.fillRect(0, 0, w, h);
    vignette = c;
  }

  // ---------- Running Lines (foreground) ----------
  const rand = (a, b) => a + Math.random() * (b - a);

  class RunningLine {
    constructor(w, h, seed=false) { this.w = w; this.h = h; this.reset(seed); }
    reset(seed=false) {
      const [minW, maxW] = LINES.width;
      const [minL, maxL] = LINES.length;
      const [minS, maxS] = LINES.speed;
      const [minA, maxA] = LINES.baseAlpha;

      this.width = rand(minW, maxW);
      this.length = rand(minL, maxL);
      this.speed = rand(minS, maxS) * (Math.random()<0.5 ? 1 : -1);
      this.y = rand(0, this.h);
      this.phase = Math.random() * Math.PI * 2;
      this.alphaBase = rand(minA, maxA);

      // off-screen start unless seeding
      this.x = this.speed > 0 ? -this.length - rand(0, 80) : this.w + this.length + rand(0, 80);
      if (seed) this.x = Math.random() * this.w;
    }
    update(dt) {
      this.x += this.speed * (dt * 60);
      if (this.speed > 0 && this.x > this.w + this.length + 120) this.reset();
      if (this.speed < 0 && this.x < -this.length - 120) this.reset();
    }
    draw(t) {
      const pulse = Math.min(1, this.alphaBase + Math.sin(t * 2 + this.phase) * LINES.pulseAmp);
      const x2 = this.speed > 0 ? this.x + this.length : this.x - this.length;

      // Outer neon red glow
      ctx.save();
      ctx.lineWidth = this.width;
      ctx.shadowBlur = LINES.glow;
      ctx.shadowColor = ARES.glow;
      ctx.strokeStyle = ARES.red(pulse);
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(x2, this.y); ctx.stroke();

      // Inner bright core (almost white-pink so it pops on red bg)
      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1, this.width * 0.65);
      ctx.strokeStyle = ARES.core(Math.min(1, pulse * 1.15));
      ctx.stroke();
      ctx.restore();
    }
  }

  const lines = [];
  function seedLines() {
    lines.length = 0;
    const w = canvas.width / dpr, h = canvas.height / dpr;
    for (let i = 0; i < LINES.max; i++) lines.push(new RunningLine(w, h, true));
  }
  seedLines();

  // ---------- Animation ----------
  let raf = null;
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last)/1000); last = now;
    const t = now * 0.001;

    drawBackground();

    for (let i = 0; i < lines.length; i++) {
      lines[i].update(dt);
      lines[i].draw(t);
    }

    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { last = performance.now(); raf = requestAnimationFrame(tick); }
  });

  // ---------- Your site logic (unchanged) ----------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.tron-section');
  function highlightNavLink() {
    let currentActive = '';
    sections.forEach(section => {
      const top = section.offsetTop, height = section.clientHeight;
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
