/* Lecture 2 — DT signals, system classification, DT-LTI, convolution, correlation */
PROBLEMS.push(
{
  id: 'L2-01', lec: 'L2', kind: 'solve', title: 'Fold-then-delay vs delay-then-fold',
  q: 'x(n) = 1 + n/3 for −3 ≤ n ≤ −1; x(n) = 1 for 0 ≤ n ≤ 3; x(n) = 0 elsewhere. (a) Determine the values of x(n). (b) Sketch (1) x folded and then delayed by four samples, (2) x delayed by four samples and then folded.',
  a: tbl(['n', '−4', '−3', '−2', '−1', '0', '1', '2', '3', '4'], [['x(n)', '0', '0', '1/3', '2/3', '1', '1', '1', '1', '0']], 99) +
    stemFig({ pts: [[-3, 0], [-2, 1 / 3], [-1, 2 / 3], [0, 1], [1, 1], [2, 1], [3, 1]], xlo: -4, xhi: 4, labels: { '-2': '1/3', '-1': '2/3', '-3': '0' }, label: 'The signal x(n)', cap: 'x(n): a rising ramp on −3…−1 followed by a plateau of 1 on 0…3.', h: 150 }) +
    steps([
      '<b>(1) Fold, then delay:</b> y₁(n) = TD₄(FD[x(n)]) = TD₄(x(−n)) = <b>x(−[n − 4]) = x(4 − n)</b>. Fold is applied to n first, so the delay moves the <i>folded</i> signal right.',
      'x(4 − n) is nonzero when −3 ≤ 4 − n ≤ 3 ⇒ 1 ≤ n ≤ 7, with n = 7 giving x(−3) = 0. Values: y₁(1…6) = x(3), x(2), x(1), x(0), x(−1), x(−2) = <b>1, 1, 1, 1, 2/3, 1/3</b>.',
    ]) +
    stemFig({ pts: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 2 / 3], [6, 1 / 3]], xlo: 0, xhi: 7, labels: { '5': '2/3', '6': '1/3' }, label: 'Fold then delay', cap: 'y₁(n) = x(4 − n): mirrored, with the ramp now on the right, sitting on n = 1…6.', h: 150 }) +
    steps([
      '<b>(2) Delay, then fold:</b> y₂(n) = FD(TD₄[x(n)]) = FD(x(n − 4)) = <b>x(−n − 4)</b>. Now the delayed signal is mirrored about n = 0, so it ends up on the <i>negative</i> side.',
      'x(−n − 4) is nonzero for −3 ≤ −n − 4 ≤ 3 ⇒ −7 ≤ n ≤ −1. Values: y₂(−7…−2) = x(3), x(2), x(1), x(0), x(−1), x(−2) = <b>1, 1, 1, 1, 2/3, 1/3</b>.'
    ]) +
    stemFig({ pts: [[-7, 1], [-6, 1], [-5, 1], [-4, 1], [-3, 2 / 3], [-2, 1 / 3]], xlo: -8, xhi: 0, labels: { '-3': '2/3', '-2': '1/3' }, label: 'Delay then fold', cap: 'y₂(n) = x(−n − 4): the same shape, but on n = −7…−2. The two orderings give different signals.', h: 150 }) +
    warn('Order matters. The trick: write the final formula with n replaced everywhere in x(·). Fold-then-delay replaces n by −(n − 4); delay-then-fold replaces n by −n − 4.')
},
{
  id: 'L2-02', lec: 'L2', kind: 'solve', title: 'Sketch standard signals; build u(n) from impulses',
  q: 'Sketch and label (a) x(n) = −2u(−n − 4) &nbsp;(b) x(n) = u(n + 3) − u(n − 4) &nbsp;(c) x(n) = 8δ(n − 6) &nbsp;(d) x(n) = 2r(n + 6) − 2r(n + 2). Then express the unit step as a function of impulses.',
  a: steps([
    '<b>(a)</b> u(−n − 4) = 1 when −n − 4 ≥ 0, i.e. n ≤ −4. So x(n) = <b>−2 for every n ≤ −4</b>, 0 for n &gt; −4 (a left-sided step of height −2).',
    '<b>(b)</b> u(n + 3) turns on at n = −3; u(n − 4) turns on at n = 4. Their difference is <b>1 for −3 ≤ n ≤ 3</b> (seven samples), 0 elsewhere — a rectangular window.',
    '<b>(c)</b> A single sample of height <b>8 at n = 6</b>.',
    '<b>(d)</b> r(k) = k for k ≥ 0. First term 2(n + 6) starts at n = −6; second −2(n + 2) starts at n = −2. For −6 ≤ n ≤ −2 the ramp climbs 0, 2, 4, 6, 8; for n ≥ −2 the slopes cancel and the output stays at <b>8</b>.'
  ]) + stemFig({ pts: [[-7, 0], [-6, 0], [-5, 2], [-4, 4], [-3, 6], [-2, 8], [-1, 8], [0, 8], [1, 8], [2, 8]], xlo: -7, xhi: 2, label: 'Ramp that saturates', cap: '(d) 2r(n+6) − 2r(n+2): ramp from n = −6 to n = −2, then constant 8 (the second ramp cancels the slope).', h: 170 }) +
    mb('u(n) = Σ<sub>k=0</sub><sup>∞</sup> δ(n − k) &nbsp;&nbsp;&nbsp;(and conversely &nbsp;δ(n) = u(n) − u(n − 1))') +
    note('Also r(n) = Σ<sub>k</sub> k·δ(n − k) = n·u(n), and u(n) − u(n − 1) = δ(n): each “derivative” of the chain ramp → step → impulse is a first difference.')
},
{
  id: 'L2-03', lec: 'L2', kind: 'solve', title: 'Classify: y(n) = n·x(n−1), y(n) = x(n²+1), y(n) = cos x(n)',
  q: 'Determine whether each system is static/dynamic, linear/non-linear, causal/non-causal and time-invariant/time-variant. Also decide BIBO stability.',
  a: '<b>Shift test for time-invariance:</b> compute the response to x(n − k) and compare with the delayed output y(n − k).' + steps([
    '<b>y(n) = n·x(n−1)</b> — depends on x(n−1): <b>dynamic</b>, past only ⇒ <b>causal</b>. Linear: n·[a x₁ + b x₂](n−1) = a·y₁ + b·y₂ ⇒ <b>linear</b>. Time test: response to x(n−k) is n·x(n−k−1); delayed output is (n−k)·x(n−k−1) — differ by the factor n vs n−k ⇒ <b>time-variant</b>. Stability: x = 1 (bounded) gives y = n (unbounded) ⇒ <b>unstable</b>.',
    '<b>y(n) = x(n²+1)</b> — dynamic. Causal needs n² + 1 ≤ n, but n² − n + 1 &gt; 0 for every n, so the index is always in the <i>future</i> ⇒ <b>non-causal</b>. Linear ✓. Time test: response to x(n−k) is x(n² + 1 − k); y(n−k) = x((n−k)² + 1) — differ ⇒ <b>time-variant</b>. Stable (|y| ≤ max|x|).',
    '<b>y(n) = cos x(n)</b> — only the present input ⇒ <b>static</b>, <b>causal</b>. Not linear: cos(a·x) ≠ a·cos x, and cos 0 = 1 ≠ 0 ⇒ <b>non-linear</b>. Time test: cos x(n−k) = y(n−k) ⇒ <b>time-invariant</b>. Stable (|y| ≤ 1).'
  ]) + note('Machine check: all three rows above were confirmed by testing shifted and superposed random inputs numerically (<code>verify.js</code>).')
},
{
  id: 'L2-04', lec: 'L2', kind: 'solve', title: 'Quick-fire classification table (the slide traps)',
  q: 'Without long proofs, fill in static?, linear?, time-invariant?, causal?, BIBO-stable? for: (1) y = 2x(n) + 3 &nbsp;(2) y = x²(n) &nbsp;(3) y = x(4n) &nbsp;(4) y = x(n + 3) &nbsp;(5) y = 0.22x(n) + 0.1x(n − 1) &nbsp;(6) y = 0.22x(n) + 0.1x(n + 1)',
  a: '<div class="table-wrap">' + tbl(['System', 'Memory', 'Linear', 'Time-inv.', 'Causal', 'Stable', 'Key reason'], [
    ['2x(n)+3', 'static', '<b>no</b>', 'yes', 'yes', 'yes', 'x = 0 ⇒ y = 3 ≠ 0 (affine, fails homogeneity)'],
    ['x²(n)', 'static', '<b>no</b>', 'yes', 'yes', 'yes', 'squares break additivity and homogeneity'],
    ['x(4n)', 'dynamic', 'yes', '<b>no</b>', '<b>no</b>', 'yes', 'scaling n (down-sampling) is time-variant; n = 1 needs x(4)'],
    ['x(n+3)', 'dynamic', 'yes', 'yes', '<b>no</b>', 'yes', 'pure advance by 3: needs future input'],
    ['0.22x(n)+0.1x(n−1)', 'dynamic', 'yes', 'yes', 'yes', 'yes', 'FIR, present + past'],
    ['0.22x(n)+0.1x(n+1)', 'dynamic', 'yes', 'yes', '<b>no</b>', 'yes', 'impossible in real time (online)']
  ], 99) + '</div>' + mb('Linear ⇔ T[a₁x₁ + a₂x₂] = a₁T[x₁] + a₂T[x₂]') +
    warn('“Static” means the output depends on the <i>present</i> input only. An easy necessary test for linearity: zero in ⇒ zero out. Any constant added to the output (y = 2x + 3) kills linearity, but time-invariance survives.')
},
{
  id: 'L2-05', lec: 'L2', kind: 'solve', title: 'Convolution of finite sequences (fold-shift-multiply-sum)',
  q: 'Convolve: (a) x(n) = {2, −1, 0, 1}, h(n) = {1, 1, 0, −1} &nbsp;&nbsp; (b) x(n) = {2, 0, 1}, h(n) = {1, 0, −1}. (All sequences start at n = 0.)',
  a: steps([
    'Output length = L<sub>x</sub> + L<sub>h</sub> − 1 = 4 + 4 − 1 = <b>7</b> (n = 0…6). Use y(n) = Σ<sub>k</sub> x(k) h(n − k).',
    'y(0) = 2·1 = <b>2</b>',
    'y(1) = 2·1 + (−1)·1 = <b>1</b>',
    'y(2) = 2·0 + (−1)·1 + 0·1 = <b>−1</b>',
    'y(3) = 2·(−1) + (−1)·0 + 0·1 + 1·1 = <b>−1</b>',
    'y(4) = (−1)·(−1) + 0·0 + 1·1 = <b>2</b>',
    'y(5) = 0·(−1) + 1·0 = <b>0</b>',
    'y(6) = 1·(−1) = <b>−1</b>'
  ]) + mb('(a) &nbsp; y(n) = {2, 1, −1, −1, 2, 0, −1}') +
    'Check: Σy = Σx·Σh = (2)(1) = 2 = 2+1−1−1+2+0−1 ✓.<br><br>' +
    '<b>(b)</b> length 3 + 3 − 1 = 5: y(0) = 2, y(1) = 0, y(2) = 2·(−1) + 0 + 1·1 = −1, y(3) = 0·(−1) + 1·0 = 0, y(4) = 1·(−1) = −1.' +
    mb('(b) &nbsp; y(n) = {2, 0, −1, 0, −1}') + 'Check: Σx·Σh = (3)(0) = 0 = 2 + 0 − 1 + 0 − 1 ✓.' +
    note('Index of the first output = (first index of x) + (first index of h). If x starts at n = −1, so does the whole y shift by −1.')
},
{
  id: 'L2-06', lec: 'L2', kind: 'solve', title: 'Convolution of two infinite causal exponentials',
  q: 'Determine the response of the system with h(n) = (¼)<sup>n</sup>u(n) to the input x(n) = (½)<sup>n</sup>u(n). Then generalize to h = α<sup>n</sup>u(n), x = β<sup>n</sup>u(n).',
  a: steps([
    'Both causal ⇒ y(n) = Σ<sub>k=0</sub><sup>n</sup> x(k)h(n−k) for n ≥ 0 (and 0 for n &lt; 0).',
    'y(n) = Σ<sub>k=0</sub><sup>n</sup> (½)<sup>k</sup>(¼)<sup>n−k</sup> = (¼)<sup>n</sup> Σ<sub>k=0</sub><sup>n</sup> 2<sup>k</sup> = (¼)<sup>n</sup>(2<sup>n+1</sup> − 1).',
    'Simplify: (¼)<sup>n</sup>·2<sup>n+1</sup> = 2(½)<sup>n</sup>, so <b>y(n) = [2(½)<sup>n</sup> − (¼)<sup>n</sup>] u(n)</b>.',
    'Check: y(0) = 2 − 1 = 1 = x(0)h(0) ✓; y(1) = 1 − ¼ = ¾ = x(0)h(1) + x(1)h(0) = ¼ + ½ ✓.'
  ]) + mb('α<sup>n</sup>u(n) * β<sup>n</sup>u(n) = ' + frac('α<sup>n+1</sup> − β<sup>n+1</sup>', 'α − β') + ' u(n), &nbsp;&nbsp; α ≠ β') +
    warn('If α = β the formula degenerates: α<sup>n</sup>u(n) * α<sup>n</sup>u(n) = (n + 1)α<sup>n</sup>u(n). The factor (n + 1) is the “repeated pole” signature you will meet again in the Z-transform.')
},
{
  id: 'L2-07', lec: 'L2', kind: 'solve', title: 'Interconnected systems: find the equivalent h(n)',
  q: 'Systems: h₁ = δ(n) + δ(n−1), h₂ = δ(n) − δ(n−1), h₃(n) = −δ(n−1) + δ(n−2), h₄(n) = δ(n−1). (a) Cascade of h₁ and h₂. (b) Parallel of h₁ and h₂. (c) h₁ in series with the parallel pair (h₂ ∥ h₃), all of that in parallel with h₄. (d) What is the cascade of h(n) = (½)<sup>n</sup>u(n) with g(n) = δ(n) − ½δ(n−1)?',
  a: steps([
    '<b>Rules:</b> cascade ⇒ h = h₁ * h₂ (order irrelevant, commutative); parallel ⇒ h = h₁ + h₂.',
    '(a) {1, 1} * {1, −1} = <b>{1, 0, −1}</b>, i.e. δ(n) − δ(n−2).',
    '(b) h₁ + h₂ = <b>2δ(n)</b>.',
    '(c) Parallel pair first, over n = 0…2: h₂ = {1, −1, 0}, h₃ = {0, −1, 1} ⇒ h₂ + h₃ = {1, −2, 1}. Cascade with h₁: {1, 1} * {1, −2, 1} = {1, −1, −1, 1}. Add the parallel branch h₄ = δ(n−1) = {0, 1, 0, 0}: <b>h = {1, 0, −1, 1}</b> (n = 0…3).',
    '(d) (½)<sup>n</sup>u(n) − ½(½)<sup>n−1</sup>u(n−1) = (½)<sup>n</sup>[u(n) − u(n−1)] = <b>δ(n)</b>. The two systems are <b>inverses</b> — the cascade is the identity.'
  ]) + note('Method: do the innermost parallel sums first, then cascade (convolve), then add the outermost parallel branch. Write every impulse response as a list over a common index range before adding.')
},
{
  id: 'L2-08', lec: 'L2', kind: 'solve', title: 'Output, autocorrelation and cross-correlation identities',
  q: 'x(n) = {2, 0, 1, 3, 2}, h(n) = {1, 0, 1, 1, 2} (both from n = 0). (1) Find y(n) = x * h. (2) Find r<sub>yy</sub>(l) using r<sub>yy</sub> = r<sub>hh</sub> * r<sub>xx</sub>. (3) Show the energy of y equals r<sub>yy</sub>(0). (4) Show r<sub>xy</sub>(l) is the folded version of r<sub>yx</sub>(l).',
  a: steps([
    '(1) Length 5 + 5 − 1 = 9: <b>y(n) = {2, 0, 3, 5, 7, 4, 7, 8, 4}</b> (n = 0…8).',
    '(2) Autocorrelations (lags −4…4): r<sub>xx</sub> = {4, 6, 4, 9, <b>18</b>, 9, 4, 6, 4}, r<sub>hh</sub> = {2, 1, 3, 3, <b>7</b>, 3, 3, 1, 2}. Both are even and peak at lag 0 (= energy: Σx² = 18, Σh² = 7).',
    'r<sub>yy</sub>(l) = (r<sub>hh</sub> * r<sub>xx</sub>)(l). At l = 0: Σ<sub>k</sub> r<sub>hh</sub>(k) r<sub>xx</sub>(−k) = 2·4 + 1·6 + 3·4 + 3·9 + 7·18 + 3·9 + 3·4 + 1·6 + 2·4 = <b>232</b>.',
    '(3) Energy of y: 2² + 0² + 3² + 5² + 7² + 4² + 7² + 8² + 4² = 4 + 0 + 9 + 25 + 49 + 16 + 49 + 64 + 16 = <b>232 = r<sub>yy</sub>(0)</b> ✓.',
    '(4) With r<sub>xy</sub>(l) = Σ x(n)y(n−l): r<sub>xy</sub>(−3…3) = {51, 39, 34, <b>36</b>, 19, 8, 6}; with r<sub>yx</sub>(l) = Σ y(n)x(n−l): r<sub>yx</sub>(−3…3) = {6, 8, 19, <b>36</b>, 34, 39, 51}. The second is the first <b>reversed</b>: r<sub>xy</sub>(l) = r<sub>yx</sub>(−l) ✓. At l = 0 both equal Σxy = 36.'
  ]) + note('Also r<sub>yx</sub>(l) = h(l) * r<sub>xx</sub>(l): passing a signal through a filter correlates its input and output through h. And the energy-density spectrum is the Fourier transform of r<sub>xx</sub>.')
},
{
  id: 'L2-09', lec: 'L2', kind: 'solve', title: 'Autocorrelation of a noisy tone',
  q: 'A 1 kHz unit-amplitude sinusoid is corrupted by zero-mean white Gaussian noise of variance 0.85. It is sampled at 20 kHz for 5 ms. Describe r<sub>xx</sub>(l): value at l = 0, behavior for l ≠ 0, and where the peaks fall.',
  a: steps([
    'Samples: N = 5 ms × 20 kHz = <b>100</b>. Tone period = 20 kHz / 1 kHz = <b>20 samples</b>; ω₀ = 2π/20 = π/10.',
    'Signal and noise are uncorrelated and the noise is white, so the correlations add: <b>r<sub>xx</sub>(l) ≈ (A²/2)cos(ω₀l) + σ²·δ(l)</b> (per-sample average).',
    '<b>l = 0:</b> 0.5 + 0.85 = <b>1.35</b> — the signal power plus the noise power. This is the tallest point.',
    '<b>l ≠ 0:</b> the noise term vanishes; only the cosine remains, peaking at 0.5 whenever l = 0, ±20, ±40, … and crossing zero near l = ±5, ±15.',
    'The input SNR is 0.5/0.85 = 0.59 → <b>−2.3 dB</b> (the tone is below the noise floor in the time domain), yet the periodicity is plainly visible in r<sub>xx</sub> away from l = 0.'
  ]) + note('Practical caveat: with only 100 samples the estimate of r<sub>xx</sub>(l) has random ripple of order σ²/√N ≈ 0.085 for l ≠ 0. Larger |l| uses fewer overlapping samples, so the (unbiased) estimate gets noisier.')
},
{
  id: 'L2-10', lec: 'L2', kind: 'solve', title: 'Using h(n) with linearity + time-invariance',
  q: 'An LTI system has impulse response h(n) = δ(n) − δ(n − 1). Without convolving numerically, find its response to x(n) = −δ(n + 1) + 2δ(n) + 3δ(n − 2).',
  a: steps([
    'Linearity: scaling an impulse scales the response. Time-invariance: delaying an impulse delays the response. So δ(n − m) → h(n − m).',
    'y(n) = −h(n + 1) + 2h(n) + 3h(n − 2).',
    '= −[δ(n+1) − δ(n)] + 2[δ(n) − δ(n−1)] + 3[δ(n−2) − δ(n−3)]',
    '= −δ(n+1) + δ(n) + 2δ(n) − 2δ(n−1) + 3δ(n−2) − 3δ(n−3).'
  ]) + mb('y(n) = −δ(n+1) + 3δ(n) − 2δ(n−1) + 3δ(n−2) − 3δ(n−3)') +
    'This is <i>exactly</i> the convolution sum y(n) = Σ x(k)h(n − k) written out term by term: each input sample launches a scaled, delayed copy of h(n).' +
    note('Equivalent list form: x = {−1, 2, 0, 3} starting at n = −1, h = {1, −1} ⇒ y = {−1, 3, −2, 3, −3} starting at n = −1.')
}
);
