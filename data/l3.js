/* Lecture 3 — LCCDE (direct method), ZIR/ZSR, realizations (DF-I, DF-II, FIR, IIR) */
PROBLEMS.push(
{
  id: 'L3-01', lec: 'L3', kind: 'solve', title: 'First-order LCCDE, full direct method',
  q: 'y(n) − 0.5y(n−1) = x(n), n ≥ 0, with y(−1) = 1. Obtain: (a) the homogeneous solution, (b) the zero-input response, (c) the particular solution for x(n) = u(n), (d) the zero-state response for x(n) = u(n), (e) the total response, (f) the impulse response h(n). Identify the transient and steady-state parts.',
  a: steps([
    '<b>(a) Homogeneous.</b> Set x = 0, try y<sub>h</sub> = λⁿ: λⁿ − 0.5λⁿ⁻¹ = 0 ⇒ λ = 0.5 ⇒ <b>y<sub>h</sub>(n) = C(0.5)ⁿ</b>.',
    '<b>(b) Zero-input response</b> (x = 0, uses y(−1) = 1): y(0) = 0.5y(−1) = 0.5 = C ⇒ <b>y<sub>zi</sub>(n) = 0.5·(0.5)ⁿ = (0.5)ⁿ⁺¹</b>.',
    '<b>(c) Particular</b> for u(n): try y<sub>p</sub> = K: K − 0.5K = 1 ⇒ <b>y<sub>p</sub> = 2</b>.',
    '<b>(d) Zero-state</b> (relaxed, y(−1) = 0): y = C(0.5)ⁿ + 2 and y(0) = x(0) + 0.5·0 = 1 ⇒ C = −1 ⇒ <b>y<sub>zs</sub>(n) = 2 − (0.5)ⁿ</b>.',
    '<b>(e) Total</b> = y<sub>zi</sub> + y<sub>zs</sub> = 0.5(0.5)ⁿ + 2 − (0.5)ⁿ = <b>2 − 0.5(0.5)ⁿ</b>. Check: y(0) = 1 + 0.5(1) = 1.5 = 2 − 0.5 ✓.',
    '<b>(f) Impulse response</b>: ZSR to δ(n): the particular solution is zero for n ≥ 1, so y = C(0.5)ⁿ with y(0) = 1 ⇒ <b>h(n) = (0.5)ⁿu(n)</b>.'
  ]) + 'Transient = the decaying part, <b>−0.5(0.5)ⁿ</b> (same form as y<sub>h</sub>); steady state = the part shaped like the input, <b>2</b> (= y<sub>p</sub>).' +
    warn('Two ways to get the total: add ZIR + ZSR (above) <i>or</i> solve y<sub>h</sub> + y<sub>p</sub> once and fit C using y(0) computed <i>with</i> the nonzero initial condition. Never fit C from y(−1) alone after y<sub>p</sub> is included — y(−1) is not in the range n ≥ 0 of the solution.')
},
{
  id: 'L3-02', lec: 'L3', kind: 'solve', title: 'Second-order LCCDE with real roots: step response',
  q: 'y(n) − 0.7y(n−1) + 0.1y(n−2) = x(n), initially relaxed, x(n) = u(n). Find the homogeneous solution, particular solution and the total response.',
  a: steps([
    'Characteristic equation: λ² − 0.7λ + 0.1 = 0 ⇒ (λ − 0.5)(λ − 0.2) = 0 ⇒ <b>y<sub>h</sub> = C₁(0.5)ⁿ + C₂(0.2)ⁿ</b>.',
    'Particular for u(n): y<sub>p</sub> = K ⇒ K(1 − 0.7 + 0.1) = 1 ⇒ K = 1/0.4 = <b>2.5</b>.',
    'Initial values by recursion (relaxed): y(0) = x(0) = 1; y(1) = 0.7y(0) + x(1) = 1.7.',
    'Fit constants to y = C₁(0.5)ⁿ + C₂(0.2)ⁿ + 2.5: n = 0: C₁ + C₂ = −1.5; n = 1: 0.5C₁ + 0.2C₂ = −0.8.',
    'Solve: C₂ = −1.5 − C₁ ⇒ 0.5C₁ − 0.3 − 0.2C₁ = −0.8 ⇒ C₁ = −5/3, C₂ = 1/6.'
  ]) + mb('y(n) = [2.5 − ' + frac('5', '3') + '(0.5)<sup>n</sup> + ' + frac('1', '6') + '(0.2)<sup>n</sup>] u(n)') +
    'Check: y(2) = 0.7(1.7) − 0.1(1) + 1 = 2.09; formula: 2.5 − (5/3)(0.25) + (1/6)(0.04) = 2.09 ✓. Steady state 2.5 = 1/(1 − 0.7 + 0.1) = H(1), the DC gain.'
},
{
  id: 'L3-03', lec: 'L3', kind: 'solve', title: 'Repeated root: zero-input response',
  q: 'y(n) − y(n−1) + 0.25y(n−2) = 0 with y(−1) = 1, y(−2) = 0. Find y(n) for n ≥ 0.',
  a: steps([
    'λ² − λ + 0.25 = (λ − 0.5)² ⇒ <b>double root λ = 0.5</b> ⇒ y<sub>h</sub> = (C₁ + C₂n)(0.5)ⁿ (the extra factor of n for each repetition).',
    'Initial values from the recursion: y(0) = y(−1) − 0.25y(−2) = 1; y(1) = y(0) − 0.25y(−1) = 0.75.',
    'n = 0: C₁ = 1. n = 1: (C₁ + C₂)(0.5) = 0.75 ⇒ C₂ = 0.5.'
  ]) + mb('y(n) = (1 + 0.5n)(0.5)<sup>n</sup> u(n)') + 'Check: y(2) = y(1) − 0.25y(0) = 0.5; formula: (1 + 1)(0.25) = 0.5 ✓.'
},
{
  id: 'L3-04', lec: 'L3', kind: 'solve', title: 'Recursing by hand; ZIR vs ZSR; h(n) of a first-order system',
  q: 'y(n) = 0.1y(n−1) + 0.2x(n) − 0.15x(n−1). (a) With a relaxed system, write y(0), y(1) in terms of the inputs. (b) Find the impulse response h(n). (c) With x = 0 and y(−1) = 1, find the zero-input response.',
  a: steps([
    '(a) Relaxed: x(−1) = 0, y(−1) = 0. y(0) = <b>0.2x(0)</b>. y(1) = 0.1y(0) + 0.2x(1) − 0.15x(0) = 0.02x(0) + 0.2x(1) − 0.15x(0) = <b>0.2x(1) − 0.13x(0)</b>.',
    '(b) Feed x = δ(n): h(0) = 0.2; h(1) = 0.1(0.2) − 0.15 = <b>−0.13</b>; for n ≥ 2 the input terms vanish and h(n) = 0.1h(n−1).',
    'So <b>h(n) = −0.13(0.1)ⁿ⁻¹</b> for n ≥ 1, with h(0) = 0.2. Equivalent compact form: h(n) = 0.2(0.1)ⁿu(n) − 0.15(0.1)ⁿ⁻¹u(n−1) — each term is the output of the recursive part driven by one input tap.',
    '(c) ZIR: x = 0, so y(n) = 0.1y(n−1): y(0) = 0.1, y(1) = 0.01, … ⇒ <b>y<sub>zi</sub>(n) = (0.1)ⁿ⁺¹</b>, n ≥ 0.'
  ]) + note('A recursive system with one feedback tap has an infinite h(n) (IIR); here it decays by a factor 0.1 per sample. The feedforward taps (0.2, −0.15) only decide the first two samples.')
},
{
  id: 'L3-05', lec: 'L3', kind: 'solve', title: 'Direct Form I and II realization (and a stability surprise)',
  q: 'Sketch the Direct Form I and Direct Form II realizations of 2y(n) + y(n−1) − 4y(n−3) = x(n) + 3x(n−5). How many delay elements does each use? Is the system stable?',
  a: steps([
    '<b>Normalize first.</b> Divide by 2 so the coefficient of y(n) is 1: y(n) = −0.5y(n−1) + 2y(n−3) + 0.5x(n) + 1.5x(n−5).',
    'So <b>a₁ = 0.5, a₂ = 0, a₃ = −2</b> and <b>b₀ = 0.5, b₅ = 1.5</b> (b₁…b₄ = 0). N = 3, M = 5.',
    '<b>DF-I</b> keeps separate delay lines for x (M = 5 delays) and y (N = 3 delays): <b>8 delays</b>. The drawn feedback multipliers are <b>−a<sub>k</sub></b>: −0.5 and +2.',
    '<b>DF-II</b> shares one line w(n) = x(n) − a₁w(n−1) − … and needs only max(M, N) = <b>5 delays</b>.'
  ]) +
    df1Fig({ b: [0.5, 0, 0, 0, 0, 1.5], a: [0.5, 0, -2], label: 'Direct Form I', cap: 'Direct Form I: x-delays (left) feed the b taps, y-delays (right) feed the −a taps; both add into y(n). 5 + 3 = 8 delays.' }) +
    df2Fig({ b: [0.5, 0, 0, 0, 0, 1.5], a: [0.5, 0, -2], label: 'Direct Form II', cap: 'Direct Form II: one shared delay line w(n−k) with feedback taps −a_k on the left and feedforward taps b_k on the right. 5 delays.' }) +
    steps([
      '<b>Stability.</b> H(z) = (0.5 + 1.5z⁻⁵)/(1 + 0.5z⁻¹ − 2z⁻³). Poles solve z³ + 0.5z² − 2 = 0: one real root at z ≈ <b>1.113</b> and a complex pair of magnitude ≈ <b>1.340</b>. All three lie <b>outside</b> the unit circle ⇒ the causal system is <b>unstable</b> (outputs grow without bound).'
    ]) + warn('The numerator (b) never affects stability; only the denominator coefficients a<sub>k</sub> do. Realizing a system does not make it good — check the poles before you build it.')
},
{
  id: 'L3-06', lec: 'L3', kind: 'solve', title: 'FIR realization and impulse response',
  q: 'Obtain the direct-form realization of y(n) = x(n) − x(n−1) + 2x(n−2) − 3x(n−4) and solve for its impulse response. Is it recursive? Stable?',
  a: steps([
    'Let x = δ(n): y(n) = δ(n) − δ(n−1) + 2δ(n−2) − 3δ(n−4).',
    '<b>h(n) = {1, −1, 2, 0, −3}</b> for n = 0…4 (note the zero tap at n = 3 — it is still part of the sequence).',
    'No past outputs appear ⇒ <b>non-recursive</b>; finite duration ⇒ <b>FIR</b>. H(z) = 1 − z⁻¹ + 2z⁻² − 3z⁻⁴ has all four poles at z = 0 ⇒ always <b>BIBO stable</b> (Σ|h| = 7).',
    'Needs <b>4 delays</b> (highest delay is x(n−4)); the n−3 tap is simply left out.'
  ]) +
    df2Fig({ b: [1, -1, 2, 0, -3], a: [], label: 'FIR direct form', cap: 'FIR (moving-average / tapped-delay) realization: no feedback. The b₃ = 0 tap is omitted; the adder chain passes straight through that row.' })
},
{
  id: 'L3-07', lec: 'L3', kind: 'solve', title: 'Block diagram → difference equation',
  q: 'Find the difference equation of the system in the figure (Direct Form II; the multipliers are as drawn).',
  a: df2Fig({ b: [1, 0.3], a: [-0.5, 0.125], label: 'Second-order DF-II structure', cap: 'Figure for the problem. Drawn feedback multipliers: +0.5 on w(n−1) and −0.125 on w(n−2). Feedforward taps: 1 on w(n), 0.3 on w(n−1).' }) + steps([
    'Name the internal node w(n) at the top of the delay line. The feedback adder gives <b>w(n) = x(n) + 0.5w(n−1) − 0.125w(n−2)</b> (drawn multipliers add as drawn).',
    'The output adder gives <b>y(n) = w(n) + 0.3w(n−1)</b>.',
    'Eliminate w: apply the same operator to y. Since y(n) = w(n) + 0.3w(n−1) is just w filtered by a feedforward polynomial, y satisfies the same recursion on the left and the polynomial on the right:'
  ]) + mb('y(n) = 0.5y(n−1) − 0.125y(n−2) + x(n) + 0.3x(n−1)') +
    'In the standard form y + a₁y(n−1) + a₂y(n−2) = …, this means <b>a₁ = −0.5, a₂ = +0.125</b>. Poles: z² − 0.5z + 0.125 = 0 ⇒ |z| = √0.125 ≈ 0.354 (complex pair) ⇒ stable.' +
    warn('The drawn feedback gain is −a<sub>k</sub>. When you read a diagram, write the equation exactly as drawn first, <i>then</i> convert to the a<sub>k</sub> convention.')
},
{
  id: 'L3-08', lec: 'L3', kind: 'solve', title: 'Particular solutions: resonance and a sinusoidal input',
  q: '(a) Solve y(n) − 0.5y(n−1) = (0.5)ⁿu(n), relaxed. (b) Solve y(n) − 0.5y(n−1) = cos(πn/2) u(n), relaxed; separate the transient from the steady state.',
  a: steps([
    '<b>(a) Resonance.</b> The input (0.5)ⁿ has the same form as the natural mode, so the particular solution must be <b>y<sub>p</sub> = K·n·(0.5)ⁿ</b> (multiply by n).',
    'Substitute: Kn(0.5)ⁿ − 0.5K(n−1)(0.5)ⁿ⁻¹ = K(0.5)ⁿ[n − (n−1)] = K(0.5)ⁿ ⇒ K = 1.',
    'y = C(0.5)ⁿ + n(0.5)ⁿ and y(0) = 1 ⇒ C = 1 ⇒ <b>y(n) = (n + 1)(0.5)ⁿ u(n)</b> (this equals (0.5)ⁿu(n) * (0.5)ⁿu(n) from the convolution rule).',
    '<b>(b) Sinusoid.</b> Try y<sub>p</sub> = K₁cos(πn/2) + K₂sin(πn/2). Using y<sub>p</sub>(n−1) = K₁sin(πn/2) − K₂cos(πn/2) and matching cos and sin terms: K₁ + 0.5K₂ = 1 and K₂ − 0.5K₁ = 0 ⇒ <b>K₁ = 0.8, K₂ = 0.4</b>.',
    'So y<sub>p</sub>(n) = 0.8cos(πn/2) + 0.4sin(πn/2) = 0.894cos(πn/2 − 0.464). Total: y = C(0.5)ⁿ + y<sub>p</sub>; y(0) = x(0) = 1 ⇒ C + 0.8 = 1 ⇒ C = 0.2.'
  ]) + mb('y(n) = 0.2(0.5)<sup>n</sup> + 0.8cos(πn/2) + 0.4sin(πn/2), &nbsp;n ≥ 0') +
    'Transient: 0.2(0.5)ⁿ (dies out). Steady state: the sinusoid, with amplitude 0.894 = |H(e<sup>jπ/2</sup>)| = 1/√(1 + 0.25) and phase −0.464 rad = ∠H. Check: y(1) = 0.5 + cos(π/2) = 0.5; formula 0.1 + 0 + 0.4 = 0.5 ✓.'
},
{
  id: 'L3-09', lec: 'L3', kind: 'solve', title: 'Recursive vs non-recursive, FIR vs IIR',
  q: 'Classify each as recursive/non-recursive and FIR/IIR: (a) y(n) = x(n) + x(n−1) &nbsp;(b) y(n) = 0.5y(n−1) + x(n) &nbsp;(c) y(n) = y(n−1) + x(n) − x(n−8) &nbsp;(d) y(n) = y(n−1) + x(n).',
  a: tbl(['System', 'Recursive?', 'h(n)', 'Class'], [
    ['(a)', 'no', '{1, 1}', '<b>FIR</b>'],
    ['(b)', 'yes', '(0.5)ⁿu(n)', '<b>IIR</b>'],
    ['(c)', 'yes', '1 for 0 ≤ n ≤ 7, else 0', '<b>FIR</b> — a recursive running-sum (8-point moving sum)'],
    ['(d)', 'yes', 'u(n)', '<b>IIR</b> — accumulator; pole at z = 1, not BIBO stable']
  ], 3) + mb('Recursive ⇔ the equation contains past <i>outputs</i>.&nbsp;&nbsp; FIR ⇔ h(n) has finite length.') +
    warn('The two classifications are independent. Case (c) is recursive yet FIR because its pole at z = 1 is exactly cancelled by a zero at z = 1. (Cancellation relies on exact arithmetic; in finite precision the cancellation is imperfect.)')
}
);
