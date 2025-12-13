// Slides + dropdown nav + “Source  Next” per figure (1 per provider), robust preload/failover.

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- niceties ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Dropdown nav ---------- */
  function buildNavMenu() {
    const menu = document.getElementById('navMenu');
    if (!menu) return;
    menu.innerHTML = '';
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    sections.forEach(sec => {
      const label = (sec.querySelector('h2')?.textContent || sec.id || '').trim() || 'Slide';
      const a = document.createElement('a');
      a.href = `#${sec.id}`;
      a.role = 'menuitem';
      a.textContent = label;
      menu.appendChild(a);
    });
  }

  function initDropdownBehavior() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    const open = () => { toggle.setAttribute('aria-expanded', 'true'); menu.hidden = false; };
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); menu.hidden = true; };

    toggle.addEventListener('click', () =>
      toggle.getAttribute('aria-expanded') === 'true' ? close() : open()
    );

    document.addEventListener('click', e => {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) close();
    });

    menu.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        close();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    });
  }

  buildNavMenu();
  initDropdownBehavior();

  /* ---------- CONTENT (unchanged from your structure) ---------- */
  const CONTENT = window.CONTENT || {};
  const RELATED_IMAGES = window.RELATED_IMAGES || {};

  /* ---------- render slides ---------- */
  const renderSlide = (id, data) => {
    const sec = document.getElementById(id);
    if (!sec || !data) return;

    const kicker = data.kicker ? `<div class="kicker">${data.kicker}</div>` : '';
    const subtitle = data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : '';
    const bulletsTop = data.bulletsTop?.length
      ? `<ul>${data.bulletsTop.map(li => `<li>${li}</li>`).join('')}</ul>` : '';
    const bullets = data.bullets?.length
      ? `<ul>${data.bullets.map(li => `<li>${li}</li>`).join('')}</ul>` : '';
    const script = data.script ? `<p class="script">${data.script}</p>` : '';

    let figure = '';
    if (data.figure) {
      const imgId = `main-image-${id}`;
      const btnId = `next-related-${id}`;
      const srcId = `source-${id}`;

      figure = `
        <figure>
          <img id="${imgId}" src="" alt="${data.figure.alt || ''}" loading="lazy" referrerpolicy="no-referrer" />
          <figcaption>
            <span class="figcap-text">${data.figure.cap || ''}</span>
            <span>
              <a id="${srcId}" target="_blank" rel="noopener">Source</a>
              <button type="button" class="fig-next-btn" id="${btnId}">Next</button>
            </span>
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
          ${script}
        </div>
        ${figure}
      </div>
    `;
  };

  Object.entries(CONTENT).forEach(([id, data]) => renderSlide(id, data));
  buildNavMenu();

  /* ---------- image preload + Next ---------- */
  function preload(url) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(url);
      img.onerror = rej;
      img.src = url;
    });
  }

  (async function initImages() {
    for (const id of Object.keys(CONTENT)) {
      const img = document.getElementById(`main-image-${id}`);
      const btn = document.getElementById(`next-related-${id}`);
      const src = document.getElementById(`source-${id}`);
      if (!img || !btn || !src) continue;

      const items = RELATED_IMAGES[id] || [];
      let idx = 0;

      const trySet = async i => {
        try {
          await preload(items[i].src);
          img.src = items[i].src;
          src.href = items[i].credit || '#';
          idx = i;
          return true;
        } catch {
          return false;
        }
      };

      for (let i = 0; i < items.length; i++) {
        if (await trySet(i)) break;
      }

      btn.addEventListener('click', async () => {
        for (let step = 1; step <= items.length; step++) {
          const next = (idx + step) % items.length;
          if (await trySet(next)) break;
        }
      });
    }
  })();
});
