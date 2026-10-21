# Ezequiel García Gilabert - Personal Portfolio

Welcome to the repository for my personal portfolio and landing page. This project is a modern, fully responsive website built with clean web standards, featuring dynamic animations, a custom interactive retro TV, and a seamless theme switcher. The JavaScript is structured using native ES6 Modules for better maintainability and performance.

## Features

* **Responsive Design:** Fluid typography, CSS Grid, and modern layout handling optimized for desktop, tablet, and mobile viewports.
* **Dark & Light Mode:** Seamless theme toggling with `localStorage` persistence and smooth CSS transitions across all elements.
* **Dynamic Hero Carousel:** An automatic text carousel with a dot selector that changes the hero titles with smooth fade transitions. It respects `prefers-reduced-motion`, pauses auto-advance on hover/focus, and pauses when the browser tab is hidden (`visibilitychange`).
* **Scroll Reveals & Progressive Text:** Native `IntersectionObserver` reveals and a scroll-driven character-by-character highlight. Both respect `prefers-reduced-motion`.
* **Interactive Retro TV:** A fully custom, procedurally generated HTML5 Canvas element encapsulated in a JavaScript class. It features 12 animated channels (static, plasma, matrix, synthwave, etc.) with an interactive dial and OSD (On-Screen Display). Rendering pauses when the TV is out of the viewport, auto channel changes are disabled and frame rate is reduced when reduced motion is preferred. Includes keyboard accessibility with descriptive ARIA labels.
* **GSAP Service Card:** The Altrum-style services card uses GSAP for slide transitions, image/text reveals, dots and prev/next controls.
* **Modular Architecture:** Core logic is split into distinct ES6 modules for themes, navigation, scroll animations, the TV canvas, services, and the hero carousel.
* **Async Loader:** A multi-stage loading screen with 3D logo/text reveals and a typewriter effect. It is an ES6 Module (`export function initLoader`) imported by `main.js`, uses `async/await`, and skips the full animation when reduced motion is preferred.
* **Custom 404 Page:** A dedicated error page that reuses the site's design tokens (fonts, theme toggle, coral accent), featuring a pulsing lightning-bolt logo with coral glow and staggered fade-in content. It only loads `base.css`, `404.css` and the theme module.
* **CSS Splitting:** The stylesheet is split into `base.css` (shared tokens, reset, typography, utilities) and page-specific files (`home.css`, `loader.css` and `404.css`). The 404 page does not load the heavy homepage styles.
* **Accessibility:** Carousel dots use `aria-current`, theme toggle updates its `aria-label` dynamically, the retro TV canvas/dial are keyboard-focusable, and the loader is marked `aria-hidden`.

## Project Structure

```text
├── index.html
├── 404.html              # Custom error page (configured for /ezequiel-management-v2/)
├── css/
│   ├── base.css          # Tokens, reset, typography, utilities, reveal, theme transition
│   ├── home.css          # Nav, hero, highlight, about, retro-tv, services, contact, footer
│   ├── loader.css        # Loader screen specific styles
│   └── 404.css           # 404 page specific styles
├── js/
│   ├── main.js           # Entry point (imports loader and orchestrates initialization)
│   ├── loader.js         # Loader sequence (ES6 Module, Async/Await, reduced-motion aware)
│   └── modules/
│       ├── theme.js            # Theme toggle logic (+ dynamic aria-label)
│       ├── navigation.js       # Sticky nav and burger menu
│       ├── reveal.js           # Reveal on scroll
│       ├── progressiveText.js  # Scroll-driven character highlight
│       ├── scrollAnimations.js # Orchestrates reveal + progressiveText
│       ├── retroTv.js          # Canvas Retro TV class (keyboard accessible)
│       ├── services.js         # GSAP Altrum card logic
│       └── heroCarousel.js     # Hero text carousel (reduced-motion + a11y + visibility pause)
├── assets/
│   ├── dog.jpg           # Hero image
│   ├── service-1.webp    # Service card image 1
│   ├── service-2.webp    # Service card image 2
│   ├── service-3.webp    # Service card image 3
│   └── favicon.svg       # Logo and site icon
└── README.md
```

## Technologies Used

* **HTML5 & CSS3** (Custom CSS Variables/Tokens, Grid, Flexbox)
* **Vanilla JavaScript (ES6+ Modules)**
* **GSAP** (via CDN for the services card transitions)
* **ScrollTrigger** (loaded and refreshed after assets load; current scroll reveals are native IntersectionObserver/scroll listeners, not ScrollTrigger animations)
* **HTML5 Canvas API** (for the interactive retro TV)

