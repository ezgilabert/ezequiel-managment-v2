# Ezequiel García Gilabert - Personal Portfolio

Welcome to the repository for my personal portfolio and landing page. This project is a modern, fully responsive website built with clean web standards, featuring dynamic animations, a custom interactive retro TV, and a seamless theme switcher. The JavaScript is structured using native ES6 Modules for better maintainability and performance.

## Features

* **Responsive Design:** Fluid typography, CSS Grid, and modern layout handling optimized for desktop, tablet, and mobile viewports.
* **Dark & Light Mode:** Seamless theme toggling with `localStorage` persistence and smooth CSS transitions across all elements.
* **Dynamic Hero Carousel:** An automatic text carousel with a dot selector that changes the hero titles with smooth fade transitions. It respects `prefers-reduced-motion`, pauses auto-advance on hover/focus, and pauses when the browser tab is hidden (`visibilitychange`).
* **Dynamic Animations:** Powered by GSAP and ScrollTrigger for sticky navigation, scroll-based text reveals, and the interactive Altrum-style service card.
* **Interactive Retro TV:** A fully custom, procedurally generated HTML5 Canvas element encapsulated in a JavaScript class. It features 12 animated channels (static, plasma, matrix, synthwave, etc.) with an interactive dial and OSD (On-Screen Display). Includes battery-saving features (pauses when out of viewport or tab is hidden) and keyboard accessibility with descriptive ARIA labels.
* **Modular Architecture:** Core logic is split into distinct ES6 modules for themes, navigation, scroll animations, the TV canvas, services, and the hero carousel.
* **Refactored Loader:** A multi-stage loading screen with 3D text reveals and a typewriter effect. It is now an ES6 Module (`export function initLoader`) imported by the main entry point, using `async/await` for readability. Skips the animation entirely when reduced motion is preferred.
* **Progressive Text Highlight:** A custom scroll-driven script that reveals text character-by-character. Falls back to showing the full text when reduced motion is preferred.
* **Custom 404 Page:** A dedicated error page that reuses the site's design tokens (fonts, theme toggle, coral accent), featuring a pulsing lightning-bolt logo with coral glow and staggered fade-in content. Uses absolute paths (`/`) so it works correctly regardless of the broken URL depth.
* **CSS Splitting:** The stylesheet is split into `base.css` (shared tokens, reset, typography, utilities) and page-specific files (`home.css` and `404.css`). The 404 page no longer loads the heavy homepage styles.
* **Accessibility:** Carousel dots use `aria-current`, theme toggle updates its `aria-label` dynamically, the retro TV canvas is keyboard-focusable, and the loader is marked `aria-hidden`.

## Project Structure

```text
├── index.html
├── 404.html              # Custom error page
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
│       ├── services.js         # GSAP Altrum card logic (+ reduced-motion snap)
│       └── heroCarousel.js     # Hero text carousel (reduced-motion + a11y + visibility pause)
├── assets/
│   ├── dog.jpg           # Hero image (WebP/AVIF recommended for production)
│   ├── service-1.webp    # Service card image 1
│   ├── service-2.webp    # Service card image 2
│   ├── service-3.webp    # Service card image 3
│   └── favicon.svg       # Logo and site icon
└── README.md
```

## Technologies Used

* **HTML5 & CSS3** (Custom CSS Variables/Tokens, Grid, Flexbox)
* **Vanilla JavaScript (ES6+ Modules)**
* **GSAP & ScrollTrigger** (via CDN for animations and scroll-pinning)
* **HTML5 Canvas API** (for the interactive retro TV)

## Architecture & Performance Notes

* **Initialization Strategy (`main.js`):** The application initialization is split into two phases. `initImmediateUI()` runs on `DOMContentLoaded` for immediate interactivity (menus, theme, canvas, loader). `initDeferredAssets()` runs on `window.load` to ensure GSAP/ScrollTrigger calculates correct scroll distances after all images have loaded.
* **CSS split:** `base.css` (shared tokens/reset/typography) is loaded on every page. `home.css` only on index, `404.css` only on 404. This keeps the error page lightweight and fast.
* **Responsive Hero Image:** The hero image uses `srcset` and `sizes` attributes to prepare for multiple image resolutions (e.g., WebP/AVIF variants), improving LCP on mobile devices.
* **Reduced motion:** Loader, hero carousel, progressive text, and GSAP snapping all respect `prefers-reduced-motion`.
* **Accessibility:** Carousel dots use `aria-current`, theme toggle updates its `aria-label`, retro TV canvas is keyboard-focusable and includes descriptive ARIA labels, loader is `aria-hidden`.
* **Asynchronous Loader (ES6 Module):** The `loader.js` uses Promises and `async/await` instead of nested `setTimeout` callbacks, and is imported directly into `main.js`, making the animation sequence much easier to read, modify, and keeping the global scope clean.
* **404 Page Isolation:** `404.html` only loads `base.css` + `404.css` + the theme module. It intentionally skips GSAP, the loader, and the retro TV so the error page renders instantly and stays self-contained. All asset paths use the absolute root (`/`) so they resolve correctly regardless of the URL path that triggered the 404.
* **Scroll Animation Split:** `scrollAnimations.js` is now an orchestrator that delegates to `reveal.js` (IntersectionObserver-based reveal) and `progressiveText.js` (scroll-driven character highlight). Each concern lives in its own module.

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
* **Language Standard:** The website visible text is in Spanish, while the code structure, comments, and variables are strictly in English.
* **Images:** All local images are placed in the `assets/` folder. For optimal performance, the service section uses locally optimized `.webp` images. It is recommended to generate `dog-400.webp`, `dog-800.webp`, and `dog-1200.webp` and update the `srcset` in `index.html` to fully leverage responsive image loading.
* **404 Route:** The 404 page links back to `/`. If the site is deployed in a subdirectory (e.g. `username.github.io/repo/`), update the `href="/"` occurrences in `404.html` to the correct base path.

## Deploying the 404

Most static hosts (Netlify, Vercel, GitHub Pages, Cloudflare Pages) automatically serve a file named `404.html` from the project root for unmatched routes. No extra configuration is needed if the file is placed at the root of the published directory.