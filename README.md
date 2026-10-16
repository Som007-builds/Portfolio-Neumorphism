# Soham Singh — Portfolio

**Live site:** [sohamsingh.indevs.in](https://sohamsingh.indevs.in)

Second-year B.Tech Information Technology student at Netaji Subhash Engineering
College (NSEC), Garia, Kolkata. I design and build software around
privacy-first AI, local inference, and backend systems — and I'm looking for
software, AI, and backend engineering internships.

This repository is the source of my personal site: five static pages about the
work I'm designing, the systems behind it, and what I'm learning along the way.

## Featured work

- **Foretyx / Arbiter** — the venture flagship: a proposed privacy and access-policy
  gateway that would review identity and redact or tokenize personally identifiable
  information before a request reaches a model. *Design and feasibility stage.*
- **Axion** — a research-intelligence platform that turns literature into an
  inspectable graph of atomic claims, contradictions, and gaps instead of a chatbot
  over PDFs. Python · FastAPI · Neo4j · ChromaDB · Next.js.
  [Source](https://github.com/Som007-builds/Axion)
- **Orion** — an air-gapped supervisory analytics platform that turns SOC
  operational evidence into explainable, evidence-linked hypotheses for examiners.
  Built for Smart India Hackathon 2026 (PS 26157).
  [Source](https://github.com/Som007-builds/orion)
- **Indigent** — a sovereign, local-first agentic workbench where the model,
  knowledge base, execution, and audit trail all stay on one machine. Built for
  Smart India Hackathon 2026 (PS 26117).
  [Source](https://github.com/Som007-builds/indigent-dev)

Foretyx / Arbiter is a venture-stage design; the other three link to working source.
Each is presented as a case study that separates what runs today from what is still
being designed, and diagrams are labeled rather than overstating what exists.

## Writing

The **Codex** collects four technical notes — privacy-first design, policy versus
filtering, identity context in systems, and local-model tradeoffs.

## Skills

- **Built in the projects:** Python and FastAPI services; SQLite, DuckDB, Neo4j,
  ChromaDB, and Qdrant; Ollama and hosted LLM integration; embeddings and
  retrieval-augmented answers; deterministic rules plus ML-assisted analytics.
- **Interfaces:** Next.js, React, and Tailwind in the projects; semantic HTML,
  responsive CSS, and vanilla JavaScript in this site.
- **Isolation & assurance:** policy validation, fail-closed design, network-disabled
  Docker sandboxes, and append-only audit ledgers.
- **Coursework and study:** C, Java, and Python; data structures and algorithms;
  object-oriented and memory concepts; systems architecture; machine-learning
  fundamentals.
- **Tools:** Git and a dependency-free Node + headless-Edge test harness.

No percentages or logo walls — just what I can actually discuss.

## Tech & design

- Plain HTML, shared CSS, and vanilla JavaScript. No framework, no build step.
- Editorial monochrome design with pixel display type, dotted separators, custom
  inline SVG diagrams, and a light/dark theme saved to `localStorage`.
- Content and navigation work without JavaScript; keyboard focus, skip links, and
  reduced-motion preferences are respected.

## Discoverability (SEO / GEO / AEO)

- **SEO:** unique titles and meta descriptions per page, canonical URLs, Open Graph
  and Twitter cards, a 1200×630 social image, `robots.txt`, an XML sitemap with
  `lastmod`, and explicit `index, follow` directives.
- **Structured data:** JSON-LD on every page — `WebSite` and `Person` sitewide, plus
  `ProfilePage`, `CollectionPage`, `ItemList` (the four projects), `ContactPage`,
  `BreadcrumbList`, and an `FAQPage`.
- **GEO / AEO:** a root `llms.txt` summarising the site for AI answer engines, and a
  visible FAQ on the contact page whose answers match the `FAQPage` schema.

Crawling is intentionally open. `robots.txt` allows all agents, including GPTBot,
OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, and Google-Extended.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Home — introduction, project cards, strengths, about |
| `systems.html` | Projects — four in-page case studies |
| `lab.html` | Skills & Lab — capabilities, learning, and early concepts |
| `codex.html` | Writing — four technical notes |
| `contact.html` | Contact and internship details |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Crawler policy, sitemap, and AI/answer-engine summary |
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
