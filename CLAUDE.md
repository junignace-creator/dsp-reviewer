# DSP Problem Drill — project notes for Claude

Static site (no build step, no dependencies). A problem-focused DSP reviewer for Lec 1–4, styled like the user's
*DigiComm Exam Drill* artifact (same tokens, fonts, cards, `.math-block` fractions, reveal-answer pattern).
The user chats with Claude about this repo to add problems, fix answers, and drill topics.

## Conventions
- Content lives in `data/*.js` as `PROBLEMS.push({id, lec, kind, title, q, a})`.
  - `id`: `L<lec>-NN` for solve problems, `DS-NN` for design. `lec` is `'L1'..'L4'`; `kind` is `'solve'|'design'`.
  - Keep problems ordered by `lec` inside each file (the list view prints a lecture heading when `lec` changes).
  - `q`/`a` are HTML strings. Helpers (in `lib.js`): `steps([...])`, `tbl(head, rows, hlCol)`, `mb()` (math block),
    `frac(n,d)`, `rt(x)`, `note()`, `warn()`, and figures `stemFig`, `pzFig`, `df1Fig`, `df2Fig`.
  - Use `−` (U+2212) for minus in prose and unicode sub/superscripts or `<sub>/<sup>`. No `${`-style leftovers.
- **Every numeric claim must be backed by a check in `verify.js`** (run `node verify.js`; it must print "all N checks passed").
  Add a `check(...)` or a simulation when adding a problem. Don't hand-wave numbers.
- Design problems follow: spec → design → verify → trade-offs. Keep answers in numbered steps.
- Styling: copy tokens from `index.html` `:root`; dark mode via `prefers-color-scheme` and `[data-theme]`. Mobile-first (16 px gutters).
- Progress is in `localStorage` key `dsp-reviewer-state-v1` — don't rename it without migrating.
- Preview: `node serve.js` → http://localhost:8123 (the file:// scheme can't load relative scripts in some previewers).

- Concepts live in `data/concepts.js` (`CONCEPTS = [{label, sections:[{h, html}]}]`). Helpers: `qa(question, answer)` (collapsible self-check), `use([ids])` (links to problems), `callout(tag, html)`. Every tiny example must have a `check()` in `verify.js`.
- The formula sheet runs `mathify()` (app.js) over each equation: single-letter variables and lowercase Greek are italicized (e, j, d, π stay upright). Don't hand-italicize in `data/reference.js`.

## Source material
Lectures are at `C:\Users\johni\OneDrive\Documents\DSP\` (Lec1…Lec4 PDFs; **not** committed — instructor's material).
Extract text with `pdftotext -layout` (poppler is installed under Git Bash; Python isn't).

Slide problems used directly (answers re-derived and verified): L1 aliasing (3cos100πt), 10 kHz sampling, three-tone signal,
periodicity, quantizer (6.35cos(πn/10)); L2 fold/delay example, signal sketches, system classification trio, convolution
examples 2a/2b, geometric convolution, correlation demo (x={2,0,1,3,2}, h={1,0,1,1,2}), radar Barker-13;
L3 first-order LCCDE, FIR realization (practice 2), DF-I/II (practice 1); L4 ROC/inverse-Z examples
(1/(1−1.5z⁻¹+0.5z⁻²) with ROC |z|>1 and |z|<0.5), complex-pole example (1+z⁻¹)/(1−z⁻¹+0.5z⁻²), one-sided ZIR (0.9, −0.81), oscillator.

Deliberately **replaced with original problems** because the slide figure/text could not be recovered reliably:
Lec2 block-diagram "find y(n)" problems, Lec3 practice 3–5 (diagrams), Lec4 sample 2 (diagram).
Assumptions to remember: π symbols are missing from the text layer of some Lec1 slides (L1-04 assumes cos(0.01πn),
cos(πn/8)cos(πn/3)); the Lec2 fold/delay example uses x(n)=1+n/3 on −3…−1; Lec 3 sample "y(n)−0.5y(n−1)=x(n)" initial
condition was cut off, so the drill uses y(−1)=1. The slide's oscillator part 2 (y(−1)=0, y(−2)=−1) does not reproduce a
cosine exactly; DS-08 derives the correct preloads.

## Ideas for next sessions
- Lecture 5+ (DTFT / frequency response, filter design) as new `data/l5.js` + update `app.js` lecture lists (`LEC_NAMES`, filter chips, drill checkboxes).
- A "timed mock exam" mode (pick N problems across lectures, one countdown).
- Block-diagram problems with the slide figures once the original images are available.
