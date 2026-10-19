/* ================= LOADER LOGIC ================= */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function initLoader() {
  window.addEventListener('load', async () => {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Respect user preference: skip the multi-stage animation
    if (reduce) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
      return;
    }

    const typeWrapper = document.getElementById('typeWrapper');
    const word1 = document.getElementById('word1');
    const word2 = document.getElementById('word2');
    const word3 = document.getElementById('word3');

    await sleep(1800);
    typeWrapper?.classList.add('slide-out');
    word1?.classList.add('active');

    await sleep(700);
    word1?.classList.remove('active');
    word1?.classList.add('slide-out');
    word2?.classList.add('active');

    await sleep(700);
    word2?.classList.remove('active');
    word2?.classList.add('slide-out');
    word3?.classList.add('active');

    await sleep(1000);
    loader.classList.add('hidden');

    await sleep(1000);
    loader.remove();
  });
}