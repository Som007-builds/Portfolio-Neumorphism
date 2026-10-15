# Project evidence register

Review date: 2026-10-15. Scope: `systems.html` and this register only. No commits; no external repository code installed or executed. Public access was read-only (GitHub API/raw and official Ollama documentation). Local Git status was clean before edits.

## Claim boundaries

- User-supplied source of truth: Soham Singh is a **second-year B.Tech IT student at NSEC, Garia, Kolkata**. **Foretyx is the venture; Arbiter is its proposed AI security/governance and privacy-gateway product.** These are owner-provided facts, not independently verified credentials or a public product release.
- The local repository is a static portfolio, not the source for these three products. Existing portfolio prose and SVGs establish documented intent, not working software/hardware.
- **Foretyx / Arbiter:** design documented; matching product implementation not independently verified.
- **AI Browser Chatbot:** **Design documented; implementation not independently verified.** No working browser extension is established by the reviewed evidence.
- **Smart Home Automation:** concept; no verified hardware build, firmware, PCB, photos, BOM, or measurements.
- “Documentation available” in the page's maturity table refers only to the portfolio case-study document. It does not mean the gateway is implemented. All three retained SVGs are explicitly proposed architectures, not verified runtime diagrams.
- No production, compliance, perfect-detection, measured savings/latency, or verified sub-₹10,000 build claim is made. Acceptance criteria are future checks, not test results.

## Local material reviewed

| File / reference | What it establishes | What it does not establish |
| --- | --- | --- |
| `systems.html` (read before modification) | Three named concepts and original conceptual SVGs | Product source, build history, working demo, or benchmarks |
| `codex.html#privacy-first` | Privacy-gateway motivation / early feasibility writing | Arbiter implementation or detection quality |
| `codex.html#policy-architecture` | Proposed policy-aware boundary and policy-update failure concerns | Deployed policy engine or control plane |
| `codex.html#local-models` | Local-model tradeoffs and intended browser-chatbot flow | Verified UI, extension, or Ollama integration |
| `lab.html#ideas` (Industrial Automation Expansion entry) | Related exploratory writing; different industrial safety requirements | Home prototype or industrial deployment |
| `tests/README.md`, `tests/smoke.mjs` lines 1–100 | Existing harness and its output/write scope | A current test pass; historical result files were not treated as validation |
| Root directory listing and initial `git status --short` | Portfolio files; initially clean tracked worktree | Any private/unpublished project source |

The four writing links above resolve to existing local IDs. They are writing, not source repositories or demos. No fictional demo/source URLs or placeholder media were added.

## Public repository discovery

Independently fetched successfully:

