# Portfolio overhaul — implementation handover

> Continue the existing work; do not start a replacement portfolio.
> The filename `handiver.md` is intentional: it was requested by the owner.
> Prepared on 2026-10-15. No deployment or commits were made during this overhaul.

## Update — 2026-10-17 (project set changed)

The owner replaced the featured project set. Superseding the project plan below:

- **Removed** the *AI Browser Chatbot* and *Smart Home Automation* case studies (and their `systems.html` anchors and `index.html` cards).
- **Added** three real projects with public source:
  - **Axion** — research-intelligence claim graph. <https://github.com/Som007-builds/Axion>
  - **Orion** — air-gapped SOC supervisory analytics (SIH 2026, PS 26157). <https://github.com/Som007-builds/orion>
  - **Indigent** — sovereign local-first agentic workbench (SIH 2026, PS 26117). <https://github.com/Som007-builds/indigent-dev>
- **Retained** *Foretyx / Arbiter* as the venture flagship. `systems.html` anchors are now `#foretyx`, `#axion`, `#orion`, `#indigent`.
- `codex.html` related-case links were repointed to `#orion` and `#indigent`; `README.md`, `PROJECT_EVIDENCE.md`, `lab.html`, and `tests/smoke.mjs` were updated to match. See `PROJECT_EVIDENCE.md` for the current claim boundaries.

## Update — 2026-10-17 (SEO / GEO / AEO pass)

Discoverability work added on top of the project-set change:

- **SEO:** per-page `<meta name="robots">` (`index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`); home `<title>`, `og:title`, and `twitter:title` retitled to “Software, Backend & AI Systems Portfolio”; `sitemap.xml` gained `lastmod` dates.
- **Structured data:** JSON-LD `@graph` on every page — `WebSite` + `Person` sitewide, plus `ProfilePage` (home), `CollectionPage` + `ItemList` of the four projects + `BreadcrumbList` (systems), `WebPage` + `BreadcrumbList` (lab), `CollectionPage` + `BreadcrumbList` (codex), and `ContactPage` + `BreadcrumbList` + `FAQPage` (contact).
- **AEO:** a new visible FAQ on `contact.html` (five Q&As) whose text matches the `FAQPage` schema; new `.faq-list` rules in `styles.css`.
- **GEO:** a new root `llms.txt` summarising the site for AI answer engines; `robots.txt` now explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, and Google-Extended (crawling stays open by the owner’s choice).
- `llms.txt` was added to the harness `production` hash list. `node tests/smoke.mjs` → **347 passed, 0 failed**. The changes are **uncommitted** pending owner authorization.

## 1. Assignment and source of truth

The owner requested an implemented, tested upgrade of the existing portfolio, not just an audit. It should help secure software engineering, AI engineering, backend engineering, and related developer internships while retaining the distinctive editorial/technical identity.

- **Name:** Soham Singh.
- **Education:** B.Tech in Information Technology, **second year**.
- **College:** Netaji Subhash Engineering College (NSEC), Garia, Kolkata.
- **Interests:** AI systems, privacy engineering, backend development, local AI inference, software architecture, developer tools, software building, technical research, robotics, and documenting experiments.
- **Venture/product:** **Foretyx** is the venture; **Arbiter** is its AI security/governance and privacy-infrastructure product. The new project page currently says “Arbiter AI”; normalize to the owner's exact “Arbiter” unless there is evidence supporting the longer brand.
- **Primary goal:** internships and professional credibility.
- **Secondary goal:** an engineering/AI/product-building personal brand.
- **Canonical domain:** `https://sohamsingh.indevs.in/`.
- **GitHub:** `https://github.com/Som007-builds`.
- **LinkedIn:** `https://www.linkedin.com/in/soham-singh-a21688307/`.
- **Email:** `sohamsingh572@gmail.com`.

Do not invent GPA, graduation year, employment, internships already held, awards, expertise, users, deployment claims, benchmarks, compliance, or production-grade security. The user supplied the second-year status; older first-year biographies in external READMEs do not override it. Seeking internships is an owner-stated objective, not a claim of immediate availability on a particular date.

### Design constraints

