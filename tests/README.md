# Portfolio smoke harness

Dependency-free automated validation using Node 24+, Microsoft Edge headless, native WebSocket/CDP and a temporary loopback static server. All output stays under `tests/`; production files are only read and hashed before/after testing.

## Commands

From the repository root, with no external network access needed:

```sh
node tests/smoke.mjs
```

After obtaining network approval, opt into Google Fonts only (Git Bash/POSIX shell):

```sh
ALLOW_FONTS=1 node tests/smoke.mjs
```

PowerShell equivalent:

```powershell
$env:ALLOW_FONTS = '1'
node tests/smoke.mjs
Remove-Item Env:ALLOW_FONTS
```

Only the exact value `1` enables font networking. Unset `ALLOW_FONTS` for the default offline mode. Override `EDGE_PATH` if Edge is not installed at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. No npm install is needed.

**Validation status:** the overhaul harness was exercised on 2026-10-15 in both
modes — offline (`346 passed, 0 failed`) and font-enabled
(`378 passed, 0 failed`). Rerun after production changes and consult the
resulting timestamps, checks, font observations and exit code. Existing
screenshots/results belong to the most recent run.

## Network policy and font evidence

Every page request is intercepted before the first navigation:

- Local requests to the test server are continued.
- **Formspree is always mocked**, including no-JS native submission; no real message is sent in either mode.
- By default, all other remote page requests are denied, including Google Fonts. Screenshots normally use fallback fonts.
- With `ALLOW_FONTS=1`, only HTTPS requests to the exact hostnames **`fonts.googleapis.com`** and **`fonts.gstatic.com`** are additionally continued. Other hosts, subdomains, non-HTTPS schemes, credentials and non-default ports are denied. Redirect destinations are intercepted and checked as well.
- The font opt-in allows network access; it does not guarantee successful loading. Google receives the permitted font requests and ordinary browser request metadata.

`tests/results.json` records:

- `fonts.allowed`, the shared wait budget and time spent waiting.
- `allowedFontRequests` and `blockedExternal` URLs.
- `fonts.observations` for navigations, primary page checks and each screenshot.
- For **Silkscreen** and **DM Sans**, the actual `document.fonts.check('16px "family"', sampleText)` result, matching `FontFace` entries with weight/status, and a `loaded`/`fallback` classification.
- A family is classified as loaded only when `document.fonts.check` succeeds **and** a matching declared face has loaded. This avoids treating an undeclared family as loaded merely because `check()` permits fallback.
- With fonts enabled, both families must load for primary page checks and screenshot checks to pass. Offline runs record the observations without requiring remote fonts.
- Per-observation wait timeouts and a summary of how many screenshots had both requested families loaded. Mixed or fallback typography is not reported as successful font loading.

Font waiting is bounded to 4 seconds per settling point and 20 seconds cumulatively. On exhaustion, outstanding page loading is stopped, statuses are recorded and tests continue where possible. Font-enabled runs reuse the browser's HTTP cache across navigations; local test assets remain `no-store`. A blocked parser or other page readiness failure can still terminate the run as an infrastructure error.

## Runtime and write scope

The browser/test phase has an **85-second watchdog**, including the real 20-second form timeout; browser closure and temporary-profile cleanup follow in `finally`. Allow **100 seconds** for a terminal invocation to leave cleanup headroom. A deadline hit fails the run. Ordinary runs should finish substantially sooner.

The harness starts and stops its own loopback server and separate Edge profile; it does not leave an indefinite server running. Do not run concurrent copies because they share the profile/output locations.

Generated outputs are ignored by `tests/.gitignore`:

- `tests/results.json`: machine-readable assertions, font/network evidence and timestamps.
- `tests/browser.log`: browser process output.
- `tests/screenshots/`: full-page PNGs.
- `tests/.tmp/`: temporary browser profile, removed during cleanup when possible.

Exit code `0` means all executed assertions passed; `1` means assertion failures or a harness error. Production-file hash comparisons are included in the report. The source scanner is conservative, not a complete standards validator.

## Coverage

All five pages: `index.html`, `systems.html`, `lab.html`, `codex.html`, `contact.html`.

- Document/doctype/tag balance, charset, exact viewport and malformed/stray markup.
- Duplicate IDs, ARIA/label references, current primary navigation, document-head assets and visible content/images.
- Per-page canonical URL, favicon link, Open Graph / Twitter social metadata and 1200×630 raster social image, standardized footer résumé placeholder, and absence of a link to the missing résumé PDF.
- Content scaffolding: three Home project cards, the Lab `#skills` target and nav labels, Systems case-study anchors/classes, four Codex entry summaries, normalized Arbiter naming, no stale first-year biography, `robots.txt` sitemap, and sitemap clean paths.
- Local asset/internal link/fragment resolution and dummy links.
- Single `h1` with no skipped heading levels, and 24 px minimum height for primary navigation/action controls at 375 px.
- Horizontal overflow and responsive navigation at **320, 360, 375, 390, 760, 768, 1024 and 1440 CSS pixels**.
- Real mouse/key input: mobile menu, Tab navigation, Escape/focus restoration, Enter activation and outside click.
- Skip-link order/focus and natural cross-page/journal fragment navigation.
- Browser-parsed stylesheet selector relevance and home portrait's intended 4:5 crop.
- Default dark theme, light toggle/accessible label, persistence across navigation/reload and simulated inaccessible storage.
- Form native validity, mocked HTTP success/reset/persistent live status, HTTP failure and network failure with retained values, pending/duplicate prevention and actual unaccelerated 20-second abort.
- JavaScript disabled: page/navigation visibility and actual intercepted native contact POST.
- Uncaught page JavaScript errors, console errors and production-file integrity.

## Screenshot paths

Full-page PNGs use device scale factor 1 and widths 1440/375. Viewport heights are 1000 desktop and 812 mobile. Images are scrolled into view and loaded before capture. Consult the corresponding `screenshot ...` font observation before judging typography.

| Page | Desktop | Mobile |
| --- | --- | --- |
| Home | `tests/screenshots/index-1440.png` | `tests/screenshots/index-375.png` |
| Systems | `tests/screenshots/systems-1440.png` | `tests/screenshots/systems-375.png` |
| Lab | `tests/screenshots/lab-1440.png` | `tests/screenshots/lab-375.png` |
| Codex | `tests/screenshots/codex-1440.png` | `tests/screenshots/codex-375.png` |
| Contact | `tests/screenshots/contact-1440.png` | `tests/screenshots/contact-375.png` |

Additional: `tests/screenshots/contact-light-1440.png`.

## Limitations

- CDP interception covers page traffic, not an OS-level network firewall. Edge flags suppress background networking but do not prove zero browser background traffic.
- Real Formspree delivery, external destination availability, hosted deployment/caching/headers and Vercel behavior are not tested.
- Font checks cover the recorded sample at normal weight 400 and matching face statuses, not every glyph, weight or platform's rasterization. A permitted request alone is not loading evidence.
- Edge viewport/mobile emulation is not real iOS/Android or cross-browser coverage. Screen-reader usability and full WCAG compliance are not certified.
- Expected denied-font logs in offline mode and the deliberate simulated form connection failure remain in `networkErrors`. Font failures in enabled mode must be reviewed rather than dismissed as intentional blocks.
