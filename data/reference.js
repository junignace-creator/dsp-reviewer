/* Reference tabs: RECIPES (procedures), FORMULAS (sheet), CHEAT (red flags). */
var RECIPES = [
  {
    topic: 'Lecture 1 · Sampling & quantization', items: [
      { name: 'Aliasing / what DT signal do I get?', when: 'Given x<sub>a</sub>(t) and F<sub>s</sub>.',
        steps: ['Read each frequency F (Hz) from the argument: Ω = 2πF.', 'f = F/F<sub>s</sub>. If |f| ≤ ½ you are done: x(n) = A cos(2πfn + φ).', 'Otherwise subtract the nearest integer: f′ = f − k. The alias frequency is F′ = f′·F<sub>s</sub>.', 'Reconstruction (ideal D/A) outputs only |F| ≤ F<sub>s</sub>/2, so you get the alias, not the original.'],
        tip: 'cos is even (alias keeps its sign); sin is odd (alias flips sign when f′ is negative). Add tones at equal frequency after aliasing.' },
      { name: 'Quantizer sizing and SQNR', when: 'Given range, Δ or bits.',
        steps: ['L = (x<sub>max</sub> − x<sub>min</sub>)/Δ + 1 and b = ⌈log₂L⌉ (or Δ = range/(L−1) from b).', 'Rounding: P<sub>q</sub> = Δ²/12. Truncation (mean-square): Δ²/3.', 'P<sub>x</sub> = A²/2 for a sinusoid, or (1/N)Σx².', 'SQNR = 10log(P<sub>x</sub>/P<sub>q</sub>); full-scale sine ⇒ 6.02b + 1.76 dB.'],
        tip: 'Every extra bit = +6.02 dB. State which Δ convention (range/(L−1) vs range/L) you used.' },
      { name: 'Periodicity of a DT sinusoid', when: 'Is x(n) = A cos(ω₀n + φ) periodic?',
        steps: ['f = ω₀/2π.', 'Rational (k/N in lowest terms)? Yes → fundamental period N. Irrational → not periodic.', 'Sum or product of sinusoids: N = lcm of the individual periods.']
      }
    ]
  },
  {
    topic: 'Lecture 2 · DT signals & systems', items: [
      { name: 'Shifting, folding and ordering', when: 'Sketch x(−n + k), x(2n), etc.',
        steps: ['Write the final formula with n substituted into x(·): e.g. fold-then-delay-by-4 → x(−(n−4)) = x(4−n).', 'Build a table of n against the argument of x, then read off x(argument).', 'Delay by k = shift right (x(n−k)); advance = shift left (x(n+k)).'],
        tip: 'Fold-then-delay ≠ delay-then-fold. Down-sampling x(Mn) is time-variant.' },
      { name: 'Classify a system (static, linear, TI, causal, stable)', when: 'Given y(n) = T[x(n)].',
        steps: ['<b>Static?</b> Output depends only on x(n) at the same n.', '<b>Causal?</b> Every index in x(·) is ≤ n. Look at the worst case, e.g. x(n²+1), x(4n), x(−n) can reach the future.', '<b>Linear?</b> Test T[a₁x₁ + a₂x₂] = a₁T[x₁] + a₂T[x₂]. Quick fail: zero in must give zero out.', '<b>Time-invariant?</b> Feed x(n−k): compare T[x(n−k)] with y(n−k). Different ⇒ time-variant (an explicit n multiplying the input, or n scaled inside x(·)).', '<b>BIBO stable?</b> Try a bounded input (e.g. x = 1): does y stay bounded?']
      },
      { name: 'Convolution table', when: 'Finite x and h.',
        steps: ['Length of y = L<sub>x</sub> + L<sub>h</sub> − 1; first index = sum of first indices.', 'For each n: fold h, shift by n, multiply with x sample by sample, sum.', 'Check: Σy = Σx · Σh.', 'Alternatively, treat as polynomial multiplication of the coefficient lists.']
      },
      { name: 'Correlation', when: 'r<sub>xy</sub>, r<sub>xx</sub>, peak search.',
        steps: ['r<sub>xy</sub>(l) = Σ x(n)y(n−l): shift, multiply, sum (no fold).', 'r<sub>xy</sub>(l) = r<sub>yx</sub>(−l); r<sub>xx</sub> is even and peaks at l = 0 (= energy).', 'Through an LTI system: r<sub>yy</sub> = r<sub>hh</sub> * r<sub>xx</sub> and r<sub>yx</sub> = h * r<sub>xx</sub>.', 'To find a delay D buried in noise, find the lag where r<sub>yx</sub> peaks.']
      }
    ]
  },
  {
    topic: 'Lecture 3 · LCCDE', items: [
      { name: 'Direct method for y(n) = y<sub>h</sub> + y<sub>p</sub>', when: 'Given LCCDE, input, initial conditions.',
        steps: ['<b>Characteristic equation:</b> replace y(n−k) by λ<sup>−k</sup> and solve for λ.', '<b>y<sub>h</sub>:</b> distinct roots → ΣC<sub>k</sub>λ<sub>k</sub>ⁿ; repeated root → (C₁ + C₂n)λⁿ; complex pair → rⁿ(A cos nθ + B sin nθ).', '<b>y<sub>p</sub>:</b> same form as the input (K for a step, Kaⁿ for aⁿ, K₁cos + K₂sin for sinusoids). If the input matches a root, multiply by n.', 'Compute y(0), y(1), … <b>by recursion</b> using the initial conditions.', 'Fit the C’s to y(0), y(1) of the <b>total</b> solution y<sub>h</sub> + y<sub>p</sub>.'],
        tip: 'ZIR = response to initial conditions with x = 0. ZSR = response to the input with zero initial conditions (convolution with h). Total = ZIR + ZSR.' },
      { name: 'Recursion by hand', when: 'Need the first few outputs or h(n).',
        steps: ['Rearrange: y(n) = −Σa<sub>k</sub>y(n−k) + Σb<sub>m</sub>x(n−m).', 'Start at n = 0 with the given y(−1), y(−2), … (zero if relaxed).', 'For h(n) set x = δ(n); the input terms vanish after n = M and h(n) follows the feedback alone.']
      },
      { name: 'Draw Direct Form I / II', when: 'Realization from the difference equation.',
        steps: ['<b>Normalize</b> so the coefficient of y(n) is 1 (divide the whole equation).', 'DF-I: one delay line for x (M delays) and one for y (N delays); y(n) = Σ b<sub>m</sub>x(n−m) − Σ a<sub>k</sub>y(n−k).', 'DF-II: w(n) = x(n) − Σa<sub>k</sub>w(n−k), y(n) = Σb<sub>m</sub>w(n−m); one shared line of max(M, N) delays.', 'Feedback multipliers in the drawing are −a<sub>k</sub>; feedforward are b<sub>m</sub>.', 'FIR = only the b taps (no feedback).'],
        tip: 'Check stability on the poles before realizing: roots of λᴺ + a₁λᴺ⁻¹ + … + a<sub>N</sub> = 0 must be inside the unit circle.' },
      { name: 'Read a block diagram', when: 'Diagram → equation.',
        steps: ['Label the output of every delay (w(n−1), w(n−2), …).', 'Write each adder as an equation exactly as drawn.', 'Eliminate the internal signal w to get the y–x relation.', 'Convert to the standard a<sub>k</sub>/b<sub>m</sub> form last.']
      }
    ]
  },
  {
    topic: 'Lecture 4 · Z-transform', items: [
      { name: 'Z-transform and ROC', when: 'Given x(n).',
        steps: ['Finite: write X(z) = Σx(n)z⁻ⁿ term by term; ROC = whole plane minus 0 and/or ∞ depending on which powers appear.', 'aⁿu(n) → 1/(1−az⁻¹), |z| &gt; |a|. −aⁿu(−n−1) → same expression, |z| &lt; |a|.', 'Sum of terms: ROC is the <b>intersection</b>; if empty, no Z-transform.', 'Use the property table (shift, scale, differentiate, convolve) instead of summing again.'],
        tip: 'ROC never contains a pole. Right-sided = outside, left-sided = inside, two-sided = ring.' },
      { name: 'Inverse Z (the decision tree)', when: 'Given X(z) and ROC.',
        steps: ['<b>Improper?</b> (numerator degree ≥ denominator degree in z⁻¹) divide first: polynomial part → impulses.', '<b>Factor</b> the denominator into (1 − p<sub>k</sub>z⁻¹).', '<b>Residues:</b> distinct p<sub>k</sub>: A<sub>k</sub> = [(1 − p<sub>k</sub>z⁻¹)X(z)] at z = p<sub>k</sub>. Repeated: expand X(z)/z in z/(z−p)ᵐ terms. Complex pair: A and A*.', '<b>Pick each term’s side from the ROC:</b> pole inside the ROC’s inner edge → right-sided pⁿu(n); pole outside → left-sided −pⁿu(−n−1).', 'Check x(0) and x(1) with long division.']
      },
      { name: 'From difference equation to H(z)', when: 'Zero initial conditions.',
        steps: ['Replace y(n−k) → z⁻ᵏY(z), x(n−m) → z⁻ᵐX(z).', 'H(z) = Y/X = (b₀ + b₁z⁻¹ + …)/(1 + a₁z⁻¹ + …).', 'Multiply top and bottom by zᴺ to read poles/zeros as roots in z.', 'h(n) = Z⁻¹{H}; step response: invert H(z)/(1−z⁻¹).', 'Stable causal ⇔ all poles |p| &lt; 1.']
      },
      { name: 'Nonzero initial conditions (one-sided Z)', when: 'Given y(−1), y(−2).',
        steps: ['Use Z⁺{y(n−1)} = z⁻¹Y + y(−1); Z⁺{y(n−2)} = z⁻²Y + z⁻¹y(−1) + y(−2).', 'Collect: Y(z)·D(z) = N<sub>ic</sub>(z) + N<sub>input</sub>(z)X(z).', 'ZIR = N<sub>ic</sub>/D; ZSR = H(z)X(z).', 'Invert each part with the inverse-Z tree.']
      }
    ]
  },
  {
    topic: 'Design problems', items: [
      { name: 'Pole-zero placement', when: 'Notch, resonator, oscillator, smoother.',
        steps: ['Convert the frequency to ω₀ = 2πF/F<sub>s</sub> (rad/sample).', '<b>To remove ω₀:</b> zeros at e<sup>±jω₀</sup> (numerator 1 − 2cos ω₀ z⁻¹ + z⁻²). Add poles at r·e<sup>±jω₀</sup> with r close to 1 to keep neighbors untouched; width ≈ 2(1−r) rad.', '<b>To pass ω₀ (resonate):</b> poles near e<sup>±jω₀</sup>; r = 1 gives an oscillator (marginal).', '<b>Smoothing:</b> real pole at a ≈ 1; time constant ≈ −1/ln a samples.', 'Write H(z) → difference equation → coefficients.', 'Verify: poles inside the circle, DC gain H(1), and the frequency response at ω₀ and a neighbor.']
      },
      { name: 'Sizing a converter', when: 'ADC / sampling-rate design.',
        steps: ['F<sub>s</sub> = 2B × (1 + guard) and filter: pass B, stop F<sub>s</sub> − B.', 'Bits: from the Δ spec (L = range/Δ + 1) or the SQNR spec (b ≥ (SQNR − 1.76)/6.02).', 'Bit rate = F<sub>s</sub> · b.', 'Report the trade-offs (filter difficulty vs rate).']
      }
    ]
  }
];