Preserve the black/off-white editorial design, S/S wordmark, pixel display typography, useful architecture illustrations, dotted separators, light-mode option, and understated motion. Keep “BUILDING PRIVATE AI SYSTEMS” or a close evolution. The owner explicitly disliked AI slop and generic templates.

The owner previously requested removal of the outer frame. **Keep the edge-to-edge background and centered reading width; do not restore the gray outer frame.** Do not add neon gradients, particles, looping animations, generic 3D, fake terminals, logo clouds, meaningless statistics, skill percentages, or excessive glassmorphism.

## 2. Repository and environment

- Workspace: `D:\All Codes\Portfolio-skewmorphism`.
- File-tool paths begin with `Portfolio-skewmorphism/`.
- OS: Windows. Terminal uses a host shell compatible with Git Bash/POSIX syntax in this session. OS sandboxing was unavailable/disabled; don't assume WSL paths work.
- Node available: **v24.11.0**.
- Microsoft Edge executable exists at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
- No framework, `package.json`, dependency install, or build pipeline. Five static HTML pages, shared CSS, and vanilla JS.
- `vercel.json`: `{ "cleanUrls": true, "trailingSlash": false }`.
- Verified portfolio repository: `https://github.com/Som007-builds/Portfolio-Neumorphism`.
- At overhaul start, Git was clean. HEAD: `20359dc`, subject `animation`; `main` and `origin/main` pointed there. Older commits include `ef50936` (Frontend re build).
- **Current changes are intentional uncommitted work. Preserve them.** Recheck Git status before editing.

### Current modified/untracked files

At handover preparation:

```text
 M codex.html
 M contact.html
 M index.html
 M systems.html
?? PROJECT_EVIDENCE.md
```

This document itself will also be untracked. `assets/resume/` and `tools/` were created, but are **empty** and won't appear in Git. There is no résumé, favicon, or social-sharing image in them yet.

`styles.css`, `theme.js`, `lab.html`, `README.md`, `robot.txt`, `sitemap.xml`, `vercel.json`, and the test harness have **not been updated for this new overhaul**. Their existing contents belong to the previously completed redesign/animation task.

A temporary `tools/upgrade-home.mjs` was used to migrate homepage markup and then deleted. Do not look for it or depend on rerunning it.

## 3. Inspection already performed

1. Read the current repository and Git state.
2. Fetched the live homepage successfully at the canonical domain. It matched the pre-overhaul source, including the outdated first-year About paragraph. Local changes have not been deployed.
3. Looked for local product code/assets/résumé: this is a portfolio repository, not the code for the three featured products. No PDF or actual product screenshots/hardware photographs were found.
4. Fetched the public GitHub repository list and reviewed likely matching projects' READMEs, trees, and selected source files.
5. Preserved conceptual diagrams and existing journal anchors while improving their honesty and detail.

### Project evidence: read `PROJECT_EVIDENCE.md`

That file contains exact URLs, pinned commits/blob hashes, files reviewed, limitations, and the claim boundaries. It is more detailed than this handover; use it rather than repeating broad discovery.

Public repositories returned:

- `Portfolio-Neumorphism`
- `orion`
- `indigent-dev`
- `personal`
- `Axion`
- `scam-shield-final`
- `image-redactor`
- `NoZero`

No public repository named Foretyx or Arbiter appeared. This does **not** prove no private, unpublished, or differently named implementation exists.

Selected code was read without installing or executing it:

- **Axion**, commit `0726da995ac7024b0a65566fdd128b78940c9518`: `README.md`, `llm.py`, `axion/lib/api-client.ts`. Research-agent app; selected model-router code calls hosted providers. Not established as Arbiter or the proposed Ollama browser chatbot.
- **orion**, commit `d6500c281b6c8a1eeecd97baa099a1bb65832d1c`: `README.md`, `backend/app/services/pseudonymisation.py`, `backend/app/api/v1/router.py`. SOC analytics with some redaction/pseudonymization primitives. Similar privacy code is **not** evidence that this is Arbiter.
- Official Ollama quickstart/API pages loaded. Current Ollama supports cloud as well as local models; localhost alone doesn't prove all inference/data processing is local.

Do not relabel unrelated projects, copy their README benchmark/test counts, infer professional expertise from dependencies, or add guessed source/demo links. A worthwhile later owner decision is whether actual public implementations such as Axion/orion should become featured projects. **Do not make that replacement unprompted.**