- [Public repository list](https://api.github.com/users/Som007-builds/repos?per_page=100&sort=updated)
- Returned names: `Portfolio-Neumorphism`, `orion`, `indigent-dev`, `personal`, `Axion`, `scam-shield-final`, `image-redactor`, `NoZero`.

No repository named Foretyx or Arbiter appeared in this response. This is not proof that private, differently named, unpublished, or historical implementations do not exist. Only the two likely candidates below received README/tree/code inspection; the other six projects were not audited. No unrelated project was relabeled as one of the three case studies.

### Axion

Repository: <https://github.com/Som007-builds/Axion>

Observed `main` commit: [`0726da995ac7024b0a65566fdd128b78940c9518`](https://github.com/Som007-builds/Axion/commit/0726da995ac7024b0a65566fdd128b78940c9518).

Discovery endpoints (all successful):

- <https://api.github.com/repos/Som007-builds/Axion>
- <https://api.github.com/repos/Som007-builds/Axion/git/ref/heads/main>
- <https://api.github.com/repos/Som007-builds/Axion/git/trees/main?recursive=1> — complete response, `truncated: false`.

Content inspected:

| Exact pinned file | Blob SHA | Observation |
| --- | --- | --- |
| [README.md](https://github.com/Som007-builds/Axion/blob/0726da995ac7024b0a65566fdd128b78940c9518/README.md) | `8a82d96c49cb7a0ff5eefe272cdf9107ee5bdb61` | Describes scientific-paper ingestion, claims, contradictions, research gaps, and a Next.js/FastAPI graph-research interface. Describes hosted Claude/Groq/Gemini providers. Not the documented Ollama browser chatbot. |
| [llm.py](https://github.com/Som007-builds/Axion/blob/0726da995ac7024b0a65566fdd128b78940c9518/llm.py) | `fab719d101b9cdbb37cd1ac3bd90aaaa355397de` | Actual functions call Groq, Gemini, and Anthropic SDKs with provider routing/retries. The inspected router is not a local Ollama implementation or privacy-gateway policy/redaction path. |
| [axion/lib/api-client.ts](https://github.com/Som007-builds/Axion/blob/0726da995ac7024b0a65566fdd128b78940c9518/axion/lib/api-client.ts) | `6ef101f0893752751d8149c4de96b04ca58e2fb5` | Browser client targets the research FastAPI backend, defaulting to localhost:8000; includes `/api/query`, graph, claims, and ingestion endpoints. A local backend URL does not establish local model inference. |

Fetch locations: README was first read at <https://raw.githubusercontent.com/Som007-builds/Axion/main/README.md>, then its bytes were verified at <https://raw.githubusercontent.com/Som007-builds/Axion/0726da995ac7024b0a65566fdd128b78940c9518/README.md> against the tree's Git blob SHA. Code was read at the same pinned raw base, with paths `llm.py` and `axion/lib/api-client.ts`.

Status: source inspected statically, not run. README statistics/test counts, setup instructions, older academic-year biography, and deployment claims were not adopted as verified facts. The stale first-year README biography does not override the user's second-year source of truth. No evidence in the inspected material establishes Axion as Foretyx/Arbiter or the requested browser chatbot.

### orion

Repository: <https://github.com/Som007-builds/orion>

Observed `main` commit: [`d6500c281b6c8a1eeecd97baa099a1bb65832d1c`](https://github.com/Som007-builds/orion/commit/d6500c281b6c8a1eeecd97baa099a1bb65832d1c).

Discovery endpoints (all successful):

- <https://api.github.com/repos/Som007-builds/orion>
- <https://api.github.com/repos/Som007-builds/orion/git/ref/heads/main>
- <https://api.github.com/repos/Som007-builds/orion/git/trees/main?recursive=1> — complete response, `truncated: false`.

Content inspected:

| Exact pinned file | Blob SHA | Observation |
| --- | --- | --- |
| [README.md](https://github.com/Som007-builds/orion/blob/d6500c281b6c8a1eeecd97baa099a1bb65832d1c/README.md) | `845c9238b826c82357c47dd3c24553a4523ca494` | Describes batch SOC supervisory analytics: operational records, rules/ML findings, evidence cards, review packs, and exports. This is a different problem from an inline model-request privacy gateway. |
| [backend/app/services/pseudonymisation.py](https://github.com/Som007-builds/orion/blob/d6500c281b6c8a1eeecd97baa099a1bb65832d1c/backend/app/services/pseudonymisation.py) | `fe9e0e23a1fb27e17f4bd77cb3e7bdaf5fcfc172` | Actual code contains entity-scoped HMAC pseudonyms and pattern-based note redaction, in the context of SOC ingestion. Code/comments alone do not verify full storage/security behavior, effectiveness, or runtime integration. Similar privacy primitives do not establish an Arbiter relationship. |
| [backend/app/api/v1/router.py](https://github.com/Som007-builds/orion/blob/d6500c281b6c8a1eeecd97baa099a1bb65832d1c/backend/app/api/v1/router.py) | `4bbf981f89dadded9bf7313cc280c43a1869247e` | Registers entities, submissions, ingestion, runs, findings, review packs, trends, policy, exports, packs, and ledger routes. Not evidence of a model proxy or Ollama chatbot. Route registration does not itself prove a working service. |

Fetch locations: README was first read at <https://raw.githubusercontent.com/Som007-builds/orion/main/README.md>, then verified at <https://raw.githubusercontent.com/Som007-builds/orion/d6500c281b6c8a1eeecd97baa099a1bb65832d1c/README.md> against the tree's Git blob SHA. Code was read at the same pinned raw base, with paths `backend/app/services/pseudonymisation.py` and `backend/app/api/v1/router.py`.

Status: source inspected statically, not run. README test counts, throughput, air-gap, signing, and ledger claims were not independently reproduced and were not transferred into these case studies. No evidence in the inspected material establishes Orion as Foretyx/Arbiter or the requested browser chatbot.

## Official setup references

Both pages fetched successfully:

- <https://docs.ollama.com/quickstart> — installation and local/cloud model distinction.
- <https://docs.ollama.com/api> — API base URLs; documents local `http://localhost:11434/api` and hosted access separately.

These support a **generic proposed integration checklist**, not instructions for a verified personal repository. No clone/install/run commands for the chatbot were invented. Model variants remain candidates; no particular variant, hardware performance, or extension permission configuration has been verified.

A loopback Ollama server can also access cloud models. The case study therefore requires an explicitly downloaded local model and separate browser/runtime network inspection before an offline claim. External pages, downloads, providers, UI assets, fonts, or telemetry can still cross the network. This portfolio currently requests Google Fonts; it is not the chatbot application.

## Failures, limitations, and handling

- External fetch failures: **none observed** for the listed API/raw/documentation requests. Both pinned README blob checks matched their trees.
- Initial unbounded `read_file` of `systems.html` returned a successful outline because of file size; the complete file was then read in bounded ranges before editing. This was not a missing-file failure.
- Terminal reported that a Windows/WSL OS sandbox could not be created; commands ran under the host shell. Only local Git reads, read-only HTTP/byte hashing, and read-only static validation were used. No fetched project code was executed.
- No `.env`, credential, key, database, or unrelated configuration contents were fetched. Tree path metadata was visible. Source can contain credential-related identifiers; no values were copied into this register or the portfolio, and no discovered endpoints were exercised.
- This was targeted discovery, not exhaustive code search, history analysis, a security audit, or proof of absence. Full default-branch trees and the six selected content files narrow identity claims without establishing all repository behavior.
- No corresponding Foretyx/Arbiter source, browser-chatbot implementation, extension manifest, home firmware/build evidence, or working product demo was established. No speculative product source/demo buttons were added.
- No benchmark or product test was executed. The future synthetic gateway checks (allow/deny, malformed identity/input, stale policy, filter failure, model timeout, required-audit failure, no-payload audit records), browser checks, and low-voltage hardware checks are acceptance targets only.

## Page contract and handoff

Only `systems.html` and this new root document are owned by this change. Other files remain parent-owned. The SVG geometry is retained; wording/captions clarify proposal status and replace loose anonymization language with redaction/pseudonymization. No standalone diagram artifacts or fabricated media were generated.

Preserved section anchors: `#foretyx`, `#browser-chatbot`, `#home-automation`.

Preserved SVG IDs: `foretyx-diagram-title`, `foretyx-diagram-desc`, `browser-diagram-title`, `browser-diagram-desc`, `home-diagram-title`, `home-diagram-desc`. Existing section-heading IDs also remain.

Existing shared class contract retained: `.project-case`, `.case-heading`, `.case-layout`, `.case-copy`, `.case-art`, `.case-notes`, `.project-tags`, `.text-link`, `.muted`, `.eyebrow`. Existing `.meta-list` and `.button` styles were not changed; no new uses were needed.

New class uses for parent styling:

- `.case-index` — case-study navigation.
- `.case-summary` — lead paragraph in each case.
- `.status-note` — visible status paragraph in each case.
- `.evidence-list` — evidence panel `ul`.
- `.case-details` — native expandable `details` sections.
- `.tradeoff-list` — decision/tradeoff `dl`.
- `.table-scroll` — labeled, keyboard-focusable table wrapper.
- `.case-status` — semantic maturity table with caption and scoped headers.
- `.resume-unavailable` — footer span: `aria-label="Résumé not available yet"`, visible text “Résumé forthcoming”; no fake link.

Primary navigation routes remain unchanged; labels are Home, Projects, Skills & Lab, Codex, Contact. Only an accurate title/description was changed in the head; global SEO remains parent-owned.

## Validation

Read-only Node assertions **passed** for HTML nesting, unique IDs, ARIA references, all local links/fragments, the required case/SVG anchors, exact preservation of every original SVG `rect`/`path`, three evidence/status/summary panels, and the maturity-table/resume-span presence. `git diff --check -- systems.html PROJECT_EVIDENCE.md` also passed. An initial static run caught a stray `</h3>` after the new lifecycle `<ol>`; it was corrected and the full assertion run passed afterward.

Only these two task-owned files were edited by this work. Later Git status also showed concurrent parent-owned changes to `codex.html` and `contact.html`; those were left untouched. The existing browser smoke harness writes reports/screenshots/logs under parent-owned `tests/`, so it was not run by that scoped edit. A later integrated overhaul did run the full harness across all five pages in offline and font-enabled modes (see `tests/results.json`); that validates the portfolio markup, metadata, and interactions, not the product concepts. No product runtime or benchmark validation is implied by the static portfolio checks.