var FORMULAS = [
  {
    topic: 'Lecture 1 · Signals & sampling', items: [
      { name: 'Sampling relations', eq: 'f = ' + frac('F', 'F<sub>s</sub>'), note: 'x(n) = x<sub>a</sub>(nT), T = 1/F<sub>s</sub>. Distinct DT sinusoids: −½ ≤ f ≤ ½ (−π ≤ ω ≤ π). Folding frequency F<sub>s</sub>/2.' },
      { name: 'Nyquist and aliasing', eq: 'F<sub>s</sub> ≥ 2F<sub>max</sub> &nbsp;&nbsp;&nbsp; F<sub>alias</sub> = F − kF<sub>s</sub>', note: 'Pick the integer k that puts F<sub>alias</sub> in [−F<sub>s</sub>/2, F<sub>s</sub>/2].' },
      { name: 'DT sinusoid periodicity', eq: 'x(n+N) = x(n) ⇔ f = ' + frac('k', 'N') + ' rational', note: 'Sum/product of sinusoids: N = lcm of the periods.' },
      { name: 'Quantization', eq: 'Δ = ' + frac('x<sub>max</sub> − x<sub>min</sub>', 'L − 1') + ', &nbsp; L = 2<sup>b</sup>, &nbsp; P<sub>q</sub> = ' + frac('Δ<sup>2</sup>', '12') + ' <span style="font-size:.7em">(rounding)</span>', note: 'Truncation: mean-square error Δ²/3. Error e<sub>q</sub>(n) = x<sub>q</sub>(n) − x(n), |e<sub>q</sub>| ≤ Δ/2 for rounding.' },
      { name: 'SQNR', eq: 'SQNR<sub>dB</sub> = 10log<sub>10</sub>' + frac('P<sub>x</sub>', 'P<sub>q</sub>') + ', &nbsp; full-scale sine: 6.02b + 1.76', note: 'P<sub>x</sub> = (1/N)Σx²(n); a sinusoid has A²/2.' },
      { name: 'Energy and average power', eq: 'E = Σ|x(n)|<sup>2</sup>, &nbsp;&nbsp; P = lim ' + frac('1', '2N+1') + 'Σ<sub>−N</sub><sup>N</sup>|x(n)|<sup>2</sup>', note: 'Periodic: P = (1/N)Σ over one period. Energy signal: 0 &lt; E &lt; ∞ (P = 0). Power signal: 0 &lt; P &lt; ∞ (E = ∞).' },
      { name: 'Even / odd parts', eq: 'x<sub>e</sub> = ½[x(n) + x(−n)], &nbsp; x<sub>o</sub> = ½[x(n) − x(−n)]' }
    ]
  },
  {
    topic: 'Lecture 2 · DT systems', items: [
      { name: 'Elementary signals', eq: 'δ(n), &nbsp; u(n) = Σ<sub>k≥0</sub>δ(n−k), &nbsp; r(n) = n·u(n), &nbsp; aⁿu(n), &nbsp; e<sup>jωn</sup>', note: 'δ(n) = u(n) − u(n−1). Sifting: x(n) = Σ<sub>k</sub> x(k)δ(n−k).' },
      { name: 'Operations', eq: 'delay: x(n−k) &nbsp;&nbsp; advance: x(n+k) &nbsp;&nbsp; fold: x(−n) &nbsp;&nbsp; down-sample: x(Mn)', note: 'Block diagram elements: adder, multiplier, constant multiplier, unit delay z⁻¹, unit advance z.' },
      { name: 'Convolution sum', eq: 'y(n) = Σ<sub>k=−∞</sub><sup>∞</sup> x(k)h(n−k) = x(n) * h(n)', note: 'Causal: h(n) = 0 for n &lt; 0. Commutative, associative, distributive. Cascade: h₁ * h₂. Parallel: h₁ + h₂.' },
      { name: 'BIBO stability', eq: 'Σ<sub>n</sub> |h(n)| &lt; ∞', note: 'FIR: always stable. IIR: depends on pole locations.' },
      { name: 'Linearity and time invariance', eq: 'T[a₁x₁ + a₂x₂] = a₁T[x₁] + a₂T[x₂] &nbsp;&nbsp; T[x(n−k)] = y(n−k)' },
      { name: 'Cross- and autocorrelation', eq: 'r<sub>xy</sub>(l) = Σ<sub>n</sub> x(n)y(n−l), &nbsp; r<sub>xy</sub>(l) = r<sub>yx</sub>(−l), &nbsp; r<sub>xx</sub>(l) = r<sub>xx</sub>(−l)', note: 'r<sub>xx</sub>(0) = energy. r<sub>yy</sub> = r<sub>hh</sub> * r<sub>xx</sub>; r<sub>yx</sub> = h * r<sub>xx</sub>. r<sub>xy</sub>(l) = x(l) * y(−l).' }
    ]
  },
  {
    topic: 'Lecture 3 · LCCDE', items: [
      { name: 'General form', eq: 'y(n) = −Σ<sub>k=1</sub><sup>N</sup> a<sub>k</sub>y(n−k) + Σ<sub>m=0</sub><sup>M</sup> b<sub>m</sub>x(n−m)', note: 'Non-recursive (FIR) if all a<sub>k</sub> = 0. Recursive has feedback. Order = N.' },
      { name: 'Characteristic equation', eq: 'λ<sup>N</sup> + a₁λ<sup>N−1</sup> + … + a<sub>N</sub> = 0', note: 'Roots = system poles. Distinct: y<sub>h</sub> = ΣC<sub>k</sub>λ<sub>k</sub>ⁿ. Repeated (multiplicity m): (C₁ + C₂n + … + C<sub>m</sub>nᵐ⁻¹)λⁿ.' },
      { name: 'Total response', eq: 'y = y<sub>h</sub> + y<sub>p</sub> = y<sub>zi</sub> + y<sub>zs</sub>', note: 'y<sub>zs</sub> = h * x (relaxed). y<sub>zi</sub> is the response to initial conditions with x = 0. y<sub>p</sub> ↔ steady state, y<sub>h</sub> ↔ transient (when stable).' },
      { name: 'Particular-solution forms', eq: 'K &nbsp; | &nbsp; Kaⁿ &nbsp; | &nbsp; K₀nᴹ+…+K<sub>M</sub> &nbsp; | &nbsp; K₁cos ω₀n + K₂sin ω₀n', note: 'Input: constant, aⁿ, polynomial nᴹ, sinusoid. ⚠ If the input form is already a homogeneous mode, multiply by n.' },
      { name: 'Impulse response of a recursive system', eq: 'h(n) = y<sub>zs</sub>(n) for x = δ(n)', note: 'Use y(0) = b₀, y(1) = b₁ − a₁b₀ … to fit constants.' },
      { name: 'Direct Form II', eq: 'w(n) = x(n) − Σa<sub>k</sub>w(n−k), &nbsp; y(n) = Σb<sub>m</sub>w(n−m)', note: 'Memory = max(M, N) delays (DF-I uses M + N). ⚠ Drawn feedback gains are −a<sub>k</sub>.' },
      { name: 'Second-order section', eq: 'y(n) = −a₁y(n−1) − a₂y(n−2) + b₀x(n) + b₁x(n−1) + b₂x(n−2)', note: 'Building block for higher-order filters (cascade of SOS).' }
    ]
  },
  {
    topic: 'Lecture 4 · Z-transform', items: [
      { name: 'Definition', eq: 'X(z) = Σ<sub>n=−∞</sub><sup>∞</sup> x(n)z<sup>−n</sup>', note: 'ROC = set of z with a finite sum. One-sided: Σ<sub>n=0</sub><sup>∞</sup> (used with initial conditions).' },
      { name: 'Common pairs (ROC)', eq: 'δ(n) ↔ 1 &nbsp;&nbsp; u(n) ↔ ' + frac('1', '1 − z<sup>−1</sup>') + ' &nbsp;&nbsp; aⁿu(n) ↔ ' + frac('1', '1 − az<sup>−1</sup>') + ' <span style="font-size:.7em">|z|&gt;|a|</span>', note: '−aⁿu(−n−1) ↔ 1/(1−az⁻¹), |z| &lt; |a|. nu(n) ↔ z⁻¹/(1−z⁻¹)². naⁿu(n) ↔ az⁻¹/(1−az⁻¹)². (n+1)aⁿu(n) ↔ 1/(1−az⁻¹)².' },
      { name: 'Damped sinusoids', eq: 'rⁿcos(ω₀n)u(n) ↔ ' + frac('1 − r cos ω₀ z<sup>−1</sup>', '1 − 2r cos ω₀ z<sup>−1</sup> + r<sup>2</sup>z<sup>−2</sup>') + '<br>rⁿsin(ω₀n)u(n) ↔ ' + frac('r sin ω₀ z<sup>−1</sup>', '1 − 2r cos ω₀ z<sup>−1</sup> + r<sup>2</sup>z<sup>−2</sup>'), note: 'r = 1 for undamped cos/sin. Poles at re<sup>±jω₀</sup>.' },
      { name: 'Properties', eq: 'x(n−k) ↔ z<sup>−k</sup>X(z) &nbsp;&nbsp; aⁿx(n) ↔ X(a<sup>−1</sup>z) &nbsp;&nbsp; x(−n) ↔ X(z<sup>−1</sup>)<br>n·x(n) ↔ −z ' + frac('dX', 'dz') + ' &nbsp;&nbsp; x₁ * x₂ ↔ X₁X₂', note: 'Also linearity, correlation r<sub>x₁x₂</sub> ↔ X₁(z)X₂(z⁻¹), windowing (product ↔ convolution of transforms). ⚠ Shift moves the whole expression (including u).' },
      { name: 'Initial value (causal)', eq: 'x(0) = lim<sub>z→∞</sub> X(z)' },
      { name: 'System function', eq: 'H(z) = ' + frac('Y(z)', 'X(z)') + ' = ' + frac('b₀ + b₁z<sup>−1</sup> + … + b<sub>M</sub>z<sup>−M</sup>', '1 + a₁z<sup>−1</sup> + … + a<sub>N</sub>z<sup>−N</sup>') + ' = b₀z<sup>N−M</sup>' + frac('Π(z − z<sub>k</sub>)', 'Π(z − p<sub>k</sub>)'), note: 'Zeros z<sub>k</sub>: H = 0. Poles p<sub>k</sub>: H = ∞. FIR: all poles at 0. Purely recursive (all-pole): b₁…b<sub>M</sub> = 0.' },
      { name: 'Stability and ROC', eq: 'BIBO stable ⇔ ROC ∋ |z| = 1 &nbsp;&nbsp; causal ⇔ |z| &gt; r<sub>max</sub> &nbsp;&nbsp; causal &amp; stable ⇔ all |p<sub>k</sub>| &lt; 1' },
      { name: 'Partial-fraction residues', eq: 'A<sub>k</sub> = (1 − p<sub>k</sub>z<sup>−1</sup>)X(z)|<sub>z=p<sub>k</sub></sub>', note: 'Conjugate poles ⇒ conjugate residues: x(n) = 2|A||p|ⁿcos(nθ + ∠A)u(n). Repeated poles: differentiation property, z/(z−p)² ↔ npⁿ⁻¹u(n).' },
      { name: 'One-sided shift', eq: 'Z⁺{y(n−1)} = z<sup>−1</sup>Y(z) + y(−1)<br>Z⁺{y(n−2)} = z<sup>−2</sup>Y(z) + z<sup>−1</sup>y(−1) + y(−2)', note: 'Y(z) = ZIR(z) + H(z)X(z). ZIR numerator comes only from initial conditions.' }
    ]
  }
];

