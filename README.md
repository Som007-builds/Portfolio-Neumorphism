# Soham Singh — Portfolio

**Live site:** [sohamsingh.indevs.in](https://sohamsingh.indevs.in)

Second-year B.Tech Information Technology student at Netaji Subhash Engineering
College (NSEC), Garia, Kolkata. I design and build software around
privacy-first AI, local inference, and backend systems — and I'm looking for
software, AI, and backend engineering internships.

This repository is the source of my personal site: five static pages about the
work I'm designing, the systems behind it, and what I'm learning along the way.

## Featured work

- **Foretyx / Arbiter** — a proposed privacy and access-policy gateway that would
  review identity and redact or tokenize personally identifiable information
  before a request reaches a model. *Design and feasibility stage.*
- **AI Browser Chatbot** — a browser assistant intended to run against a local
  Ollama model with explicit, permissioned page context. *Design stage.*
- **Smart Home Automation** — a low-voltage control concept for accessible home
  automation with a cost target, starting from one safe bench node. *Concept stage.*

Each is presented as a design case study: intended architecture, tradeoffs, and
open questions. Diagrams are labeled as proposed, not verified runtime. I keep
the maturity honest rather than overstating what exists.

## Writing

The **Codex** collects four technical notes — privacy-first design, policy versus
filtering, identity context in systems, and local-model tradeoffs.

## Skills

- **Applied in this site:** semantic HTML, responsive CSS, and vanilla
  JavaScript — accessible navigation, progressive enhancement, and a native
  fetch/FormData contact form with real error and timeout handling.
- **Coursework and study:** C, Java, and Python; data structures and algorithms;
  object-oriented and memory concepts; systems architecture; machine-learning
  fundamentals.
- **Direction:** backend request/response boundaries, HTTP/REST failure handling,
  and local AI inference.
- **Tools:** Git and a dependency-free Node + headless-Edge test harness.

No percentages or logo walls — just what I can actually discuss.

## Tech & design

- Plain HTML, shared CSS, and vanilla JavaScript. No framework, no build step.
- Editorial monochrome design with pixel display type, dotted separators, custom
  inline SVG diagrams, and a light/dark theme saved to `localStorage`.
- Content and navigation work without JavaScript; keyboard focus, skip links, and
  reduced-motion preferences are respected.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Home — introduction, project cards, strengths, about |
| `systems.html` | Projects — three in-page case studies |
| `lab.html` | Skills & Lab — capabilities, learning, and early concepts |
| `codex.html` | Writing — four technical notes |
| `contact.html` | Contact and internship details |
| `styles.css`, `theme.js` | Shared styling and interaction |
| `profile.webp` | Portrait |

## Run locally

No install or build required. Open `index.html`, or serve the folder:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Testing

A dependency-free smoke suite (Node 24+ and Microsoft Edge) checks all five
pages across mobile, tablet, and desktop widths, plus links, metadata,
accessibility basics, theming, and the contact form:

```sh
node tests/smoke.mjs
```

## Contact

- **Email:** sohamsingh572@gmail.com
- **LinkedIn:** [soham-singh-a21688307](https://www.linkedin.com/in/soham-singh-a21688307/)
- **GitHub:** [Som007-builds](https://github.com/Som007-builds)
- **Site:** [sohamsingh.indevs.in](https://sohamsingh.indevs.in)

Open to software, AI, and backend engineering internships.
