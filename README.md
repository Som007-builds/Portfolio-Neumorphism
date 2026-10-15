# Soham Singh — Portfolio

A static personal portfolio about privacy-first AI, local inference, and backend
systems. Plain HTML, shared CSS, and vanilla JavaScript; no framework, package
installation, or build step.

## Pages

| File | Content |
| --- | --- |
| `index.html` | Introduction, three project cards, strengths, about, and journal highlights |
| `systems.html` | Three in-page case studies: Foretyx / Arbiter, AI Browser Chatbot, and Smart Home Automation |
| `lab.html` | Skills and working context, learning tracks, and early product concepts |
| `codex.html` | Four journal entries with an in-page index |
| `contact.html` | Contact form and direct email/social links |
| `styles.css` | Shared layout, typography, dark/light palettes, responsive rules |
| `theme.js` | Theme persistence, mobile navigation, progressive form handling, motion |
| `profile.webp` | Original portrait, displayed in grayscale using CSS |
| `PROJECT_EVIDENCE.md` | Evidence register and claim boundaries for the featured concepts |

## Visual system

Edge-to-edge monochrome surfaces with centered content, pixel display headings,
dotted section separators, square controls, and custom inline SVG illustrations.
No runtime CSS generator or icon library.

- **Display:** Silkscreen; **body:** DM Sans; **metadata:** system monospace.
- **Dark edition:** near-black `#080808`, off-white `#f1f0eb`.
- **Light edition:** warm paper `#f4f3ed`, ink `#151515`.
- Dark is the first-visit default; an explicit light/dark selection is saved in
  `localStorage`. Storage failures do not prevent the site from working.
- Navigation and content remain available without JavaScript. The mobile menu is
  progressively enhanced.
- Skip links, visible keyboard focus, and native form labels are supported.
- One-time staggered entrances and scroll reveals use the native Web Animations
  API and IntersectionObserver (including the new project cards). No animation
  libraries, looping effects, or scroll hijacking.
- Reduced-motion preferences disable reveals and interaction motion, including
  changes made while the page is open. Content remains visible if JavaScript or
  the animation APIs are unavailable; keyboard focus finishes any reveal
  containing the focused control.

The site describes project intentions and constraints rather than implying
production deployments. Foretyx is in early design/feasibility; the smart-home
budget is a target, not a verified build cost. The three product concepts have no
verified source or demo links, and the résumé is not yet available (see below).

## Preview locally

Open `index.html` directly for a quick look, or serve the directory with any
static server. If Python is installed, run from this directory:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. An HTTP origin is preferable when testing
cross-page theme persistence and form requests.

## External services

- **Google Fonts** supplies the two typefaces. The browser requests resources
  from Google; system fonts are used if those requests fail. The layout does not
  depend on the font service being available.
- **Formspree** receives contact submissions at the existing endpoint
  `https://formspree.io/f/xaqpzvdv`. Name, email, topic, and message are sent to
  that service. There are no API keys in the frontend.
- Without JavaScript, the contact form submits to Formspree normally. With
  JavaScript, it shows pending/success/error feedback, prevents duplicate
  in-flight submissions, and preserves entered text after errors. Requests have a
  20-second timeout; a timeout cannot confirm whether a message was received.

Test form behavior with mocked requests before making real submissions. Actual
delivery depends on the Formspree account, endpoint configuration, and service
availability.

## Missing assets

- **Résumé:** no PDF exists yet. Hero, footer, and Contact intentionally show
  non-clickable placeholders instead of a dead download link. See
  `assets/resume/README.md` for exactly where to place the file and how to
  activate the links. Do not add a résumé link until the PDF exists.
- **Product evidence:** matching source, demos, screenshots, hardware photos, and
  measured results for the three case studies were not established. See
  `PROJECT_EVIDENCE.md`. Do not add a source/demo button without a real URL.

## Validation

The dependency-free smoke suite requires Node 24+ and Microsoft Edge:

```sh
node --check theme.js
node --check tests/smoke.mjs
node tests/smoke.mjs
```

It starts and stops its own local server and headless browser. External page
requests are blocked, and Formspree is mocked. It checks all five pages at **320,
360, 375, 390, 760, 768, 1024, and 1440** pixels, internal links, document
structure, canonical/social/favicon metadata, the résumé-missing state, card and
case-study scaffolding, heading hierarchy, touch-target height, keyboard/mobile
navigation, theme persistence, no-JavaScript fallback, and form
success/error/timeout handling.

For a font-aware visual check, `ALLOW_FONTS=1 node tests/smoke.mjs` in a
POSIX-compatible shell permits the two Google Fonts hosts. Reports and
screenshots are generated under `tests/` and ignored by Git. See
`tests/README.md` for details and browser-path configuration.

## Deployment and SEO

Deploy the directory as a static site. `vercel.json` enables clean URLs while
keeping the underlying `.html` files usable.

SEO is implemented for the canonical domain `https://sohamsingh.indevs.in/`:

- Unique titles/descriptions and matching canonical URLs (`/`, `/systems`,
  `/lab`, `/codex`, `/contact`).
- Open Graph and Twitter metadata on every page, using the raster social image
  at `assets/social-preview.png` (1200×630; editable source `assets/social-card.html`).
- An SVG favicon (`assets/favicon.svg`) linked from every page.
- `robots.txt` (canonical sitemap) and `sitemap.xml` (the five clean paths). The
  legacy `robot.txt` is retained for compatibility.
- Home includes truthful Person structured data and the canonical URL.

Update the metadata if the production domain ever changes.

## Links

- [GitHub — Som007-builds](https://github.com/Som007-builds)
- [LinkedIn — Soham Singh](https://www.linkedin.com/in/soham-singh-a21688307/)
- Email: `sohamsingh572@gmail.com`
