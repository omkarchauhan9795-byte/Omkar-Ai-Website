# Omkar-Ai Website — v3.0.0 Marketing & Download Site

Static, zero-dependency (except Three.js CDN), drag-and-drop deployable website for **Omkar-Ai v3.0.0**.

## Quick Start

```bash
# Serve locally (any static server)
npx serve .
# or
python -m http.server 8080
# or
php -S localhost:8080
```

Open `http://localhost:8080` — the site works from any folder, no build step required.

## Deploy Anywhere

Drag the **entire `Website Omkar - Ai` folder** to:
- Netlify / Vercel / Cloudflare Pages (static hosting)
- GitHub Pages / GitLab Pages
- Any web server (nginx, Apache, Caddy, IIS)
- S3 + CloudFront / Azure Blob / GCS
- ZIP and upload to any static host

**No environment variables, no build, no Node runtime, no database.**

## External Dependencies

| Resource | Purpose | Location |
|----------|---------|----------|
| Three.js r128 | Hero neural-field background | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` (deferred) |

**That's it.** All CSS, JS, fonts (system stack), icons (inline SVG), and images are local.

## Folder Structure

```
Website Omkar - Ai/
├── index.html              # Home — hero, metrics, pillars, HUD, safety demo, FAQ, CTA
├── features.html           # Deep-dive: 6 pillars, 18 capabilities, specs, comparison
├── download.html           # Installer/portable cards, hashes, verify steps, install guide, troubleshooting
├── docs.html               # Sticky-sidebar docs: quick start, commands, HUD, memory, subagents, safety, MCP, shortcuts
├── changelog.html          # Timeline: v3.0.0 → v2.0.0 with full release notes
├── about.html              # Story, creator, 6 design principles, stats
├── privacy.html            # Local-first privacy policy, data inventory, provider data flow
├── terms.html              # CC BY-NC 4.0 terms, permitted use, restrictions, liability
├── 404.html                # Friendly not-found with nav links
├── site.webmanifest        # PWA manifest (icons, shortcuts)
├── robots.txt              # Crawler rules (disallows /downloads/)
├── assets/
│   ├── css/
│   │   ├── style.css       # Core: tokens, header, hero, components, footer, responsive
│   │   └── pages.css       # Inner pages: page-hero, feature-rows, docs-layout, legal-layout, timeline, 404
│   ├── js/
│   │   ├── main.js         # Header, mobile nav, reveal, counters, tabs, copy, FAQ, typing, scrollspy
│   │   └── three-scene.js  # Neural particle field, pointer parallax, reduced-motion/WebGL fallback
│   └── img/
│       ├── logo.svg        # Brand mark (34×34)
│       ├── favicon.svg     # Browser tab icon
│       ├── og-cover.svg    # Social card source (1200×630)
│       ├── og-cover.png    # Rendered social card
│       ├── apple-touch-icon.png (180×180)
│       ├── icon-192.png    (192×192)
│       └── icon-512.png    (512×512)
└── downloads/
    ├── Omkar-Ai-Setup-3.0.0.exe        (97,097,542 bytes)
    ├── Omkar-Ai-3.0.0-portable.zip     (135,693,758 bytes)
    ├── SHA256SUMS.txt                  (185 bytes)
    └── README.txt                      # This file's content
