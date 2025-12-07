// Preload helpers (unchanged)
function preloadOnce(url){
  return new Promise((res, rej) => {
    if (!url) return rej(new Error('empty'));
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => res(url);
    img.onerror = () => rej(new Error('fail'));
    img.src = url;
  });
}
async function firstWorking(arr){
  for (const u of arr) { try { return await preloadOnce(u); } catch(_){} }
  return null;
}

// Initialize all slides: use one-per-provider, keep Source synced, skip broken
(async function initAllNextButtons(){
  for (const id of Object.keys(CONTENT)) {
    const img = document.getElementById(`main-image-${id}`);
    const btn = document.getElementById(`next-related-${id}`);
    const sourceA = document.getElementById(`source-${id}`);
    if (!img || !btn || !sourceA) continue;

    // Extract src/credit lists from provider objects
    const items = (RELATED_IMAGES[id] || []);
    const list = items.map(o => o.src);
    const credit = items.map(o => o.credit || o.src);

    // Choose first working image
    const good = await firstWorking(list);
    img.src = good || list[0] || "";
    let idx = Math.max(0, list.findIndex(u => u && img.src.endsWith(u)));
    sourceA.href = credit[idx] || credit[0] || "#";

    const advance = async () => {
      for (let step = 0; step < list.length; step++) {
        const nextIdx = (idx + 1) % list.length;
        try {
          const ok = await preloadOnce(list[nextIdx]);
          img.src = ok;
          idx = nextIdx;
          sourceA.href = credit[idx] || sourceA.href;
          break;
        } catch { idx = nextIdx; }
      }
    };

    btn.addEventListener('click', advance);
    img.addEventListener('error', advance);
  }
})();