## 4. Work implemented during this overhaul

### `index.html` — content and markup updated; styling not finished

- Retained the headline and original hero boundary illustration.
- Eyebrow now reads “Software engineering · AI systems · Privacy”.
- Added “Software that respects data boundaries.”
- Supporting copy identifies Soham as a second-year B.Tech IT student and includes backend/privacy direction.
- Hero has real Explore Projects and Contact Me links plus a **disabled/non-link** résumé placeholder with explanation. No fabricated PDF link.
- Added an easily editable internship-search message and HTML comment.
- Changed primary navigation labels to Home / Projects / Skills & Lab / Codex / Contact; route filenames unchanged.
- Replaced the old featured-work + two simple work rows with **three `.project-card` articles inside `.project-grid`**.
- The card visuals reuse the three existing conceptual SVGs from `systems.html`, with prefixed IDs to avoid duplicates. They explicitly say proposed architecture, not screenshots.
- Cards contain name, description, stage, relevant proposed technology tags, descriptive case-study action, and honest source/demo availability notes.
- Added an evidence-backed strengths section and a real link to this portfolio's source repository.
- About identifies second year and correct education/college, adds interests and concise education metadata.
- Updated recruiter-oriented contact strip and footer résumé placeholder.

**Known unfinished dependency:** new homepage classes have no tailored styles yet. The homepage currently links to `lab.html#skills`, but **`#skills` does not exist yet**. Fix this in the skills work below.

### `systems.html` — three expanded in-page case studies

- Three original project anchors and all original SVG IDs/geometry retained.
- Accurate Foretyx/Arbiter relationship, explicit design/feasibility status.
- Proposed request interception, identity/policy decisions, PII transformation, model adapter, audit/failure lifecycle.
- Maturity matrix, expandable engineering tradeoffs, future synthetic-data milestone, evidence panel.
- Browser-chatbot scope covers intended UI/model configuration, Ollama setup outline, explicit browser context permission, cancellation/error states, network/privacy limits.
- Home-automation scope distinguishes intended SBC/WiFi/relay control from verified hardware; no fabricated firmware, photos, measurements, energy savings, or tested budget.
- All future acceptance criteria are labeled unexecuted. No product test results were manufactured.
- Links to the writing and `PROJECT_EVIDENCE.md`; no fake source/demo actions.
- Header labels updated; footer résumé placeholder added.

**Review needed:** avoid recruiter-hostile repetition of disclaimers. Be accurate but concise. The table's “Implemented” row refers to the case-study document itself, not product code; consider whether a simpler “Documentation available” classification is clearer. The new headline `DESIGNING / THE BOUNDARIES.` may be too long in pixel typography at small widths. Review/fix actual wrapping.

### `codex.html` — writing improved

- All four full articles, original dates, anchors, and title IDs preserved.
- Added short summaries, subsection headings, related case studies, and primary references.
- Preserved core arguments about privacy boundaries, policy versus filtering, IAM context, WebSocket stale-state handling, architecture habits, and local inference tradeoffs.
- Distinguishes proposals and proposed checks from runtime proof.
- Existing dates are labeled **Original note**; do not pretend today's edits were published at those dates. Optionally add a truthful current update date.
- Estimated read times calculated at 220 words/minute, rounded up: privacy 2 min (~356 words), policy 3 min (~481), systems 2 min (~325), local models 2 min (~409). Recalculate if substantial edits change length.
- Verified citations fetched: OWASP sensitive-information disclosure, OWASP prompt injection, MDN WebSockets, official Ollama documentation.
- Updated navigation and résumé footer status.

### `contact.html` — recruiter conversion updated

- Explicitly seeks software, AI, and backend internships; availability copy marked editable.
- Prominent direct mail link.
- Accurate second-year B.Tech IT / NSEC Garia Kolkata education section.
- Foretyx/Arbiter design-stage wording, interests, profile links.
- Added “Internship opportunity” select option.
- Foretyx option displays “Foretyx / Arbiter collaboration” but preserves old submitted value `Collaboration on Foretyx`.
- Existing form endpoint, IDs, field names, validation, and JS hooks preserved.
- Updated navigation and résumé footer placeholder.