var CHEAT = [
  {
    title: 'Red flags (the traps that cost points)',
    items: [
      '<b>Aliasing:</b> subtract the integer <i>before</i> scaling by F<sub>s</sub>; sin flips sign, cos does not. A DT sinusoid is periodic only if f is <i>rational</i>.',
      '<b>Fold/delay order:</b> fold-then-delay by k is x(−(n−k)); delay-then-fold is x(−n−k). Different signals.',
      '<b>Linearity:</b> y = 2x + 3 is <i>not</i> linear (zero in ≠ zero out) but is time-invariant. y = x² is non-linear. y = x(4n) is time-variant. y = n·x(n−1) is time-variant <i>and</i> unstable.',
      '<b>Convolution:</b> length = L<sub>x</sub> + L<sub>h</sub> − 1; first index = sum of first indices; Σy = ΣxΣh. Don’t forget zero taps are still part of h(n).',
      '<b>Recursive ≠ IIR.</b> A recursive running sum can be FIR (pole–zero cancellation); FIR ⇔ finite h(n).',
      '<b>LCCDE:</b> fit C₁, C₂ with y(0), y(1) of the <i>total</i> solution; resonance (input = natural mode) ⇒ multiply y<sub>p</sub> by n; repeated root ⇒ extra factor n.',
      '<b>Realization:</b> normalize the y(n) coefficient to 1 first; drawn feedback gain is −a<sub>k</sub>; DF-II uses max(M, N) delays, DF-I uses M + N.',
      '<b>Z-transform shift:</b> aⁿu(n−2) ≠ aⁿ⁻²u(n−2) — rewrite before using z⁻². Time reversal flips the ROC to the inside.',
      '<b>ROC:</b> never contains a pole. X(z) without ROC does not define x(n). Sum of right- and left-sided pieces may have <i>empty</i> ROC (no transform).',
      '<b>Improper X(z):</b> divide first; the polynomial part gives impulses at the start of x(n).',
      '<b>Stability:</b> BIBO stable ⇔ unit circle in the ROC. Causal ⇒ all poles inside |z| &lt; 1. A pole at 2 can give a stable system only if non-causal.',
      '<b>Pole angle ↔ frequency:</b> ω₀ = 2πF/F<sub>s</sub>. Radius ↔ decay; r = 1 ⇒ sustained oscillation (marginal); r &gt; 1 ⇒ growth.'
    ]
  },
  {
    title: 'Numbers worth knowing cold',
    items: [
      'SQNR(full-scale sine) = 6.02b + 1.76 dB; every bit adds 6.02 dB; truncation is 6.02 dB worse than rounding (mean-square).',
      '2cos 36° = 1.618 (golden ratio), sin 36° = 0.5878, cos 45° = sin 45° = 0.7071, cos 60° = 0.5, sin 60° = 0.866.',
      'Σ<sub>k=0</sub>ⁿ aᵏ = (1 − aⁿ⁺¹)/(1 − a);  Σ<sub>k=0</sub>^∞ aᵏ = 1/(1 − a) for |a| &lt; 1.',
      'Step response of 1/(1 − az⁻¹): (1 − aⁿ⁺¹)/(1 − a); settles (95 %) in about 3/(−ln a) samples.',
      'Moving average of length M: zeros at ω = 2πk/M, DC gain 1, h = 1/M each.'
    ]
  }
];
