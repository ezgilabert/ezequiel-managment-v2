export function initServices() {
  const altrumCard = document.querySelector('#altrumCard');
  if (!altrumCard || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const imgSlides = altrumCard.querySelectorAll('.img-slide');
  const textSlides = altrumCard.querySelectorAll('.text-slide');
  const currentNum = altrumCard.querySelector('#current-num');
  const editionLabel = altrumCard.querySelector('#edition-label');
  const dotButtons = altrumCard.querySelectorAll('.dot-btn');
  const totalSlides = imgSlides.length;
  const editions = ["@Service 01", "@Service 02", "@Service 03"];

  let disableSnap = false;
  let disableSnapTimeout;

  // Initial setup for slides
  imgSlides.forEach((slide, i) => {
    const inner = slide.querySelector('.reveal-item');
    gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
    gsap.set(inner, { y: i === 0 ? '0%' : '100%' });
  });

  textSlides.forEach((slide, i) => {
    const inner = slide.querySelector('.reveal-item');
    gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
    gsap.set(inner, { y: i === 0 ? '0%' : '100%' });
  });

  // UI Update (numbers, dots, layers)
  const updateUI = (progress) => {
    const activeIdx = progress < 0.25 ? 0 : (progress < 0.75 ? 1 : 2);
    if (currentNum) currentNum.textContent = '0' + (activeIdx + 1);
    if (editionLabel) editionLabel.textContent = editions[activeIdx];
    
    dotButtons.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIdx);
    });

    imgSlides.forEach((slide, i) => {
      slide.style.pointerEvents = i === activeIdx ? 'auto' : 'none';
      slide.style.zIndex = i === activeIdx ? 20 : 10;
    });
    textSlides.forEach((slide, i) => {
      slide.style.pointerEvents = i === activeIdx ? 'auto' : 'none';
      slide.style.zIndex = i === activeIdx ? 20 : 10;
    });
  };

  // Slide transition logic
  const addTransitionsToTimeline = (tl) => {
    tl.to([imgSlides[0].querySelector('.reveal-item'), textSlides[0].querySelector('.reveal-item')], { y: '-100%', duration: 1, ease: "power2.inOut" })
      .to([imgSlides[0], textSlides[0]], { opacity: 0, duration: 0.4, ease: "power2.inOut" }, "<")
      .to([imgSlides[1].querySelector('.reveal-item'), textSlides[1].querySelector('.reveal-item')], { y: '0%', duration: 1, ease: "power2.inOut" }, "<")
      .to([imgSlides[1], textSlides[1]], { opacity: 1, duration: 0.4, ease: "power2.inOut" }, "<")
      .to([imgSlides[1].querySelector('.reveal-item'), textSlides[1].querySelector('.reveal-item')], { y: '-100%', duration: 1, ease: "power2.inOut" })
      .to([imgSlides[1], textSlides[1]], { opacity: 0, duration: 0.4, ease: "power2.inOut" }, "<")
      .to([imgSlides[2].querySelector('.reveal-item'), textSlides[2].querySelector('.reveal-item')], { y: '0%', duration: 1, ease: "power2.inOut" }, "<")
      .to([imgSlides[2], textSlides[2]], { opacity: 1, duration: 0.4, ease: "power2.inOut" }, "<");
  };

  const smartSnap = {
    snapTo: (progress) => {
      if (disableSnap) return progress;
      return Math.round(progress * 2) / 2;
    },
    duration: 0.4,
    delay: 0.1
  };

  // Bottom dots navigation
  const handleDotClick = (tl, dot) => {
    let st = tl.scrollTrigger;
    if (!st) { ScrollTrigger.refresh(); st = tl.scrollTrigger; }
    if (!st) return;
    
    const idx = parseInt(dot.getAttribute('data-index'), 10);
    if (Number.isNaN(idx)) return;
    
    disableSnap = true;
    if (disableSnapTimeout) clearTimeout(disableSnapTimeout);
    
    const progress = idx / (totalSlides - 1);
    const scrollPos = st.start + (st.end - st.start) * progress;
    
    gsap.to(window, {
      scrollTo: scrollPos,
      duration: 0.6,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => {
        disableSnapTimeout = setTimeout(() => { disableSnap = false; }, 100);
      }
    });
  };

  const mm = gsap.matchMedia();

  // ==========================================
  // DESKTOP
  // ==========================================
  mm.add("(min-width: 1025px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services",
        start: "center center",
        end: "+=200%",
        pin: true,
        scrub: 1,
        snap: smartSnap,
        onUpdate: (self) => updateUI(self.progress)
      }
    });
    addTransitionsToTimeline(tl);

    const dotListeners = [];
    dotButtons.forEach(dot => {
      const listener = () => handleDotClick(tl, dot);
      dot.addEventListener('click', listener);
      dotListeners.push({ dot, listener });
    });

    return () => dotListeners.forEach(item => item.dot.removeEventListener('click', item.listener));
  });

  // ==========================================
  // MOBILE & TABLET
  // ==========================================
  mm.add("(max-width: 1024px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services",
        start: "center center",
        end: "+=150%", 
        pin: true,
        scrub: 1,
        snap: smartSnap,
        onUpdate: (self) => updateUI(self.progress)
      }
    });
    addTransitionsToTimeline(tl);

    const dotListeners = [];
    dotButtons.forEach(dot => {
      const listener = () => handleDotClick(tl, dot);
      dot.addEventListener('click', listener);
      dotListeners.push({ dot, listener });
    });

    return () => dotListeners.forEach(item => item.dot.removeEventListener('click', item.listener));
  });
}