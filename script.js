// script.js
// Renders your 5 recruitment slides into existing <section id="..."> nodes,
// applies per-slide backgrounds from JS, and wires nav + Prev/Next controls.

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
   * 1) Slide content (kept in JS)
   *    - Keys must match section IDs in your HTML
   * -------------------------------------------*/
  const CONTENT = {
    title: {
      kicker: 'Slide 1',
      h2: 'Answer to Question 1: Why Recruitment is Important',
      bulletsTop: [
        '<strong>Core statement:</strong> Recruitment is critical because people are the main drivers of business success.'
      ],
      bullets: [
        '<strong>Get the Best —</strong> It ensures you find top talent with the right skills. <span class="script-inline">“Hiring is about securing the best skills available to ensure quality work.”</span>',
        '<strong>Increase Profit —</strong> Better staff means higher productivity and more money. <span class="script-inline">“Good staff directly increase revenue by working smarter and producing more.”</span>',
        '<strong>Staff Stay Longer —</strong> Finding the right team fit reduces the high cost of turnover. <span class="script-inline">“Selecting people who fit the culture saves money by keeping teams stable.”</span>',
        '<strong>Grow the Company —</strong> It brings in skills needed to expand into new areas. <span class="script-inline">“Recruitment provides expertise to tackle future growth.”</span>'
      ],
      explain: 'Great hiring powers quality, profit, retention, and growth. Get the skills and the culture-fit right, and the business compounds value over time.',
      figure: {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        alt: 'Team planning hiring needs around a table',
        cap: 'Team planning hiring needs',
        link: 'https://unsplash.com/photos/3fPXt37X6UQ'
      }
    },

    problem: {
      kicker: 'Slide 2',
      h2: 'Hiring Right: The Simple Guide',
      subtitle: 'The Techniques for Getting the Best Staff',
      bullets: [
        '<strong>Importance:</strong> Why good staff are essential for profit and growth.',
        '<strong>Effectiveness:</strong> Techniques to find people who can do the job well.',
        '<strong>Efficiency:</strong> Methods to hire the best people quickly and affordably.'
      ],
      explain: 'Hiring connects strategy to execution. Focus on outcomes: profitable growth, proven capability, and a process that’s quick without sacrificing quality.',
      script: '“Simple, clear hiring raises quality and reduces cost.”',
      figure: {
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Interview panel assessing candidates',
        cap: 'Interview panel assessing candidates',
        link: 'https://unsplash.com/photos/cZVthlrnlnQ'
      }
    },

    aim: {
      kicker: 'Slide 3',
      h2: 'Example: The Simple Truth',
      bullets: [
        '<strong>A great hire is an investment;</strong> a bad hire is a debt.',
        '<strong>Bad hire result:</strong> wasted time, poor work, team stress. <span class="script-inline">“When we rush to hire, the mistakes quickly become expensive.”</span>',
        '<strong>Good hire result:</strong> high quality, fast results, team success. <span class="script-inline">“Taking time to hire the right person ensures a big return on our investment.”</span>',
        '<strong>Key takeaway:</strong> Always prioritize quality over speed.'
      ],
      explain: 'The cost curve is real: haste creates rework, delays, and morale dips; quality hiring compounds returns in output and stability.',
      figure: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Graph_icon.svg/640px-Graph_icon.svg.png',
        alt: 'Graph icon representing ROI and costs',
        cap: 'ROI vs cost of hiring decisions',
        link: 'https://commons.wikimedia.org/wiki/File:Graph_icon.svg'
      }
    },

    rq: {
      kicker: 'Slide 4',
      h2: 'Techniques for Effective Staff (Hiring the Right Person)',
      bullets: [
        '<strong>Focus:</strong> what they can do and how they fit.',
        '<strong>Work Test First:</strong> small task required for the job (e.g., write an email, solve a sample problem). <span class="script-inline">“We test skills directly, because actions speak louder than resumes.”</span>',
        '<strong>Ask About the Past:</strong> what they actually did in a difficult situation. <span class="script-inline">“Past behavior is the best predictor of future performance.”</span>',
        '<strong>Check Team Fit:</strong> confirm working style matches our culture. <span class="script-inline">“A candidate must thrive and feel comfortable in our environment.”</span>'
      ],
      explain: 'Validate ability with real work, validate reliability with real stories, and validate belonging with culture alignment.',
      figure: {
        src: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=80',
        alt: 'Practical work sample test at a desk',
        cap: 'Work sample test (evidence of skill)',
        link: 'https://unsplash.com/photos/7omHUGhhmZ0'
      }
    },

    scope: {
      kicker: 'Slide 5',
      h2: 'Techniques for Efficient Staff (Hiring Fast & Smart)',
      bullets: [
        '<strong>Be organized & leverage your team.</strong>',
        '<strong>Referral Bonus:</strong> reward employees for recommendations. <span class="script-inline">“Great employees know great people—pay them to share.”</span>',
        '<strong>The Waiting List:</strong> keep excellent candidates for future roles. <span class="script-inline">“When a role opens, we check our waiting list first.”</span>',
        '<strong>Clear Job Ad:</strong> precise description that filters out noise. <span class="script-inline">“A good job ad acts like a filter for relevance.”</span>'
      ],
      explain: 'Systematize speed: mobilize referrals, keep warm pipelines, and use job ads that pre-qualify. You’ll cut time-to-hire without losing quality.',
      figure: {
        src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Colleagues sharing referrals',
        cap: 'Referrals and talent networks accelerate hiring',
        link: 'https://unsplash.com/photos/6U5AEmQIajg'
      }
    }
  };

  /* ---------------------------------------------
   * 2) Render function (injects content)
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
    if (data.figure?.src) {
      const capText = data.figure.cap ? data.figure.cap : '';
      const capLink = data.figure.link ? `<a target="_blank" rel="noopener" href="${data.figure.link}">Source</a>` : '';
      figure = `
        <figure>
          <img src="${data.figure.src}" alt="${data.figure.alt || ''}" loading="lazy" />
          <figcaption><span class="figcap-text">${capText}</span><span>${capLink}</span></figcaption>
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

  // Render all (only IDs that exist will render)
  Object.entries(CONTENT).forEach(([id, data]) => renderSlide(id, data));

  /* ---------------------------------------------
   * 3) Backgrounds from JS (no HTML edits needed)
   *    - pick a CSS class or an image per slide
   * -------------------------------------------*/
  const SLIDE_BG = {
    title:   { type: 'class', className: 'bg-spotlight' },
    problem: { type: 'class', className: 'bg-soft-gradient' },
    aim:     { type: 'class', className: 'bg-grid' },
    // rq:    { type: 'class', className: 'bg-mesh' },
    // scope: { type: 'img',   image: 'assets/bg-team.jpg', dim: 0.56 },
  };

  const toDirectDrive = (url) => {
    const m = url && url.match(/\/d\/([^/]+)\//);
    return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
    // still recommend repo assets for speed/reliability
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

  // Apply backgrounds
  Object.entries(SLIDE_BG).forEach(([id, cfg]) => {
    const sec = document.getElementById(id);
    if (sec) applyBg(sec, cfg);
  });

  // Pleasant default preset for the first 3 slides if nothing set
  (function presetIfNone(){
    const slides = document.querySelectorAll('main section');
    const hasBg = s => s && (s.className.match(/\bbg-/) || s.classList.contains('bg-img'));
    const first = slides[0], second = slides[1], third = slides[2];
    if (first  && !hasBg(first))  applyBg(first,  { type:'class', className:'bg-spotlight' });
    if (second && !hasBg(second)) applyBg(second, { type:'class', className:'bg-soft-gradient' });
    if (third  && !hasBg(third))  applyBg(third,  { type:'class', className:'bg-grid' });
  })();

  /* ---------------------------------------------
   * 4) Prev / Next controls + keyboard nav
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
