// script.js
// Injects your 5 slides, applies per-slide backgrounds from JS,
// adds smooth nav + Prev/Next controls, and (NEW) a single “Next” button
// beside Source on Slide 4 that cycles through ~5 related images.

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
    title: {
      kicker: 'Slide 1 — Why Recruitment is Crucial',
      h2: 'Answer to Question 1: Why Recruitment is Important',
      bulletsTop: [
        '<strong>Core Statement:</strong> Recruitment is critical because people are the main drivers of business success.'
      ],
      bullets: [
        '<strong>Get the Best —</strong> It ensures you find top talent with the right skills. <span class="script-inline">“Hiring is about securing the best skills available to ensure quality work.”</span>',
        '<strong>Increase Profit —</strong> Better staff means higher productivity and more money. <span class="script-inline">“Good staff directly increase revenue by working smarter and producing more.”</span>',
        '<strong>Staff Stay Longer —</strong> Finding the right team fit reduces the high cost of staff turnover. <span class="script-inline">“Selecting people who fit the culture saves us money by keeping teams stable.”</span>',
        '<strong>Grow the Company —</strong> It brings in the skills needed to expand the business into new areas. <span class="script-inline">“Recruitment provides the expertise required to successfully tackle future growth.”</span>'
      ],
      explain: '<em>Note:</em> The financial impact of a bad vs. good hire is detailed on Slide 3.',
      figure: {
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        alt: 'Team planning hiring needs around a table',
        cap: 'Team planning hiring needs',
        link: 'https://unsplash.com/photos/3fPXt37X6UQ'
      }
    },

    problem: {
      kicker: 'Slide 2 — The Why & How of Hiring 🚀',
      h2: 'Hiring Right: The Simple Guide',
      subtitle: 'The Techniques for Getting the Best Staff',
      bullets: [
        '<strong>Importance:</strong> Why good staff are essential for profit and growth.',
        '<strong>Effectiveness:</strong> Techniques to find people who can do the job well.',
        '<strong>Efficiency:</strong> Methods to hire the best people quickly and affordably.'
      ],
      explain: 'These three focus areas keep hiring aligned to outcomes: profit & growth, capability, and speed/cost.',
      figure: {
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Interview panel assessing candidates',
        cap: 'Interview panel assessing candidates',
        link: 'https://unsplash.com/photos/cZVthlrnlnQ'
      }
    },

    aim: {
      kicker: 'Slide 3 — Example: The Simple Truth 💡',
      h2: 'Quality Over Speed',
      bullets: [
        '<strong>A great hire is an investment;</strong> a bad hire is a debt.',
        '<strong>Bad Hire Result:</strong> A quick, poor choice leads to wasted time, bad work, and team stress. <span class="script-inline">“When we rush to hire, the mistakes quickly become expensive.”</span>',
        '<strong>Good Hire Result:</strong> A smart choice leads to high quality, fast results, and team success. <span class="script-inline">“Taking time to hire the right person ensures a big return on our investment.”</span>',
        '<strong>Key Takeaway:</strong> Always prioritize quality over speed.'
      ],
      figure: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Graph_icon.svg/640px-Graph_icon.svg.png',
        alt: 'Graph icon representing ROI and costs',
        cap: 'ROI vs cost of hiring decisions',
        link: 'https://commons.wikimedia.org/wiki/File:Graph_icon.svg'
      }
    },

    rq: {
      kicker: 'Slide 4 — Techniques for Effective Staff (Hiring the Right Person) ✅',
      h2: 'Evaluate Skills, Evidence, and Fit',
      bullets: [
        'Focus on what they can do and how they fit.',
        '<strong>Work Test First:</strong> Ask them to do a small task required for the job (e.g., write an email or solve a sample problem). <span class="script-inline">“We test skills directly, because actions speak louder than resumes.”</span>',
        '<strong>Ask About the Past:</strong> Ask what they actually did in a difficult situation at their last job. <span class="script-inline">“Past behavior is the best predictor of future performance.”</span>',
        '<strong>Check the Team Fit:</strong> Confirm their working style matches our culture (e.g., Are they collaborative? Are they honest?). <span class="script-inline">“A candidate must be able to thrive and feel comfortable in our specific work environment.”</span>'
      ],
      explain: 'Use direct work evidence, behavioral detail, and cultural alignment to reduce hiring risk.',
      figure: {
        src: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=80',
        alt: 'Practical work sample test at a desk',
        cap: 'Work sample test (evidence of skill)',
        link: 'https://unsplash.com/photos/7omHUGhhmZ0'
      }
    },

    scope: {
      kicker: 'Slide 5 — Techniques for Efficient Staff (Hiring Fast & Smart) 💰',
      h2: 'Be Ready, Leverage Networks, Filter Early',
      bullets: [
        'Be organized and leverage your current team.',
        '<strong>Referral Bonus:</strong> Give current employees a reward for recommending people. <span class="script-inline">“Our current great employees know other great people, so we pay them to share.”</span>',
        '<strong>The Waiting List:</strong> Keep a list of excellent candidates we liked but didn\'t hire right away. <span class="script-inline">“When a new role opens, we check our waiting list first to save weeks of searching.”</span>',
        '<strong>Clear Job Ad:</strong> Write a very clear job description that immediately filters out unqualified applicants. <span class="script-inline">“A good job ad acts like a filter, ensuring only relevant people apply.”</span>'
      ],
      explain: 'Referrals, warm pipelines, and sharp job ads cut time-to-hire while protecting quality.',
      figure: {
        src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
        alt: 'Colleagues sharing referrals',
        cap: 'Referrals and talent networks accelerate hiring',
        link: 'https://unsplash.com/photos/6U5AEmQIajg'
      }
    }
  };

  /* ---------------------------------------------
   * 2) Render into existing <section id="...">
   *    (Adds a “Next” button beside Source for #rq only)
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
      const imgId = (id === 'rq') ? ' id="main-image"' : '';
      const actions = (id === 'rq')
        ? `${capLink} <button type="button" class="fig-next-btn" id="next-related">Next</button>`
        : `${capLink}`;

      figure = `
        <figure>
          <img${imgId} src="${data.figure.src}" alt="${data.figure.alt || ''}" loading="lazy" />
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

  /* ---------------------------------------------
   * 2.5) Related images: single “Next” button carousel
   * -------------------------------------------*/
  // Replace these URLs with your local files if you prefer (e.g., "images/hiring/a.jpg")
  const RELATED_IMAGES = {
    hiring: [
      'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
    ]
  };

  (function initNextButton() {
    const mainImg = document.getElementById('main-image');
    const nextBtn = document.getElementById('next-related');
    if (!mainImg || !nextBtn) return;

    const options = RELATED_IMAGES.hiring.slice(0, 5);
    let idx = options.findIndex(u => mainImg.src.endsWith(u));
    if (idx < 0) idx = 0;

    function show(i) {
      mainImg.src = options[i % options.length];
    }

    nextBtn.addEventListener('click', () => {
      idx = (idx + 1) % options.length;
      show(idx);
    });
  })();

  /* ---------------------------------------------
   * 3) Backgrounds from JS
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
