/* Design problems: start from a spec, end with coefficients / sizes / structure, then verify. */
(function () {
  var circ = Math.PI / 4, k, mazeros = [];
  for (k = 1; k <= 7; k++) mazeros.push({ re: Math.cos(k * circ), im: Math.sin(k * circ), t: '' });
  var barker = [], bl = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 13, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  bl.forEach(function (v, i) { barker.push([i - 12, v]); });
  var w36 = Math.PI / 5, c36 = Math.cos(w36), s36 = Math.sin(w36);

  PROBLEMS.push(
  {
    id: 'DS-01', lec: 'L1', kind: 'design', title: 'ADC front end for speech',
    q: '<b>Spec:</b> speech limited to B = 4 kHz. The A/D must give SQNR ≥ 60 dB for a full-scale sinusoid, and the anti-aliasing filter must reject by ≥ 60 dB anything that would fold into 0–4 kHz. Keep the bit rate modest. Choose F<sub>s</sub>, the anti-alias filter edges and the number of bits, and report the bit rate.',
    a: steps([
      '<b>Minimum rate:</b> Nyquist says F<sub>s</sub> ≥ 2B = 8 kHz. But then the filter must pass 4 kHz and block everything above F<sub>s</sub> − B = 4 kHz: a brick wall (zero transition band) — not realizable.',
      '<b>Pick a guard band:</b> F<sub>s</sub> = 10 kHz. A tone at F between F<sub>s</sub>/2 and F<sub>s</sub> folds to F<sub>s</sub> − F, so everything above F<sub>s</sub> − B = 6 kHz lands in the 0–4 kHz band (6 kHz → 4 kHz, 7 kHz → 3 kHz, …). So the filter needs <b>pass edge 4 kHz, stop edge 6 kHz, ≥ 60 dB</b>: a 2 kHz-wide transition band.',
      '<b>Bits:</b> SQNR ≈ 6.02b + 1.76 dB ≥ 60 ⇒ b ≥ 9.7 ⇒ <b>b = 10 bits</b> (SQNR = 61.96 dB).',
      '<b>Bit rate:</b> R = F<sub>s</sub>·b = 10 000 × 10 = <b>100 kb/s</b>.'
    ]) + tbl(['F<sub>s</sub>', 'Transition band', 'Bit rate (10 b)', 'Verdict'], [
      ['8 kHz', '4 → 4 kHz (none)', '80 kb/s', 'impossible filter'],
      ['<b>10 kHz</b>', '4 → 6 kHz', '<b>100 kb/s</b>', 'practical compromise'],
      ['16 kHz', '4 → 12 kHz', '160 kb/s', 'easy filter, wasteful rate']
    ], 0) + note('Real telephony makes the same compromise: voice is band-limited to ≈ 3.4 kHz and sampled at 8 kHz (transition 3.4 → 4.6 kHz), then μ-law companded to 8 bits for 64 kb/s. The 6 dB/bit rule holds only for a <i>full-scale</i> signal; quiet speech gets a poorer SQNR, which is exactly why companding exists.')
  },
  {
    id: 'DS-02', lec: 'L1', kind: 'design', title: 'Sensor digitizer from a resolution spec',
    q: '<b>Spec:</b> a sensor output spans ±2 V with 2.4 kHz bandwidth. The step size must be no coarser than 1 mV. (a) How many levels and bits? (b) Choose F<sub>s</sub> with 25 % margin over Nyquist. (c) What is the bit rate? (d) What SQNR does a full-scale sine achieve?',
    a: steps([
      '<b>(a)</b> Using the slide’s convention Δ = (x<sub>max</sub> − x<sub>min</sub>)/(L − 1): L − 1 ≥ 4 V / 1 mV = 4000 ⇒ L ≥ 4001 ⇒ 2<sup>11</sup> = 2048 is too few, 2<sup>12</sup> = 4096 works ⇒ <b>12 bits</b>. Actual Δ = 4/4095 = <b>0.977 mV</b> ≤ 1 mV ✓. (11 bits would give Δ = 4/2047 = 1.95 mV ✗.)',
      '<b>(b)</b> Nyquist = 2 × 2.4 kHz = 4.8 kHz; × 1.25 ⇒ <b>F<sub>s</sub> = 6 kHz</b>. Anti-alias filter: pass 2.4 kHz, stop by F<sub>s</sub> − 2.4 = 3.6 kHz.',
      '<b>(c)</b> R = 6000 × 12 = <b>72 kb/s</b>.',
      '<b>(d)</b> Rounding: P<sub>q</sub> = Δ²/12 = 7.95×10⁻⁸ V²; sine P<sub>x</sub> = 2²/2 = 2 V² ⇒ SQNR = 10log(2/7.95×10⁻⁸) = <b>74.0 dB</b> (= 6.02·12 + 1.76 ✓).'
    ]) + note('Notice the order of design: resolution spec → bits → SQNR falls out. The reverse (SQNR spec → bits) was DS-01.')
  },
  {
    id: 'DS-03', lec: 'L2', kind: 'design', title: 'Design an inverse system (echo / ISI equalizer)',
    q: '<b>Spec:</b> a channel adds one echo, y(n) = x(n) + 0.5x(n−1). Design a causal, stable system G that recovers x(n) from y(n). Give g(n) and its difference equation, and prove G * H = δ. Then repeat for a stronger echo y(n) = x(n) + 2x(n−1).',
    a: steps([
      'Channel: h(n) = δ(n) + 0.5δ(n−1) ⇒ H(z) = 1 + 0.5z⁻¹. The equalizer must satisfy G(z)H(z) = 1 ⇒ <b>G(z) = 1/(1 + 0.5z⁻¹)</b>.',
      'Pole at z = −0.5, inside the unit circle ⇒ causal and stable: <b>g(n) = (−0.5)ⁿu(n)</b> (IIR). Difference equation: <b>x̂(n) = y(n) − 0.5x̂(n−1)</b> (recursive — it subtracts its own previous estimate).',
      '<b>Proof:</b> g * h = (−0.5)ⁿu(n) + 0.5(−0.5)ⁿ⁻¹u(n−1) = (−0.5)ⁿ[u(n) − u(n−1)] = <b>δ(n)</b> ✓.',
      '<b>Strong echo:</b> H(z) = 1 + 2z⁻¹ has a zero at z = −2 (outside the unit circle). The inverse 1/(1 + 2z⁻¹) has a pole at −2: the causal inverse (−2)ⁿu(n) <b>explodes</b>; the stable inverse is the anti-causal −(−2)ⁿu(−n−1), which needs future samples of y (usable offline, or with delay).'
    ]) + warn('A causal, stable inverse exists only if all zeros of H(z) lie inside the unit circle (a minimum-phase channel). This is the DSP version of the ISI/equalizer idea from digital communications.')
  },
  {
    id: 'DS-04', lec: 'L2', kind: 'design', title: 'Radar delay estimation with a Barker code',
    q: '<b>Spec:</b> a radar transmits the Barker-13 sequence x(n) = {1, 1, 1, 1, 1, −1, −1, 1, 1, −1, 1, −1, 1}. The receiver sees y(n) = a·x(n − D) + v(n), v white noise. (a) With F<sub>s</sub> = 1 MHz and a correlation peak at lag D = 20, what is the range? (b) What F<sub>s</sub> is needed to separate targets 15 m apart? (c) What are the peak and sidelobe levels of the code, and the noise benefit of correlating? (c = 3×10⁸ m/s)',
    a: steps([
      '<b>Detector:</b> compute r<sub>yx</sub>(l) = Σ y(n)x(n−l). The peak occurs at l = D (with the lecture’s r<sub>xy</sub>(l) = Σ x(n)y(n−l) it appears at l = −D — same information, folded).',
      '<b>(a)</b> Delay = D·T = 20/1 MHz = 20 µs. The wave goes out <i>and</i> back, so <b>R = c·t<sub>d</sub>/2 = 3×10⁸ × 20×10⁻⁶ / 2 = 3000 m</b>.',
      '<b>(b)</b> Resolution is one lag: ΔR = c·T/2 ≤ 15 m ⇒ T ≤ 0.1 µs ⇒ <b>F<sub>s</sub> ≥ 10 MHz</b>.',
      '<b>(c)</b> Autocorrelation of Barker-13 (figure): peak = 13 at l = 0, sidelobes only 0 or ±1. Peak-to-sidelobe = 13:1 ⇒ 20log 13 = <b>22.3 dB</b>.',
      '<b>Noise benefit:</b> at the right lag the 13 aligned samples add coherently, giving a peak of 13a (power 169a²), while zero-mean white noise adds incoherently (power 13σ²). SNR improves from a²/σ² to 13a²/σ²: a gain of 13, i.e. <b>10log 13 = 11.1 dB</b> (the matched-filter gain).'
    ]) + stemFig({ pts: barker, xlo: -12, xhi: 12, labels: { '-12': '1', '12': '1' }, label: 'Barker-13 autocorrelation', cap: 'r_xx(l) of the Barker-13 sequence: one sharp peak of 13 at l = 0; every other lag is 0 or 1.', h: 200 }) +
      note('Why Barker? For any other length-13 ±1 code the sidelobes would usually be larger. Low sidelobes prevent a strong nearby echo from masking a weak distant one.')
  },
  {
    id: 'DS-05', lec: 'L3', kind: 'design', title: 'Exponential smoother from a settling-time spec',
    q: '<b>Spec:</b> design y(n) = a·y(n−1) + (1 − a)·x(n) so that its unit-step response reaches 95 % of its final value by n = 20. Find a, the DC gain, the time constant, and the noise-variance reduction for white input noise.',
    a: steps([
      '<b>Step response by the direct method:</b> y<sub>h</sub> = Caⁿ (the pole is a); for x = u(n), y<sub>p</sub> = K with K(1 − a) = 1 − a ⇒ K = 1. Relaxed: y(0) = 1 − a ⇒ C = −a. So <b>y(n) = 1 − aⁿ⁺¹</b> for n ≥ 0.',
      '<b>Spec:</b> 1 − a²¹ ≥ 0.95 ⇒ a²¹ ≤ 0.05 ⇒ a ≤ 0.05<sup>1/21</sup> = e<sup>ln0.05/21</sup> = e<sup>−0.1427</sup> ⇒ <b>a ≈ 0.867</b>.',
      '<b>DC gain:</b> H(1) = (1 − a)/(1 − a) = <b>1</b> (final value of the step is 1, so no scaling needed).',
      '<b>Time constant:</b> τ ≈ −1/ln a = 7.0 samples; 95 % ≈ 3τ = 21 samples ✓. Pole at z = a = 0.867 (inside the unit circle: stable).',
      '<b>Noise:</b> h(n) = (1 − a)aⁿ ⇒ Σh² = (1 − a)²/(1 − a²) = (1 − a)/(1 + a) = 0.0712 ⇒ white-noise variance is reduced to <b>7 %</b> (−11.5 dB) at the price of a 21-sample lag.'
    ]) + note('The design knob is a single pole location. a → 1 gives more smoothing but slower response; a → 0 gives no smoothing (y = x). That trade-off between noise and speed is the whole story of low-pass design.')
  },
  {
    id: 'DS-06', lec: 'L3', kind: 'design', title: 'Echo/reverb effect and its memory cost',
    q: '<b>Spec:</b> audio at F<sub>s</sub> = 8 kHz. Add an echo 0.25 s after the sound at half amplitude, and let each echo re-echo. Give the difference equation, h(n), H(z), the stability condition and the memory required.',
    a: steps([
      '<b>Delay in samples:</b> D = 0.25 s × 8000 = <b>2000</b>.',
      '<b>Equation:</b> the output feeds back through a 2000-sample delay with gain 0.5: <b>y(n) = x(n) + 0.5y(n − 2000)</b>.',
      '<b>h(n):</b> h(n) = 0.5·h(n − 2000) + δ(n) ⇒ <b>h(n) = Σ<sub>k≥0</sub> (0.5)ᵏ δ(n − 2000k)</b>: impulses of height 1, ½, ¼, … every 2000 samples ⇒ IIR (infinite length from only two coefficients).',
      '<b>H(z)</b> = 1/(1 − 0.5z⁻²⁰⁰⁰): 2000 poles on a circle of radius 0.5<sup>1/2000</sup> = <b>0.99965</b> — just inside the unit circle ⇒ stable. In general stability needs |g| &lt; 1 for feedback gain g.',
      '<b>Memory:</b> a Direct Form II realization shares one delay line: <b>2000 delay elements</b> (= 0.25 s of audio). A feedforward FIR with the same echoes truncated at K repeats would need 2000K.',
      '<b>DC gain:</b> 1/(1 − 0.5) = 2 ⇒ steady tones come out twice as loud; scale the input by 0.5 if unity DC gain is required.'
    ]) + warn('Gain g = 1 would repeat the echo forever (poles on the unit circle, marginal). g &gt; 1 grows without bound. Always check |g| &lt; 1.')
  },
  {
    id: 'DS-07', lec: 'L4', kind: 'design', title: 'Moving-average filter that nulls 50 Hz hum',
    q: '<b>Spec:</b> a signal sampled at 400 Hz is polluted by 50 Hz mains hum. Design a causal FIR moving-average filter with unity DC gain that completely removes it. Give M, h(n), H(z) and the zero locations, and state the other frequencies it also removes.',
    a: steps([
      '<b>Hum frequency:</b> ω = 2π·50/400 = <b>π/4</b>.',
      'A length-M moving average has H(z) = (1/M)Σz⁻ᵏ = (1/M)(1 − z⁻ᴹ)/(1 − z⁻¹). Its zeros are the M-th roots of unity except z = 1 (cancelled by the denominator), i.e. at ω = 2πk/M, k = 1…M−1.',
      'Make the first zero land on π/4: 2π/M = π/4 ⇒ <b>M = 8</b>.',
      '<b>h(n) = 1/8 for 0 ≤ n ≤ 7</b> (unity DC gain: Σh = 1). <b>H(z) = (1/8)(1 − z⁻⁸)/(1 − z⁻¹)</b>.',
      '<b>Also nulled:</b> k = 2, 3, 4 ⇒ 100, 150, 200 Hz (every multiple of F<sub>s</sub>/M = 50 Hz). Gain at 25 Hz is 0.64 and at DC is 1.',
      '<b>Implementation:</b> direct FIR: y(n) = (1/8)Σ<sub>k=0</sub>⁷ x(n−k) (7 adds, 7 delays), or recursive running sum y(n) = y(n−1) + [x(n) − x(n−8)]/8 (same output; the pole at z = 1 is cancelled by a zero, so errors can accumulate in finite precision).'
    ]) + pzFig({ poles: [{ re: 0, im: 0, t: '(7)', dx: 8, dy: -10 }], zeros: mazeros, roc: { type: 'all' }, label: 'Zeros of an 8-point moving average', cap: 'Seven zeros on the unit circle at multiples of 45° (the eighth root of unity at z = 1 is cancelled by the pole there), and seven poles at the origin. The zero at ±45° removes the 50 Hz hum.' }) +
      note('The cost: a 25 Hz component loses 36 % of its amplitude, and the filter is a crude low-pass. DS-09 shows how to remove one frequency without damaging its neighbors.')
  },
  {
    id: 'DS-08', lec: 'L4', kind: 'design', title: 'Digital sine oscillator at 2 kHz',
    q: '<b>Spec:</b> design a second-order oscillator producing a sinusoid of peak amplitude 1 and frequency 2000 Hz at F<sub>s</sub> = 20 kHz. (a) Find H(z) and the difference equation, with the oscillation started by an impulse. (b) If instead no impulse is available, what initial conditions y(−1), y(−2) start the same oscillation? (c) If y(−1) = 0, what y(−2) gives a unit-amplitude sinusoid?',
    a: steps([
      '<b>Frequency:</b> ω₀ = 2π·2000/20000 = <b>π/5 = 36°</b>. We want y(n) = sin(ω₀n)u(n) as the impulse response: Z{sin(ω₀n)u(n)} = sin ω₀ z⁻¹/(1 − 2cos ω₀ z⁻¹ + z⁻²).',
      '<b>(a)</b> <b>H(z) = 0.5878 z⁻¹/(1 − 1.618 z⁻¹ + z⁻²)</b>, poles at e<sup>±j36°</sup> (on the unit circle). Difference equation: <b>y(n) = 1.618y(n−1) − y(n−2) + 0.5878x(n−1)</b>. Drive with x = δ(n). (2cos 36° = 1.618 is the golden ratio.)',
      '<b>(b) Free-running (x = 0):</b> y(n) = 1.618y(n−1) − y(n−2). To reproduce sin(ω₀n), n ≥ 0, the “history” must be the sine extended backwards: <b>y(−1) = sin(−ω₀) = −0.5878, y(−2) = sin(−2ω₀) = −0.9511</b>. Check: y(0) = 1.618(−0.5878) + 0.9511 = 0 ✓; y(1) = 0 − (−0.5878) = 0.5878 = sin 36° ✓.',
      '<b>(c) With y(−1) = 0:</b> y(0) = −y(−2), y(1) = −1.618y(−2), … = −y(−2)·sin((n+1)ω₀)/sin ω₀. For unit amplitude choose <b>y(−2) = −sin ω₀ = −0.5878</b>: then y(n) = sin((n+1)ω₀) — the same 2 kHz sine, advanced by one sample.'
    ]) + pzFig({ poles: [{ re: c36, im: s36, t: '36°', dx: 8, dy: -6 }, { re: c36, im: -s36, t: '', dx: 8, dy: 14 }], zeros: [{ re: 0, im: 0, t: '' }], label: 'Poles of the oscillator on the unit circle', cap: 'Poles at ±36° on the unit circle: marginally stable, so the sine neither decays nor grows. The numerator z⁻¹ puts one zero at the origin.' }) +
      warn('Poles exactly on the unit circle are not BIBO stable. In finite-precision arithmetic the coefficient 1.618 is rounded, moving the poles slightly inside (decaying tone) or outside (growing tone). Real oscillators use extra amplitude control.')
  },
  {
    id: 'DS-09', lec: 'L4', kind: 'design', title: 'Second-order notch filter for 60 Hz',
    q: '<b>Spec:</b> remove 60 Hz hum from a signal sampled at F<sub>s</sub> = 600 Hz while leaving other frequencies almost untouched. Place the poles and zeros, give H(z), the difference equation, the DC gain, and the notch width.',
    a: steps([
      '<b>Notch frequency:</b> ω₀ = 2π·60/600 = <b>π/5 = 36°</b>, 2cos ω₀ = 1.618.',
      '<b>Zeros</b> exactly on the unit circle at e<sup>±jω₀</sup> give an exact null: numerator <b>1 − 1.618z⁻¹ + z⁻²</b>.',
      '<b>Poles</b> at r·e<sup>±jω₀</sup>, just inside the circle, cancel the zeros’ effect everywhere except right at ω₀. Take r = 0.9: denominator <b>1 − 2r cos ω₀ z⁻¹ + r²z⁻² = 1 − 1.4562z⁻¹ + 0.81z⁻²</b>.',
      '<b>H(z) = (1 − 1.618z⁻¹ + z⁻²)/(1 − 1.4562z⁻¹ + 0.81z⁻²)</b>. Difference equation: <b>y(n) = 1.4562y(n−1) − 0.81y(n−2) + x(n) − 1.618x(n−1) + x(n−2)</b>.',
      '<b>DC gain:</b> H(1) = (2 − 1.618)/(1 − 1.4562 + 0.81) = 0.382/0.3538 = <b>1.080</b>. To make it unity, scale the numerator by 1/1.080 = 0.926.',
      '<b>Width:</b> the −3 dB points are about ±(1 − r) = ±0.1 rad/sample either side of ω₀, so the notch width ≈ 2(1 − r) = 0.2 rad ≈ 19 Hz. Numerically |H| at ω₀ ± 0.1 is 0.762 ≈ 0.707 × 1.080 ✓.',
      '<b>Stability:</b> poles at radius 0.9 &lt; 1 ✓. Trade-off: r → 1 gives a narrower notch but a longer transient (about 1/(1−r) = 10 samples to settle).'
    ]) + pzFig({ poles: [{ re: 0.9 * c36, im: 0.9 * s36, t: '0.9∠36°', dx: 7, dy: -8 }, { re: 0.9 * c36, im: -0.9 * s36, t: '', dx: 7, dy: 14 }], zeros: [{ re: c36, im: s36, t: 'zero 36°', dx: 8, dy: -14 }, { re: c36, im: -s36, t: '' }], roc: { type: 'out', r1: 0.9 }, label: 'Notch filter pole-zero placement', cap: 'Zeros on the unit circle at ±36° (exact null at 60 Hz); poles at the same angle but radius 0.9 (pulls the response back up on either side). ROC |z| > 0.9 includes the unit circle.' }) +
      note('General recipe: zero at e<sup>jω₀</sup> kills ω₀; a pole just beside it restores the neighbors. Equivalent for a resonator (peak): put the <i>pole</i> near the circle and the zero far away.')
  }
  );
})();
