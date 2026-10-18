export function initScrollAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Reveal on Scroll ---
  const reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // --- Progressive Highlight Text ---
  const progressiveText = document.querySelector('.highlight-text');
  if (progressiveText) {
    const fullText = "Donde la magia y la suerte no existen, el método y la estrategia hacen lo imposible.";
    const words = fullText.split(/\s+/);
    
    progressiveText.innerHTML = words.map(word => {
      const chars = word.split('').map(char => `<span class="highlight-char">${char}</span>`).join('');
      return `<span class="highlight-word">${chars}</span>`;
    }).join(' ');

    const chars = progressiveText.querySelectorAll('.highlight-char');
    let tickingText = false;

    const updateProgressiveText = () => {
      const rect = progressiveText.getBoundingClientRect();
      const start = window.innerHeight * 0.9;
      const end = window.innerHeight * 0.2;
      
      let progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
      progress = progress * progress * (3 - 2 * progress); // Smoothstep

      const filled = Math.floor(progress * chars.length);
      chars.forEach((char, i) => {
        char.style.color = i < filled ? 'var(--ink)' : 'var(--line-2)';
      });
    };

    window.addEventListener('scroll', () => {
      if (!tickingText) {
        window.requestAnimationFrame(() => {
          updateProgressiveText();
          tickingText = false;
        });
        tickingText = true;
      }
    }, { passive: true });
    
    updateProgressiveText();
  }
}