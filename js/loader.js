/* ================= LOADER LOGIC ================= */

// Utility function to pause execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

window.addEventListener('load', async () => {
  const loader = document.getElementById('loader');
  const typeWrapper = document.getElementById('typeWrapper');
  const word1 = document.getElementById('word1');
  const word2 = document.getElementById('word2');
  const word3 = document.getElementById('word3');

  if (!loader) return;

  // 1. Initial delay before starting the text animation
  await sleep(1800);
  typeWrapper?.classList.add('slide-out');
  word1?.classList.add('active');

  // 2. Transition to word 2 (2500ms - 1800ms = 700ms wait)
  await sleep(700);
  word1?.classList.remove('active');
  word1?.classList.add('slide-out');
  word2?.classList.add('active');

  // 3. Transition to word 3 (3200ms - 2500ms = 700ms wait)
  await sleep(700);
  word2?.classList.remove('active');
  word2?.classList.add('slide-out');
  word3?.classList.add('active');

  // 4. Hide loader after the last word is shown (4200ms - 3200ms = 1000ms wait)
  await sleep(1000);
  loader.classList.add('hidden');

  // 5. Remove from DOM after CSS transition finishes
  await sleep(1000);
  loader.remove();
});