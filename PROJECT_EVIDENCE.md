# Project evidence register

Review date: 2026-10-17. Scope: `index.html`, `systems.html`, and this register. No product repository code was installed or executed for this update. Public repository access was read-only (GitHub API/raw and official documentation) during an earlier audit; this update reuses those findings and the owner-supplied project summaries. No commits were made as part of the documentation change.

## Claim boundaries

- User-supplied source of truth: Soham Singh is a **second-year B.Tech IT student at NSEC, Garia, Kolkata**. **Foretyx is the venture; Arbiter is its proposed AI security/governance and privacy-gateway product.** These are owner-provided facts, not independently verified credentials or a public product release.
- The local repository is a static portfolio, not the source for any of these projects. Portfolio prose and SVGs establish documented intent, not running software.
- **Foretyx / Arbiter:** design documented; no matching public product source or runtime demonstration was established. It is presented as a venture-stage design.
- **Axion:** a public, self-hosted research prototype (<https://github.com/Som007-builds/Axion>). The end-to-end loop runs on a real corpus, but relationship verdicts and confidence are LLM-assisted heuristics and the evaluation set is limited. It is not a production service.
- **Orion:** a public, air-gapped supervisory analytics build (<https://github.com/Som007-builds/orion>), built for Smart India Hackathon 2026 (problem statement 26157). Test-suite and benchmark figures shown on the page are **project-reported** and were not independently reproduced.
- **Indigent:** a public, local-first agentic workbench (<https://github.com/Som007-builds/indigent-dev>), built for Smart India Hackathon 2026 (problem statement 26117). The control plane, policy enforcement, sandbox, audit, and local retrieval are implemented; some capabilities remain staged.
- No production, compliance, perfect-detection, verified air-gap certification, or measured-benchmark claim is made for any project. Case-study diagrams are architecture illustrations, not certified runtime diagrams.

## Scope change from the previous register

The owner asked to feature three real projects and remove the **AI Browser Chatbot** and **Smart Home Automation** case studies. This register supersedes the earlier 2026-10-15 version:

- Added case studies and anchors: `#axion`, `#orion`, `#indigent`.
- Retained case study and anchor: `#foretyx` (presented as the venture flagship).
- Removed case studies and anchors: `#browser-chatbot`, `#home-automation`.
- `codex.html` related-case links were repointed to `#orion` and `#indigent` because their previous targets no longer exist.

## Featured projects

| Anchor | Project | Public source | Honest status |
| --- | --- | --- | --- |
| `#foretyx` | Foretyx / Arbiter | None established | Venture-stage design; implementation not verified |
| `#axion` | Axion | <https://github.com/Som007-builds/Axion> | Working research prototype; evaluation limited |
| `#orion` | Orion | <https://github.com/Som007-builds/orion> | SIH 2026 build; project-reported validation |
| `#indigent` | Indigent | <https://github.com/Som007-builds/indigent-dev> | SIH 2026 build; core implemented, edges staged |

## Public repository discovery

The earlier audit listed the public repositories under `Som007-builds`, including `Axion`, `orion`, and `indigent-dev`. Commit-level inspection was performed on 2026-10-15 against the then-current default branches; this register does not pin current commit SHAs, and repository contents may have changed since.

### Axion

Repository: <https://github.com/Som007-builds/Axion>

- Inspected statically, not run. The README describes paper ingestion, atomic claims, contradictions, research gaps, and a Next.js / FastAPI graph interface.
- The model layer routes across hosted providers; a local backend URL does not imply local model inference.
- Relationship/critique verdicts are model-generated hypotheses; confidence is a heuristic score. Reported statistics and setup claims were not adopted as verified facts.

### orion

Repository: <https://github.com/Som007-builds/orion>

- Inspected statically, not run. The README describes batch SOC supervisory analytics: operational records, rules/ML findings, evidence cards, review packs, and exports.
- The inspected source includes entity-scoped pseudonymisation and note redaction applied during SOC ingestion.
- README test counts, throughput, air-gap, signing, and ledger claims were not independently reproduced. Any figures on the page are labeled project-reported.

### indigent-dev

Repository: <https://github.com/Som007-builds/indigent-dev>

- Local-first design: a same-origin frontend proxy, a FastAPI control plane with a bounded task state machine, a deterministic policy validator, a network-disabled Docker sandbox, loopback Ollama and Qdrant, and an append-only audit.
- Described as implemented at the control-plane level with staged capabilities; the default composition is described as reporting empty state rather than fabricating answers.

## Failures, limitations, and handling

- No product repository code was executed for this update; findings are static and owner-supplied.
- No benchmark or product test was run here. Figures attributed to a project are presented as reported, not as portfolio-verified measurements.
- No `.env`, credential, key, database, or unrelated configuration contents were fetched. No discovered endpoint was exercised.
- This is targeted documentation review, not a security audit, exhaustive code search, or proof of absence.
- No source/demo buttons were added for Foretyx / Arbiter, which has no established public source. The three real projects link to their own GitHub repositories.

## Page contract and handoff

- Featured section anchors in `systems.html`: `#foretyx`, `#axion`, `#orion`, `#indigent`.
- Retained SVG IDs: `foretyx-diagram-title`, `foretyx-diagram-desc`. New SVG IDs: `axion-diagram-title`, `axion-diagram-desc`, `orion-diagram-title`, `orion-diagram-desc`, `indigent-diagram-title`, `indigent-diagram-desc`. Matching `card-*` diagram IDs are used on `index.html`.
- Shared class contract retained: `.project-case`, `.case-heading`, `.case-layout`, `.case-copy`, `.case-art`, `.case-notes`, `.project-tags`, `.text-link`, `.muted`, `.eyebrow`, `.case-index`, `.case-summary`, `.status-note`, `.evidence-list`, `.case-details`, `.tradeoff-list`, `.table-scroll`, `.case-status`.
- The `.project-grid` was set to two columns so four cards form a balanced 2×2 layout. `.project-card--featured` marks the Foretyx / Arbiter venture card.

## Validation

The repository smoke harness (`tests/smoke.mjs`) is the authoritative check: HTML nesting, unique IDs, ARIA references, local link/fragment resolution, the four project cards, the four case anchors, metadata, motion behavior, and production-file stability. External project links are not network-tested.
