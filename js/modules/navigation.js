export function initNavigation() {
  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const navContainer = document.getElementById('navContainer');
  const navOverlay = document.getElementById('navOverlay');
  const navLogo = document.getElementById('navLogo'); // Nuevo: Seleccionamos el logo

  if (nav) {
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (navBurger && nav) {
    const closeDropdown = () => {
      nav.classList.remove('dropdown-active');
      navContainer.classList.remove('dropdown-open');
      navBurger.classList.remove('is-rotated');
      navBurger.setAttribute('aria-expanded', 'false');
      if (navOverlay) navOverlay.classList.remove('is-active');
    };

    navBurger.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      const isActive = nav.classList.toggle('dropdown-active');
      navContainer.classList.toggle('dropdown-open', isActive);
      navBurger.classList.toggle('is-rotated', isActive);
      navBurger.setAttribute('aria-expanded', String(isActive));
      
      if (navOverlay) {
        navOverlay.classList.toggle('is-active', isActive);
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeDropdown);
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeDropdown);
    }

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && e.target !== navOverlay) closeDropdown();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });

    if (navLogo) {
      navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        closeDropdown();
      });
    }
  }
}