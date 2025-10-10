document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // Tron: Ares Live Background
  // ===============================
  const canvas = document.getElementById('tronGrid');
  const ctx = canvas.getContext('2d', { alpha: true });

  // Theme
  const THEME = {
    bgTop: '#050508',
    bgBottom: '#0a0a11',
    tronRed: (a=1) => `rgba(255, 0, 85, ${a})`,
    tronCore: (a=1) => `rgba(255, 60, 120, ${a})`,
    glowShadowColor: 'rgba(255, 0, 85, 0.9)',
    vignette: 'rgba(0,0,0,0.55)',
    scanlineAlpha: 0.06,
  };

  const GRID = {
    horizon: 0.42,     // 0-1 from top of canvas
    depthSpeed: 0.015, // grid sliding speed
    vLines: 20,
    hLines: 30,
    glow: 14,
    lineWidth: 1.25,
  };

  const TRAILS = { count: 70, speed: [0.6, 1.8], size: [0.8, 2.2], life: [2.5, 6.0] };
  const SPEEDLINES = { max: 120, spawnChance: 0.25, width: [1, 2], speed: [1.2, 2.4], glow: 10 };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DPI-aware resize
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildScanlinePattern();
    buildVignette();
  }
  window.addEventListener('resize', () => {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    resizeCanvas();
  });
  resizeCanvas();

  // Parallax target
  let pointer = { x: window.innerWidth/2, y: window.innerHeight*GRID.horizon };
  let parallax = { x: pointer.x, y: pointer.y };
  const lerp = (a,b,t) => a + (b - a) * t;
  function onPointerMove(e) {
    const x = ('touches' in e) ? e.touches[0].clientX : e.clientX;
    const y = ('touches' in e) ? e.touches[0].clientY : e.clientY;
    pointer.x = x; pointer.y = y;
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Background gradient + scanlines
  let scanlinePattern = null;
  function buildScanlinePattern() {
    const p = document.createElement('canvas');
    const ph = 3;
    p.width = 2; p.height = ph;
    const pctx = p.getContext('2d');
    pctx.fillStyle = 'rgba(255,255,255,0.08)';
    pctx.fillRect(0, 1, 2, 1);
    scanlinePattern = p;
  }
  function drawBackground() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, THEME.bgTop);
    g.addColorStop(1, THEME.bgBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (scanlinePattern) {
      ctx.globalAlpha = THEME.scanlineAlpha;
      ctx.fillStyle = ctx.createPattern(scanlinePattern, 'repeat');
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  }

  // Vignette
  let vignetteCanvas = null;
  function buildVignette() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const v = document.createElement('canvas');
    v.width = Math.max(1, w);
    v.height = Math.max(1, h);
    const vctx = v.getContext('2d');
    const rad = Math.hypot(w, h) * 0.75;
    const g = vctx.createRadialGradient(w/2, h/2, rad*0.35, w/2, h/2, rad);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, THEME.vignette);
    vctx.fillStyle = g;
    vctx.fillRect(0, 0, w, h);
    vignetteCanvas = v;
  }

  // Perspective helpers
  function projectToScreen(x, z, vpX, vpY, w, h) {
    const persp = 0.0028;
    const scale = 1 / (1 + z * persp);
    const sx = lerp(vpX, x, scale);
    const sy = lerp(vpY, h, scale);
    return { x: sx, y: sy };
  }

  // Particles (light trails)
  class Trail {
    constructor(w, h) { this.reset(w, h); }
    reset(w, h) {
      const [zmin, zmax] = [10, 800];
      this.z = Math.random() * (zmax - zmin) + zmin;
      this.x = Math.random() * w;
      this.y = lerp(h * (GRID.horizon + 0.02), h * 0.98, Math.random());
      const [smin, smax] = TRAILS.speed;
      this.speed = Math.random() * (smax - smin) + smin;
      this.size = Math.random() * (TRAILS.size[1] - TRAILS.size[0]) + TRAILS.size[0];
      this.life = Math.random() * (TRAILS.life[1] - TRAILS.life[0]) + TRAILS.life[0];
      this.age = 0;
    }
    update(dt, w, h, vpX, vpY) {
      this.z -= this.speed * 120 * dt;
      this.age += dt;
      if (this.z < 4 || this.age > this.life) this.reset(w, h);
      const p = projectToScreen(this.x, this.z, vpX, vpY, w, h);
      this.sx = p.x; this.sy = p.y;
    }
    draw(ctx) {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = THEME.glowShadowColor;
      ctx.fillStyle = THEME.tronCore(0.85);
      ctx.beginPath();
      ctx.arc(this.sx, this.sy, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = THEME.tronRed(0.85);
      ctx.lineWidth = this.size * 0.6;
      ctx.beginPath();
      ctx.moveTo(this.sx - this.size * 4, this.sy);
      ctx.lineTo(this.sx, this.sy);
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }
  const trails = Array.from({ length: prefersReduced ? 0 : TRAILS.count }, () => new Trail(canvas.clientWidth, canvas.clientHeight));

  // Speed lines
  class SpeedLine {
    constructor(w, h) { this.w = w; this.h = h; this.reset(); }
    reset() {
      this.y = Math.random() * this.h;
      this.len = Math.random() * (this.w * 0.25) + (this.w * 0.1);
      const [smin, smax] = SPEEDLINES.speed;
      this.speed = (Math.random() * (smax - smin) + smin) * (Math.random() < 0.5 ? 1 : -1);
      this.x = this.speed > 0 ? -this.len : this.w + this.len;
      this.width = Math.random() * (SPEEDLINES.width[1] - SPEEDLINES.width[0]) + SPEEDLINES.width[0];
      this.alphaBase = 0.25 + Math.random() * 0.35;
      this.phase = Math.random() * Math.PI * 2;
    }
    update(dt) {
      this.x += this.speed * 60 * dt;
      if (this.speed > 0 && this.x > this.w + this.len) this.reset();
      if (this.speed < 0 && this.x < -this.len) this.reset();
    }
    draw(ctx, t) {
      const pulse = Math.sin(t * 2 + this.phase) * 0.2 + this.alphaBase;
      ctx.save();
      ctx.lineWidth = this.width;
      ctx.shadowBlur = SPEEDLINES.glow;
      ctx.shadowColor = THEME.glowShadowColor;
      ctx.strokeStyle = THEME.tronRed(pulse);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + (this.speed > 0 ? this.len : -this.len), this.y);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1, this.width * 0.6);
      ctx.strokeStyle = THEME.tronCore(Math.min(1, pulse * 1.2));
      ctx.stroke();
      ctx.restore();
    }
  }
  const speedLines = [];
  function seedSpeedLines() {
    speedLines.length = 0;
    const max = prefersReduced ? Math.floor(SPEEDLINES.max * 0.25) : SPEEDLINES.max;
    for (let i = 0; i < max * 0.35; i++) speedLines.push(new SpeedLine(canvas.clientWidth, canvas.clientHeight));
  }
  seedSpeedLines();

  // Grid
  let gridOffsetZ = 0;
  function drawGrid(dt, vpX, vpY, w, h) {
    gridOffsetZ += GRID.depthSpeed * 120 * dt;

    ctx.save();
    ctx.lineWidth = GRID.lineWidth;
    ctx.shadowBlur = GRID.glow;
    ctx.shadowColor = THEME.glowShadowColor;
    ctx.strokeStyle = THEME.tronRed(0.55);

    // verticals
    for (let i = 0; i <= GRID.vLines; i++) {
      const t = i / GRID.vLines;
      const x = t * w;
      ctx.beginPath();
      ctx.moveTo(x, vpY);
      ctx.lineTo(lerp(vpX, x, 0.02), h);
      ctx.stroke();
    }

    // horizontals (depth spaced)
    const rows = GRID.hLines;
    for (let r = 1; r < rows; r++) {
      const z = (r + (gridOffsetZ % 1)) * 12;
      const l = projectToScreen(0, z, vpX, vpY, w, h);
      const rgt = projectToScreen(w, z, vpX, vpY, w, h);
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(rgt.x, rgt.y);
      ctx.stroke();
    }

    // inner bright pass
    ctx.shadowBlur = 0;
    ctx.lineWidth = GRID.lineWidth * 0.7;
    ctx.strokeStyle = THEME.tronCore(0.9);
    for (let i = 0; i <= GRID.vLines; i++) {
      const t = i / GRID.vLines;
      const x = t * w;
      ctx.beginPath();
      ctx.moveTo(x, vpY);
      ctx.lineTo(lerp(vpX, x, 0.02), h);
      ctx.stroke();
    }
    for (let r = 1; r < rows; r++) {
      const z = (r + (gridOffsetZ % 1)) * 12;
      const l = projectToScreen(0, z, vpX, vpY, w, h);
      const rgt = projectToScreen(w, z, vpX, vpY, w, h);
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(rgt.x, rgt.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Animation
  let rafId = null;
  let lastT = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    parallax.x = lerp(parallax.x, pointer.x, 0.06);
    parallax.y = lerp(parallax.y, pointer.y, 0.06);

    const w = canvas.clientWidth, h = canvas.clientHeight;
    const vpX = lerp(w * 0.5, parallax.x, 0.2);
    const vpY = h * GRID.horizon;

    drawBackground();
    drawGrid(dt, vpX, vpY, w, h);

    if (!prefersReduced) {
      for (let i = 0; i < trails.length; i++) {
        trails[i].update(dt, w, h, vpX, vpY);
        trails[i].draw(ctx);
      }
      if (speedLines.length < SPEEDLINES.max && Math.random() < SPEEDLINES.spawnChance * dt * 60) {
        speedLines.push(new SpeedLine(w, h));
      }
      const t = now * 0.001;
      for (let i = 0; i < speedLines.length; i++) {
        speedLines[i].update(dt);
        speedLines[i].draw(ctx, t);
      }
    }

    if (vignetteCanvas) ctx.drawImage(vignetteCanvas, 0, 0);
    rafId = requestAnimationFrame(frame);
  }

  if (!prefersReduced) {
    rafId = requestAnimationFrame(frame);
  } else {
    drawBackground();
    if (vignetteCanvas) ctx.drawImage(vignetteCanvas, 0, 0);
  }

  // Pause when tab hidden (battery friendly)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else { lastT = performance.now(); rafId = requestAnimationFrame(frame); }
  });

  // ===============================
  // Your site logic (unchanged)
  // ===============================
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
