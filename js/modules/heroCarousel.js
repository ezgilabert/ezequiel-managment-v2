export function initHeroCarousel() {
  const textEl = document.getElementById('dynamicHeroText');
  const selectorEl = document.getElementById('heroSelector');
  if (!textEl || !selectorEl) return;

  // Phrases updated with Version 4 style (Instrument Serif + coral color)
  const titles = [
    "Todo lo que se puede soñar, se puede <span class='it it--coral'>lograr</span>",
    "Soñar no es lo mismo que hacerlo <span class='it it--coral'>realidad</span>",
    "Las ideas no se convierten solas en <span class='it it--coral'>realidad</span>",
    "El futuro no se imagina. Se <span class='it it--coral'>construye</span>",
    "Hay potencial en todo. La diferencia está en hacerlo <span class='it it--coral'>crecer</span>"
  ];

  // Ensure the first title is rendered with proper HTML formatting immediately on load
  textEl.innerHTML = titles[0];

  let currentIndex = 0;
  let intervalId;
  let isTransitioning = false;

  // Dynamically create selector dots
  titles.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('hero__dot');
    if (i === 0) dot.classList.add('is-active');
    dot.setAttribute('aria-label', `View phrase ${i + 1}`);
    
    // On click, change phrase and reset timer
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
    textEl.classList.add('fade-out');
    
    setTimeout(() => {
      currentIndex = newIndex;
      // Use innerHTML to render <span> tags and apply styles
      textEl.innerHTML = titles[currentIndex]; 
      
      // Update dots
      dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
      
      // Entry animation
      textEl.classList.remove('fade-out');
      textEl.classList.add('fade-in');
      
      // Force reflow to trigger transition
      void textEl.offsetWidth;
      
      textEl.classList.remove('fade-in');
      isTransitioning = false;
    }, 500); // Synced with CSS transition duration
  };

  const resetInterval = () => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % titles.length;
      changeTitle(nextIndex);
    }, 10000); // 10 seconds
  };

  // Start cycle
  resetInterval();
}