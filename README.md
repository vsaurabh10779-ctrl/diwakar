# diwakar

Portfolio site for **Diwakar — Frontend Developer**.

A zero-dependency, zero-build static site: hand-written HTML, CSS and vanilla JavaScript.
No framework, no bundler, no `node_modules`. Deploys straight to GitHub Pages.

---

## Run locally

Open `index.html` directly, or serve the folder:

```sh
npx serve .
```

```sh
python -m http.server 8080
```

Then visit <http://localhost:8080>.

---

## ⚠️ Replace the placeholders before publishing

The site is currently filled with **placeholder content**. Search these files for
`REPLACE`, `SAMPLE`, `diwakar.dev`, `github.com/diwakar` and `linkedin.com/in/diwakar`:

| What | Where | Current placeholder |
| --- | --- | --- |
| Email address | `index.html` — `#copyMail` | `hello@diwakar.dev` |
| GitHub profile | `index.html` — contact socials | `github.com/diwakar` |
| LinkedIn profile | `index.html` — contact socials | `linkedin.com/in/diwakar` |
| X / Twitter | `index.html` — contact socials | `x.com/diwakar_dev` |
| Location | `index.html` — hero meta | `REPLACE · your city, India` |
| Projects (4) | `index.html` — `#work` | sample projects, links are `href="#"` |
| Social preview tags | `index.html` — `<head>` | generic title/description |
| Page title & meta | `index.html` — `<title>`, `<meta name="description">` | placeholder copy |

Notes:

- `href="#"` links in the project cards are `aria-disabled="true"`, so they are
  non-clickable until you point them at a real URL.
- The project "Source" / "Live site" links are intentionally dead links — swap in
  real repo and demo URLs.

---

## Project structure

```
diwakar/
├── index.html            # single page, all sections
├── style.css             # design tokens → components → responsive
├── script.js             # ~300 lines of vanilla JS
└── README.md
```

## Sections

`Hero` · `About` · `Stack` · `Work` · `Path` · `Contact`

## Features

- Fully responsive (mobile nav, bento grid collapses cleanly)
- Scroll-reveal animations with stagger, via `IntersectionObserver`
- Animated stat counters
- 3D tilt on project cards, magnetic hover on buttons
- Seamless CSS/JS marquee ticker
- Active-section nav highlighting (scroll spy)
- Custom cursor that grows over interactive elements (desktop only)
- Click-to-copy email button
- Scroll progress bar
- `prefers-reduced-motion` respected throughout
- Keyboard accessible, skip link, visible focus rings
- Print stylesheet included

## Design system

Edit the tokens at the top of `style.css`:

```css
--paper: #f2f0ea;   /* warm off-white background */
--ink:   #14140f;   /* near-black text            */
--cobalt:#2b3cff;   /* primary accent             */
--acid:  #d4ff3f;   /* highlight                  */
--coral: #ff5533;   /* status / "available" dot   */
```

Type: `Instrument Serif` (display) · `Space Grotesk` (body) · `JetBrains Mono` (labels).

## Deploy

Publishing is intentionally **off** — nothing auto-deploys.

When you want the site live, pick one:

**GitHub Pages (Actions)** — add a workflow like this, then push:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

**GitHub Pages (branch)** — Settings → Pages → Source: *Deploy from a branch*,
`main` / `/ (root)`.

## Licence

MIT