```

## Pages Overview

| Page | Purpose | Key Components |
|------|---------|----------------|
| `index.html` | Landing | Three.js hero, animated HUD, metric counters, bento pillar grid, feature tabs, wide HUD mockup, safety confirm demo, steps, capability marquee, FAQ, final CTA |
| `features.html` | Deep dive | 6 feature rows (alt layouts), 18-card capability matrix, spec grid, comparison table |
| `download.html` | Downloads | Dual download cards, hash verification (copy btns), PowerShell verify, requirements, install guides (installer + portable), data locations, troubleshooting FAQ |
| `docs.html` | Documentation | Sticky sidebar nav, quick start, first-run keys, voice command table, HUD guide, memory/skills, subagents, safety/undo, MCP config, shortcuts, troubleshooting |
| `changelog.html` | Release history | Timeline cards: v3.0.0 (current), v2.4.0, v2.3.0, v2.2.0, v2.1.0, v2.0.0 with Added/Changed/Fixed |
| `about.html` | About | Creator bio, 6 design principles, stat band, quote panel |
| `privacy.html` | Privacy | Data inventory table, provider data flow, updater requests, third-party, user rights |
| `terms.html` | Terms | CC BY-NC 4.0, permitted use, restrictions, AI provider responsibility, safety disclaimer, warranty/liability |
| `404.html` | Not found | Large 404, friendly copy, primary nav links |

## Design System (CSS Custom Properties)

```css
:root {
  --bg: #04070d;              /* Deep night */
  --bg-soft: #060b14;         /* Slightly lighter */
  --panel: rgba(10,18,30,0.72); /* Glass panels */
  --panel-solid: #0a121e;
  --panel-lift: #0e1928;
  --line: rgba(146,196,255,0.12);  /* Cyan grid lines */
  --line-strong: rgba(118,214,255,0.3);
  --text: #eaf3ff;            /* Near-white */
  --muted: #91a4bb;           /* Secondary text */
  --muted-2: #667b94;         /* Tertiary */
  --cyan: #5ce1ff;            /* Primary accent */
  --cyan-soft: #a9f0ff;
  --blue: #4f8cff;
  --violet: #a78bfa;          /* Secondary accent */
  --green: #55e6a5;           /* Success */
  --amber: #ffc857;           /* Warning */
  --red: #ff6b81;             /* Danger */
  --radius: 20px;
  --radius-sm: 14px;
  --radius-lg: 28px;
  --container: 1180px;
  --header-h: 76px;
  --font-display: "Segoe UI Variable Display", "Segoe UI", system-ui;
  --font-body: "Segoe UI Variable Text", "Segoe UI", system-ui;
  --font-mono: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
  --ease: cubic-bezier(0.22,1,0.36,1);
}
```

**No external fonts.** Uses system UI stack (Segoe UI Variable on Windows, San Francisco on macOS/iOS, etc.).

## JavaScript Modules

| File | Responsibilities |
|------|------------------|
| `main.js` | Header scroll state, mobile nav toggle, active nav highlighting, IntersectionObserver reveal (`[data-reveal]`), metric counters (`[data-count]`), feature tabs (`[data-tab]`/`[data-panel]`), safety confirm demo, FAQ accordion, copy-to-clipboard (`[data-copy]`), hero prompt typing (`[data-typing]`), docs/legal scrollspy |
| `three-scene.js` | Neural particle field (2000 pts), pointer parallax, connection lines, color shift, `prefers-reduced-motion` + WebGL fallback to static gradient |

All scripts are `defer` — no render-blocking.

## Accessibility

- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- Skip link (first focusable element)
- Inline SVG icon sprite (`<symbol>` + `<use href="#i-*">`)
- `aria-label`/`aria-expanded`/`aria-controls` on interactive controls
- `prefers-reduced-motion` respected (reveal, typing, Three.js animation)
- Focus-visible outlines on all interactive elements
- Color contrast ≥ 4.5:1 (WCAG AA)
- `lang="en"` on `<html>`

## Performance

- All CSS/JS local, minified-ready (human-readable in repo)
- Three.js loaded from CDN with `defer` + `preconnect`
- Images: SVG for icons/logo, PNG for social card (pre-rendered)
- No third-party analytics, tracking, fonts, or scripts
- Critical CSS inlined in `<head>`? No — but both stylesheets are small (~67KB + ~36KB gzipped ~12KB + ~7KB)
- Total page weight (index.html, cold): ~1.2 MB including Three.js (~500 KB gzipped)

## Verifying Downloads

The `downloads/` folder contains **only release artifacts** (no source, no venv, no tests, no API keys):

```
Omkar-Ai-Setup-3.0.0.exe        8c4ba2f6c24959e91938665bcc49c3f5c49aff964e010735e10a9793997b0f19
Omkar-Ai-3.0.0-portable.zip     2e9e3aecd974e202e64dd81ae2f13ffbc180809e88887007a61a8993525b51a4
```

Verify with:
```powershell
Get-FileHash .\Omkar-Ai-Setup-3.0.0.exe -Algorithm SHA256
Get-FileHash .\Omkar-Ai-3.0.0-portable.zip -Algorithm SHA256
```

## Customization

### Colors
Edit `--cyan`, `--violet`, `--green`, `--amber`, `--red` in `assets/css/style.css:18-24`.

### Content
- Copy/edit HTML directly — each page is self-contained
- Shared header/footer/icon sprite duplicated in each file (intentional for portability)
- Update version references: search for `3.0.0`, `v3.0.0`, `97 MB`, `130 MB`

### Three.js Scene
Tune particle count, colors, connection distance in `assets/js/three-scene.js`.

## Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Mobile Safari / Chrome | 14+ / 90+ |

Requires: ES2020, IntersectionObserver, CSS Grid, CSS Custom Properties, `prefers-reduced-motion`.

## License

Website code & design: **CC BY-NC 4.0** — same as Omkar-Ai application.

```
© 2026 Omkar Chauhan. All rights reserved.
DESIGNED & BUILT BY OMKAR CHAUHAN · CC BY-NC 4.0
```

## Credits

- **Creator:** Omkar Chauhan — https://omkarchauhan.me
- **Application:** Omkar-Ai v3.0.0 — https://github.com/omkarchauhan/Omkar-Ai
- **Three.js:** https://threejs.org (MIT license, loaded from cdnjs)
- **System fonts:** Segoe UI Variable / San Francisco / system-ui

---

**Built for portability. Deploy by dragging the folder.** No CI, no build, no lock-in.