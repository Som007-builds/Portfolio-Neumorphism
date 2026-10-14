# Soham Singh — Portfolio

A static personal portfolio about privacy-first AI, local inference, and hardware. Plain HTML, shared CSS, and vanilla JavaScript; no framework, package installation, or build step.

## Pages

| File | Content |
| --- | --- |
| `index.html` | Introduction, selected work, portrait, and journal highlights |
| `systems.html` | Foretyx, AI Browser Chatbot, and Smart Home Automation designs |
| `lab.html` | Learning tracks and early product concepts |
| `codex.html` | Four full journal entries with an in-page index |
| `contact.html` | Contact form and direct email/social links |
| `styles.css` | Shared layout, typography, dark/light palettes, responsive rules |
| `theme.js` | Theme persistence, mobile navigation, progressive form handling |
| `profile.webp` | Original portrait, displayed in grayscale using CSS |

## Visual system

Edge-to-edge monochrome surfaces with centered content, pixel display headings, dotted section separators, square controls, and custom inline SVG illustrations. No runtime CSS generator or icon library.

- **Display:** Silkscreen; **body:** DM Sans; **metadata:** system monospace.
- **Dark edition:** near-black `#080808`, off-white `#f1f0eb`.
- **Light edition:** warm paper `#f4f3ed`, ink `#151515`.
- Dark is the first-visit default; an explicit light/dark selection is saved in `localStorage`. Storage failures do not prevent the site from working.
- Navigation and content remain available without JavaScript. The mobile menu is progressively enhanced.
- Skip links, visible keyboard focus, and native form labels are supported.
- One-time staggered entrances and scroll reveals use the native Web Animations API and IntersectionObserver. Links, buttons, and the mobile menu have subtle interaction transitions. No animation libraries, looping effects, or scroll hijacking.
- Reduced-motion preferences disable reveals and interaction motion, including changes made while the page is open. Content remains visible if JavaScript or the animation APIs are unavailable; keyboard focus finishes any reveal containing the focused control.

The site describes project intentions and constraints rather than implying production deployments. Foretyx is in early design/feasibility; the smart-home budget is a target, not a verified build cost.

## Preview locally

Open `index.html` directly for a quick look, or use an editor's static preview server. If Python is installed, run from this directory:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. An HTTP origin is preferable when testing cross-page theme persistence and form requests.

## External services

- **Google Fonts** supplies the two typefaces. The browser requests resources from Google; system fonts are used if those requests fail. The layout does not depend on the font service being available.
- **Formspree** receives contact submissions at the existing endpoint `https://formspree.io/f/xaqpzvdv`. Name, email, topic, and message are sent to that service. There are no API keys in the frontend.
- Without JavaScript, the contact form submits to Formspree normally. With JavaScript, it shows pending/success/error feedback, prevents duplicate in-flight submissions, and preserves entered text after errors. Requests have a 20-second timeout; a timeout cannot confirm whether a message was received.

Test form behavior with mocked requests before making real submissions. Actual delivery depends on the Formspree account, endpoint configuration, and service availability.

## Validation

The dependency-free smoke suite requires Node 24+ and Microsoft Edge:

```sh
node tests/smoke.mjs
```

It starts and stops its own local server and headless browser. External page requests are blocked, and Formspree is mocked. It checks all five pages at 320, 375, 760, 1024, and 1440 pixels, internal links, document structure, keyboard/mobile navigation, theme persistence, no-JavaScript fallback, and form success/error/timeout handling.

For a font-aware visual check, `ALLOW_FONTS=1 node tests/smoke.mjs` in a POSIX-compatible shell permits the two Google Fonts hosts. Reports and screenshots are generated under `tests/` and ignored by Git. See `tests/README.md` for details and browser-path configuration.

## Deployment and SEO

Deploy the directory as a static site. `vercel.json` enables clean URLs while keeping the underlying `.html` files usable. No deployment account or live domain is assumed.

Home includes descriptive social metadata and structured Person data. Before publishing, configure canonical URLs and absolute social-image URLs using the actual production domain. The pre-existing `sitemap.xml` and `robot.txt` were not changed during the visual redesign; review their domain values and crawler configuration separately.

## Links

- [GitHub — Som007-builds](https://github.com/Som007-builds)
- [LinkedIn — Soham Singh](https://www.linkedin.com/in/soham-singh-a21688307/)
- Email: `sohamsingh572@gmail.com`
