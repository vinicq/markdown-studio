# Markdown Studio

Static application in HTML, CSS, and JavaScript. Converts Markdown to HTML, editable DOCX, and PDF via browser printing. No backend, conversion API, API keys, or dependency installation required.

## Usage

Open `index.html` in a modern browser. For more predictable persistence and to run via HTTP, execute the following in the project folder:

```sh
python -m http.server 8080
```

Access http://localhost:8080. On Windows, if necessary, use `py -m http.server 8080`.

To host on GitHub Pages, place the files from this package in the root of the repository, including `index.html` and `.nojekyll`. All scripts and themes are included locally. URL-based images depend on the internet; DOCX export also depends on the image server's CORS permissions.

## Features

- Markdown editor with live preview in an isolated iframe.
- 140 built-in CSS themes, numbered continuously in the picker.
- Multi-language interface (Portuguese and English) with a quick toggle button.
- Theme filter by category (light, dark, paper, serif, high contrast), derived from measuring each theme's CSS in a real browser.
- Local persistence of text, additional CSS, selected theme, file name, and page settings. No synchronization between devices. Clearing site data erases local data.
- Additional CSS editor, applied after the selected theme.
- A4/Letter formats, with margins of 15/20/25 mm.
- Open and download Markdown, export to HTML and DOCX, print to PDF.
- 18 document templates available for quick loading.
- Markdown support beyond CommonMark/GFM: footnotes, heading IDs (auto-slug and `{#custom-id}`), definition lists, `==highlight==`, `^superscript^`, `~subscript~` and `:emoji:` shortcodes.

## Exports

**HTML:** Standalone file with embedded CSS. URL-based images remain external. Input HTML is sanitized by DOMPurify; scripts, forms, and inline HTML styles are not executed.

**PDF:** Click Export with PDF selected and choose "Save as PDF" in the browser dialog. Enable background graphics and disable browser headers/footers. Pagination and fonts depend on the browser and installed fonts. The preview is continuous, not an exact simulation of physical pages.

**DOCX:** Uses the docx library to produce native OOXML, without altChunk and without renaming HTML to `.docx`. Headings, lists, tables, links, code, images, and basic formatting are editable. Colors, fonts, and sizes are obtained from the computed styles of the preview. Full CSS, pseudo-elements, layout, animations, page backgrounds, and print media features do not have full equivalence in Word. Dark themes are adapted to a white page to maintain readability. Remote images without CORS, relative images, or unavailable images are replaced with alt text, with a warning.

## Adding Themes

To distribute a new theme as part of the site, place the CSS file in `themes/` and execute with Node.js:

```sh
node generate_theme_manifest.js
node scripts/classify-themes.mjs
```

The first command scans the folder, derives a readable name from each file name, and updates `themes/manifest.json`. Files whose CSS is identical to a theme already bundled in `themes.js` are skipped, so the same theme is not listed twice. The application fetches this manifest dynamically on load.

The second command assigns each theme a category (light or dark, plus paper, serif and high contrast). It renders every theme in headless Chrome and reads the computed background, text color and font, because reading the CSS with a regular expression gets it wrong: themes that set colors through CSS variables or `@media` blocks report the wrong background, and dark themes such as Dracula and Tokyo Night were classified as light that way. It needs Chrome installed, and honors `CHROME_PATH`. Re-running `generate_theme_manifest.js` preserves the categories already recorded.

The CSS must be self-contained: remote `@import` and remote fonts are blocked by the document's policy. Use local fonts or data URLs. Relative references to images are not automatically embedded.

The selectors `body`, HTML elements, `.markdown-body`, and `.md-juice` are supported. Additional CSS can override a theme without modifying the original file. The iframe prevents the theme from altering the application controls.

## Structure

```text
index.html                  Interface
app.css                     Application style
app.js                      Editor, preview, files, i18n, and persistence
markdown-extensions.js      marked extensions: footnotes, heading IDs, definition lists, highlight, sub/superscript, emoji
docx-export.js              Semantic conversion to Word
generate_theme_manifest.js  Node script to generate manifest.json
scripts/classify-themes.mjs Node script that measures each theme in Chrome and records its category
themes.js                   Loads built-in themes and manifest
themes/                     Folder containing all CSS themes and manifest.json
templates.js                Built-in Markdown templates
vendor/                     Libraries and licenses
```

## Verification

JavaScript scripts undergo syntax verification. The Word export has a structural integration test with lists, tables, code, and links. The interface, printing, and visual differences between themes must be checked in the target browser; the authoring environment does not offer a browser preview for this static modality.
