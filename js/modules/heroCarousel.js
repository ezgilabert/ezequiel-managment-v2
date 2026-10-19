export function initHeroCarousel() {
  const textEl = document.getElementById('dynamicHeroText');
  const selectorEl = document.getElementById('heroSelector');
  if (!textEl || !selectorEl) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const titles = [
    "Todo lo que se puede soñar, se puede <span class='it it--coral'>lograr</span>",
    "Soñar no es lo mismo que hacerlo <span class='it it--coral'>realidad</span>",
    "Las ideas no se convierten solas en <span class='it it--coral'>realidad</span>",
    "El futuro no se imagina. Se <span class='it it--coral'>construye</span>",
    "Hay potencial en todo. La diferencia está en hacerlo <span class='it it--coral'>crecer</span>"
  ];

  textEl.innerHTML = titles[0];

  let currentIndex = 0;
  let intervalId;
  let isTransitioning = false;

  /* --- Anti layout-shift */
  const measureAndApplyMinHeight = () => {
    const originalHTML = textEl.innerHTML;
    let maxH = 0;
    titles.forEach((title) => {
      textEl.innerHTML = title;
      const h = textEl.offsetHeight;
      if (h > maxH) maxH = h;
    });
    textEl.innerHTML = originalHTML;
    if (maxH > 0) textEl.style.minHeight = maxH + 'px';
  };

  requestAnimationFrame(measureAndApplyMinHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureAndApplyMinHeight);
  }
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(measureAndApplyMinHeight, 150);
  }, { passive: true });

  titles.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.classList.add('hero__dot');
    if (i === 0) {
      dot.classList.add('is-active');
      dot.setAttribute('aria-current', 'true');
    }
    dot.setAttribute('aria-label', `Ver frase ${i + 1}`);

    dot.addEventListener('click', () => {
      if (isTransitioning || currentIndex === i) return;
      changeTitle(i);
      resetInterval();
    });

    selectorEl.appendChild(dot);
  });

  const dots = selectorEl.querySelectorAll('.hero__dot');

  const changeTitle = (newIndex) => {
    isTransitioning = true;

    if (reduce) {
      currentIndex = newIndex;
      textEl.innerHTML = titles[currentIndex];
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === currentIndex);
        if (i === currentIndex) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      isTransitioning = false;
      return;
    }

    textEl.classList.add('fade-out');

    setTimeout(() => {
      currentIndex = newIndex;
      textEl.innerHTML = titles[currentIndex];

      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === currentIndex);
        if (i === currentIndex) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });

      textEl.classList.remove('fade-out');
      textEl.classList.add('fade-in');

      void textEl.offsetWidth;

      textEl.classList.remove('fade-in');
      isTransitioning = false;
    }, 500);
  };

  const resetInterval = () => {
    clearInterval(intervalId);
    if (reduce) return;
    intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % titles.length;
      changeTitle(nextIndex);
    }, 10000);
  };

  // Pause auto-advance on hover/focus for accessibility
  selectorEl.addEventListener('mouseenter', () => clearInterval(intervalId));
  selectorEl.addEventListener('mouseleave', resetInterval);
  selectorEl.addEventListener('focusin', () => clearInterval(intervalId));
  selectorEl.addEventListener('focusout', resetInterval);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(intervalId);
    } else {
      resetInterval();
    }
  });

  resetInterval();
}