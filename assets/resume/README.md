# Résumé assets

**Status: no résumé PDF is present.** The site intentionally shows non-clickable
placeholders (Hero, Contact, and footer) instead of a broken download link.

## Add the real résumé

1. Export your résumé as a PDF.
2. Place the file in this directory with this exact name:

   ```text
   assets/resume/soham-singh-resume.pdf
   ```

   The file must be a real PDF (its bytes must begin with `%PDF-`).

3. Activate the links (manual, no tooling required):
   - **Hero** (`index.html`): replace the `<span class="button button-unavailable" data-resume-slot="hero" …>Download résumé</span>`
     with an anchor, and update the `#resume-note` text or remove it:

     ```html
     <a class="button button-primary" data-resume-slot="hero" href="assets/resume/soham-singh-resume.pdf" download>Download résumé</a>
     ```

   - **Footer** (`index.html`, `systems.html`, `lab.html`, `codex.html`, `contact.html`): replace each
     `<span class="resume-unavailable" data-resume-slot="footer" …>Résumé forthcoming</span>`
     with:

     ```html
     <a href="assets/resume/soham-singh-resume.pdf" download>Résumé (PDF)</a>
     ```

4. Reload the local preview and confirm the download works before publishing.

## Rules

- Do not add a résumé link until the PDF actually exists; a dead download looks worse than an honest placeholder.
- Do not commit sensitive personal data you are not ready to make public. This directory is deployed as a static site.
- Keep the `data-resume-slot` attributes so placeholders stay greppable and consistent.
