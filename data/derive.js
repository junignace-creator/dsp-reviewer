/* Open-notes pack: DERIVE (how to arrive at an equation) and GRAPHS (how to draw it). Rendered in the "Notes (print)" tab. */
var DERIVE = [
  {
    topic: 'Lecture 1 · Sampling & quantization', items: [
      { name: 'Sampling relation and aliasing', steps: [
        'x(n) = x<sub>a</sub>(nT) = A cos(2πF·nT + φ) = A cos(2π(F/F<sub>s</sub>)n + φ), so <b>f = F/F<sub>s</sub></b>.',
        'For integer k and integer n: cos(2π(f + k)n + φ) = cos(2πfn + φ). So f and f + k give the <b>same samples</b>; only −½ ≤ f ≤ ½ is distinct.',
        'Alias: f′ = f − k (k = nearest integer), <b>F′ = F − kF<sub>s</sub></b>. To avoid aliasing need |F| &lt; F<sub>s</sub>/2: <b>F<sub>s</sub> ≥ 2F<sub>max</sub></b>.'
      ] },
      { name: 'SQNR = 6.02b + 1.76 dB', steps: [
        'Sine of amplitude A: range 2A, L = 2<sup>b</sup> levels ⇒ Δ ≈ 2A/2<sup>b</sup>. Signal power P<sub>x</sub> = A²/2.',
        'Rounding error e is uniform on (−Δ/2, Δ/2): P<sub>q</sub> = (1/Δ)∫e² de = <b>Δ²/12</b> = A²/(3·2<sup>2b</sup>).',
        'SQNR = P<sub>x</sub>/P<sub>q</sub> = (3/2)·2<sup>2b</sup>. In dB: 10log₁₀1.5 + 20b·log₁₀2 = <b>1.76 + 6.02b</b>.'
      ] }
    ]
  },
  {
    topic: 'Lecture 2 · DT systems', items: [
      { name: 'The convolution sum', steps: [
        'Any signal is a sum of shifted impulses: x(n) = Σ<sub>k</sub> x(k)δ(n − k).',
        'Time invariance: δ(n − k) → h(n − k). Linearity: scale and add.',
        '<b>y(n) = Σ<sub>k=−∞</sub><sup>∞</sup> x(k)h(n − k) = x(n) * h(n)</b>. Substitute k → n − k to get h * x (commutative). Causal h (h = 0 for n &lt; 0) and causal x: limits 0 … n.'
      ] },
      { name: 'BIBO stability ⇔ Σ|h(n)| &lt; ∞', steps: [
        'If |x| ≤ M<sub>x</sub>: |y(n)| ≤ Σ|h(k)||x(n−k)| ≤ M<sub>x</sub>Σ|h(k)|. Finite sum ⇒ bounded output (sufficient).',
        'Necessary: choose x(n) = sgn h(−n); then y(0) = Σ|h(k)|, which is unbounded if the sum is.'
      ] }
    ]
  },
  {
    topic: 'Lecture 3 · LCCDE', items: [
      { name: 'Direct method (homogeneous + particular)', steps: [
        'y(n) = y<sub>h</sub>(n) + y<sub>p</sub>(n).',
        '<b>Homogeneous</b> (x = 0): try y<sub>h</sub> = λⁿ in Σa<sub>k</sub>y(n − k) = 0 ⇒ characteristic polynomial <b>λᴺ + a₁λᴺ⁻¹ + … + a<sub>N</sub> = 0</b>. Distinct roots: Σ C<sub>i</sub>λ<sub>i</sub>ⁿ; repeated root of multiplicity m: (C₁ + C₂n + … )λⁿ.',
        '<b>Particular:</b> same form as the input (constant → K; aⁿ → Kaⁿ, use nKaⁿ if a is a root; cos/sin → K₁cos + K₂sin). Substitute to find K.',
        '<b>Constants</b> C<sub>i</sub> from the initial conditions applied to the <i>total</i> y (not to y<sub>h</sub>). ZIR: x = 0 with the given y(−1), y(−2). ZSR: zero initial conditions.'
      ] },
      { name: 'Direct Form II from H(z)', steps: [
        'H(z) = B(z)/A(z) = [1/A(z)]·B(z): do the all-pole part first. Define W(z) = X(z)/A(z) ⇒ <b>w(n) = x(n) − a₁w(n−1) − … − a<sub>N</sub>w(n−N)</b>.',
        'Then Y(z) = B(z)W(z) ⇒ <b>y(n) = b₀w(n) + b₁w(n−1) + … + b<sub>M</sub>w(n−M)</b>. One shared delay line of max(M, N) delays.',
        'Direct Form I does B(z) first (M delays on x), then 1/A(z) (N delays on y): M + N delays.'
      ] }
    ]
  },
  {
    topic: 'Lecture 4 · Z-transform', items: [
      { name: 'Z{aⁿu(n)} and Z{−aⁿu(−n−1)}, with ROC', steps: [
        'Causal: X(z) = Σ<sub>n=0</sub><sup>∞</sup>(az⁻¹)ⁿ = <b>1/(1 − az⁻¹) = z/(z − a)</b> when |az⁻¹| &lt; 1, i.e. <b>|z| &gt; |a|</b>.',
        'Anti-causal: −Σ<sub>n=−∞</sub><sup>−1</sup>(az⁻¹)ⁿ = −Σ<sub>m=1</sub><sup>∞</sup>(z/a)ᵐ = −(z/a)/(1 − z/a) = <b>1/(1 − az⁻¹)</b> when <b>|z| &lt; |a|</b>.',
        'Same algebra, different ROC ⇒ different signal. X(z) alone does not determine x(n).'
      ] },
      { name: 'Shift, scaling, reversal, convolution', steps: [
        '<b>Shift:</b> Σx(n−k)z⁻ⁿ, let m = n − k: z⁻ᵏΣx(m)z⁻ᵐ = <b>z⁻ᵏX(z)</b>.',
        '<b>Scaling:</b> Σaⁿx(n)z⁻ⁿ = Σx(n)(a⁻¹z)⁻ⁿ = <b>X(a⁻¹z)</b>; ROC becomes |a|r₁ &lt; |z| &lt; |a|r₂.',
        '<b>Reversal:</b> Σx(−n)z⁻ⁿ, let m = −n: Σx(m)zᵐ = <b>X(z⁻¹)</b>; ROC 1/r₂ &lt; |z| &lt; 1/r₁.',
        '<b>Convolution:</b> Σ<sub>n</sub>Σ<sub>k</sub>x(k)h(n−k)z⁻ⁿ = Σx(k)z⁻ᵏ·Σh(m)z⁻ᵐ (m = n − k) = <b>X(z)H(z)</b>.'
      ] },
      { name: 'Differentiation: Z{n·x(n)} = −z·dX/dz', steps: [
        'dX/dz = Σ(−n)x(n)z⁻ⁿ⁻¹ ⇒ −z·dX/dz = Σn·x(n)z⁻ⁿ.',
        'Example: X = 1/(1 − az⁻¹) ⇒ dX/dz = −(1 − az⁻¹)⁻²·(az⁻²) ⇒ <b>Z{n·aⁿu(n)} = az⁻¹/(1 − az⁻¹)²</b>, |z| &gt; |a|.'
      ] },
      { name: 'cos and sin pairs', steps: [
        'cos ω₀n = ½(e<sup>jω₀n</sup> + e<sup>−jω₀n</sup>): two exponentials aⁿ with a = e<sup>±jω₀</sup>.',
        '½[1/(1 − e<sup>jω₀</sup>z⁻¹) + 1/(1 − e<sup>−jω₀</sup>z⁻¹)] = <b>(1 − cos ω₀ z⁻¹)/(1 − 2cos ω₀ z⁻¹ + z⁻²)</b>, |z| &gt; 1.',
        'sin ω₀n = (1/2j)(e<sup>jω₀n</sup> − e<sup>−jω₀n</sup>) ⇒ <b>sin ω₀ z⁻¹/(1 − 2cos ω₀ z⁻¹ + z⁻²)</b>. For rⁿcos/rⁿsin replace z⁻¹ by rz⁻¹ (scaling).'
      ] },
      { name: 'Partial-fraction coefficients and complex poles', steps: [
        'X(z) = ΣA<sub>k</sub>/(1 − p<sub>k</sub>z⁻¹). Multiply both sides by (1 − p<sub>k</sub>z⁻¹) and set z = p<sub>k</sub>: <b>A<sub>k</sub> = [(1 − p<sub>k</sub>z⁻¹)X(z)]<sub>z=p<sub>k</sub></sub></b>.',
        'Repeated pole: write A/(1 − pz⁻¹) + B/(1 − pz⁻¹)² and use (1 − pz⁻¹)⁻² ↔ (n + 1)pⁿu(n) (or the differentiation pair).',
        'Complex pair p, p* ⇒ A, A* (real signal). With A = |A|e<sup>jα</sup>, p = |p|e<sup>jβ</sup>: A pⁿ + A*(p*)ⁿ = <b>2|A||p|ⁿcos(βn + α)</b>.'
      ] },
      { name: 'H(z) from a difference equation, poles and zeros', steps: [
        'Zero initial conditions, Z of both sides: Y(z)(1 + Σa<sub>k</sub>z⁻ᵏ) = X(z)Σb<sub>m</sub>z⁻ᵐ ⇒ <b>H(z) = B(z)/A(z)</b>.',
        'Multiply top and bottom by zᴺ: H(z) = b₀z<sup>N−M</sup>Π(z − z<sub>k</sub>)/Π(z − p<sub>k</sub>). Zeros z<sub>k</sub>: H = 0. Poles p<sub>k</sub>: H = ∞ (extra poles/zeros at z = 0 from N − M).',
        'Improper (M ≥ N): divide first, then partial fractions on the remainder. h(n) = Z⁻¹{H} for the right ROC.'
      ] },
      { name: 'Stability and causality from the ROC', steps: [
        'Causal ⇒ right-sided ⇒ ROC is outside the outermost pole (|z| &gt; r<sub>max</sub>).',
        'BIBO stable ⇔ Σ|h| &lt; ∞ ⇔ H(e<sup>jω</sup>) exists ⇔ <b>unit circle inside the ROC</b>.',
        'Both ⇒ all poles satisfy <b>|p| &lt; 1</b>. A pole on the circle is marginal (an oscillator or accumulator), not BIBO stable.'
      ] },
      { name: 'One-sided Z and initial conditions', steps: [
        'X⁺(z) = Σ<sub>n=0</sub><sup>∞</sup>x(n)z⁻ⁿ. For the delay: Σ<sub>n=0</sub><sup>∞</sup>x(n−1)z⁻ⁿ = x(−1) + z⁻¹X⁺(z). Twice: <b>Z⁺{x(n−2)} = z⁻²X⁺(z) + z⁻¹x(−1) + x(−2)</b>.',
        'Take Z⁺ of the LCCDE, collect Y⁺: <b>Y⁺(z) = P(z)/A(z) + H(z)X(z)</b>, where P comes only from y(−1), y(−2), …',
        'First term = zero-input response; second = zero-state response. Invert each term separately.'
      ] }
    ]
  },
  {
    topic: 'Design derivations', items: [
      { name: 'First-order smoother from a settling-time spec', steps: [
        'y(n) = a·y(n−1) + (1 − a)x(n), 0 &lt; a &lt; 1; DC gain = (1 − a)/(1 − a) = 1.',
        'Step response: y(n) = 1 − aⁿ⁺¹. To reach 95 % at sample N: aᴺ⁺¹ = 0.05 ⇒ <b>a = 0.05<sup>1/(N+1)</sup></b>.',
        'Time constant τ ≈ −1/ln a samples (63 %); 95 % ≈ 3τ.'
      ] },
      { name: 'Inverse system for an echo or ISI', steps: [
        'Echo: y(n) = x(n) + αx(n − D) ⇒ H(z) = 1 + αz⁻ᴰ. The equalizer is the inverse: <b>H<sub>i</sub>(z) = 1/(1 + αz⁻ᴰ)</b>.',
        'Difference equation: <b>x̂(n) = y(n) − αx̂(n − D)</b>. h<sub>i</sub>(n) = Σ(−α)ᵏδ(n − kD).',
        'Causal and stable only if the poles (|z|ᴰ = |α|) lie inside the unit circle: <b>|α| &lt; 1</b>.'
      ] },
      { name: 'Moving-average null: zeros at the roots of unity', steps: [
        'H(z) = (1/M)Σ<sub>k=0</sub><sup>M−1</sup>z⁻ᵏ = (1/M)(1 − z⁻ᴹ)/(1 − z⁻¹) (geometric sum).',
        'Zeros: z<sup>M</sup> = 1 except z = 1 ⇒ ω = 2πk/M, k = 1…M−1. To null ω₀ choose <b>M = 2π/ω₀</b> (first zero), which also nulls its multiples.'
      ] },
      { name: 'Notch filter (remove ω₀, leave the rest)', steps: [
        'Zeros on the circle at e<sup>±jω₀</sup> for an exact null: numerator <b>1 − 2cos ω₀ z⁻¹ + z⁻²</b>.',
        'Poles at r·e<sup>±jω₀</sup>, just inside the circle (r ≈ 0.9–0.99), cancel the zeros away from ω₀: denominator <b>1 − 2r cos ω₀ z⁻¹ + r²z⁻²</b>.',
        'Bandwidth ≈ 2(1 − r) rad/sample. DC gain = H(1) = (2 − 2cos ω₀)/(1 − 2r cos ω₀ + r²). Closer r → 1: narrower notch, longer ring-down.'
      ] },
      { name: 'Digital oscillator (sine and cosine)', steps: [
        'Want y(n) = sin(ω₀n)u(n) for x = δ(n): H(z) = Y(z) = <b>sin ω₀ z⁻¹/(1 − 2cos ω₀ z⁻¹ + z⁻²)</b>, ω₀ = 2πF/F<sub>s</sub>. Poles at e<sup>±jω₀</sup> (on the unit circle).',
        'Difference equation: y(n) = 2cos ω₀·y(n−1) − y(n−2) + sin ω₀·x(n−1). Cosine: numerator 1 − cos ω₀ z⁻¹.',
        'No impulse? Preload the history: sine y(−1) = −sin ω₀, y(−2) = −sin 2ω₀; cosine y(−1) = cos ω₀, y(−2) = cos 2ω₀ (continue the sinusoid backwards).'
      ] },
      { name: 'ADC and quantizer sizing', steps: [
        'Sampling: F<sub>s</sub> ≥ 2F<sub>max</sub> (plus a guard band if the anti-alias filter is not ideal).',
        'From an SQNR spec: b ≥ (SQNR<sub>dB</sub> − 1.76)/6.02, round up. From a resolution: L = range/Δ + 1 ⇒ b = ⌈log₂L⌉.',
        'Bit rate = b·F<sub>s</sub>. Memory/delay of D samples costs D·b bits; D = delay·F<sub>s</sub>.'
      ] }
    ]
  }
];

