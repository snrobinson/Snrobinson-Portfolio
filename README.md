# Stephen Robinson — Portfolio

Personal portfolio and personal-brand site for **Stephen Robinson**, technical program leader and applied AI builder.

Live site: **https://www.snrobinson.com**

## Stack

A dependency-free static site — no build step, no framework.

- **HTML** — hand-authored (`index.html`, plus the `jarvis/` case-study page)
- **CSS** — a single hand-written design system (`css/styles.css`) using CSS custom-property tokens, with light/dark theming
- **JavaScript** — one vanilla file (`scripts/scripts.js`): accessible theme toggle, section-aware navigation, and mobile-menu behavior
- **Fonts** — Space Grotesk + Inter + JetBrains Mono (Google Fonts)

## Structure

```
index.html            Main single-page site
css/styles.css        Design system + light/dark theme tokens
scripts/scripts.js    Interactions (theme, nav, scroll awareness)
jarvis/               Visual JARVIS system case study
images/               Headshot, social preview, and icons
favicon.svg           SR monogram favicon
site.webmanifest      PWA manifest
robots.txt / sitemap.xml
CNAME / .nojekyll     GitHub Pages config
Stephen-Robinson-Resume.pdf
```

## Local development

No dependencies required. Serve the folder over HTTP:

```bash
python3 serve.py      # http://localhost:3000
```

Or use any static server (e.g. VS Code Live Server).

## Theming

The site supports light and dark modes. It follows the visitor's OS preference on first load and remembers a manual choice via `localStorage`. Colors are driven by semantic tokens in `:root` and overridden under `[data-theme="light"]`.

## Deployment

Configured for **GitHub Pages** with a custom domain:

- `CNAME` → `www.snrobinson.com`
- `.nojekyll` → serve files as-is (no Jekyll processing)

One-time setup: enable Pages for the repo (Settings → Pages → deploy from branch), then point the domain's DNS at GitHub Pages.
