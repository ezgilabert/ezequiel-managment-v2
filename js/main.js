import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initScrollAnimations } from './modules/scrollAnimations.js';
import { initServices } from './modules/services.js';
import { RetroTv } from './modules/retroTv.js';
import { initHeroCarousel } from './modules/heroCarousel.js';
import { initLoader } from './loader.js';

/**
 * Initialize core UI elements as soon as the DOM is parsed.
 * This ensures immediate interactivity for the user.
 */
function initImmediateUI() {
  // 1. Dynamic Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Loader
  initLoader();

  // 3. Core UI Modules
  initTheme();
  initNavigation();
  initScrollAnimations();
  initHeroCarousel();
  
  // 4. Retro TV Class
  new RetroTv('tvCanvas');
}

/**
 * Initialize heavy assets and scroll animations after all media (images) has loaded.
 * GSAP/ScrollTrigger needs accurate element heights, which depends on loaded images.
 */
function initDeferredAssets() {
  initServices();
  
  // Refresh ScrollTrigger to ensure all positions are calculated correctly
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// Execute when DOM is fully parsed
document.addEventListener('DOMContentLoaded', initImmediateUI);

// Execute when all assets (images, fonts, scripts) are fully loaded
window.addEventListener('load', initDeferredAssets);