### Existing implementations to preserve

`theme.js` already handles:

- Guarded localStorage theme persistence; dark first-visit default; light toggle and cross-tab state.
- Progressively enhanced mobile menu at `max-width: 760px`; native navigation remains visible without JS.
- Native form fallback and fetch/FormData submission; real 20-second abort deadline; success/reset and persistent error feedback; retained text on failure; duplicate in-flight prevention.
- One-time staggered hero entrances and IntersectionObserver reveals via Web Animations API.
- Reduced-motion initial/live preference handling; focus cancels any reveal containing the focused control; no hidden-by-default content.

Contact service: `https://formspree.io/f/xaqpzvdv`. Don't send real messages during testing. No new service integration is needed.

## 5. Remaining implementation, in priority order

### P0 — Complete shared styling and fix broken dependencies

Read the current CSS first and reuse its variables/layout patterns. Add minimal styles for the new content instead of resetting everything.

**Homepage classes needing styling:**

- `.hero-positioning`
- `.button-unavailable`
- `.resume-note`, `.opportunity-note`, `.resume-unavailable`
- `.section-intro`
- `.project-grid`, `.project-card`, `.project-visual`, `.project-diagram`, `.project-card-body`, `.resource-note`
- `.strength-grid`, `.section-evidence`
- `.education-block` (already used as a DL on Home and a section on Contact)

**Case-study classes needing styling:**

- `.case-index`, `.case-summary`, `.status-note`
- `.evidence-list`
- `.case-details` with native `summary` focus/hover/open states
- `.tradeoff-list`
- `.table-scroll`, `.case-status` with readable caption and scoped header cells

**Writing/contact classes needing styling:**

- `.entry-summary`, `.entry-reading-time`, `.article-links`
- `.entry-body h3` needs intentional spacing to avoid paragraphs colliding with new headings
- `.contact-intro`

Other classes remain usable; do not duplicate the entire stylesheet. Check visual hierarchy, text lengths, small SVG labels, and table readability. Horizontal table scrolling can be confined to the labeled keyboard-focusable wrapper, but don't hide whole-page overflow to counterfeit responsiveness.

Disabled résumé spans must not look like working download buttons on hover. Existing `.button:hover` and `.button:not(:disabled):hover` rules may inadvertently affect a span; explicitly scope actual interactive effects or override unavailable controls. Maintain legible contrast rather than making unavailable text unreadably faint.

The new card markup replaced `.work-row` in Home. Update `theme.js` reveal selectors if card motion is retained; avoid double-animating nested elements. Update test selectors accordingly. Don't remove accessibility assertions just because old DOM selectors changed.

Clean up accidental excessive indentation in new paragraphs; this is cosmetic, not a behavior change.

### P0 — Finish Skills & Lab and global navigation consistency

`lab.html` is still the old page and still has old nav labels. Home already links to `lab.html#skills`.

- Add a real `id="skills"` target and a readable, evidence-grounded skills section.
- Update this page's navigation to the labels used in the other four pages.
- Preserve existing exploratory concepts and separate learning from applied capabilities.
- Do not add empty pages. Keep the filename `lab.html`.

Evidence-supported content:

- **Applied here:** HTML, CSS, JavaScript, semantic markup, responsive layouts, native fetch/FormData and error states, accessible navigation.
- **Documented learning:** C, Java, Python, DSA, OOP/memory concepts, systems architecture, ML fundamentals and local-model integration thinking. Do not frame these as professional-level mastery.
- **Backend direction:** request/response boundaries, HTTP/REST concepts and failure handling; the portfolio's form integration is a browser client, not proof of building a full backend service.
- **AI/local inference:** Ollama integration is documented as a project direction, not a verified working chatbot. No proven model-training expertise.
- **Tools/practice:** Git and the Node/Edge/CDP test harness are demonstrated in this repository.
- No verified database work was established for these featured projects. Do not invent SQL, Postgres, Docker, cloud deployment skills, etc., just to fill categories.

Selected Axion/orion code was inspected, but do not turn a dependency declaration or an external repository's existence into an expertise claim. If you use that evidence for a skill, identify the concrete code and qualify what is actually supported.

Keep skills easy to discuss in an interview, without logo clouds or percentages.

