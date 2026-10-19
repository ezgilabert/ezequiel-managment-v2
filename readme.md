# Ezequiel García Gilabert - Personal Portfolio

Welcome to the repository for my personal portfolio and landing page. This project is a modern, fully responsive website built with clean web standards, featuring dynamic animations, a custom interactive retro TV, and a seamless theme switcher. The JavaScript is structured using native ES6 Modules for better maintainability and performance.

## Features

* **Responsive Design:** Fluid typography, CSS Grid, and modern layout handling optimized for desktop, tablet, and mobile viewports.
* **Dark & Light Mode:** Seamless theme toggling with `localStorage` persistence and smooth CSS transitions across all elements.
* **Dynamic Hero Carousel:** An automatic text carousel with a dot selector that changes the hero titles with smooth fade transitions.
* **Dynamic Animations:** Powered by GSAP and ScrollTrigger for sticky navigation, scroll-based text reveals, and the interactive Altrum-style service card.
* **Interactive Retro TV:** A fully custom, procedurally generated HTML5 Canvas element encapsulated in a JavaScript class. It features 12 animated channels (static, plasma, matrix, synthwave, etc.) with an interactive dial and OSD (On-Screen Display). Includes battery-saving features (pauses when out of viewport or tab is hidden).
* **Modular Architecture:** Core logic is split into distinct ES6 modules for themes, navigation, scroll animations, the TV canvas, services, and the hero carousel.
* **Refactored Loader:** A multi-stage loading screen with 3D text reveals and a typewriter effect, refactored using `async/await` for better readability and maintenance.
* **Progressive Text Highlight:** A custom scroll-driven script that reveals text character-by-character.
* **Custom 404 Page:** A dedicated error page that reuses the site's design tokens (fonts, theme toggle, coral accent), featuring a pulsing lightning-bolt logo with coral glow and staggered fade-in content. Uses absolute paths (`/`) so it works correctly regardless of the broken URL depth.

## Project Structure

```text
├── index.html
├── 404.html              # Custom error page
├── css/
│   ├── main.css          # Main styles, design tokens, and layout (dead code removed)
│   ├── loader.css        # Loader screen specific styles
│   └── 404.css           # 404 page specific styles
├── js/
│   ├── main.js           # Entry point (orchestrates initialization)
│   ├── loader.js         # Loader sequence timing (Async/Await)
│   └── modules/
│       ├── theme.js            # Theme toggle logic
│       ├── navigation.js       # Sticky nav and burger menu
│       ├── scrollAnimations.js # Reveal on scroll & progressive text highlight
│       ├── retroTv.js          # Canvas Retro TV class
│       ├── services.js         # GSAP Altrum card logic
│       └── heroCarousel.js     # Hero text carousel logic
├── assets/
│   ├── dog.jpg           # Hero image (WebP recommended for production)
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

* **Initialization Strategy (`main.js`):** The application initialization is split into two phases. `initImmediateUI()` runs on `DOMContentLoaded` for immediate interactivity (menus, theme, canvas). `initDeferredAssets()` runs on `window.load` to ensure GSAP/ScrollTrigger calculates correct scroll distances after all images have loaded.
* **Asynchronous Loader:** The `loader.js` uses Promises and `async/await` instead of nested `setTimeout` callbacks, making the animation sequence much easier to read and modify.
* **Clean CSS:** The `main.css` file has been audited to remove dead code, unused variables, and deprecated components from previous design iterations.
* **404 Page Isolation:** `404.html` only loads `main.css` + `404.css` + the theme module. It intentionally skips GSAP, the loader, and the retro TV so the error page renders instantly and stays self-contained. All asset paths use the absolute root (`/`) so they resolve correctly regardless of the URL path that triggered the 404.

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

* **Theme Colors:** The entire color palette is controlled via CSS variables at the top of `css/main.css` under the `:root` and `[data-theme="dark"]` selectors.
* **Hero Content:** The carousel phrases can be edited directly in the `titles` array inside `js/modules/heroCarousel.js`.
* **Language Standard:** The website visible text is in Spanish, while the code structure, comments, and variables are strictly in English.
* **Images:** All local images are placed in the `assets/` folder. For optimal performance, the service section uses locally optimized `.webp` images. It is recommended to convert `dog.jpg` to `.webp` or `.avif` before deploying to production.
* **404 Route:** The 404 page links back to `/`. If the site is deployed in a subdirectory (e.g. `username.github.io/repo/`), update the `href="/"` occurrences in `404.html` to the correct base path.

## Deploying the 404

Most static hosts (Netlify, Vercel, GitHub Pages, Cloudflare Pages) automatically serve a file named `404.html` from the project root for unmatched routes. No extra configuration is needed if the file is placed at the root of the published directory.