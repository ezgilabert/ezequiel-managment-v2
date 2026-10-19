export function initServices() {
  const altrumCard = document.querySelector('#altrumCard');
  if (!altrumCard || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const imgSlides = altrumCard.querySelectorAll('.img-slide');
  const textSlides = altrumCard.querySelectorAll('.text-slide');
  const currentNum = altrumCard.querySelector('#current-num');
  const editionLabel = altrumCard.querySelector('#edition-label');
  const dotButtons = altrumCard.querySelectorAll('.dot-btn');
  const totalSlides = imgSlides.length;
  const editions = ["@Service 01", "@Service 02", "@Service 03"];

  let allowSnap = true;
  let mainTimeline;

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

  const addTransitionsToTimeline = (tl) => {
    const imgInners = Array.from(imgSlides).map(s => s.querySelector('.reveal-item'));
    const textInners = Array.from(textSlides).map(s => s.querySelector('.reveal-item'));

    // Transition 0 -> 1
    tl.fromTo([imgInners[0], textInners[0]],
      { y: '0%' }, { y: '-100%', duration: 1, ease: "power2.inOut" }, 0)
    .fromTo([imgInners[1], textInners[1]],
      { y: '100%' }, { y: '0%', duration: 1, ease: "power2.inOut" }, 0)
    .fromTo([imgSlides[0], textSlides[0]],
      { opacity: 1 }, { opacity: 0, duration: 1, ease: "power2.inOut" }, 0)
    .fromTo([imgSlides[1], textSlides[1]],
      { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.inOut" }, 0)

    // Transition 1 -> 2
    .fromTo([imgInners[1], textInners[1]],
      { y: '0%' }, { y: '-100%', duration: 1, ease: "power2.inOut" }, 1)
    .fromTo([imgInners[2], textInners[2]],
      { y: '100%' }, { y: '0%', duration: 1, ease: "power2.inOut" }, 1)
    .fromTo([imgSlides[1], textSlides[1]],
      { opacity: 1 }, { opacity: 0, duration: 1, ease: "power2.inOut" }, 1)
    .fromTo([imgSlides[2], textSlides[2]],
      { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.inOut" }, 1);
  };

  const handleDotClick = (dot) => {
    if (!mainTimeline || !mainTimeline.scrollTrigger) return;

    const idx = parseInt(dot.getAttribute('data-index'), 10);
    if (Number.isNaN(idx)) return;

    allowSnap = false;

    const progress = idx / (totalSlides - 1);
    const scrollPos = mainTimeline.scrollTrigger.start +
                     (mainTimeline.scrollTrigger.end - mainTimeline.scrollTrigger.start) * progress;

    gsap.to(window, {
      scrollTo: scrollPos,
      duration: 0.8,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => { allowSnap = true; },
      onInterrupt: () => { allowSnap = true; }
    });
  };

  // Disable snapping when the user prefers reduced motion
  const snapConfig = reduce ? false : {
    snapTo: (value) => allowSnap ? Math.round(value * (totalSlides - 1)) / (totalSlides - 1) : value,
    duration: { min: 0.2, max: 0.5 },
    delay: 0.1,
    ease: "power1.inOut"
  };

  const mm = gsap.matchMedia();

  // ==========================================
  // DESKTOP
  // ==========================================
  mm.add("(min-width: 1025px)", () => {
    mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".services",
        start: "center center",
        end: "+=200%",
        pin: true,
        scrub: 1,
        snap: snapConfig,
        onUpdate: (self) => updateUI(self.progress)
      }
    });
    addTransitionsToTimeline(mainTimeline);

    const dotListeners = [];
    dotButtons.forEach(dot => {
      const listener = () => handleDotClick(dot);
      dot.addEventListener('click', listener);
      dotListeners.push({ dot, listener });
    });

    return () => dotListeners.forEach(item => item.dot.removeEventListener('click', item.listener));
  });

  // ==========================================
  // MOBILE & TABLET
  // ==========================================
  mm.add("(max-width: 1024px)", () => {
    mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".services",
        start: "center center",
        end: "+=150%",
        pin: true,
        scrub: 1,
        snap: snapConfig,
        onUpdate: (self) => updateUI(self.progress)
      }
    });
    addTransitionsToTimeline(mainTimeline);

    const dotListeners = [];
    dotButtons.forEach(dot => {
      const listener = () => handleDotClick(dot);
      dot.addEventListener('click', listener);
      dotListeners.push({ dot, listener });
    });

    return () => dotListeners.forEach(item => item.dot.removeEventListener('click', item.listener));
  });
}