### P1 — Résumé support (file missing)

`assets/resume/` is empty. No PDF was found. Do not fabricate a résumé or make a nonexistent URL clickable.

- Keep visible explanatory non-link/disabled actions in Hero, Contact, and footer until the real file exists.
- Standardize placeholders across all five pages. Currently only Home has `data-resume-slot="hero"` and `data-resume-slot="footer"`; the other edited pages use plain `.resume-unavailable` spans. Lab has not been updated.
- Write a short asset README explaining exactly where to place the real PDF, e.g. `assets/resume/soham-singh-resume.pdf`.
- Make activation straightforward. Suggested approach, **not implemented**: optional dependency-free `tools/prepare-resume.mjs` validates a real `%PDF-` file and updates marked static slots. It should disable/revert them when the file is absent and be idempotent. A simpler documented manual activation is acceptable if reliable. Avoid unnecessary runtime fetching of a nonexistent PDF on every page load.
- Preserve functionality without JS and without the résumé.
- Clearly report the missing asset at final handoff.

### P1 — SEO, social preview, favicon, crawlers

No new SEO implementation has been done yet. Home's head still contains old generic positioning and lacks canonical/social image URLs. Other pages have only title/description. User specified the canonical domain; don't retain `your-domain.com` or invent a new one.

- Unique accurate titles/descriptions for all pages.
- Canonical URLs consistent with Vercel clean URLs: `/`, `/systems`, `/lab`, `/codex`, `/contact` (or otherwise a consistent verified choice).
- Open Graph and Twitter metadata on every page, with absolute preview image URL, name/site identity, appropriate card type, and image alt text/dimensions.
- Update Home Person structured data with truthful current positioning and canonical URL. Do not add graduation year or false job/employer/credential claims.
- Create a professional **real raster social image** (commonly 1200×630 PNG) matching the portfolio identity, plus an editable source if useful. SVG-only social previews aren't broadly supported. No fake project screenshot or employer logos.
- Add a favicon, e.g. original S/S SVG mark, with correct links. Raster fallback is optional if generated honestly.
- Existing crawler file is **`robot.txt`**, not standard **`robots.txt`**. Its content is already correct (allow all + canonical sitemap). Rename or provide `robots.txt` and decide whether the old path needs compatibility. This has not been done yet.
- `sitemap.xml` already lists the five correct canonical clean paths. Validate it; don't manufacture lastmod dates or indexing claims.
- Add no external-verification tokens or analytics by default.

A tiny optional Node prepare/check tool is reasonable for static metadata consistency, but a framework migration/build dependency isn't.

### P1 — Content/evidence polish

- Normalize Arbiter naming across all pages and `PROJECT_EVIDENCE.md`.
- Search all public content for first-year / Year 1 / Y1 / 1st-year; remove outdated present-day biographies. Historical external material cited in the evidence register can be described as historical rather than changing unrelated repositories.
- Recheck that all product cards/studies clearly distinguish design, prototype, implemented, and planned work.
- Do not claim “implemented” product functionality because this portfolio page is implemented.
- Preserve dates and useful technical arguments in Codex. New test/experiment descriptions remain proposed unless actually run against actual product code.
- No valid featured-product source or demo links were established. Keep those actions absent instead of fake placeholders.
- Home does have a real portfolio-source link; distinguish that working implementation from the three product concepts.
- Consider improving presentation of `PROJECT_EVIDENCE.md` download/link if raw Markdown is awkward on the deployed static host; don't copy sensitive data or pretend it's product proof.

### P1 — Responsive and accessibility fixes

Test **all five pages** at the user-requested widths:

- 360 px mobile
- 390 px mobile
- 768 px tablet
- 1024 px laptop
- 1440 px desktop

Retain existing 320/375/760 checks if helpful. Check:

- The longer nav labels, mobile menu breakpoint and keyboard behavior.
- Hero copy, three actions, disabled résumé explanation, and long Projects headline.
- Card stacking, meaningful action labels, diagram labels, tables, article readability, Contact wrapping, and footer density.
- No horizontal page overflow; don't simply apply global overflow hiding.
- Touch targets, visible focus, logical heading hierarchy, informative SVG/image labels.
- Dark and light contrast, disabled text contrast, skip link, no-JS behavior.
- Reduced-motion first load and live change, focused controls during reveals.

