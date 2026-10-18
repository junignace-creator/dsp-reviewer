/* Lecture 4 — Z-transform, ROC, properties, inverse Z, H(z), one-sided Z with initial conditions */
PROBLEMS.push(
{
  id: 'L4-01', lec: 'L4', kind: 'solve', title: 'Z-transform and ROC of finite sequences',
  q: 'x(n) = {3, −2, −2, 5, 1, 4, −1} where the arrow (n = 0) is on the “5”. (a) Find X(z) and its ROC. (b) What changes if n = 0 is the first sample? The last sample? (c) X(z) and ROC of δ(n).',
  a: steps([
    '(a) Indices run n = −3 … 3. X(z) = Σ x(n)z⁻ⁿ gives <b>X(z) = 3z³ − 2z² − 2z + 5 + z⁻¹ + 4z⁻² − z⁻³</b>.',
    'It has positive powers (z³) ⇒ blows up as z → ∞; negative powers (z⁻³) ⇒ blows up as z → 0. <b>ROC: all z except 0 and ∞</b> (0 &lt; |z| &lt; ∞).',
    '(b) n = 0 on the <i>first</i> sample (causal): X = 3 − 2z⁻¹ − 2z⁻² + 5z⁻³ + z⁻⁴ + 4z⁻⁵ − z⁻⁶, only negative powers ⇒ <b>ROC: |z| &gt; 0</b> (includes ∞). n = 0 on the <i>last</i> sample (anti-causal): X = 3z⁶ − 2z⁵ − 2z⁴ + 5z³ + z² + 4z − 1, only positive powers ⇒ <b>ROC: |z| &lt; ∞</b> (includes 0).',
    '(c) δ(n) → <b>X(z) = 1</b>, ROC <b>all z</b>.'
  ]) + tbl(['Signal', 'Has terms', 'ROC'], [
    ['x(n) ≠ 0 only for n ≥ 0', 'z⁻ᵏ only', '|z| &gt; 0 (∞ included)'],
    ['x(n) ≠ 0 only for n ≤ 0', 'zᵏ only', '|z| &lt; ∞ (0 included)'],
    ['both', 'z⁻ᵏ and zᵏ', '0 &lt; |z| &lt; ∞'],
    ['δ(n)', 'none (constant)', 'all z']
  ], 2) + note('A finite-length sequence’s ROC is the whole plane minus whichever of 0, ∞ the powers of z force out. The ROC never contains a pole.')
},
{
  id: 'L4-02', lec: 'L4', kind: 'solve', title: 'Infinite sequences: causal, anti-causal, two-sided, and no ROC',
  q: 'Find X(z) and the ROC: (a) x(n) = aⁿu(n) &nbsp;(b) x(n) = −aⁿu(−n−1) &nbsp;(c) x(n) = (½)ⁿu(n) + 2ⁿu(−n−1) &nbsp;(d) x(n) = 2ⁿu(n) + (½)ⁿu(−n−1).',
  a: steps([
    '<b>(a)</b> Σ<sub>n≥0</sub>(az⁻¹)ⁿ = <b>1/(1 − az⁻¹)</b>, converges for |az⁻¹| &lt; 1 ⇒ <b>ROC |z| &gt; |a|</b> (outside the pole — right-sided).',
    '<b>(b)</b> −Σ<sub>n≤−1</sub>(az⁻¹)ⁿ = −Σ<sub>m≥1</sub>(a⁻¹z)ᵐ = <b>1/(1 − az⁻¹)</b> again, but converges for |a⁻¹z| &lt; 1 ⇒ <b>ROC |z| &lt; |a|</b> (inside the pole — left-sided). Same X(z), different ROC, <i>different signal</i>.',
    '<b>(c)</b> Causal part: 1/(1 − ½z⁻¹), |z| &gt; ½. Anti-causal part 2ⁿu(−n−1) = −[−2ⁿu(−n−1)] → −1/(1 − 2z⁻¹), |z| &lt; 2. The ROCs overlap in an <b>annulus ½ &lt; |z| &lt; 2</b>:'
  ]) + mb('X(z) = ' + frac('1', '1 − ½z<sup>−1</sup>') + ' − ' + frac('1', '1 − 2z<sup>−1</sup>') + ' = ' + frac('−1.5z<sup>−1</sup>', '(1 − ½z<sup>−1</sup>)(1 − 2z<sup>−1</sup>)')) +
    pzFig({ poles: [{ re: 0.5, im: 0, t: '½', dy: 16 }, { re: 2, im: 0, t: '2', dy: 16 }], zeros: [{ re: 0, im: 0, t: '(1)', dy: -10 }], roc: { type: 'ann', r1: 0.5, r2: 2 }, label: 'Pole-zero plot with annular ROC', cap: '(c) Poles at ½ and 2, zero at the origin. The ROC (shaded) is the ring between the poles — it contains the unit circle, so this two-sided signal has a Fourier transform.' }) +
    steps(['<b>(d)</b> Needs |z| &gt; 2 <i>and</i> |z| &lt; ½ — the regions do not overlap. <b>No ROC ⇒ the Z-transform does not exist</b> (the sum diverges for every z).']) +
    warn('X(z) alone does not determine x(n); X(z) <b>and</b> its ROC do. Right-sided → outside the outermost pole; left-sided → inside the innermost pole; two-sided → a ring between poles.')
},
{
  id: 'L4-03', lec: 'L4', kind: 'solve', title: 'Properties workout (shift, scaling, differentiation, reversal, convolution, initial value)',
  q: 'Find the Z-transform (use the properties, not the definition): (a) (½)ⁿ⁻²u(n−2) and (½)ⁿu(n−2) &nbsp;(b) n(½)ⁿu(n) &nbsp;(c) (−½)ⁿcos(πn/3)u(n) &nbsp;(d) u(−n) &nbsp;(e) u(n) * u(n) &nbsp;(f) x(0) for X(z) = (2 + z⁻¹)/(1 − ½z⁻¹) (causal).',
  a: steps([
    '<b>(a) Shift:</b> x(n−2) ↔ z⁻²X(z). With x(n) = (½)ⁿu(n): <b>(½)ⁿ⁻²u(n−2) ↔ z⁻²/(1 − ½z⁻¹)</b>. The second signal is NOT shifted consistently: (½)ⁿu(n−2) = ¼·(½)ⁿ⁻²u(n−2) ↔ <b>¼ z⁻²/(1 − ½z⁻¹)</b>.',
    '<b>(b) Differentiation:</b> Z{n·x(n)} = −z dX/dz. X = (1 − ½z⁻¹)⁻¹ ⇒ dX/dz = −(1 − ½z⁻¹)⁻²·(½z⁻²) ⇒ <b>X<sub>b</sub> = ½z⁻¹/(1 − ½z⁻¹)²</b>, |z| &gt; ½.',
    '<b>(c) Scaling:</b> Z{aⁿx(n)} = X(a⁻¹z). Start with cos(πn/3)u(n) ↔ (1 − ½z⁻¹)/(1 − z⁻¹ + z⁻²), then replace z⁻¹ by a z⁻¹ with a = −½: <b>(1 + ¼z⁻¹)/(1 + ½z⁻¹ + ¼z⁻²)</b>, |z| &gt; ½.',
    '<b>(d) Reversal:</b> x(−n) ↔ X(z⁻¹). u(n) ↔ 1/(1 − z⁻¹), so <b>u(−n) ↔ 1/(1 − z)</b>, ROC |z| &lt; 1.',
    '<b>(e) Convolution:</b> product of transforms: (1/(1 − z⁻¹))² = 1/(1 − z⁻¹)² ↔ <b>(n + 1)u(n)</b>, ROC |z| &gt; 1.',
    '<b>(f) Initial value</b> (causal x): x(0) = lim<sub>z→∞</sub>X(z) = (2 + 0)/(1 − 0) = <b>2</b>. (Series: (2 + w)(1 + ½w + …) gives x(1) = 1 + 1 = 2.)'
  ]) + warn('The shift property moves the <i>whole</i> expression, argument included. If a^n is left unshifted while u(n) is shifted, you must rewrite it first, as in (a).') +
    note('Check on (c): (−½)ⁿcos(πn/3) = (½)ⁿcos(2πn/3) since (−1)ⁿcos(πn/3) = cos(2πn/3). The standard form (1 − r cos ω z⁻¹)/(1 − 2r cos ω z⁻¹ + r²z⁻²) with r = ½, ω = 2π/3 gives the same answer.')
},
{
  id: 'L4-04', lec: 'L4', kind: 'solve', title: 'Inverse Z by power series (long division)',
  q: 'X(z) = 1/(1 − 1.5z⁻¹ + 0.5z⁻²). Find the first few terms of x(n) if (a) ROC |z| &gt; 1, (b) ROC |z| &lt; 0.5.',
  a: steps([
    '<b>(a) |z| &gt; 1 ⇒ right-sided:</b> divide in descending powers of z (i.e. powers of z⁻¹).',
    '1 ÷ (1 − 1.5z⁻¹ + 0.5z⁻²): 1 → remainder 1.5z⁻¹ − 0.5z⁻² → 1.5z⁻¹ → remainder 1.75z⁻² … giving <b>X = 1 + 1.5z⁻¹ + 1.75z⁻² + 1.875z⁻³ + …</b> so x(n) = {1, 1.5, 1.75, 1.875, …} for n = 0, 1, 2, 3.',
    'Pattern (confirmed by partial fractions in L4-05): x(n) = 2 − (0.5)ⁿ for n ≥ 0.',
    '<b>(b) |z| &lt; 0.5 ⇒ left-sided:</b> divide in <i>ascending</i> powers of z. Rewrite X = 2z²/(1 − 3z + 2z²) and expand 1/(1 − 3z + 2z²) = 1 + 3z + 7z² + 15z³ + … (each coefficient c<sub>k</sub> = 3c<sub>k−1</sub> − 2c<sub>k−2</sub>).',
    '<b>X = 2z² + 6z³ + 14z⁴ + 30z⁵ + …</b> ⇒ x(−2) = 2, x(−3) = 6, x(−4) = 14, x(−5) = 30 and x(n) = 0 for n &gt; −2. Closed form: x(n) = [−2 + (0.5)ⁿ] for n ≤ −1 (gives 0 at n = −1 ✓).'
  ]) + warn('The ROC decides which way you divide: outside the outermost pole → descending powers of z (causal); inside the innermost pole → ascending powers of z (anti-causal). Power series is good for the first few samples; partial fractions give the closed form.')
},
{
  id: 'L4-05', lec: 'L4', kind: 'solve', title: 'Inverse Z by partial fractions: distinct poles, three ROCs',
  q: 'X(z) = 1/(1 − 1.5z⁻¹ + 0.5z⁻²). Find the closed form of x(n) for (a) |z| &gt; 1, (b) ½ &lt; |z| &lt; 1, (c) |z| &lt; ½.',
  a: steps([
    'Factor the denominator: 1 − 1.5z⁻¹ + 0.5z⁻² = (1 − z⁻¹)(1 − 0.5z⁻¹), so the poles are <b>z = 1 and z = 0.5</b>.',
    'X(z) = A/(1 − z⁻¹) + B/(1 − 0.5z⁻¹). Residues: A = [(1 − z⁻¹)X]<sub>z=1</sub> = 1/(1 − 0.5) = <b>2</b>; B = [(1 − 0.5z⁻¹)X]<sub>z=0.5</sub> = 1/(1 − 2) = <b>−1</b>.',
    'X(z) = 2/(1 − z⁻¹) − 1/(1 − 0.5z⁻¹). Now assign each term’s side from the ROC:'
  ]) + tbl(['ROC', 'pole 1 term', 'pole ½ term', 'x(n)'], [
    ['|z| &gt; 1', 'right-sided: 2u(n)', 'right-sided: −(½)ⁿu(n)', '<b>2u(n) − (½)ⁿu(n)</b>'],
    ['½ &lt; |z| &lt; 1', 'left-sided: −2u(−n−1)', 'right-sided: −(½)ⁿu(n)', '<b>−2u(−n−1) − (½)ⁿu(n)</b>'],
    ['|z| &lt; ½', 'left-sided: −2u(−n−1)', 'left-sided: +(½)ⁿu(−n−1)', '<b>[−2 + (½)ⁿ]u(−n−1)</b>']
  ], 3) +
    pzFig({ poles: [{ re: 0.5, im: 0, t: '½', dy: 16 }, { re: 1, im: 0, t: '1', dx: 7, dy: -9 }], zeros: [{ re: 0, im: 0, t: '(2)', dy: -10 }], roc: { type: 'ann', r1: 0.5, r2: 1 }, label: 'Poles at 1/2 and 1 with ROC 1/2<|z|<1', cap: 'Case (b): the ROC is the ring between the poles, so the pole at ½ is treated as causal and the pole at 1 as anti-causal. Two zeros sit at the origin.' }) +
    note('Part (a) matches the long-division series in L4-04: 2 − (½)ⁿ = 1, 1.5, 1.75, 1.875, … ✓. In case (c) the n = −1 sample is 0 (−2 + 2) and n = −2 gives 2 — also matching L4-04(b).') +
    warn('In case (b) the signal is two-sided and the unit circle is in the ROC only if the ROC contains |z| = 1. The ring ½ &lt; |z| &lt; 1 does <i>not</i> contain it (the pole at z = 1 is on the boundary).') +
    note('MATLAB check: <code>[r,p,k] = residuez(b,a)</code> expands in <i>negative</i> powers of z (b = numerator, a = denominator, in powers of z⁻¹; the form used here, and the denominator order must be higher than the numerator, i.e. proper). <code>residue</code> works in <i>positive</i> powers, so apply it to X(z)/z. For this X: b = 1, a = [1 −1.5 0.5] gives r = [2 −1], p = [1 0.5]. Same A and B as above (MATLAB may list the poles in a different order).')
},
{
  id: 'L4-06', lec: 'L4', kind: 'solve', title: 'Improper rational X(z): divide first',
  q: 'X(z) = (1 + z⁻¹ + z⁻²)/(1 − ½z⁻¹), causal (ROC |z| &gt; ½). Find x(n).',
  a: steps([
    'Numerator degree in z⁻¹ is 2, denominator degree is 1 ⇒ M ≥ N ⇒ <b>improper</b>. Divide polynomials in w = z⁻¹: (w² + w + 1) ÷ (1 − ½w).',
    'Quotient −2w − 6, remainder 7: check (−2w − 6)(1 − ½w) + 7 = −2w + w² − 6 + 3w + 7 = w² + w + 1 ✓.',
    'So <b>X(z) = −6 − 2z⁻¹ + 7/(1 − ½z⁻¹)</b>: a polynomial part (finite, just impulses) plus a proper fraction.',
    'Invert term by term: <b>x(n) = −6δ(n) − 2δ(n−1) + 7(½)ⁿu(n)</b>.',
    'Check: x(0) = −6 + 7 = 1 ✓ (the leading numerator coefficient); x(1) = −2 + 3.5 = 1.5 and series (1 + w + w²)(1 + ½w + …) gives 1 + ½ = 1.5 ✓; x(2) = 7(¼) = 1.75 ✓.'
  ]) + note('Improper X(z) always contributes impulses δ(n−k) at the start of x(n). Skipping the division and trying A/(1 − ½z⁻¹) alone loses them.')
},
{
  id: 'L4-07', lec: 'L4', kind: 'solve', title: 'Inverse Z with a repeated pole',
  q: 'X(z) = z⁻¹ / [(1 − z⁻¹)(1 − ½z⁻¹)²], causal. Find x(n).',
  a: steps([
    'Multiply top and bottom by z² and work with X(z)/z so every factor has the form z/(z − p): X(z) = z²/[(z−1)(z−½)²] ⇒ <b>X(z)/z = z/[(z−1)(z−½)²]</b>.',
    'Expand: X(z)/z = A/(z−1) + B/(z−½) + C/(z−½)².',
    'A = [z/(z−½)²]<sub>z=1</sub> = 1/¼ = <b>4</b>. C = [z/(z−1)]<sub>z=½</sub> = ½/(−½) = <b>−1</b>. For the repeated root: B = d/dz[z/(z−1)]<sub>z=½</sub> = [−1/(z−1)²]<sub>z=½</sub> = −1/¼ = <b>−4</b>. (Check: X(z)/z ∼ 1/z² at infinity ⇒ A + B = 0 ✓.)',
    'X(z) = 4z/(z−1) − 4z/(z−½) − z/(z−½)². Using z/(z−p)² ↔ n pⁿ⁻¹u(n) (differentiation property): the last term gives −n(½)ⁿ⁻¹ = −2n(½)ⁿ.'
  ]) + mb('x(n) = [4 − 4(½)<sup>n</sup> − 2n(½)<sup>n</sup>] u(n)') +
    'Check: x(0) = 4 − 4 = 0 ✓ (numerator has the extra z⁻¹); x(1) = 4 − 2 − 1 = 1 ✓; x(2) = 4 − 1 − 1 = 2 ✓ (series: z⁻¹(1 + 2z⁻¹ + …) → 0, 1, 2, …).' +
    note('Each extra repetition of a pole adds a factor of n (n, n², …): a double pole gives (C₁ + C₂n)pⁿ — the same pattern you saw for repeated characteristic roots in Lec 3.')
},
{
  id: 'L4-08', lec: 'L4', kind: 'solve', title: 'Inverse Z with complex-conjugate poles',
  q: 'X(z) = (1 + z⁻¹)/(1 − z⁻¹ + 0.5z⁻²), causal. Find x(n) as a real signal.',
  a: steps([
    'Denominator zeros: z² − z + 0.5 = 0 ⇒ <b>p = 0.5 ± j0.5 = (1/√2)e<sup>±jπ/4</sup></b>, |p| = 0.707 &lt; 1.',
    'X(z)/z = (z + 1)/[(z−p)(z−p*)]. A = [(z+1)/(z−p*)]<sub>z=p</sub> = (p + 1)/(p − p*) = (1.5 + 0.5j)/(j1) = <b>0.5 − 1.5j</b>. The partner residue is A*.',
    'x(n) = A pⁿ + A* p*ⁿ = 2|A||p|ⁿcos(nθ + ∠A) u(n), with |A| = √(0.25 + 2.25) = √2.5 = 1.581, ∠A = atan2(−1.5, 0.5) = −71.57° = −1.249 rad, θ = π/4.'
  ]) + mb('x(n) = ' + rt('10') + ' (1/' + rt('2') + ')<sup>n</sup> cos(πn/4 − 1.249) u(n)') +
    'Check: x(0) = 3.162·cos(−71.57°) = 3.162·0.316 = 1 ✓; x(1) = 3.162·0.707·cos(45° − 71.57°) = 2.236·0.894 = 2 ✓; long division gives x = {1, 2, 1.5, 0.5, −0.25, …} ✓.' +
    pzFig({ poles: [{ re: 0.5, im: 0.5, t: '0.5+0.5j', dx: 6, dy: -8 }, { re: 0.5, im: -0.5, t: '0.5−0.5j', dx: 6, dy: 16 }], zeros: [{ re: 0, im: 0, t: '', dy: -9 }, { re: -1, im: 0, t: '−1', dx: -4, dy: -12 }], roc: { type: 'out', r1: 0.7071 }, label: 'Complex-conjugate poles inside the unit circle', cap: 'Poles at radius 0.707 and angle ±45° ⇒ a decaying oscillation with period 8 samples. Zeros at 0 and −1. ROC |z| > 0.707 contains the unit circle: stable.' }) +
    warn('Conjugate poles always give conjugate residues, so the imaginary parts cancel and x(n) is real. Pole radius sets the decay rate (|p|ⁿ), pole angle sets the oscillation frequency (θ rad/sample).')
},
{
  id: 'L4-09', lec: 'L4', kind: 'solve', title: 'Convolution through the Z-transform',
  q: 'Use Z-transforms to convolve x(n) = (½)ⁿu(n) with h(n) = u(n).',
  a: steps([
    'X(z) = 1/(1 − ½z⁻¹), H(z) = 1/(1 − z⁻¹). Convolution in time ⇒ product in z: <b>Y(z) = 1/[(1 − ½z⁻¹)(1 − z⁻¹)]</b>, ROC |z| &gt; 1.',
    'Partial fractions (same Y as L4-05): A = 2 at z = 1, B = −1 at z = ½.',
    '<b>y(n) = [2 − (½)ⁿ]u(n)</b>.',
    'Direct check: Σ<sub>k=0</sub><sup>n</sup>(½)ᵏ = 2(1 − (½)ⁿ⁺¹) = 2 − (½)ⁿ ✓.'
  ]) + note('The ROC of a product is at least the overlap of the two ROCs (|z| &gt; ½ and |z| &gt; 1 ⇒ |z| &gt; 1). Pole–zero cancellation can enlarge it.')
},
{
  id: 'L4-10', lec: 'L4', kind: 'solve', title: 'System function, poles/zeros, h(n), step response',
  q: 'y(n) − (3/4)y(n−1) + (1/8)y(n−2) = x(n) + (1/3)x(n−1), causal and relaxed. Find H(z), the poles and zeros, h(n), the stability verdict, and the unit-step response.',
  a: steps([
    'Take the Z-transform of both sides (zero initial conditions) and divide: <b>H(z) = (1 + ⅓z⁻¹)/(1 − ¾z⁻¹ + ⅛z⁻²)</b> = z(z + ⅓)/[(z − ½)(z − ¼)].',
    '<b>Zeros:</b> z = 0 and z = −⅓. <b>Poles:</b> z = ½ and z = ¼ (solve z² − ¾z + ⅛ = 0).',
    '<b>Stability:</b> causal ⇒ ROC is |z| &gt; ½, which contains the unit circle; both poles inside ⇒ <b>BIBO stable</b>.',
    '<b>h(n):</b> H(z)/z = (z + ⅓)/[(z−½)(z−¼)] ⇒ residue at ½: (½ + ⅓)/(¼) = 10/3; at ¼: (¼ + ⅓)/(−¼) = −7/3. So <b>h(n) = [(10/3)(½)ⁿ − (7/3)(¼)ⁿ]u(n)</b>. Check h(0) = 1 ✓, h(1) = ¾ + ⅓ = 13/12 ✓.',
    '<b>Step response:</b> Y(z) = H(z)·1/(1 − z⁻¹), so Y(z)/z = z(z + ⅓)/[(z−1)(z−½)(z−¼)] with residues 32/9 (z=1), −10/3 (z=½), 7/9 (z=¼).'
  ]) + mb('y<sub>step</sub>(n) = [' + frac('32', '9') + ' − ' + frac('10', '3') + '(½)<sup>n</sup> + ' + frac('7', '9') + '(¼)<sup>n</sup>] u(n)') +
    'Steady state 32/9 = 3.556 = H(1) = (4/3)/(1 − ¾ + ⅛) ✓ (DC gain = H(z) evaluated at z = 1). Check y(0) = 32/9 − 30/9 + 7/9 = 1 ✓.' +
    pzFig({ poles: [{ re: 0.5, im: 0, t: '½', dy: 16 }, { re: 0.25, im: 0, t: '¼', dx: -6, dy: 16 }], zeros: [{ re: 0, im: 0, t: '0', dx: -2, dy: -10 }, { re: -1 / 3, im: 0, t: '−⅓', dx: -14, dy: -10 }], roc: { type: 'out', r1: 0.5 }, label: 'Pole-zero plot of H(z)', cap: 'Zeros at 0 and −⅓ (o); poles at ¼ and ½ (x). ROC |z| > ½ (shaded) includes the unit circle.' })
},
{
  id: 'L4-11', lec: 'L4', kind: 'solve', title: 'One-sided Z-transform with nonzero initial conditions',
  q: 'y(n) = 0.9y(n−1) − 0.81y(n−2) + x(n) with y(−1) = 1, y(−2) = 1. Solve for the zero-input response.',
  a: steps([
    'One-sided shifts: Z⁺{y(n−1)} = z⁻¹Y(z) + y(−1); Z⁺{y(n−2)} = z⁻²Y(z) + z⁻¹y(−1) + y(−2).',
    'Set x = 0: Y(z) = 0.9[z⁻¹Y + y(−1)] − 0.81[z⁻²Y + z⁻¹y(−1) + y(−2)].',
    'Collect: Y(z)(1 − 0.9z⁻¹ + 0.81z⁻²) = 0.9y(−1) − 0.81y(−2) − 0.81y(−1)z⁻¹ = <b>0.09 − 0.81z⁻¹</b>.',
    'Poles: 1 − 0.9z⁻¹ + 0.81z⁻² ⇒ 2r cos θ = 0.9, r² = 0.81 ⇒ <b>r = 0.9, θ = 60° = π/3</b> (complex pair 0.9∠±60°).',
    'For N(z) = n₀ + n₁z⁻¹ over 1 − 2r cos θ z⁻¹ + r²z⁻²: <b>y(n) = rⁿ[n₀cos nθ + ((n₁ + n₀ r cos θ)/(r sin θ)) sin nθ]</b>. Here n₀ = 0.09, n₁ = −0.81, r cos θ = 0.45, r sin θ = 0.7794: coefficient of sin = (−0.81 + 0.0405)/0.7794 = −0.987 = −0.57√3.'
  ]) + mb('y<sub>zi</sub>(n) = (0.9)<sup>n</sup>[0.09cos(πn/3) − 0.987 sin(πn/3)] u(n)') +
    'Check by recursion: y(0) = 0.9(1) − 0.81(1) = 0.09 ✓; y(1) = 0.9(0.09) − 0.81(1) = −0.729 ✓ (formula: 0.9[0.045 − 0.855] = −0.729 ✓).' +
    note('Total response = y<sub>zi</sub> (from the initial conditions, denominator-only dynamics) + y<sub>zs</sub> (from H(z)X(z)). The one-sided shift property is the only property that differs from the two-sided transform; it is exactly what injects the initial conditions.')
},
{
  id: 'L4-12', lec: 'L4', kind: 'solve', title: 'Same H(z), different ROC: causal vs stable',
  q: 'H(z) = 1/(1 − 2z⁻¹). Find h(n) for each ROC: (a) |z| &gt; 2, (b) |z| &lt; 2. Which is causal? Which is stable? Can one choice be both?',
  a: steps([
    'The only pole is z = 2.',
    '<b>(a) |z| &gt; 2:</b> right-sided ⇒ <b>h(n) = 2ⁿu(n)</b>. <b>Causal</b>, but Σ|h| = ∞ and the unit circle is <i>not</i> in the ROC ⇒ <b>unstable</b>.',
    '<b>(b) |z| &lt; 2:</b> left-sided ⇒ <b>h(n) = −2ⁿu(−n−1)</b>. Σ<sub>n≤−1</sub> 2ⁿ = Σ<sub>k≥1</sub>2⁻ᵏ = 1 ⇒ <b>stable</b> (unit circle inside the ROC), but <b>non-causal</b> (nonzero for negative n).',
    'No ROC gives both: causal needs the ROC outside the outermost pole, stable needs the unit circle in the ROC, so a causal stable system needs <b>every pole inside the unit circle</b>. This pole (2) fails.'
  ]) + tbl(['Property', 'Condition on ROC'], [
    ['Causal', 'exterior of a circle, |z| &gt; r<sub>max</sub> (and includes ∞)'],
    ['Anti-causal', 'interior of a circle, |z| &lt; r<sub>min</sub>'],
    ['BIBO stable', 'contains the unit circle |z| = 1'],
    ['Causal and stable', 'all poles satisfy |p| &lt; 1']
  ], 0) + note('Stability is never a property of H(z) alone: it needs the ROC (or, for a causal system, the pole locations).')
},
{
  id: 'L4-13', lec: 'L4', kind: 'solve', title: 'Pole location → shape of the impulse response',
  q: 'For a causal system describe the long-term behavior of h(n) when the (only) poles are: (a) 0.9 &nbsp;(b) −0.9 &nbsp;(c) 0.9e<sup>±jπ/4</sup> &nbsp;(d) 1.1 &nbsp;(e) e<sup>±jπ/2</sup> &nbsp;(f) 1 &nbsp;(g) a double pole at 0.9.',
  a: tbl(['Poles', 'Term in h(n)', 'Behavior'], [
    ['(a) 0.9', '(0.9)ⁿ', 'smooth monotone decay (slow: time constant ≈ 1/(−ln 0.9) ≈ 9.5 samples)'],
    ['(b) −0.9', '(−0.9)ⁿ', 'decays with sign alternating every sample'],
    ['(c) 0.9∠±45°', '(0.9)ⁿcos(πn/4 + φ)', 'decaying oscillation, period 2π/(π/4) = 8 samples'],
    ['(d) 1.1', '(1.1)ⁿ', 'grows without bound — <b>unstable</b>'],
    ['(e) ∠±90°, |p| = 1', 'cos(πn/2 + φ)', 'sustained oscillation, period 4 — marginal (not BIBO stable): a digital oscillator'],
    ['(f) 1', 'constant', 'does not decay (h = u(n)) — marginal; the accumulator'],
    ['(g) double at 0.9', 'n(0.9)ⁿ', 'rises, peaks, then decays: n·0.9ⁿ peaks at n = 9 and 10 (equal, 3.487), then dies out']
  ], 2) + mb('|p| &lt; 1: decays &nbsp;&nbsp; |p| = 1: constant/oscillating &nbsp;&nbsp; |p| &gt; 1: grows') +
    note('Radius → rate of decay or growth. Angle → frequency of oscillation (θ rad/sample ⇒ F = θ·F<sub>s</sub>/2π). Negative real pole → angle π → fastest alternation. Multiplicity m → polynomial factor nᵐ⁻¹.')
},
{
  id: 'L4-14', lec: 'L4', kind: 'solve', title: 'Z-transforms of sinusoids, finite windows and a left-sided exponential',
  q: 'Find X(z) and the ROC: (a) x(n) = 2ⁿ sin(ω₀n)u(n) &nbsp;(b) x(n) = cos(ω₀n + φ)u(n) &nbsp;(c) x(n) = (½)ⁿ[u(n) − u(n−10)] &nbsp;(d) x(n) = aⁿu(k − n), k &gt; 0.',
  a: steps([
    '<b>(a) Scaling.</b> Start from sin ω₀n u(n) ↔ sin ω₀ z⁻¹/(1 − 2cos ω₀ z⁻¹ + z⁻²) and replace z⁻¹ by 2z⁻¹: <b>X(z) = 2 sin ω₀ z⁻¹/(1 − 4cos ω₀ z⁻¹ + 4z⁻²)</b>. The poles are 2e<sup>±jω₀</sup>, radius 2, so <b>ROC |z| &gt; 2</b>.',
    '<b>(b) Expand the phase:</b> cos(ω₀n + φ) = cos φ cos ω₀n − sin φ sin ω₀n. Combine the two table entries: numerator = cos φ(1 − cos ω₀ z⁻¹) − sin φ sin ω₀ z⁻¹ = cos φ − z⁻¹(cos φ cos ω₀ + sin φ sin ω₀) = cos φ − cos(ω₀ − φ)z⁻¹.'
  ]) + mb('X(z) = ' + frac('cos φ − cos(ω₀ − φ) z⁻¹', '1 − 2cos ω₀ z⁻¹ + z⁻²') + ', &nbsp; |z| &gt; 1') + steps([
    '<b>(c) Finite window.</b> Only n = 0 … 9 are nonzero, so X(z) = Σ<sub>n=0</sub><sup>9</sup>(½z⁻¹)ⁿ = <b>(1 − (½z⁻¹)¹⁰)/(1 − ½z⁻¹)</b>. The (apparent) pole at ½ is cancelled by a zero, so the only pole left is the 9-fold pole at z = 0. <b>ROC |z| &gt; 0</b> (causal finite sequence).',
    '<b>(d) Left-sided (right end at n = k).</b> u(k − n) = 1 for n ≤ k. Let m = k − n: X(z) = Σ<sub>m=0</sub><sup>∞</sup> a<sup>k−m</sup>z<sup>−(k−m)</sup> = (a/z)ᵏ Σ(z/a)ᵐ = <b>(a z⁻¹)ᵏ/(1 − a⁻¹z)</b>, converging only when <b>|z| &lt; |a|</b>. For k &gt; 0 the sequence is two-sided (it has samples at n = 0 … k), so z = 0 is also excluded because of the z⁻ᵏ factor: <b>0 &lt; |z| &lt; |a|</b>. (If k ≤ 0 it is purely anti-causal and |z| &lt; |a| works with z = 0 included.)'
  ]) + note('Table rows 8–11 (slide 18) are the sinusoid entries. Whenever a phase φ appears, split with the cos/sin addition formula first, then combine over the common denominator.')
},
{
  id: 'L4-15', lec: 'L4', kind: 'solve', title: 'Causal inverse with a mix of distinct and repeated poles',
  q: 'X(z) = 1/[(1 + z⁻¹)(1 − z⁻¹)²], causal. Find x(n).',
  a: steps([
    'Write with unknown constants (one for each power of the repeated pole): X(z) = A/(1 + z⁻¹) + B/(1 − z⁻¹) + C/(1 − z⁻¹)².',
    '<b>A</b> (cover up 1 + z⁻¹, set z⁻¹ = −1): A = 1/(1 + 1)² = <b>¼</b>. <b>C</b> (cover up (1 − z⁻¹)², set z⁻¹ = 1): C = 1/(1 + 1) = <b>½</b>.',
    '<b>B</b> from the value at z⁻¹ = 0 (z → ∞): 1 = A + B + C ⇒ B = 1 − ¼ − ½ = <b>¼</b>.',
    'Use (1 − z⁻¹)⁻² ↔ (n + 1)u(n) (from u * u):'
  ]) + mb('x(n) = [¼(−1)<sup>n</sup> + ¼ + ½(n + 1)] u(n)') +
    'Check: x(0) = ¼ + ¼ + ½ = 1 ✓. The denominator (1 + w)(1 − 2w + w²) = 1 − w − w² + w³ gives x(1) = x(0) = 1, and the formula gives −¼ + ¼ + 1 = 1 ✓.' +
    warn('A double pole at p contributes (A + Bn)pⁿ. Here the repeated pole sits on the unit circle (z = 1), so x(n) contains a term that <i>grows linearly</i> (½n): a causal system with this H(z) would not be BIBO stable.')
},
{
  id: 'L4-16', lec: 'L4', kind: 'solve', title: 'Convolution through Z, including a cancellation',
  q: 'Convolve with Z-transforms: (a) x₁(n) = (⅓)ⁿu(n), x₂(n) = (½)ⁿu(n) &nbsp;(b) x₁(n) = cos(πn/3)u(n), x₂(n) = 0.5ⁿu(n).',
  a: steps([
    '<b>(a)</b> Y(z) = 1/[(1 − ⅓z⁻¹)(1 − ½z⁻¹)], ROC |z| &gt; ½. Residues: at the pole ⅓: 1/(1 − ½·3) = <b>−2</b>; at the pole ½: 1/(1 − ⅓·2) = <b>3</b>.',
    '<b>y(n) = [3(½)ⁿ − 2(⅓)ⁿ]u(n)</b>. Check y(0) = 1 ✓, y(1) = 3/2 − 2/3 = 5/6 = ⅓ + ½ ✓ (the convolution sum for n = 1).',
    '<b>(b)</b> X₁(z) = (1 − ½z⁻¹)/(1 − z⁻¹ + z⁻²) and X₂(z) = 1/(1 − ½z⁻¹). The numerator of X₁ <b>cancels</b> the pole of X₂:'
  ]) + mb('Y(z) = X₁(z)X₂(z) = ' + frac('1', '1 − z⁻¹ + z⁻²') + ', &nbsp; |z| &gt; 1') + steps([
    'The poles of 1 − z⁻¹ + z⁻² are e<sup>±jπ/3</sup> (2r cos θ = 1, r = 1). Using the sin ω₀ table row with ω₀ = π/3: <b>y(n) = [sin(π(n+1)/3)/sin(π/3)] u(n) = (2/√3) sin(π(n+1)/3) u(n)</b>.',
    'Check: y(0) = 1, y(1) = 1 (= cos(π/3) + 0.5 ✓), y(2) = 0, y(3) = −1.'
  ]) + note('A product can have a larger ROC than the overlap of the two ROCs when a pole of one is cancelled by a zero of the other. Here |z| &gt; ½ and |z| &gt; 1 overlap in |z| &gt; 1, which still holds because the pole at ½ vanished.')
},
{
  id: 'L4-17', lec: 'L4', kind: 'solve', title: 'System function, poles/zeros and h(n) from a difference equation (improper H and unstable cases)',
  q: 'Find H(z), the poles and zeros, and h(n) (causal) for: (a) y(n) = ½y(n−1) + 2x(n) + 0.5x(n−1) + x(n−2) &nbsp;(b) y(n) − 3y(n−1) − 4y(n−2) = x(n) + 2x(n−1).',
  a: steps([
    '<b>(a)</b> Z-transform with zero initial conditions: <b>H(z) = (2 + 0.5z⁻¹ + z⁻²)/(1 − ½z⁻¹)</b> has a degree-2 numerator over a degree-1 denominator in z⁻¹ ⇒ <b>improper</b> (M ≥ N), so divide first.',
    'With w = z⁻¹, long division gives (w² + 0.5w + 2) ÷ (1 − 0.5w) = −2w − 5 + 7/(1 − 0.5w). So <b>H(z) = −5 − 2z⁻¹ + 7/(1 − ½z⁻¹)</b>.',
    '<b>h(n) = −5δ(n) − 2δ(n − 1) + 7(½)ⁿu(n)</b>. Check h(0) = 2 ✓, h(1) = −2 + 3.5 = 1.5 = ½·2 + 0.5 ✓.',
    '<b>Poles/zeros:</b> in positive powers H = (2z² + 0.5z + 1)/(z(z − ½)). <b>Poles</b> z = 0 and z = ½. <b>Zeros</b> from 2z² + 0.5z + 1 = 0: z = −0.125 ± j0.696 (complex pair, |z| = 0.707). Both poles are inside the unit circle ⇒ stable (ROC |z| &gt; ½).',
    '<b>(b)</b> <b>H(z) = (1 + 2z⁻¹)/(1 − 3z⁻¹ − 4z⁻²) = (1 + 2z⁻¹)/[(1 − 4z⁻¹)(1 + z⁻¹)]</b>. In positive powers: z(z + 2)/[(z − 4)(z + 1)].',
    '<b>Zeros</b> z = 0 and z = −2. <b>Poles</b> z = 4 and z = −1. Residues: at 4: (1 + ½)/(1 + ¼) = 1.2; at −1: (1 − 2)/(1 + 4) = −0.2.'
  ]) + mb('h(n) = [1.2(4)<sup>n</sup> − 0.2(−1)<sup>n</sup>] u(n)') + steps([
    'Check h(0) = 1 ✓, h(1) = 4.8 + 0.2 = 5 = 3·1 + 2 ✓. A pole at 4 is outside the unit circle (and −1 is on it) ⇒ the causal system is <b>unstable</b> (h grows like 4ⁿ).'
  ]) + note('Improper H(z) just means the system has a finite-length feedforward part added to the recursive part: the extra terms are delayed impulses.')
},
{
  id: 'L4-18', lec: 'L4', kind: 'solve', title: 'Cascade of two first-order sections: step response and Direct Form II',
  q: 'Two identical sections in cascade (each: adder, a z⁻¹ delay, and a 0.8 feedback gain around the delay, so each section is v(n) = u(n) + 0.8v(n−1)). The input x(n) enters the first section, the output of the first feeds the second, and y(n) is the output of the second. (a) Find H(z). (b) Find the unit-step response (initially relaxed). (c) Draw the Direct Form II equivalent.',
  a: steps([
    '<b>(a)</b> Each section: H₁(z) = 1/(1 − 0.8z⁻¹). Cascade ⇒ product: <b>H(z) = 1/(1 − 0.8z⁻¹)² = 1/(1 − 1.6z⁻¹ + 0.64z⁻²)</b> (a double pole at 0.8, so stable and causal).',
    '<b>(b)</b> Y(z) = H(z)/(1 − z⁻¹) = A/(1 − z⁻¹) + B/(1 − 0.8z⁻¹) + C/(1 − 0.8z⁻¹)². <b>A</b> = 1/(1 − 0.8)² = <b>25</b>. <b>C</b> (at z⁻¹ = 1.25) = 1/(1 − 1.25) = <b>−4</b>. <b>B</b> from y(0) = 1 ⇒ 1 = 25 + B − 4 ⇒ <b>B = −20</b>.',
    'Use (1 − pz⁻¹)⁻² ↔ (n + 1)pⁿu(n):'
  ]) + mb('y(n) = [25 − 20(0.8)<sup>n</sup> − 4(n + 1)(0.8)<sup>n</sup>] u(n)') + steps([
    'Check: y(0) = 25 − 20 − 4 = 1 ✓; y(1) = 25 − 16 − 6.4 = 2.6 = 1.6·1 + 1 ✓. As n → ∞, y → 25 = H(1) = 1/(1 − 0.8)² ✓ (DC gain).',
    '<b>(c) Direct Form II:</b> multiply out the denominator; the difference equation is y(n) = 1.6y(n−1) − 0.64y(n−2) + x(n). Since there are no zeros (b₀ = 1 only), DF-I and DF-II coincide: one shared delay line with feedback taps +1.6 and −0.64.'
  ]) + df2Fig({ b: [1], a: [-1.6, 0.64], label: 'Direct Form II equivalent', cap: 'Direct Form II of 1/(1 − 1.6z⁻¹ + 0.64z⁻²): drawn feedback gains +1.6 on w(n−1) and −0.64 on w(n−2). Two delays, the same count as the cascade.' }) +
    note('The cascade and the single second-order section use the same number of delays (2), but the cascade has two separate gain-0.8 loops. Multiplying the section polynomials (1 − 0.8z⁻¹)² gives the DF-II coefficients 1.6 = 2·0.8 and 0.64 = 0.8².')
}
);