## Architecture & Performance Notes

* **Initialization Strategy (`main.js`):** The application initialization is split into two phases. `initImmediateUI()` runs on `DOMContentLoaded` for immediate interactivity (menus, theme, canvas, loader). `initDeferredAssets()` runs on `window.load` to initialize services and refresh ScrollTrigger after all images have loaded.
* **CSS split:** `base.css` (shared tokens/reset/typography) is loaded on every page. `home.css` only on index, `404.css` only on 404. The 404 page also loads `404.css` and the shared theme module, but skips GSAP, the loader, and the retro TV.
* **Responsive Hero Image:** The hero image uses `srcset` and `sizes` attributes to prepare for multiple image resolutions (e.g., WebP/AVIF variants), improving LCP on mobile devices.
* **Reduced motion:** Loader, hero carousel, progressive text, reveal and 404 animations respect `prefers-reduced-motion`. The GSAP services card currently does not branch on reduced motion; if needed, add a reduced-motion guard in `services.js` to make slide changes instant.
* **Accessibility:** Carousel dots use `aria-current`, theme toggle updates its `aria-label`, retro TV canvas and dial are keyboard-focusable and include descriptive ARIA labels, and the loader is `aria-hidden`.
* **Asynchronous Loader (ES6 Module):** `loader.js` uses Promises and `async/await` instead of nested `setTimeout` callbacks, and is imported directly into `main.js`, making the animation sequence easier to read and modify while keeping the global scope clean.
* **404 Page Isolation:** `404.html` only loads `base.css` + `404.css` + `theme.js`. It intentionally skips GSAP, the loader, and the retro TV so the error page renders instantly and stays self-contained.
* **404 Base Path:** The current `404.html` uses absolute paths prefixed with `/ezequiel-management-v2/` for assets, CSS, JS and internal links. This is configured for a GitHub Pages project site deployed under that repository name. If the site is deployed at the domain root or under a different subpath, update all `/ezequiel-management-v2/...` occurrences in `404.html`.
* **Scroll Animation Split:** `scrollAnimations.js` is an orchestrator that delegates to `reveal.js` (IntersectionObserver-based reveal) and `progressiveText.js` (scroll-driven character highlight). Each concern lives in its own module.
* **Retro TV Performance:** The TV only renders while visible in the viewport. When reduced motion is preferred, it lowers the frame rate and disables auto channel changes. The browser also throttles `requestAnimationFrame` when the tab is hidden.
* **Services Card:** The service slides are controlled by GSAP timelines and use image/text reveal masks. Prev/next buttons and dot controls update the current slide and edition label.

## Getting Started

**IMPORTANT:** Because this project uses native ES6 JavaScript modules (`type="module"`), opening `index.html` directly via the `file://` protocol will result in a CORS policy error. You must run this project through a local development server.

### How to run it locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. Navigate to the project folder.
3. Start a local server. You can use any of the following methods:
   * **VS Code (Recommended):** Install the Live Server extension, right-click on `index.html`, and select "Open with Live Server".
   * **Python:** Run `python -m http.server 8000` in your terminal and open `http://localhost:8000`.
   * **Node.js:** Run `npx serve` in your terminal and open the provided local URL.

## Customization Notes

* **Theme Colors:** The entire color palette is controlled via CSS variables at the top of `css/base.css` under the `:root` and `[data-theme="dark"]` selectors.
* **Hero Content:** The carousel phrases can be edited directly in the `titles` array inside `js/modules/heroCarousel.js`.
* **Language Standard:** The website visible text is in Spanish, while the code structure, comments, and variables are in English.
* **Images:** All local images are placed in the `assets/` folder. The service section uses locally optimized `.webp` images. It is recommended to generate `dog-400.webp`, `dog-800.webp`, and `dog-1200.webp` and update the `srcset` in `index.html` to fully leverage responsive image loading.
* **404 Route & Base Path:** `404.html` currently links back to `/ezequiel-management-v2/` and loads its assets/scripts from `/ezequiel-management-v2/...`. If the site is deployed at the domain root, replace those paths with `/`. If it is deployed under another repository name, replace `ezequiel-management-v2` with the correct base path.

## Deploying the 404

Most static hosts (Netlify, Vercel, GitHub Pages, Cloudflare Pages) automatically serve a file named `404.html` from the project root for unmatched routes. No extra configuration is needed if the file is placed at the root of the published directory.

For GitHub Pages project sites, make sure the hardcoded base path in `404.html` (`/ezequiel-management-v2/`) matches the repository name. For custom domains or root deployments, update those absolute paths to `/` or to the correct base path.