Keep the existing full-bleed surfaces, responsive content gutters, and no-JS progressive enhancement.

### P2 — Performance, reliability, security

Audit actual bottlenecks, not imaginary scores:

- Image dimensions/filesize and lazy loading; portrait `profile.webp` is original, with width/height markup and explicit CSS `height:auto; aspect-ratio:4/5; object-fit:cover` already fixing an earlier crop bug.
- Font loading (currently Google Fonts DM Sans + Silkscreen with `display=swap` and preconnects), fallback layouts and possible layout shifts.
- JS/CSS bytes, unused styles from replaced Home blocks, render behavior, network failures, console errors.
- Avoid adding dependencies/frameworks or unnecessary animation libraries.
- Lighthouse or equivalent if available; only report actual runs/scores. The existing CDP harness can provide measured performance/resource evidence but isn't itself a Lighthouse score.
- Scan shipped files for exposed secrets, personal/customer sample data, sensitive endpoints, and unsafe link/DOM handling. The email and Formspree endpoint are intentional public contact configuration, not credentials.
- Check external destinations truthfully; LinkedIn may block automated checks. Report blocks rather than calling the URL broken without evidence.
- Do not execute untrusted external repository code or fetch private credential files merely to fill out the audit.

### P2 — Documentation and final report

Update `README.md` to reflect the actual changes, missing assets, metadata domain, résumé activation, test commands, and local/deployment workflow. Its current SEO section still says canonical metadata must be configured; replace that only after implementing it. The main README is unchanged in this overhaul.

Update `tests/README.md` for new selectors, viewports, assets/metadata checks, and current honest status. It contains stale language saying the font-enabled update hasn't been exercised; it was exercised in the earlier task, but **not for this new overhaul**.

No commits or deployment unless explicitly authorized. The user asked for continuation in the existing repository, not a branch or hosted release.

## 6. Validation state — do not confuse previous results with this work

### Current overhaul

- No integrated browser run, responsive review, Lighthouse run, or full current security/SEO audit has been performed after these edits.
- Scoped static checks by the content agents passed: markup nesting/IDs/ARIA/link fragments, preserved case anchors and SVG geometry, secure external links, Contact hooks, and `git diff --check`.
- Public repository/official-doc fetches described above succeeded. No product tests were run.
- Parent ran `git diff --check` during handover preparation: no whitespace errors; Git emitted LF→CRLF normalization warnings for `index.html`. Do not misreport these as a build failure.

### Earlier baseline, before this new overhaul

The prior animation/full-bleed task passed **281 browser assertions** with Google Fonts loaded. Those results do **not** validate the current markup or new cards/classes. Old `tests/results.json`, screenshots, and logs may still exist and are ignored by Git.

### Existing harness

`tests/smoke.mjs` is a dependency-free finite Node orchestrator. It starts a loopback static server and separate headless Edge profile, uses native WebSocket/CDP, then cleans up. No indefinite terminal server or npm install is needed.

Run from the repository root:

```sh
node --check theme.js
node --check tests/smoke.mjs
node tests/smoke.mjs
```

With approved font network access in Git Bash/POSIX shell:

```sh
ALLOW_FONTS=1 node tests/smoke.mjs
```

PowerShell can set `ALLOW_FONTS` in the environment before the command; see `tests/README.md`. The default mode blocks external page requests. Font opt-in permits only `fonts.googleapis.com` and `fonts.gstatic.com`. **Formspree is always mocked, including native no-JS POSTs.** No real message is sent.

- Existing watchdog: 85 seconds; use a 100-second terminal timeout, or adjust carefully if adding substantially more checks.
- Don't run copies concurrently; they share temporary profile/output directories.
- Screenshots/results/logs under `tests/` are generated/ignored. Read actual timestamps and exit code.
- Outputs: `tests/results.json`, `tests/browser.log`, `tests/screenshots/*.png`.
- Existing widths: 320, 375, 760, 1024, 1440. Add requested 360/390/768.
- Existing tests include real menu/key input, skip links, natural fragments, theme/storage failure, no-JS fallback, mocked form HTTP/network failures, duplicate protection, real 20-second timeout, font evidence, full-bleed shell, motion/reduced-motion, and production-file hashes.
- Headless focus needs `Emulation.setFocusEmulationEnabled`; the existing motion test includes it. Don't weaken focus assertions because a headless page lacks native focus.