var GRAPHS = [
  {
    title: 'Stem plots: shifting, folding, scaling', steps: [
      'Write the new signal as x(argument). Make a two-row table: n and argument, then read x(argument) at each n.',
      'Delay x(n − k): shift right by k. Fold x(−n): mirror about n = 0. Fold-then-delay x(−(n − k)) = x(k − n): mirror, then place the old n = 0 sample at n = k.',
      'x(2n) keeps every second sample (compressed, information lost); x(n/2) inserts zeros. Mark n = 0 with an arrow and label the heights.'
    ]
  },
  {
    title: 'Aliasing picture (frequency axis)', steps: [
      'Draw an axis in Hz with ticks at 0, F<sub>s</sub>/2, F<sub>s</sub>, 3F<sub>s</sub>/2 … and fold it like a zig-zag at each multiple of F<sub>s</sub>/2.',
      'A tone at F lands at the same height on the first strip [0, F<sub>s</sub>/2]: that is F<sub>alias</sub> = |F − kF<sub>s</sub>|.',
      'Sketch the samples: mark the sampling instants nT on the original sinusoid and connect them with the slower alias.'
    ]
  },
  {
    title: 'Sketching a convolution', steps: [
      'Length L<sub>x</sub> + L<sub>h</sub> − 1, starts at (first index of x) + (first index of h). Total area Σy = Σx·Σh.',
      'Two equal rectangles ⇒ triangle (peak = overlap length). Rectangle * exponential ⇒ rising then decaying. Causal exp * causal exp ⇒ starts at 0, tends to a smooth hump.',
      'Per output point: fold h, slide it to n, multiply, sum. Draw the folded h under x and shade the overlap.'
    ]
  },
  {
    title: 'Pole-zero plot with ROC', steps: [
      'Draw the z-plane with the unit circle. Poles = <b>x</b>, zeros = <b>o</b> (write multiplicity). Remember extra poles/zeros at z = 0 (or ∞) from N − M.',
      'ROC is a circle, outside the circle, or a ring, bounded by poles. <b>Causal</b>: shade outside the outermost pole. <b>Anti-causal</b>: shade inside the innermost pole. <b>Two-sided</b>: the ring between two poles.',
      '<b>No pole is ever inside the ROC.</b> Stable ⇔ the unit circle lies in the ROC. Finite sequences: all z except 0 and/or ∞.'
    ]
  },
  {
    title: 'Impulse-response shape from the pole', steps: [
      'Pole radius = decay: |p| &lt; 1 decays, = 1 constant/oscillating, &gt; 1 grows. Pole angle = oscillation: θ rad/sample ⇒ F = θF<sub>s</sub>/2π.',
      'Real positive pole: monotone. Real negative pole: alternates sign every sample. Complex pair: decaying cosine. Double pole: n·pⁿ (rises, peaks, decays).',
      'First-order aⁿ: time constant τ = −1/ln a; the envelope is 36.8 % of its start at n = τ.'
    ]
  },
  {
    title: 'Magnitude response from poles and zeros', steps: [
      'Evaluate on the unit circle: <b>|H(e<sup>jω</sup>)| = |b₀|·Π(distance from e<sup>jω</sup> to each zero) / Π(distance to each pole)</b>.',
      'ω = 0 is the point z = 1; ω = π is z = −1. Walking counter-clockwise: a pole near the circle at angle θ gives a <b>peak at ω ≈ θ</b>; a zero on the circle at θ gives a <b>null at ω = θ</b>.',
      'Notch: null at ω₀ with flat ≈ 1 elsewhere. Moving average: nulls at multiples of 2π/M, lowpass-like with lobes. Oscillator: infinite peak (pole on the circle).'
    ]
  },
  {
    title: 'Block diagrams (DF-I, DF-II, FIR)', steps: [
      '<b>FIR</b>: tapped delay line z⁻¹ chain, a multiplier b<sub>k</sub> per tap, one adder on the right.',
      '<b>DF-II</b>: one delay chain w(n−k). Left side adders form w(n) = x(n) − Σa<sub>k</sub>w(n−k) (drawn gain = −a<sub>k</sub>); right side forms y(n) = Σb<sub>m</sub>w(n−m). Delays = max(M, N).',
      '<b>DF-I</b>: input delays (b taps) feed an adder, then output delays (−a taps). Delays = M + N. Label every node, e.g. x(n), x(n−1), y(n−1).'
    ]
  }
];

