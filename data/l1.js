/* Lecture 1 — signals, sampling, aliasing, quantization */
PROBLEMS.push(
{
  id: 'L1-01', lec: 'L1', kind: 'solve', title: 'Sampling and aliasing of one cosine',
  q: 'Given x<sub>a</sub>(t) = 3cos(100πt). (a) Find the minimum sampling rate that avoids aliasing. (b) The signal is sampled at F<sub>s</sub> = 200 Hz — what DT signal results? (c) It is sampled at F<sub>s</sub> = 75 Hz instead — what DT signal results? (d) Find the frequency 0 &lt; F &lt; F<sub>s</sub>/2 of a sinusoid that yields samples identical to those in (c).',
  a: steps([
    'Read the frequency: Ω = 100π = 2πF ⇒ <b>F = 50 Hz</b>.',
    '(a) Nyquist: F<sub>s</sub> ≥ 2F ⇒ <b>F<sub>s</sub> ≥ 100 Hz</b>.',
    '(b) f = F/F<sub>s</sub> = 50/200 = 1/4, inside |f| ≤ ½, so no aliasing: <b>x(n) = 3cos(πn/2)</b>.',
    '(c) f = 50/75 = 2/3 &gt; ½ — aliased. x(n) = 3cos(4πn/3) = 3cos(2πn − 2πn/3) = <b>3cos(2πn/3)</b>.',
    '(d) Subtract the integer: f<sub>alias</sub> = 2/3 − 1 = −1/3, so |f| = 1/3 ⇒ F = (1/3)(75) = <b>25 Hz</b>. Check: 3cos(2π·25·n/75) = 3cos(2πn/3) ✓.'
  ]) + warn('Folding frequency is F<sub>s</sub>/2 = 37.5 Hz; the 50 Hz tone is above it and "folds" down to 25 Hz. For a <i>sine</i> the alias flips sign (sin is odd); for cosine it does not.')
},
{
  id: 'L1-02', lec: 'L1', kind: 'solve', title: 'Sampling range and folding of a band-limited signal',
  q: 'An analog signal contains frequencies up to 10 kHz. (a) What range of sampling frequencies allows exact reconstruction? (b) The signal is sampled at F<sub>s</sub> = 8 kHz. Examine what happens to the components F<sub>1</sub> = 5 kHz and F<sub>2</sub> = 9 kHz.',
  a: steps([
    '(a) <b>F<sub>s</sub> ≥ 2·10 kHz = 20 kHz</b> (no mathematical upper limit; higher costs more samples).',
    '(b) Folding frequency = F<sub>s</sub>/2 = 4 kHz, so only −4…+4 kHz is distinguishable.',
    'F<sub>1</sub> = 5 kHz: f = 5/8; subtract 1 → −3/8 ⇒ appears at <b>3 kHz</b>.',
    'F<sub>2</sub> = 9 kHz: f = 9/8; subtract 1 → 1/8 ⇒ appears at <b>1 kHz</b>.'
  ]) + mb('F<sub>alias</sub> = F − k·F<sub>s</sub>, &nbsp;choose integer k so that |F<sub>alias</sub>| ≤ F<sub>s</sub>/2') +
    note('Both aliases land inside the 0–4 kHz band, indistinguishable from genuine 3 kHz and 1 kHz tones. This is why an anti-aliasing filter must come <i>before</i> the sampler.')
},
{
  id: 'L1-03', lec: 'L1', kind: 'solve', title: 'Three-tone signal: Nyquist rate, sampled sequence, reconstruction',
  q: 'x<sub>a</sub>(t) = 3cos(2000πt) + 5sin(6000πt) + 10cos(12000πt). (a) What is the Nyquist rate? (b) What DT signal results from sampling at F<sub>s</sub> = 5000 samples/s? (c) What analog signal y<sub>a</sub>(t) is reconstructed from those samples by an ideal D/A converter?',
  a: steps([
    'Frequencies: 2000π → <b>1 kHz</b>; 6000π → <b>3 kHz</b>; 12000π → <b>6 kHz</b>.',
    '(a) Nyquist rate = 2F<sub>max</sub> = 2(6 kHz) = <b>12 kHz</b>.',
    '(b) F<sub>s</sub> = 5 kHz → folding frequency 2.5 kHz. f<sub>1</sub> = 1/5 (fine). f<sub>2</sub> = 3/5 → 3/5 − 1 = <b>−2/5</b>. f<sub>3</sub> = 6/5 → 6/5 − 1 = <b>1/5</b>.',
    'x(n) = 3cos(2πn/5) + 5sin(2π(−2/5)n) + 10cos(2πn/5) = <b>13cos(2πn/5) − 5sin(4πn/5)</b>. (The sine picked up a minus sign because sin is odd; the two cosines at f = 1/5 add: 3 + 10.)',
    '(c) Ideal D/A outputs frequencies inside ±F<sub>s</sub>/2: f = 1/5 → 1000 Hz, f = 2/5 → 2000 Hz. <b>y<sub>a</sub>(t) = 13cos(2000πt) − 5sin(4000πt)</b>.'
  ]) + note('Sanity check: evaluate both expressions at n = 1 (t = 0.2 ms) — they agree to the last digit.')
},
{
  id: 'L1-04', lec: 'L1', kind: 'solve', title: 'Periodicity of CT and DT sinusoids',
  q: 'Decide whether each signal is periodic and give the fundamental period. (a) x<sub>a</sub>(t) = 3cos(5t + π/6) &nbsp;(b) x(n) = cos(0.01πn) &nbsp;(c) x(n) = 3cos(5n + π/6) &nbsp;(c′) x(n) = 3cos(5πn + π/6) &nbsp;(d) x(n) = cos(πn/8)·cos(πn/3) &nbsp;(e) Are cos(5πn/2) and cos(πn/2) distinct or identical?',
  a: tbl(['Signal', 'f = ω/2π', 'Verdict'], [
    ['(a) 3cos(5t+π/6)', '—', 'CT sinusoids are <b>always periodic</b>: T = 2π/5 s'],
    ['(b) cos(0.01πn)', '0.005 = 1/200', 'Rational → periodic, <b>N = 200</b>'],
    ['(c) 3cos(5n+π/6)', '5/2π', 'Irrational → <b>not periodic</b>'],
    ['(c′) 3cos(5πn+π/6)', '5/2', 'Rational → periodic, <b>N = 2</b>'],
    ['(d) cos(πn/8)cos(πn/3)', '1/16 and 1/6', 'N₁ = 16, N₂ = 6 → <b>N = lcm(16, 6) = 48</b>'],
    ['(e) cos(5πn/2) vs cos(πn/2)', '5/4 and 1/4', '5π/2 = 2π + π/2 → <b>identical</b> (frequencies differ by an integer multiple of 2π)']
  ], 2) + warn('A DT sinusoid is periodic only if f = k/N is a <i>ratio of integers</i>. Without a π in the argument (case c) ω/2π is irrational. Distinct DT sinusoids only exist for |f| ≤ ½ (−π ≤ ω ≤ π); the fastest oscillation is ω = π (f = ½).') +
    note('The slide shows these without the π symbols in the text layer; (b), (c) and (d) above assume the π is present. Case (c′) is the contrast that makes the point.')
},
{
  id: 'L1-05', lec: 'L1', kind: 'solve', title: 'Quantizer bits and SQNR (rounding vs truncation)',
  q: 'The DT signal x(n) = 6.35cos(πn/10) is quantized with resolution (a) Δ = 0.1 and (b) Δ = 0.02. How many bits does the A/D converter need in each case? Compute SQNR<sub>dB</sub> for each using rounding and using truncation.',
  a: steps([
    'Range: x<sub>max</sub> = 6.35, x<sub>min</sub> = −6.35 → 12.7. Levels: L = (x<sub>max</sub> − x<sub>min</sub>)/Δ + 1.',
    '(a) L = 12.7/0.1 + 1 = 128 ⇒ b = log<sub>2</sub>128 = <b>7 bits</b>.',
    '(b) L = 12.7/0.02 + 1 = 636 ⇒ 2<sup>9</sup> = 512 &lt; 636 ≤ 1024 ⇒ <b>10 bits</b>.',
    'Signal power of a cosine: P<sub>x</sub> = A²/2 = 6.35²/2 = 20.16.',
    '<b>Rounding:</b> error uniform on (−Δ/2, Δ/2) → P<sub>q</sub> = Δ²/12.',
    '<b>Truncation:</b> error uniform on [0, Δ) → mean-square error P<sub>q</sub> = Δ²/3 (what the MATLAB demo computes as mean(e²)); its <i>variance</i> is still Δ²/12 but the mean Δ/2 is a DC bias.'
  ]) + tbl(['Δ', 'Bits', 'SQNR round', 'SQNR trunc (mean-square)'], [
    ['0.1', '7', '10log(20.16 / (0.01/12)) ≈ <b>43.8 dB</b>', '10log(20.16 / (0.01/3)) ≈ <b>37.8 dB</b>'],
    ['0.02', '10', '10log(20.16 / (0.0004/12)) ≈ <b>57.8 dB</b>', '10log(20.16 / (0.0004/3)) ≈ <b>51.8 dB</b>']
  ], 2) + note('Truncation is 10log(4) = 6.02 dB worse than rounding. Going from Δ = 0.1 to 0.02 shrinks Δ by 5×, so SQNR rises by 20log(5) = 13.98 dB (57.8 − 43.8 ✓). Bits are rounded <i>up</i> (636 levels need 10 bits but only use 636 of 1024 codes), so this is less than a full 3 × 6.02 = 18 dB. A MATLAB run on a few samples lands within about ±2 dB of these theoretical values.')
},
{
  id: 'L1-06', lec: 'L1', kind: 'solve', title: 'Even and odd decomposition',
  q: 'x(n) = {1, 2, 3} for n = 0, 1, 2 (zero elsewhere). Find the even part x<sub>e</sub>(n) and odd part x<sub>o</sub>(n), and verify x = x<sub>e</sub> + x<sub>o</sub>.',
  a: mb('x<sub>e</sub>(n) = ½[x(n) + x(−n)], &nbsp;&nbsp; x<sub>o</sub>(n) = ½[x(n) − x(−n)]') +
    tbl(['n', '−2', '−1', '0', '1', '2'], [
      ['x(n)', '0', '0', '1', '2', '3'],
      ['x(−n)', '3', '2', '1', '0', '0'],
      ['x<sub>e</sub>(n)', '1.5', '1', '1', '1', '1.5'],
      ['x<sub>o</sub>(n)', '−1.5', '−1', '0', '1', '1.5']
    ], 99) +
    'Check n = 1: x<sub>e</sub> + x<sub>o</sub> = 1 + 1 = 2 = x(1) ✓; n = −2: 1.5 − 1.5 = 0 = x(−2) ✓. ' +
    note('x<sub>o</sub>(0) is always 0 (an odd sequence must pass through the origin), and x<sub>e</sub>(0) = x(0).')
},
{
  id: 'L1-07', lec: 'L1', kind: 'solve', title: 'Energy signal or power signal?',
  q: 'Classify each as an energy signal, a power signal, or neither, and give E or P. (a) x(n) = (½)<sup>n</sup>u(n) &nbsp;(b) x(n) = (½)<sup>|n|</sup> &nbsp;(c) x(n) = u(n) &nbsp;(d) x(n) = 3cos(0.2πn) &nbsp;(e) x(n) = n·u(n)',
  a: tbl(['Signal', 'Computation', 'Verdict'], [
    ['(a) (½)ⁿu(n)', 'E = Σ (¼)ⁿ = 1/(1−¼)', 'Energy signal, <b>E = 4/3</b>'],
    ['(b) (½)^|n|', 'E = 1 + 2Σ<sub>n≥1</sub>(¼)ⁿ = 1 + 2(1/3)', 'Energy signal, <b>E = 5/3</b>'],
    ['(c) u(n)', 'P = lim (N+1)/(2N+1)', 'Power signal, <b>P = ½</b> (E = ∞)'],
    ['(d) 3cos(0.2πn)', 'P = A²/2', 'Power signal, <b>P = 4.5</b> (periodic: average over one period)'],
    ['(e) n·u(n)', 'E = ∞ and P = ∞', '<b>Neither</b> (grows without bound)']
  ], 2) + note('Energy signals have P = 0; power signals have E = ∞. Decaying/finite-duration → energy; periodic or steady → power; growing → neither.')
},
{
  id: 'L1-08', lec: 'L1', kind: 'solve', title: 'Reading the A/D chain from a sample table',
  q: 'A 3-bit uniform quantizer covers −1 V … +1 V (x<sub>min</sub> = −1, x<sub>max</sub> = +1) using rounding. Find the number of levels, the step Δ, and the codeword and quantization error for the sample x = 0.30 V.',
  a: steps([
    'L = 2<sup>3</sup> = <b>8 levels</b>.',
    'Δ = (x<sub>max</sub> − x<sub>min</sub>)/(L − 1) = 2/7 = <b>0.2857 V</b> (the slide’s convention: levels include both end points).',
    'Level k (k = 0…7) sits at −1 + k·(2/7): −1, −0.714, −0.429, −0.143, +0.143, +0.429, +0.714, +1. The codeword is k in binary (000 … 111).',
    'x = 0.30 lies between level 4 (+0.143) and level 5 (+0.429). Distances: 0.157 and 0.129 ⇒ rounds up to level 5: <b>x<sub>q</sub> = 0.429 V, code 101</b>.',
    'Quantization error e<sub>q</sub> = x<sub>q</sub> − x = 0.429 − 0.300 = <b>+0.129 V</b>, and |e<sub>q</sub>| ≤ Δ/2 = 0.143 ✓.'
  ]) + warn('Two conventions exist: Δ = range/(L−1) (end points are levels, used on the slides) and Δ = range/L (midrise). Always say which one you used. The error sign convention also varies (x − x<sub>q</sub> or x<sub>q</sub> − x).')
}
);