**Required harness updates before running:**

- It references Home `.work-row` and related old reveal behavior. That markup was replaced by `.project-card` and its case-study links. Adapt natural-navigation, scroll-reveal, and focus tests to the real new DOM.
- It includes some core selector relevance checks for older Home classes; review what should still be asserted versus obsolete layout selectors.
- Its static server initially recognizes HTML/CSS/JS/WebP only. If you create SVG/PNG/PDF assets, add proper MIME types so tests emulate their real rendering accurately.
- Expand hashed production files if adding assets/tools you want protected during testing.
- Add canonical/social metadata, crawler/sitemap, résumé absent/present behavior, new card links, heading, touch-target, and appropriate accessibility assertions.
- Visual review must inspect screenshots with actual loaded fonts, not just fallback screenshots. Verify font evidence in the report.

This suite is not a full standards validator, screen-reader audit, real-device test, cross-browser certification, product security test, or live delivery test. Report those limitations.

## 7. Local preview and deployment

No build is required. Open `index.html` or serve the directory with an available static server. If Python is installed:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. Python availability was not established; Node is available, and the test harness already serves the files locally during finite validation. File URLs are less representative for theme storage/form testing.

Vercel configuration suggests the existing static deployment route, and the canonical domain is live. No hosting credentials/account configuration were inspected. Preserve `cleanUrls` and verify assets/clean paths rather than inventing deployment details.

Do not push/commit if it may trigger deployment without owner authorization. In final instructions explain how the owner can preview changes and deploy through their existing Vercel/project setup. Do not actually deploy.

## 8. Items the owner must supply or clarify

Do not block the rest of the work on these:

1. Actual résumé PDF.
2. Matching Arbiter source or a private-safe evidence excerpt, screenshots/demo, and real test results if the product is further along than the public evidence.
3. AI Browser Chatbot source and reproducible setup; extension evidence/permissions if context access exists.
4. Smart Home firmware, BOM/hardware design, prototype photos/video, and measured reliability/energy results if available.
5. Real demo URLs for the featured projects if they exist.
6. Any additional verified skills/experience the owner wants listed.

Existing GitHub, LinkedIn, and email are documented; don't claim those are missing. No deployment credential is necessary to finish local work, and none should be placed in the frontend.

## 9. Completion checklist and final response format

The continuation is complete when:

- [ ] Accurate second-year identity throughout; no stale current first-year biography.
- [ ] Recruiter-friendly hero/about/contact and editable internship objective.
- [ ] New cards, evidence panels, article sections, and résumé states actually styled/responsive.
- [ ] Skills & Lab implemented with `#skills`; consistent nav on all pages.
- [ ] Product identity/stages/claim boundaries consistent; no invented source/demo/media/results.
- [ ] Existing four writings preserved, scannable, dated honestly, linked to projects.
- [ ] Résumé missing state works; documented activation validates/links only a real file.
- [ ] Canonicals, titles/descriptions, social metadata/image, favicon, robots.txt, sitemap in place and checked.
- [ ] Requested mobile/tablet/laptop/desktop checks, keyboard/reduced-motion/no-JS/form checks run on current work.
- [ ] Performance/resource/security/link checks performed and limitations recorded.
- [ ] README/test documentation updated; no deployment/commit without authorization.

Owner requested the final report in sections:

**A. Summary** — changes and reasons.

**B. Before/after** — positioning, design, content, project presentation.

**C. Files changed** — important paths and purposes.

**D. Verification** — exact executed commands/checks/results, failures and unverified areas. No fabricated build/Lighthouse scores; static HTML needs no framework build.

**E. Missing assets** — résumé and real product evidence that must be supplied.

**F. Remaining priorities** — ordered, realistic next steps.

**G. Deployment instructions** — preview locally and use the existing host when the owner authorizes publication.

Start by checking Git status and reading this document plus `PROJECT_EVIDENCE.md`, then finish the P0 styling/skills work. Preserve the existing uncommitted progress and do not repeat the generic redesign.