/* Quick rules: the traps and shortcuts that came up while studying. Printed first in the Notes tab. */
var RULES = [
  { title: 'Sampling and the ADC', steps: [
    'f = F/F<sub>s</sub>. Subtract the nearest whole number so f′ ∈ [−½, ½]; alias F′ = |f′|·F<sub>s</sub>. <b>sin flips sign if f′ &lt; 0</b>, cos does not. Tones with the same f′ add (3 + 10 = 13).',
    'D/A output: F = f′·F<sub>s</sub> (only frequencies inside ±F<sub>s</sub>/2 come out). Out-of-band noise folds into the band, so filter <b>before</b> the ADC: pass edge B, stop edge <b>F<sub>s</sub> − B</b>, transition band = F<sub>s</sub> − 2B (≥ 0, so F<sub>s</sub> &gt; 2B in practice).',
    'Quantizer: Δ = R/(L − 1) (from L = R/Δ + 1; the +1 is <i>outside</i> the fraction); L = 2<sup>b</sup>, b = ⌈log₂L⌉. Quantize x: k = round((x − x<sub>min</sub>)/Δ), x<sub>q</sub> = x<sub>min</sub> + kΔ, code = k in binary, error ≤ Δ/2. Sine range = 2A, P = A²/2. <b>8 bits = 1 byte</b> (kbit/s rate vs kB storage).'
  ] },
  { title: 'Shifts, folds, impulses, windows', steps: [
    'Every operation <b>replaces every n</b> in the current formula: delay k → n − k (slides right); advance → n + k; fold → −n. Apply in the order stated: fold-then-delay-4 = x(−(n−4)) = x(4−n); delay-then-fold = x(−n−4) (that is the first result moved 8 left).',
    'δ(n − k) sits at n = k. u(n) = δ(n) + δ(n−1) + δ(n−2) + … (n = 0, 1, 2, …). u(n+3) − u(n−4) = 1 for −3 ≤ n ≤ 3 (7 samples). Fold/delay on a formula, e.g. 1 + n/3 → 1 + (n−4)/3.',
    'Linearity zero-test only <b>rules out</b>: y = 2x + 3 and cos x fail; y = x² passes it but is still non-linear (T[2x] ≠ 2T[x]). Delay = x(n−k); a pure delay is time-invariant, n·x(n) and x(2n) are not.'
  ] },
  { title: 'Convolution and impulse response', steps: [
    'y(n) = Σ x(k)h(n−k): for each n use every pair whose indices <b>add up to n</b>. Length L<sub>x</sub> + L<sub>h</sub> − 1, start = sum of the starts, check Σy = Σx·Σh. Equals polynomial multiplication in z⁻¹.',
    'Finite geometric sum Σ<sub>k=0</sub><sup>n</sup> rᵏ = (rⁿ⁺¹ − 1)/(r − 1). Example: (½)ⁿ * (¼)ⁿ = (¼)ⁿ(2ⁿ⁺¹ − 1). h(n) for x = δ(n): at every step add the <b>feedback term</b> (coefficient × previous h) <b>and</b> the input terms; after the input ends h(n) = p·h(n−1).',
    'Each input impulse launches a scaled, delayed copy of h: x = −δ(n+1) + 2δ(n) + 3δ(n−2) ⇒ y = −h(n+1) + 2h(n) + 3h(n−2). Exponent algebra: aⁿ⁺¹ = a·aⁿ; combine only <b>like terms</b> (same base): 0.5·0.5ⁿ − 0.5ⁿ = −0.5·0.5ⁿ, but 0.5ⁿ − 1ⁿ = 0.5ⁿ − 1.'
  ] },
  { title: 'LCCDE, ZIR/ZSR and realizations', steps: [
    'Solve for y(n) to recurse: y(n) = −Σa<sub>k</sub>y(n−k) + Σb<sub>m</sub>x(n−m). Normalize so y(n) has coefficient 1; <b>a<sub>k</sub> = coefficient next to y(n−k) on the left</b>; drawn feedback gain = <b>−a<sub>k</sub></b>. Fill a table n = 0, 1, 2 (needs y(−1), …).',
    'Homogeneous: λⁿ, root of λᴺ + a₁λᴺ⁻¹ + … + a<sub>N</sub> = 0. y + 0.5y(n−1) = x has λ = <b>−0.5</b> (sign!). ZIR: x = 0 with the given y(−1); ZSR: y(−1) = 0; total = ZI + ZS. Fit C with y(0) from the recursion. Transient = decaying part, steady state = forced part (H(1) × input).',
    'DF-I uses M + N delays, DF-II uses max(M, N). Missing term ⇒ coefficient 0 and no tap.'
  ] },
  { title: 'Z-transform, poles and stability', steps: [
    'Replace n by (n − k) in time ⇒ z⁻ᵏ in z. Multiply by zᴺ to get positive powers; the list [1, a₁, a₂, a₃] becomes <b>z³ + a₁z² + a₂z + a₃</b> (same order, a₃ is the constant). <b>w = z⁻¹</b> trick to factor: (1 − ½w)(1 − ¼w) etc.; try ±1, ±2, ±½ as roots, divide out.',
    'Calculator polynomial mode: enter a, b, c, d for ax³ + bx² + cx + d, use 0 for a missing power. Complex poles come in conjugate pairs (same magnitude): <b>magnitude</b> decides growth, angle only sets frequency.',
    'Causal ⇒ ROC outside the outermost pole; stable ⇔ unit circle in ROC ⇒ all |p| &lt; 1; pole on the circle = marginal, not BIBO stable. <b>Quick tests</b> on monic f(z): f(1) &lt; 0 ⇒ real root &gt; 1 (unstable); (−1)ᴺf(−1) &lt; 0 ⇒ root &lt; −1; |a<sub>N</sub>| ≥ 1 ⇒ unstable; Σ|a<sub>k</sub>| &lt; 1 ⇒ stable. If these pass, compute the roots; they cannot prove stability alone.'
  ] }
];
