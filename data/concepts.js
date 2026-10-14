/* Concepts: plain-language explanation of every idea and property, tiny checkable examples, links to practice. */
var CONCEPTS = [

/* ================= LECTURE 1 ================= */
{
  label: 'Lec 1 · Signals & sampling',
  sections: [
    {
      h: '1. Signals and systems — the vocabulary',
      html: `
      <p>A <b>signal</b> is a quantity that changes with time (or space): a voltage, a sound pressure, a pixel brightness. A <b>system</b> is anything that takes a signal in and produces another signal out: an amplifier, a filter, a computer program.</p>
      <p>Two independent questions classify a signal:</p>
      ${tbl(['Question', 'Answer A', 'Answer B'], [
        ['Is <b>time</b> continuous or discrete?', 'Continuous-time (CT): defined for every instant, written x(t)', 'Discrete-time (DT): defined only at whole-number steps, written x(n)'],
        ['Is the <b>value</b> continuous or discrete?', 'Continuous-valued: any number in a range', 'Discrete-valued: only a finite set of levels']
      ], 0)}
      ${tbl(['Name', 'Time', 'Value', 'Example'], [
        ['Analog', 'continuous', 'continuous', 'a microphone voltage'],
        ['Sampled (DT-CV)', 'discrete', 'continuous', 'samples before rounding'],
        ['<b>Digital</b> (DT-DV)', 'discrete', 'discrete', 'numbers inside a computer']
      ], 0)}
      <p>DSP means doing the processing in the digital row, so a real-world pipeline looks like this:</p>
      ${mb('analog in → anti-alias filter → sampler → quantizer → <i>digital processor</i> → D/A → analog filter → analog out')}
      ${callout('Why bother going digital?', 'Digital processing is programmable, repeatable (no component drift), and immune to small noise: a value either survives or it doesn’t. The price is the two approximations you will study next: sampling in time and quantizing in value.')}
      <p>Other labels you will meet: <b>deterministic</b> (exact formula, like sin(1000πt)) versus <b>random</b> (only its statistics are known, like noise); <b>multichannel</b> (several signals at once, like a stereo pair); <b>multidimensional</b> (depends on several variables, like an image).</p>
      ${qa('Is the sequence {0.7, 0.2, 0.9} stored as exact decimals a digital signal?', 'Not strictly. Time is discrete but the values are arbitrary decimals, so it is DT-CV. It becomes digital once each value is rounded to one of a finite set of levels (quantization).')}
      `
    },
    {
      h: '2. Sinusoids — CT versus DT (the surprising part)',
      html: `
      <p>A continuous-time sinusoid is <b>x(t) = A cos(2πFt + φ)</b>. F is the frequency in <b>Hz</b> (cycles per second), A the amplitude, φ the phase.</p>
      <p>A discrete-time sinusoid is <b>x(n) = A cos(2πfn + φ) = A cos(ωn + φ)</b>. Here f is in <b>cycles per sample</b> and ω = 2πf in <b>radians per sample</b>. There is no “seconds” in DT: the only clock is the sample counter n.</p>
      <h4>Three facts that are not true for CT</h4>
      <ul>
        <li><b>Periodic only if f is a fraction.</b> x(n) repeats exactly only if f = k/N with k and N whole numbers. Then the period is N. Example: cos(0.01πn) has f = 1/200 → period 200. But cos(5n) has f = 5/(2π), which is not a fraction → <i>never</i> repeats, even though it still wiggles.</li>
        <li><b>Frequencies that differ by a whole number of cycles are identical.</b> ω and ω + 2π give exactly the same samples, because the sample counter n only takes whole-number values. So cos(5πn/2) and cos(πn/2) are the same sequence (5π/2 = 2π + π/2).</li>
        <li><b>There is a fastest possible oscillation:</b> ω = π (f = ½), which flips sign every sample: +, −, +, −. Beyond that the pattern folds back.</li>
      </ul>
      ${callout('Tiny example', 'cos(2π·(5/2)·n) at n = 0,1,2,3 is 1, −1, 1, −1 … and cos(2π·(1/2)·n) is also 1, −1, 1, −1 …. They differ by exactly 2 cycles per sample (5/2 − 1/2 = 2), so they are the same signal.')}
      ${qa('Is x(n) = cos(πn/8)·cos(πn/3) periodic? What period?', 'Yes. Periods of the two factors: cos(πn/8) has f = 1/16 → 16; cos(πn/3) has f = 1/6 → 6. The product repeats when both have repeated: lcm(16, 6) = <b>48</b>.')}
      ${use(['L1-04'])}
      `
    },
    {
      h: '3. Sampling, aliasing and the Nyquist rule',
      html: `
      <p><b>Sampling</b> means reading a continuous signal at evenly spaced instants: <b>x(n) = x<sub>a</sub>(nT)</b>, where T = 1/F<sub>s</sub> is the sampling period and F<sub>s</sub> the sampling rate in samples per second.</p>
      <p>Put a CT sinusoid of frequency F into this formula and the DT frequency that comes out is</p>
      ${mb('<i>f</i> = ' + frac('F', 'F<sub>s</sub>'))}
      <p>That is the bridge between the two worlds: <b>f is “how many cycles of the tone happen between two samples”</b>.</p>
      <h4>Aliasing: when the sampling is too slow</h4>
      <p>Distinct DT sinusoids only exist for −½ ≤ f ≤ ½. If the tone is so fast that F/F<sub>s</sub> lands outside that range, its samples are identical to those of a <i>slower</i> tone. That slower impostor is the <b>alias</b>. Fix it by subtracting a whole number:</p>
      ${mb('F<sub>alias</sub> = F − k·F<sub>s</sub> &nbsp;&nbsp; (choose the whole number k that lands in −F<sub>s</sub>/2 … +F<sub>s</sub>/2)')}
      ${callout('Tiny example', 'A 50 Hz cosine sampled at F<sub>s</sub> = 75 Hz has f = 50/75 = 2/3, which is above ½. Subtract 1: f = −1/3, i.e. an alias at <b>25 Hz</b>. Check: cos(2π·50·n/75) = cos(4πn/3) and cos(2π·25·n/75) = cos(2πn/3) give the same value at every n. (n = 1: both are −0.5.)')}
      <h4>The Nyquist rule</h4>
      <p>To avoid aliasing, sample at least twice as fast as the highest frequency present:</p>
      ${mb('F<sub>s</sub> ≥ 2F<sub>max</sub>')}
      <p>The frequency F<sub>s</sub>/2 is the <b>folding frequency</b>: the highest tone that can be represented. Anything above it folds back down. Real systems put an <b>anti-aliasing low-pass filter</b> <i>before</i> the sampler to remove the frequencies that would fold, because after sampling the damage cannot be undone.</p>
      <p>Cosine is even, so its alias keeps its sign; a sine is odd, so its alias flips sign when f comes out negative (this is what happens to the 3 kHz sine in L1-03).</p>
      ${qa('A tone at 9 kHz is sampled at 8 kHz. What frequency do you see?', 'f = 9/8; subtract 1 → 1/8; so you see <b>1 kHz</b> (9 − 8 = 1).')}
      ${use(['L1-01', 'L1-02', 'L1-03'])}
      `
    },
    {
      h: '4. Quantization, error and SQNR',
      html: `
      <p>After sampling, each value is still a precise real number. The <b>quantizer</b> rounds it to the nearest allowed level so it fits in a finite number of bits.</p>
      <ul>
        <li><b>Levels</b> L = 2<sup>b</sup> for b bits.</li>
        <li><b>Step</b> (resolution) Δ = (x<sub>max</sub> − x<sub>min</sub>)/(L − 1) = the gap between neighboring levels.</li>
        <li><b>Quantization error</b> e<sub>q</sub> = x<sub>q</sub> − x. With rounding it lies between −Δ/2 and +Δ/2.</li>
        <li><b>Rounding</b> picks the nearest level; <b>truncation</b> always picks the level below.</li>
      </ul>
      ${callout('Tiny example', 'Levels every Δ = 0.5. The sample 1.3 is between 1.0 and 1.5; rounding gives 1.5 (error +0.2), truncation gives 1.0 (error −0.3).')}
      <h4>How good is it? SQNR</h4>
      <p>Signal-to-quantization-noise ratio compares the signal power to the error power. Rounding error is spread evenly over ±Δ/2, which gives a noise power of Δ²/12:</p>
      ${mb('SQNR<sub>dB</sub> = 10 log<sub>10</sub>' + frac('P<sub>x</sub>', 'P<sub>q</sub>') + ', &nbsp;&nbsp; P<sub>q</sub> = ' + frac('Δ<sup>2</sup>', '12'))}
      <p>For a full-scale sinusoid this works out to <b>SQNR ≈ 6.02·b + 1.76 dB</b>: <b>every extra bit buys about 6 dB</b>. Truncation (measured as mean-square error) is 6 dB worse than rounding.</p>
      ${qa('How many bits give at least 60 dB SQNR for a full-scale sine?', '6.02b + 1.76 ≥ 60 → b ≥ 9.67 → <b>10 bits</b> (gives 61.96 dB).')}
      ${use(['L1-05', 'L1-08', 'DS-01', 'DS-02'])}
      `
    },
    {
      h: '5. Signal classes you must recognize',
      html: `
      ${tbl(['Class', 'Definition', 'Quick example'], [
        ['Even', 'x(−n) = x(n) (mirror image about n = 0)', 'cos(ωn), 0.5<sup>|n|</sup>'],
        ['Odd', 'x(−n) = −x(n); must pass through 0 at n = 0', 'sin(ωn)'],
        ['Periodic', 'x(n + N) = x(n) for some N', 'cos(2πn/20) (N = 20)'],
        ['Energy signal', 'E = Σ|x(n)|² finite (decays or is short)', '(½)<sup>n</sup>u(n): E = 4/3'],
        ['Power signal', 'Average power P finite and non-zero (steady or periodic)', 'u(n): P = ½; A cos(ωn): P = A²/2']
      ], 0)}
      <p>Any signal splits into even and odd parts: <b>x<sub>e</sub>(n) = ½[x(n) + x(−n)]</b> and <b>x<sub>o</sub>(n) = ½[x(n) − x(−n)]</b>, and x = x<sub>e</sub> + x<sub>o</sub>.</p>
      ${callout('Tiny example', 'x = {1, 2, 3} at n = 0, 1, 2. At n = 1: x(1) = 2 and x(−1) = 0, so x<sub>e</sub>(1) = 1 and x<sub>o</sub>(1) = 1; indeed 1 + 1 = 2.')}
      ${qa('Is x(n) = n·u(n) an energy signal or a power signal?', 'Neither: it grows without bound, so both its energy and its average power are infinite.')}
      ${use(['L1-06', 'L1-07'])}
      `
    }
  ]
},

/* ================= LECTURE 2 ================= */
{
  label: 'Lec 2 · DT signals & systems',
  sections: [
    {
      h: '1. The three building-block signals',
      html: `
      <ul>
        <li><b>Unit impulse δ(n):</b> equals 1 at n = 0 and 0 everywhere else. It is the “single click” test signal.</li>
        <li><b>Unit step u(n):</b> 0 for n &lt; 0, 1 for n ≥ 0 (a switch turned on at n = 0). Note u(n) = δ(n) + δ(n−1) + δ(n−2) + …</li>
        <li><b>Unit ramp r(n) = n·u(n):</b> climbs 0, 1, 2, 3, … from n = 0.</li>
        <li><b>Exponentials</b> aⁿu(n): decays when |a| &lt; 1, grows when |a| &gt; 1, flips sign every step when a &lt; 0.</li>
      </ul>
      <h4>The three operations on the time axis</h4>
      ${tbl(['Operation', 'Formula', 'What happens', 'x = {1, 2, 3} at n = 0,1,2'], [
        ['Delay by k', 'x(n − k)', 'whole signal slides <b>right</b> by k', 'x(n−1): 1, 2, 3 now at n = 1, 2, 3'],
        ['Advance by k', 'x(n + k)', 'slides <b>left</b> by k', 'x(n+1): 1, 2, 3 now at n = −1, 0, 1'],
        ['Fold', 'x(−n)', 'mirror about n = 0', 'x(−n): 3, 2, 1 at n = −2, −1, 0'],
        ['Down-sample by M', 'x(Mn)', 'keep every M-th sample', 'x(2n) from {…}: keeps every second sample']
      ], 0)}
      ${callout('How to never get these wrong', 'Substitute into the formula, then build a table. To get x(−n − 4): for each n compute the argument −n − 4 and read x there. Never try to “move the picture” in your head when two operations are combined.')}
      ${qa('Fold x then delay by 4, versus delay by 4 then fold: same result?', 'No. Fold-then-delay gives x(−(n−4)) = x(4−n). Delay-then-fold gives x(−n−4). The first lands on the right side of the axis, the second on the left.')}
      ${use(['L2-01', 'L2-02'])}
      `
    },
    {
      h: '2. The sifting property: every signal is a pile of impulses',
      html: `
      <p>This one idea is the foundation of everything in DT-LTI theory. Any sequence can be written as a sum of scaled, delayed impulses, one per sample:</p>
      ${mb('x(n) = Σ<sub>k</sub> x(k)·δ(n − k)')}
      <p>Read it as: “at n = k put a spike of height x(k)”.</p>
      ${callout('Tiny example', 'x = {2, −1, 3} at n = 0, 1, 2 equals 2δ(n) − δ(n−1) + 3δ(n−2). Check n = 1: only the middle term is nonzero, giving −1. ✓')}
      <p>Why it matters: if you know what a system does to a <i>single impulse</i>, then (for an LTI system) you know what it does to <i>every</i> signal, because every signal is just a stack of impulses. That is the next-but-one section.</p>
      ${qa('Write x(n) = {1, 0, 4} (starting at n = 0) with impulses.', 'x(n) = δ(n) + 4δ(n−2). The zero sample contributes nothing.')}
      ${use(['L2-10'])}
      `
    },
    {
      h: '3. System properties — what each one really means',
      html: `
      <p>A system turns an input x(n) into an output y(n) = T[x(n)]. Five yes/no questions describe almost everything about it. Learn the <i>test</i> for each; the tests are exactly what the sample problems ask you to do.</p>

      <h4>Static vs dynamic (memory)</h4>
      <p><b>Static:</b> the output at time n depends only on the input at the same time n. <b>Dynamic:</b> it also depends on other times (past or future inputs) — it has memory.<br>Static: y(n) = 3x(n) + x²(n). Dynamic: y(n) = x(n) + x(n−1).</p>

      <h4>Linear (superposition)</h4>
      <p>A system is linear if it obeys <b>additivity</b> (response to a sum = sum of responses) and <b>homogeneity</b> (scaling the input scales the output), together:</p>
      ${mb('T[a₁x₁ + a₂x₂] = a₁T[x₁] + a₂T[x₂]')}
      <p><b>Fast filter:</b> put in zero. If the output isn’t zero, it can’t be linear. So y = 2x + 3 fails (zero in gives 3), and so does y = x² or y = cos x.</p>

      <h4>Time-invariant (the rules don’t change)</h4>
      <p>Do the <b>shift test</b>: delay the input by k and see if the output is just the old output delayed by k.</p>
      ${mb('T[x(n − k)] = y(n − k)  for every k')}
      <p>y = x(n) + x(n−1): feed x(n−k) → x(n−k) + x(n−k−1) = y(n−k) ✓ invariant. y = n·x(n): feed x(n−k) → n·x(n−k), but y(n−k) = (n−k)·x(n−k) ✗ variant. An explicit n multiplying the input, or n being scaled inside x(·) (like x(4n)), breaks time-invariance.</p>

      <h4>Causal (no peeking into the future)</h4>
      <p>The output at time n may use inputs up to n only. y = x(n) + x(n−1) is causal; y = x(n) + x(n+1) is not (needs tomorrow’s input), and neither is x(n²+1) or x(4n). Real-time systems must be causal. Offline processing (a recorded file) can use non-causal ones.</p>

      <h4>BIBO stable (bounded in, bounded out)</h4>
      <p>If the input never exceeds some finite size, the output must also stay finite. Quick test: feed a constant 1. y = n·x(n−1) turns it into y = n, which grows forever → unstable. y = x(n) + x(n−1) never exceeds 2 → stable.</p>

      ${callout('Summary table', tbl(['System', 'Static?', 'Linear?', 'Time-inv.?', 'Causal?', 'Stable?'], [
        ['x(n) + x(n−1)', 'no', 'yes', 'yes', 'yes', 'yes'],
        ['2x(n) + 3', 'yes', '<b>no</b>', 'yes', 'yes', 'yes'],
        ['n·x(n−1)', 'no', 'yes', '<b>no</b>', 'yes', '<b>no</b>'],
        ['x(4n)', 'no', 'yes', '<b>no</b>', '<b>no</b>', 'yes'],
        ['cos x(n)', 'yes', '<b>no</b>', 'yes', 'yes', 'yes']
      ], 0))}
      ${qa('Is y(n) = x(−n) causal? Time-invariant?', 'Not causal: y(1) = x(−1) is fine but y(−1) = x(1) uses the future. Not time-invariant: input x(n−k) gives x(−n−k), whereas y(n−k) = x(−n+k); these differ.')}
      ${use(['L2-03', 'L2-04'])}
      `
    },
    {
      h: '4. LTI systems, the impulse response, and convolution',
      html: `
      <p>A system that is both <b>L</b>inear and <b>T</b>ime-<b>I</b>nvariant is called LTI. These are special: <b>their entire behavior is captured by one signal, the impulse response h(n)</b> — the output when the input is a single impulse δ(n) and the system starts at rest.</p>
      <h4>Why convolution appears</h4>
      <ol>
        <li>Every input is a stack of impulses: x(n) = Σ x(k)δ(n−k) (sifting).</li>
        <li><b>Time-invariance:</b> an impulse delayed by k produces h delayed by k, i.e. h(n−k).</li>
        <li><b>Linearity:</b> an impulse scaled by x(k) produces x(k)·h(n−k), and the responses just add.</li>
      </ol>
      <p>Adding up gives the <b>convolution sum</b>:</p>
      ${mb('y(n) = Σ<sub>k</sub> x(k)·h(n − k) = x(n) * h(n)')}
      <p>In words: every input sample launches a scaled copy of h starting at its own time; the output is all those copies stacked.</p>
      ${callout('Tiny example', 'x = {1, 1, 1}, h = {1, 2} (both starting at n = 0). Sample 0 launches {1, 2}, sample 1 launches {1, 2} one step later, sample 2 launches {1, 2} two steps later:<br>n = 0: 1 &nbsp; n = 1: 2 + 1 = 3 &nbsp; n = 2: 2 + 1 = 3 &nbsp; n = 3: 2.<br>So y = {1, 3, 3, 2}. Length 3 + 2 − 1 = 4 ✓, and Σy = 9 = (Σx)(Σh) = 3 × 3 ✓.')}
      <h4>The mechanical recipe (fold, shift, multiply, sum)</h4>
      <ol>
        <li>Flip h to get h(−k).</li>
        <li>Slide it by n so it becomes h(n − k).</li>
        <li>Multiply with x(k) sample by sample and add: that is y(n).</li>
        <li>Repeat for every n where the two overlap.</li>
      </ol>
      <h4>Two checks that catch almost every mistake</h4>
      <ul>
        <li>Length of y = L<sub>x</sub> + L<sub>h</sub> − 1.</li>
        <li>Sum of y = (sum of x) × (sum of h).</li>
      </ul>
      ${qa('x = {2, 0, 1} and h = {1, 0, −1}. What is Σy before computing y?', 'Σx = 3 and Σh = 0 so Σy must be <b>0</b>. (The actual y = {2, 0, −1, 0, −1} adds to 0 ✓.)')}
      ${use(['L2-05', 'L2-06', 'L2-10'])}
      `
    },
    {
      h: '5. Properties of convolution (and what they mean for diagrams)',
      html: `
      ${tbl(['Property', 'Statement', 'What it means in practice'], [
        ['Commutative', 'x * h = h * x', 'You may flip whichever signal is easier. The roles of “input” and “system” are interchangeable.'],
        ['Associative', '(x * h₁) * h₂ = x * (h₁ * h₂)', '<b>Cascade</b> of two systems = one system with h = h₁ * h₂. The order of the blocks does not matter.'],
        ['Distributive', 'x * (h₁ + h₂) = x*h₁ + x*h₂', '<b>Parallel</b> branches = one system with h = h₁ + h₂.'],
        ['Identity', 'x * δ(n) = x(n)', 'δ(n) is “do nothing”.'],
        ['Shift', 'x * δ(n − k) = x(n − k)', 'Convolving with a delayed impulse delays the signal.'],
        ['Causal system', 'h(n) = 0 for n &lt; 0', 'The sum starts at k = 0 only.'],
        ['Causal input too', 'x(n) = 0 for n &lt; 0', 'Both sums run from 0 to n, a finite sum for each n.']
      ], 0)}
      <h4>Using them on block diagrams</h4>
      <ul>
        <li>Blocks <b>in series</b> → convolve their impulse responses.</li>
        <li>Blocks <b>side by side</b>, outputs added → add their impulse responses.</li>
        <li>Combine from the inside out: parallel sums first, then cascades, then the outer parallel.</li>
      </ul>
      ${callout('Tiny example', 'h₁ = δ(n) + δ(n−1) followed by h₂ = δ(n) − δ(n−1): h = {1, 1} * {1, −1} = {1, 0, −1}. In parallel instead: h = {2, 0}.')}
      <h4>Two classifications read directly from h(n)</h4>
      <ul>
        <li><b>FIR vs IIR:</b> if h(n) has finite length the system is FIR (finite impulse response); if it goes on forever it is IIR.</li>
        <li><b>Stability:</b> an LTI system is BIBO stable exactly when Σ|h(n)| is finite. FIR systems are always stable. An IIR exponential aⁿu(n) is stable only if |a| &lt; 1.</li>
      </ul>
      ${qa('h(n) = 0.5ⁿu(n) — causal? stable? FIR or IIR?', 'Causal (zero for n &lt; 0). Stable: Σ0.5ⁿ = 2, finite. IIR: infinitely many nonzero samples.')}
      ${use(['L2-07', 'L2-06', 'L3-09'])}
      `
    },
    {
      h: '6. Correlation — “how alike are two signals?”',
      html: `
      <p>Convolution flips one signal; <b>correlation does not</b>. It slides one signal past another and multiplies and sums at each lag l, measuring how well they line up:</p>
      ${mb('r<sub>xy</sub>(l) = Σ<sub>n</sub> x(n)·y(n − l)')}
      <ul>
        <li><b>Cross-correlation</b> (x ≠ y): finds how one signal is a delayed copy of another. The lag with the biggest value reveals the delay (radar and sonar do exactly this).</li>
        <li><b>Autocorrelation</b> (y = x): how a signal relates to its own shifted copy. Always peaks at l = 0, where it equals the energy Σx². It is even: r<sub>xx</sub>(l) = r<sub>xx</sub>(−l).</li>
      </ul>
      ${callout('Tiny example', 'x = {1, 2, 3}: r<sub>xx</sub>(0) = 1 + 4 + 9 = 14; r<sub>xx</sub>(±1) = 1·2 + 2·3 = 8; r<sub>xx</sub>(±2) = 1·3 = 3. So r<sub>xx</sub> = {3, 8, 14, 8, 3}: symmetric, peak at the middle.')}
      <h4>Properties worth memorizing</h4>
      <ul>
        <li>r<sub>xy</sub>(l) = r<sub>yx</sub>(−l) (swapping the order mirrors the result).</li>
        <li>Correlation is convolution with one signal flipped: r<sub>xy</sub>(l) = x(l) * y(−l).</li>
        <li>Through an LTI system: r<sub>yx</sub> = h * r<sub>xx</sub> and r<sub>yy</sub> = r<sub>hh</sub> * r<sub>xx</sub>.</li>
        <li>Energy = r<sub>xx</sub>(0). White noise has an autocorrelation that is a single spike at 0.</li>
      </ul>
      ${qa('Why can correlation find a faint radar echo in noise?', 'The echo matches the transmitted pattern at exactly one lag, so the products add coherently there. Random noise has no such pattern, so it adds incoherently and stays small. See DS-04.')}
      ${use(['L2-08', 'L2-09', 'DS-04'])}
      `
    }
  ]
},

/* ================= LECTURE 3 ================= */
{
  label: 'Lec 3 · LCCDE',
  sections: [
    {
      h: '1. What a difference equation is',
      html: `
      <p>A <b>linear constant-coefficient difference equation (LCCDE)</b> is a rule that computes the next output from recent inputs and recent outputs, with fixed numbers as the multipliers:</p>
      ${mb('y(n) = −Σ<sub>k=1</sub><sup>N</sup> a<sub>k</sub>·y(n − k) + Σ<sub>m=0</sub><sup>M</sup> b<sub>m</sub>·x(n − m)')}
      <p>It is the DT version of a differential equation, and it is exactly what a computer program implements: a few multiply-adds per sample.</p>
      <ul>
        <li><b>Non-recursive</b> (all a<sub>k</sub> = 0): y depends only on inputs. Output dies out soon after the input does → <b>FIR</b>.</li>
        <li><b>Recursive</b>: y also depends on its own past (<i>feedback</i>). The output can keep going on its own → usually <b>IIR</b>.</li>
        <li><b>Order N</b> = the number of past outputs used = the number of memory elements needed.</li>
      </ul>
      ${callout('Tiny example — feedback in action', 'y(n) = 0.5·y(n−1) + x(n) with a single click x = δ(n), starting from rest: y(0) = 1, y(1) = 0.5, y(2) = 0.25, y(3) = 0.125, … The output keeps echoing, halving each time. This is an IIR system with h(n) = 0.5ⁿu(n).')}
      ${qa('Is y(n) = x(n) + 2x(n−1) recursive or non-recursive?', 'Non-recursive (no past outputs on the right). It is FIR with h = {1, 2}.')}
      ${use(['L3-04', 'L3-09'])}
      `
    },
    {
      h: '2. Zero-input, zero-state and total response',
      html: `
      <p>The output of a recursive system comes from <b>two independent causes</b>:</p>
      <ul>
        <li><b>Zero-state response (ZSR)</b> — what the <i>input</i> does, assuming the memory starts empty (“relaxed”, all initial values y(−1), y(−2), … = 0). This equals x(n) * h(n).</li>
        <li><b>Zero-input response (ZIR)</b> — what the <i>leftover memory</i> does with the input switched off. It depends only on y(−1), y(−2), … .</li>
      </ul>
      ${mb('y(n) = y<sub>zs</sub>(n) + y<sub>zi</sub>(n)')}
      <p>(This is just linearity: two causes, two responses, added.)</p>
      ${callout('Tiny example', 'y(n) = 0.5y(n−1) + x(n), x = u(n), y(−1) = 1. ZSR = 2 − 0.5ⁿ (1, 1.5, 1.75, …). ZIR = 0.5ⁿ⁺¹ (0.5, 0.25, 0.125, …). Total = their sum = 1.5, 1.75, 1.875, … Check n = 0 directly: y(0) = 0.5·1 + 1 = 1.5 ✓.')}
      <h4>Transient and steady state</h4>
      <p>For a stable system, parts of the response die away (the <b>transient</b>) and what is left tracks the input (the <b>steady state</b>). In the example the 0.5ⁿ terms fade and the output approaches 2, which is the steady-state value for a step input.</p>
      ${qa('In the tiny example, what is the response if the input is zero and y(−1) = 4?', 'Only the ZIR: y(0) = 0.5·4 = 2, then 1, 0.5, … = 4·0.5ⁿ⁺¹.')}
      ${use(['L3-01', 'L3-04'])}
      `
    },
    {
      h: '3. Homogeneous solution: the system’s natural behavior',
      html: `
      <p>Set the input to zero and ask: <i>what shapes can the output take on its own?</i> Guess y(n) = λⁿ and substitute into the equation. After dividing by a common power of λ you get the <b>characteristic equation</b> (a polynomial in λ):</p>
      ${mb('λ<sup>N</sup> + a₁λ<sup>N−1</sup> + … + a<sub>N</sub> = 0')}
      <p>Its roots λ are the system’s <b>poles</b>. Each root contributes one natural “mode”:</p>
      ${tbl(['Roots', 'Modes in y<sub>h</sub>(n)', 'What it looks like'], [
        ['Distinct real λ', 'C₁λ₁ⁿ + C₂λ₂ⁿ + …', 'decaying (|λ| &lt; 1), growing (|λ| &gt; 1); alternating sign if λ &lt; 0'],
        ['Repeated real λ (twice)', '(C₁ + C₂n)λⁿ', 'extra factor of n: may rise before it decays'],
        ['Complex pair r e<sup>±jθ</sup>', 'rⁿ(A cos nθ + B sin nθ)', 'oscillation at θ rad/sample, envelope rⁿ']
      ], 0)}
      <p>The constants C₁, C₂, … are found from the starting values of the output. <b>Stability check:</b> if every |λ| &lt; 1 all modes die out (stable); any |λ| &gt; 1 makes the output blow up.</p>
      ${callout('Tiny example', 'y(n) − 0.7y(n−1) + 0.1y(n−2) = 0 → λ² − 0.7λ + 0.1 = 0 → (λ − 0.5)(λ − 0.2) = 0, so y<sub>h</sub> = C₁0.5ⁿ + C₂0.2ⁿ. Both roots are inside 1 → stable.')}
      ${qa('What does y<sub>h</sub> look like for y(n) − y(n−1) + 0.25y(n−2) = 0?', 'λ² − λ + 0.25 = (λ − 0.5)² → repeated root: y<sub>h</sub> = (C₁ + C₂n)·0.5ⁿ.')}
      ${use(['L3-02', 'L3-03'])}
      `
    },
    {
      h: '4. Particular solution: the part forced by the input',
      html: `
      <p>With a real input switched on, the output also contains a part that <b>copies the form of the input</b>: this is the <b>particular solution y<sub>p</sub></b>. You guess it with unknown constants and substitute into the equation to find them.</p>
      ${tbl(['Input x(n)', 'Guess for y<sub>p</sub>(n)'], [
        ['constant (or step u(n))', 'K'],
        ['Aⁿ', 'K·Aⁿ'],
        ['nᴹ (polynomial)', 'K₀nᴹ + K₁nᴹ⁻¹ + … + K<sub>M</sub>'],
        ['cos ω₀n or sin ω₀n', 'K₁cos ω₀n + K₂sin ω₀n']
      ], 0)}
      ${callout('Resonance rule', 'If the guess already appears in y<sub>h</sub> (for example the input is 0.5ⁿ and 0.5 is a characteristic root) it can’t work, so multiply the guess by n: y<sub>p</sub> = K·n·0.5ⁿ.')}
      <h4>Putting it together</h4>
      <ol>
        <li>y = y<sub>h</sub> + y<sub>p</sub>.</li>
        <li>Compute y(0), y(1), … <b>by running the recursion</b> with the given initial conditions.</li>
        <li>Choose the constants in y<sub>h</sub> so the full formula matches those first values.</li>
      </ol>
      ${callout('Tiny example', 'y(n) − 0.5y(n−1) = u(n), relaxed. y<sub>p</sub> = K: K − 0.5K = 1 → K = 2. y = C·0.5ⁿ + 2 and y(0) = 1 → C = −1. So y = 2 − 0.5ⁿ: 1, 1.5, 1.75, … → 2.')}
      ${qa('Why must the constants be fitted to y(0), y(1) of the <i>total</i> solution and not to y<sub>h</sub> alone?', 'Because y(0) already includes the particular part. Fitting y<sub>h</sub> alone would give the wrong constants and the formula would not reproduce the actual outputs.')}
      ${use(['L3-01', 'L3-02', 'L3-08'])}
      `
    },
    {
      h: '5. Impulse response from an LCCDE',
      html: `
      <p>The impulse response h(n) is the ZSR when x = δ(n). Because δ(n) is zero for every n ≥ 1, the equation behaves like the homogeneous one after n = 0, so h(n) is made of the natural modes. Two ways to get it:</p>
      <ul>
        <li><b>By recursion:</b> run the equation with x = δ(n), starting from rest. Fast for the first few samples (use this to check your formula).</li>
        <li><b>By formula:</b> write h(n) = (modes with unknown constants) for n ≥ 0, and match the first values computed by recursion.</li>
      </ul>
      ${callout('Tiny example', 'y(n) = 0.1y(n−1) + 0.2x(n) − 0.15x(n−1). Recursion: h(0) = 0.2; h(1) = 0.1(0.2) − 0.15 = −0.13; then h(n) = 0.1h(n−1). So h(n) = −0.13·0.1ⁿ⁻¹ for n ≥ 1.')}
      <p>Once you have h(n), everything from Lecture 2 applies: the response to any input is x * h, and the system is stable if Σ|h| is finite (equivalently, all poles inside |λ| &lt; 1).</p>
      ${qa('What is h(n) for y(n) = 0.8y(n−1) + x(n)?', 'h(0) = 1, h(1) = 0.8, h(2) = 0.64, … so h(n) = 0.8ⁿu(n).')}
      ${use(['L3-04', 'L3-01'])}
      `
    },
    {
      h: '6. Realizations: turning an equation into a diagram',
      html: `
      <p>A <b>realization</b> is a block diagram that computes the equation, built from four parts: <b>adder</b>, <b>constant multiplier</b>, <b>unit delay z⁻¹</b> (memory: holds a sample for one step) and the signal wires. Each delay is one memory element in hardware.</p>
      <h4>The first thing to do: normalize</h4>
      <p>The standard form has coefficient 1 on y(n). If the equation starts 2y(n) + …, divide the whole equation by 2 first, or every coefficient will be wrong.</p>
      <h4>Direct Form I</h4>
      <p>Do exactly what the equation says: one chain of delays on the <b>input</b> (for x(n−m)) and a separate chain on the <b>output</b> (for y(n−k)). Memory used: M + N delays.</p>
      <h4>Direct Form II</h4>
      <p>Split the equation into a recursive part followed by a non-recursive part, then notice the two delay chains hold the same signal and can be <b>merged into one chain</b>. Memory used: max(M, N) delays — the minimum possible.</p>
      <ul>
        <li><b>FIR</b> = only the feedforward taps (no feedback paths).</li>
        <li><b>IIR</b> = feedback paths present.</li>
        <li>Higher-order filters are built by cascading <b>second-order sections</b> (two delays each).</li>
      </ul>
      ${callout('Reading rule', 'The multipliers drawn on the feedback paths are −a<sub>k</sub>, not a<sub>k</sub>. When reading a diagram, write each adder as an equation exactly as drawn, then convert to the standard form.')}
      ${qa('How many delays does Direct Form II need for y(n) = 0.5y(n−1) + x(n) + 3x(n−4)?', 'N = 1 and M = 4, so max(M, N) = <b>4</b> delays (Direct Form I would use 5).')}
      ${use(['L3-05', 'L3-06', 'L3-07'])}
      `
    }
  ]
},

/* ================= LECTURE 4 ================= */
{
  label: 'Lec 4 · Z-transform',
  sections: [
    {
      h: '1. Why the Z-transform exists',
      html: `
      <p>Solving difference equations step by step (Lecture 3) works but is slow. The Z-transform converts the problem into <b>ordinary algebra</b>, the same way the Laplace transform does for differential equations: delays become multiplications by z⁻¹, convolution becomes multiplication, and equations become rational functions of z.</p>
      ${mb('X(z) = Σ<sub>n=−∞</sub><sup>∞</sup> x(n)·z<sup>−n</sup>')}
      <p>Read it as: “write the sequence as a polynomial whose coefficients are the samples and whose powers of z⁻¹ mark time.” The power of z⁻¹ <i>is</i> the time index.</p>
      ${callout('Tiny example', 'x = {3, 0, −2} starting at n = 0 becomes X(z) = 3 − 2z⁻². The “z⁻²” says the −2 sits at time 2. A unit delay multiplies by z⁻¹, which pushes every term one step later.')}
      <p>The complex variable z lives on the <b>z-plane</b>. The circle |z| = 1 is the <b>unit circle</b>; it corresponds to real frequencies (this is why it keeps showing up).</p>
      ${qa('What is the Z-transform of δ(n − 3)?', 'z⁻³ (a single spike at time 3).')}
      `
    },
    {
      h: '2. Region of convergence (ROC) — the part everyone skips',
      html: `
      <p>The sum defining X(z) only gives a finite answer for some z. That set of z is the <b>ROC</b>. It matters because <b>the same formula X(z) with a different ROC is a different signal</b>.</p>
      <h4>Why a ROC appears: one geometric series</h4>
      <p>For x(n) = aⁿu(n): X(z) = Σ(a/z)ⁿ over n ≥ 0. A geometric series with ratio a/z converges only if |a/z| &lt; 1, i.e. <b>|z| &gt; |a|</b>, and then equals 1/(1 − az⁻¹). For a = 0.5, z = 2 the ratio is 0.25 and the sum is 1/(1 − 0.25) = 1.333; for z = 0.3 the ratio is 1.67 and the series explodes.</p>
      ${tbl(['Signal type', 'ROC shape', 'Example'], [
        ['Right-sided (starts at some n, goes on forever), e.g. causal', '<b>outside</b> a circle: |z| &gt; r', 'aⁿu(n): |z| &gt; |a|'],
        ['Left-sided (ends at some n, goes back forever)', '<b>inside</b> a circle: |z| &lt; r', '−aⁿu(−n−1): |z| &lt; |a|'],
        ['Two-sided', 'a <b>ring</b> between two circles', '0.5ⁿu(n) + 2ⁿu(−n−1): ½ &lt; |z| &lt; 2'],
        ['Finite length', 'whole plane, except z = 0 and/or z = ∞', '{1, 2, 3}: all z ≠ 0']
      ], 0)}
      <p>Three rules to remember:</p>
      <ol>
        <li>The ROC <b>never contains a pole</b>; poles are where X(z) blows up.</li>
        <li>The boundaries of the ROC are circles passing through poles.</li>
        <li>If the pieces of a two-sided signal have non-overlapping ROCs, the signal has <b>no Z-transform</b>.</li>
      </ol>
      ${qa('X(z) = 1/(1 − 0.5z⁻¹) with ROC |z| &gt; 0.5. Causal or anti-causal?', 'Outside a circle → right-sided → causal: x(n) = 0.5ⁿu(n). With ROC |z| &lt; 0.5 the same formula would be the anti-causal −0.5ⁿu(−n−1).')}
      ${use(['L4-01', 'L4-02'])}
      `
    },
    {
      h: '3. The properties — meaning and mini-examples',
      html: `
      <p>You almost never compute the Z-transform from the definition. You start from a few known pairs and apply these properties.</p>

      <h4>Linearity</h4>
      ${mb('a₁x₁ + a₂x₂ ↔ a₁X₁(z) + a₂X₂(z)')}
      <p>Transform term by term. The ROC is at least the overlap of the individual ROCs.</p>

      <h4>Time shift — a delay is a multiplication by z⁻¹</h4>
      ${mb('x(n − k) ↔ z<sup>−k</sup>X(z)')}
      <p>Example: u(n−1) ↔ z⁻¹/(1 − z⁻¹). <b>Careful:</b> the shift moves the <i>whole</i> expression, so 0.5ⁿ⁻²u(n−2) ↔ z⁻²/(1 − 0.5z⁻¹) but 0.5ⁿu(n−2) = ¼·0.5ⁿ⁻²u(n−2) ↔ ¼z⁻²/(1 − 0.5z⁻¹).</p>

      <h4>Scaling by aⁿ — stretches the z-plane</h4>
      ${mb('aⁿx(n) ↔ X(a⁻¹z)')}
      <p>Example: u(n) ↔ 1/(1 − z⁻¹) ⇒ 3ⁿu(n) ↔ 1/(1 − 3z⁻¹). Multiplying by aⁿ moves every pole from p to ap.</p>

      <h4>Time reversal</h4>
      ${mb('x(−n) ↔ X(z⁻¹)')}
      <p>Example: u(−n) ↔ 1/(1 − z), ROC |z| &lt; 1. Reversal turns “outside a circle” into “inside a circle”.</p>

      <h4>Differentiation in z — a factor of n</h4>
      ${mb('n·x(n) ↔ −z ' + frac('dX(z)', 'dz'))}
      <p>Example: 0.5ⁿu(n) ↔ 1/(1 − 0.5z⁻¹), so n·0.5ⁿu(n) ↔ 0.5z⁻¹/(1 − 0.5z⁻¹)². This is where repeated poles come from.</p>

      <h4>Convolution — the one that matters most</h4>
      ${mb('x₁(n) * x₂(n) ↔ X₁(z)·X₂(z)')}
      <p>A messy convolution sum becomes a simple multiplication. Example: {1, 1} * {1, 2}: (1 + z⁻¹)(1 + 2z⁻¹) = 1 + 3z⁻¹ + 2z⁻² ↔ {1, 3, 2}. That is the same answer as the fold-shift-multiply-sum method in Lecture 2.</p>

      <h4>Initial value theorem (causal signals)</h4>
      ${mb('x(0) = lim<sub>z→∞</sub> X(z)')}
      <p>Example: X(z) = (2 + z⁻¹)/(1 − 0.5z⁻¹) → as z → ∞ the z⁻¹ terms vanish, so x(0) = 2.</p>

      <h4>Also in the list</h4>
      <ul>
        <li><b>Correlation:</b> r<sub>x₁x₂</sub>(l) ↔ X₁(z)X₂(z⁻¹).</li>
        <li><b>Multiplication in time</b> (windowing) ↔ convolution in the z-domain (rarely computed by hand).</li>
      </ul>
      ${qa('Z-transform of n·u(n) (the ramp)?', 'Differentiate u(n) ↔ 1/(1 − z⁻¹): −z·d/dz[1/(1 − z⁻¹)] = z⁻¹/(1 − z⁻¹)².')}
      ${use(['L4-03', 'L4-09'])}
      `
    },
    {
      h: '4. The pairs to memorize (all from one geometric series)',
      html: `
      ${tbl(['Signal (n ≥ 0 unless noted)', 'X(z)', 'ROC'], [
        ['δ(n)', '1', 'all z'],
        ['u(n)', '1/(1 − z⁻¹)', '|z| &gt; 1'],
        ['aⁿu(n)', '1/(1 − az⁻¹)', '|z| &gt; |a|'],
        ['−aⁿu(−n−1)', '1/(1 − az⁻¹)', '|z| &lt; |a|'],
        ['n·aⁿu(n)', 'az⁻¹/(1 − az⁻¹)²', '|z| &gt; |a|'],
        ['(n+1)aⁿu(n)', '1/(1 − az⁻¹)²', '|z| &gt; |a|'],
        ['rⁿcos(ω₀n)u(n)', '(1 − r cos ω₀ z⁻¹)/(1 − 2r cos ω₀ z⁻¹ + r²z⁻²)', '|z| &gt; r'],
        ['rⁿsin(ω₀n)u(n)', 'r sin ω₀ z⁻¹/(1 − 2r cos ω₀ z⁻¹ + r²z⁻²)', '|z| &gt; r']
      ], 0)}
      ${callout('How to remember them', 'Everything starts from Σaⁿz⁻ⁿ = 1/(1 − az⁻¹). The cos/sin rows are the same idea with complex a = r·e<sup>±jω₀</sup> and the two conjugate terms combined. The “n” rows come from differentiating.')}
      `
    },
    {
      h: '5. Going backwards: the inverse Z-transform',
      html: `
      <p>Given X(z) <i>and its ROC</i>, find x(n). Three methods:</p>
      <ol>
        <li><b>Power series (long division):</b> expand X(z) in powers of z⁻¹ (if ROC is outside) or powers of z (if ROC is inside). The coefficients <i>are</i> the samples. Easy, but only gives the first few samples.</li>
        <li><b>Partial fractions (the main method):</b> split X(z) into simple terms A/(1 − pz⁻¹), whose inverses you already know.</li>
        <li><b>Known pairs and properties:</b> recognize the form and apply the table.</li>
      </ol>
      <h4>Partial fractions recipe</h4>
      <ol>
        <li>If the numerator is as high as or higher than the denominator (improper), divide first; the leftover polynomial gives impulses.</li>
        <li>Factor the denominator into (1 − p<sub>k</sub>z⁻¹).</li>
        <li>Find each coefficient: <b>A<sub>k</sub> = (1 − p<sub>k</sub>z⁻¹)X(z) evaluated at z = p<sub>k</sub></b>.</li>
        <li>Use the ROC to decide each term’s side: pole inside the region → right-sided p<sup>n</sup>u(n); pole outside → left-sided −pⁿu(−n−1).</li>
        <li>Repeated poles: extra factors of n. Complex-conjugate poles: the coefficients are conjugates and combine into a cosine.</li>
      </ol>
      ${callout('Tiny example', 'X(z) = 1/[(1 − z⁻¹)(1 − 0.5z⁻¹)]. A = 1/(1 − 0.5) = 2 at p = 1, B = 1/(1 − 2) = −1 at p = 0.5. With ROC |z| &gt; 1 both terms are right-sided: x(n) = 2 − 0.5ⁿ for n ≥ 0 (1, 1.5, 1.75, …). Check x(0) from the formula: 2 − 1 = 1 ✓.')}
      ${qa('Same X(z) with ROC |z| &lt; 0.5 — what changes?', 'Both poles are now outside the region, so both terms become left-sided: x(n) = [−2 + 0.5ⁿ]u(−n−1). The formula for X(z) is identical; only the ROC changed.')}
      ${use(['L4-04', 'L4-05', 'L4-06', 'L4-07', 'L4-08'])}
      `
    },
    {
      h: '6. The system function H(z), poles and zeros',
      html: `
      <p>Take the Z-transform of a difference equation (starting from rest) and divide output by input. You get the <b>system function</b>:</p>
      ${mb('H(z) = ' + frac('Y(z)', 'X(z)') + ' = ' + frac('b₀ + b₁z<sup>−1</sup> + … + b<sub>M</sub>z<sup>−M</sup>', '1 + a₁z<sup>−1</sup> + … + a<sub>N</sub>z<sup>−N</sup>'))}
      <p>It is just the Z-transform of the impulse response h(n). Convolution in time becomes <b>Y(z) = H(z)X(z)</b>: output = system × input.</p>
      <h4>Poles and zeros</h4>
      <ul>
        <li><b>Zeros</b> are values of z where H(z) = 0 (roots of the numerator). The system <i>blocks</i> signals at that z.</li>
        <li><b>Poles</b> are values of z where H(z) → ∞ (roots of the denominator). They <i>are</i> the characteristic roots from Lecture 3: they decide the natural behavior.</li>
        <li>Draw them on the z-plane: × for poles, ○ for zeros. That picture is the <b>pole-zero plot</b>.</li>
      </ul>
      <h4>What the plot tells you at a glance</h4>
      ${tbl(['Feature', 'Meaning'], [
        ['Pole at radius r &lt; 1', 'decaying response, faster when r is small'],
        ['Pole angle θ', 'oscillation at θ rad/sample (F = θF<sub>s</sub>/2π)'],
        ['Pole on the unit circle', 'sustained oscillation (marginal; an oscillator)'],
        ['Pole outside the unit circle', 'growing response (unstable if causal)'],
        ['Zero on the unit circle at angle θ', 'completely blocks frequency θ (a notch)'],
        ['Pole near the circle at angle θ', 'strongly amplifies frequency θ (a resonance)']
      ], 0)}
      <h4>Stability and causality, finally stated plainly</h4>
      <ul>
        <li>Causal ⇔ ROC is outside the outermost pole.</li>
        <li>BIBO stable ⇔ the ROC contains the unit circle.</li>
        <li>So a <b>causal and stable</b> system needs <b>all poles inside the unit circle</b>.</li>
      </ul>
      ${callout('Tiny example', 'y(n) = 0.5y(n−1) + x(n) gives H(z) = 1/(1 − 0.5z⁻¹): one pole at 0.5 (inside), no zeros except z = 0. Causal and stable; h(n) = 0.5ⁿu(n).')}
      ${qa('H(z) = 1/(1 − 2z⁻¹), causal. Stable?', 'No: the pole at z = 2 is outside the unit circle, so h(n) = 2ⁿu(n) grows without bound.')}
      ${use(['L4-10', 'L4-12', 'L4-13', 'DS-07', 'DS-09'])}
      `
    },
    {
      h: '7. Initial conditions: the one-sided Z-transform',
      html: `
      <p>The ordinary (two-sided) transform assumes everything starts at rest. To handle nonzero initial values y(−1), y(−2), … use the <b>one-sided</b> transform (sum from n = 0). All properties carry over <i>except time shift</i>, which now picks up extra terms for the values before time 0:</p>
      ${mb('Z⁺{y(n−1)} = z<sup>−1</sup>Y(z) + y(−1)')}
      ${mb('Z⁺{y(n−2)} = z<sup>−2</sup>Y(z) + z<sup>−1</sup>y(−1) + y(−2)')}
      <p>Transform the equation with these rules and collect Y(z). You always end up with two pieces:</p>
      ${mb('Y(z) = ' + frac('(terms from initial conditions)', 'D(z)') + ' + H(z)X(z)')}
      <p>The first fraction is the <b>zero-input response</b>, the second the <b>zero-state response</b> — exactly the split from Lecture 3, now computed algebraically.</p>
      ${callout('Tiny example', 'y(n) = 0.5y(n−1) + x(n), y(−1) = 2, x = 0: Y(z) = 0.5[z⁻¹Y + 2] → Y(z)(1 − 0.5z⁻¹) = 1 → Y(z) = 1/(1 − 0.5z⁻¹) → y(n) = 0.5ⁿ. Direct check: y(0) = 0.5·2 = 1 ✓.')}
      ${qa('With y(−1) = 1 for y(n) = 0.9y(n−1) + x(n) and x = 0, what is the ZIR?', 'Y(z)(1 − 0.9z⁻¹) = 0.9·1 → Y = 0.9/(1 − 0.9z⁻¹) → y(n) = 0.9ⁿ⁺¹.')}
      ${use(['L4-11', 'DS-08'])}
      `
    }
  ]
}
];
