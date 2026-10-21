export function initServices() {
  const altrumCard = document.querySelector('#altrumCard');
  if (!altrumCard || typeof gsap === 'undefined') return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const imgSlides = altrumCard.querySelectorAll('.img-slide');
  const textSlides = altrumCard.querySelectorAll('.text-slide');
  const editionLabel = altrumCard.querySelector('#edition-label');
  const dotButtons = altrumCard.querySelectorAll('.dot-btn');
  const prevBtn = altrumCard.querySelector('#prevBtn');
  const nextBtn = altrumCard.querySelector('#nextBtn');
  
  const totalSlides = imgSlides.length;
  
  const editions = ["01 / ÁREA", "02 / ÁREA", "03 / ÁREA"];

  let currentIndex = 0;
  let isAnimating = false;
  let autoplayInterval;

  imgSlides.forEach((slide, i) => {
    gsap.set(slide, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 20 : 10 });
    gsap.set(slide.querySelector('.reveal-item'), { y: i === 0 ? '0%' : '100%' });
  });
  textSlides.forEach((slide, i) => {
    gsap.set(slide, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 20 : 10 });
    gsap.set(slide.querySelector('.reveal-item'), { y: i === 0 ? '0%' : '100%' });
  });

  const updateUI = (activeIdx) => {
    if (editionLabel) editionLabel.textContent = editions[activeIdx];

    if (prevBtn) prevBtn.textContent = String(activeIdx + 1).padStart(2, '0');
    if (nextBtn) nextBtn.textContent = String(totalSlides).padStart(2, '0');

    dotButtons.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === activeIdx);
    });
  };

  const goToSlide = (index) => {
    if (index === currentIndex || isAnimating || index < 0 || index >= totalSlides) return;
    
    isAnimating = true;
    updateUI(index);

    const currentImg = imgSlides[currentIndex];
    const currentText = textSlides[currentIndex];
    const nextImg = imgSlides[index];
    const nextText = textSlides[index];

    const currentImgInner = currentImg.querySelector('.reveal-item');
    const currentTextInner = currentText.querySelector('.reveal-item');
    const nextImgInner = nextImg.querySelector('.reveal-item');
    const nextTextInner = nextText.querySelector('.reveal-item');

    const goingForward = index > currentIndex;
    const outY = goingForward ? '-100%' : '100%';
    const inY = goingForward ? '100%' : '-100%';

    gsap.set([nextImg, nextText], { opacity: 1, zIndex: 20 });
    gsap.set([nextImgInner, nextTextInner], { y: inY });

    gsap.to([currentImgInner, currentTextInner], {
      y: outY,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set([currentImg, currentText], { opacity: 0, zIndex: 10 });
      }
    });

    gsap.to([nextImgInner, nextTextInner], {
      y: '0%',
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        currentIndex = index;
        isAnimating = false;
      }
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const target = (currentIndex - 1 + totalSlides) % totalSlides;
      goToSlide(target);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const target = (currentIndex + 1) % totalSlides;
      goToSlide(target);
      resetAutoplay();
    });
  }

  dotButtons.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!Number.isNaN(idx)) {
        goToSlide(idx);
        resetAutoplay();
      }
    });
  });

  // Autoplay
  const startAutoplay = () => {
    if (reduce) return;
    autoplayInterval = setInterval(() => {
      const nextIdx = (currentIndex + 1) % totalSlides;
      goToSlide(nextIdx);
    }, 5000);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  altrumCard.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  altrumCard.addEventListener('mouseleave', startAutoplay);

  updateUI(0);
  startAutoplay();
}