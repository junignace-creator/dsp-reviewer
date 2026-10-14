# DSP Problem Drill

A problem-focused reviewer for the first four DSP lectures, styled after the *DigiComm Exam Drill*.

| Lecture | Topics |
|---|---|
| Lec 1 | Signals, sampling, aliasing, A/D conversion, quantization, SQNR |
| Lec 2 | DT signals and operations, system classification, DT-LTI, convolution, correlation |
| Lec 3 | LCCDE (direct method), ZIR/ZSR, Direct Form I/II, FIR/IIR realizations |
| Lec 4 | Z-transform, ROC, properties, inverse Z, H(z), pole-zero, one-sided Z |

## What's inside

- **Concepts** — start here if DSP is new: plain-language explanation of every idea and property per lecture, a tiny hand-checkable example each, self-check questions, and links to the matching problems.
- **Sample Problems** (40) — worked solutions in steps, with plots/diagrams. Self-grade each with *Got it* / *Missed*.
- **Design Problems** (9) — spec → pole/zero placement or sizing → coefficients → verification (ADC sizing, equalizer, radar, smoother, echo, moving-average notch, oscillator, notch filter).
- **Drill** — random problem from a pool you pick (lectures, solve/design, unsolved / missed only) with a timer.
- **Recipes** — step-by-step procedures (aliasing, system classification, convolution, LCCDE, DF-I/II, inverse Z tree, notch design…).
- **Formula Sheet** and **Cheat List** — traps, numbers to know cold, and your own missed problems.

Progress is stored in `localStorage` on the device (`dsp-reviewer-state-v1`).

## Run it

Open `index.html` directly, or serve it:

```bash
node serve.js        # http://localhost:8123
```

To publish with GitHub Pages: repo **Settings → Pages → Deploy from a branch → `main` / root**.

## Verify the math

Every closed-form answer is machine-checked against simulation:

```bash
node verify.js       # should print: all NN checks passed
```

## Layout

```
index.html        page shell + CSS (design tokens copied from the DigiComm drill)
app.js            tabs, problem cards, grading, filters, drill, cheat list
inline.js         auto-formats inline math in prose (math font, italic variables)
lib.js            math helpers + SVG generators (stem plots, pole-zero plots, DF-I/DF-II block diagrams)
data/l1.js … l4.js  problems per lecture
data/concepts.js  plain-language concept notes (tab 1)
data/design.js    design problems
data/reference.js recipes, formula sheet, cheat list
verify.js         numerical verification of the answers
serve.js          tiny static server for local preview
CLAUDE.md         notes for continuing this project in a Claude chat
```

Lecture slides are the instructor's material and are **not** included in this repo.
