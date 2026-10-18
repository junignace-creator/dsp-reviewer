// Numerical checks for every closed-form answer in problems.js.
// Run: node verify.js   (exits non-zero if any check fails)
let fails = 0, n = 0;
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
function check(name, got, want, tol) {
  n++;
  const ok = Array.isArray(want) ? want.length === got.length && want.every((w, i) => near(got[i], w, tol)) : near(got, want, tol);
  if (!ok) { fails++; console.log('FAIL', name, '\n  got ', got, '\n  want', want); }
}
const conv = (x, h) => { const y = Array(x.length + h.length - 1).fill(0); x.forEach((a, i) => h.forEach((b, j) => y[i + j] += a * b)); return y; };
// LCCDE simulator: y(n) = -sum a_k y(n-k) + sum b_m x(n-m); a=[a1..aN], b=[b0..bM]; x is a function; ic={1:y(-1),2:y(-2)...}
function sim(a, b, x, N, ic = {}) {
  const y = {}; const Y = k => k >= 0 ? y[k] : (ic[-k] || 0);
  for (let i = 0; i < N; i++) {
    let s = 0; a.forEach((ak, k) => s -= ak * Y(i - (k + 1)));
    b.forEach((bm, m) => s += bm * x(i - m));
    y[i] = s;
  }
  return Array.from({ length: N }, (_, i) => y[i]);
}
const u = k => k >= 0 ? 1 : 0, d = k => k === 0 ? 1 : 0, zero = () => 0;
const range = N => Array.from({ length: N }, (_, i) => i);

// ---- L1-01 aliasing
check('L1-01c', 2 / 3 - 1, -1 / 3); // f=50/75 -> -1/3 -> 25 Hz
// ---- L1-03 three-tone, Fs=5000
{
  const f = (F, Fs) => { let r = F / Fs; r -= Math.round(r); return r; };
  check('L1-03 f1', f(1000, 5000), 1 / 5); check('L1-03 f2', f(3000, 5000), -2 / 5); check('L1-03 f3', f(6000, 5000), 1 / 5);
  for (let i = 0; i < 12; i++) {
    const t = i / 5000;
    const orig = 3 * Math.cos(2000 * Math.PI * t) + 5 * Math.sin(6000 * Math.PI * t) + 10 * Math.cos(12000 * Math.PI * t);
    const red = 13 * Math.cos(2 * Math.PI * i / 5) - 5 * Math.sin(4 * Math.PI * i / 5);
    check('L1-03 sample ' + i, red, orig, 1e-9);
  }
}
// ---- L1-05 quantizer
{
  const Px = 6.35 ** 2 / 2;
  for (const D of [0.1, 0.02]) {
    const L = 12.7 / D + 1; console.log('L1-05 levels', D, Math.round(L), 'bits', Math.ceil(Math.log2(Math.round(L))));
    console.log('  theory round SQNR', (10 * Math.log10(Px / (D * D / 12))).toFixed(2), ' trunc(ms)', (10 * Math.log10(Px / (D * D / 3))).toFixed(2));
    const N = 2000; let e2r = 0, e2t = 0, p = 0;
    for (let i = 0; i < N; i++) { const x = 6.35 * Math.cos(Math.PI * i / 10); const r = Math.round(x / D) * D, t = Math.floor(x / D) * D; e2r += (x - r) ** 2; e2t += (x - t) ** 2; p += x * x; }
    console.log('  sim round', (10 * Math.log10(p / e2r)).toFixed(2), ' trunc', (10 * Math.log10(p / e2t)).toFixed(2));
  }
}
// ---- L1-06 even/odd
{
  const x = { 0: 1, 1: 2, 2: 3 }; const X = k => x[k] || 0;
  const xe = k => (X(k) + X(-k)) / 2, xo = k => (X(k) - X(-k)) / 2;
  check('L1-06 xe', [-2, -1, 0, 1, 2].map(xe), [1.5, 1, 1, 1, 1.5]); check('L1-06 xo', [-2, -1, 0, 1, 2].map(xo), [-1.5, -1, 0, 1, 1.5]);
}
// ---- L1-07 energies
{
  let E1 = 0, E2 = 0; for (let k = 0; k < 200; k++) E1 += 0.25 ** k; for (let k = -200; k <= 200; k++) E2 += 0.25 ** Math.abs(k);
  check('E1', E1, 4 / 3); check('E2', E2, 5 / 3);
}
// ---- L2-01 fold/delay
{
  const x = k => (k >= -3 && k <= -1) ? 1 + k / 3 : (k >= 0 && k <= 3 ? 1 : 0);
  check('L2-01 x', [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(x), [0, 0, 1 / 3, 2 / 3, 1, 1, 1, 1, 0]);
  const y1 = k => x(-(k - 4)); check('L2-01 y1', [0, 1, 2, 3, 4, 5, 6, 7].map(y1), [0, 1, 1, 1, 1, 2 / 3, 1 / 3, 0]);
  const y2 = k => x(-k - 4); check('L2-01 y2', [-8, -7, -6, -5, -4, -3, -2, -1].map(y2), [1, 1, 1, 1, 1, 2 / 3, 1 / 3, 0].map((v, i) => [0, 1, 1, 1, 1, 2 / 3, 1 / 3, 0][i]));
  console.log('L2-01 y2 n=-8..-1', [-8, -7, -6, -5, -4, -3, -2, -1].map(y2).map(v => +v.toFixed(3)).join(' '));
}
// ---- L2-02 ramp
{ const r = k => k > 0 ? k : 0; check('L2-02d', [-7, -6, -5, -4, -3, -2, -1, 0, 3].map(k => 2 * r(k + 6) - 2 * r(k + 2)), [0, 0, 2, 4, 6, 8, 8, 8, 8]); }
// ---- L2-03 system tests (numerical TI / linearity)
{
  const sys = { 'n*x(n-1)': (x, n) => n * x(n - 1), 'x(n^2+1)': (x, n) => x(n * n + 1), 'cos x(n)': (x, n) => Math.cos(x(n)), 'x(4n)': (x, n) => x(4 * n), '2x+3': (x, n) => 2 * x(n) + 3, 'x^2': (x, n) => x(n) ** 2 };
  const x1 = n => Math.sin(n), x2 = n => (((n % 3) + 3) % 3) - 1;
  for (const [k, S] of Object.entries(sys)) {
    const sh = 2; const xs = n => x1(n - sh);
    const ti = [-3, 0, 4].every(n => near(S(xs, n), S(x1, n - sh), 1e-9));
    const lin = [-3, 0, 4].every(n => near(S(m => 2 * x1(m) + 3 * x2(m), n), 2 * S(x1, n) + 3 * S(x2, n), 1e-9));
    console.log('L2-03', k.padEnd(10), 'TI', ti, 'LIN', lin);
  }
}
// ---- L2-05 convolution
check('L2-05a', conv([2, -1, 0, 1], [1, 1, 0, -1]), [2, 1, -1, -1, 2, 0, -1]);
check('L2-05b', conv([2, 0, 1], [1, 0, -1]), [2, 0, -1, 0, -1]);
// ---- L2-06 geometric conv
for (let i = 0; i < 8; i++) { let s = 0; for (let k = 0; k <= i; k++) s += 0.5 ** k * 0.25 ** (i - k); check('L2-06 n=' + i, s, 2 * 0.5 ** i - 0.25 ** i); }
// ---- L2-07
check('L2-07 casc', conv([1, 1], [1, -1]), [1, 0, -1]);
check('L2-07 sp', (() => { const s = [1, 1, 1]; const p = conv([1, 1], s); p[1] += 1; return p; })(), [1, 3, 2, 1]);
check('L2-07c', (() => { const p = conv([1, 1], [1, -2, 1]); p[1] += 1; return p; })(), [1, 0, -1, 1]);
check('L2-10', conv([-1, 2, 0, 3], [1, -1]), [-1, 3, -2, 3, -3]);
check('L2-07d', conv(range(30).map(i => 0.5 ** i), [1, -0.5]).slice(0, 30), [1, ...Array(29).fill(0)]);
// ---- L2-08 correlation
{
  const x = [2, 0, 1, 3, 2], h = [1, 0, 1, 1, 2], y = conv(x, h); console.log('L2-08 y', y.join(' '), 'Ey', y.reduce((s, v) => s + v * v, 0));
  const rxx = l => x.reduce((s, v, i) => s + v * (x[i - l] || 0), 0); const rhh = l => h.reduce((s, v, i) => s + v * (h[i - l] || 0), 0);
  const ryy = l => y.reduce((s, v, i) => s + v * (y[i - l] || 0), 0);
  const rxxA = range(9).map(i => rxx(i - 4)), rhhA = range(9).map(i => rhh(i - 4)); const rc = conv(rxxA, rhhA);
  check('L2-08 ryy=rhh*rxx', range(17).map(i => ryy(i - 8)), rc); console.log('  rxx(0)', rxx(0), 'rhh(0)', rhh(0), 'ryy(0)', ryy(0), 'rxx(-4..4)', rxxA.join(' '));
  const rxy = l => x.reduce((s, v, i) => s + v * (y[i - l] || 0), 0), ryx = l => y.reduce((s, v, i) => s + v * (x[i - l] || 0), 0);
  check('L2-08 rxy(l)=ryx(-l)', range(17).map(i => rxy(i - 8)), range(17).map(i => ryx(8 - i))); console.log('  rxy(-3..3)', [-3, -2, -1, 0, 1, 2, 3].map(rxy).join(' '), ' ryx(-3..3)', [-3, -2, -1, 0, 1, 2, 3].map(ryx).join(' '));
}
// ---- L2-09 Barker
{ const b = [1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1]; const r = l => b.reduce((s, v, i) => s + v * (b[i - l] || 0), 0); console.log('L2-09 Barker autocorr', range(25).map(i => r(i - 12)).join(' ')); }
// ---- L3-01 first order
{
  check('L3-01 zi', sim([-0.5], [1], zero, 8, { 1: 1 }), range(8).map(i => 0.5 * 0.5 ** i));
  check('L3-01 zs', sim([-0.5], [1], u, 8), range(8).map(i => 2 - 0.5 ** i));
  check('L3-01 tot', sim([-0.5], [1], u, 8, { 1: 1 }), range(8).map(i => 2 - 0.5 * 0.5 ** i));
  check('L3-01 h', sim([-0.5], [1], d, 8), range(8).map(i => 0.5 ** i));
}
// ---- L3-02 second order step
check('L3-02', sim([-0.7, 0.1], [1], u, 12), range(12).map(i => 2.5 - (5 / 3) * 0.5 ** i + (1 / 6) * 0.2 ** i));
// ---- L3-03 repeated root zi
check('L3-03', sim([-1, 0.25], [0], zero, 12, { 1: 1, 2: 0 }), range(12).map(i => (1 + 0.5 * i) * 0.5 ** i));
// ---- L3-04 first-order example
{
  check('L3-04 h', sim([-0.1], [0.2, -0.15], d, 6), [0.2, 0.2 * 0.1 - 0.15, ...[2, 3, 4, 5].map(k => -0.13 * 0.1 ** (k - 1))]);
  check('L3-04 zi', sim([-0.1], [0.2, -0.15], zero, 5, { 1: 1 }), range(5).map(i => 0.1 ** (i + 1)));
}
// ---- L3-08 resonance & sinusoid
check('L3-08 res', sim([-0.5], [1], k => 0.5 ** k * u(k), 10), range(10).map(i => (i + 1) * 0.5 ** i));
{
  const y = sim([-0.5], [1], k => Math.cos(Math.PI * k / 2) * u(k), 40); const ss = n => 0.8944271909999159 * Math.cos(Math.PI * n / 2 - 0.4636476090008061);
  console.log('L3-08 ss diff at n=30..33', [30, 31, 32, 33].map(i => (y[i] - ss(i)).toExponential(1)).join(' '));
}
// ---- L3-05 stability of 2y(n)+y(n-1)-4y(n-3)=x(n)+3x(n-5)
{
  let z = 1.1; for (let i = 0; i < 50; i++) z -= (z ** 3 + 0.5 * z ** 2 - 2) / (3 * z ** 2 + z); console.log('L3-05 real root', z);
  const bq = 0.5 + z; const cq = 2 / z; const disc = bq * bq - 4 * cq; console.log('  deflated quad z^2+bz+c: b', bq, 'c', cq, 'disc', disc, '|complex roots|', Math.sqrt(cq));
}
// ---- L4 inverse z
check('L4-05a', sim([-1.5, 0.5], [1], d, 10), range(10).map(i => 2 - 0.5 ** i));
check('L4-07', sim([-0.5], [1, 1, 1], d, 10), range(10).map(i => (i === 0 ? -6 : 0) + (i === 1 ? -2 : 0) + 7 * 0.5 ** i));
check('L4-08 closed', sim([-2, 1.25, -0.25], [0, 1], d, 10), range(10).map(i => 4 - 4 * 0.5 ** i - 2 * i * 0.5 ** i));
{
  const th = Math.PI / 4, A = Math.hypot(0.5, -1.5), ph = Math.atan2(-1.5, 0.5), r = Math.SQRT1_2;
  check('L4-09', sim([-1, 0.5], [1, 1], d, 12), range(12).map(i => 2 * A * r ** i * Math.cos(i * th + ph)));
  console.log('L4-09 |A|', A, '2|A|', 2 * A, 'phase deg', ph * 180 / Math.PI, 'rad', ph);
}
// ---- L4-10 conv via z
check('L4-10', conv(range(12).map(i => 0.5 ** i), range(12).map(() => 1)).slice(0, 12), range(12).map(i => 2 - 0.5 ** i));
// ---- L4-11 H(z)
{
  const a = [-0.75, 0.125], b = [1, 1 / 3];
  check('L4-11 h', sim(a, b, d, 12), range(12).map(i => (10 / 3) * 0.5 ** i - (7 / 3) * 0.25 ** i));
  check('L4-11 step', sim(a, b, u, 14), range(14).map(i => 32 / 9 - (10 / 3) * 0.5 ** i + (7 / 9) * 0.25 ** i));
}
// ---- L4-12 ZIR 0.9, 0.81
{
  const y = sim([-0.9, 0.81], [1], zero, 14, { 1: 1, 2: 1 }); console.log('L4-12 y0,y1', y[0], y[1]);
  check('L4-12 closed', y, range(14).map(i => 0.9 ** i * (0.09 * Math.cos(Math.PI * i / 3) - 0.57 * Math.sqrt(3) * Math.sin(Math.PI * i / 3))));
}
// ---- L4-13 stability h
{ let s = 0; for (let k = 1; k < 200; k++) s += 0.5 ** k; check('L4-13 sum|h|', s, 1); }
// ---- DS-03 inverse
check('DS-03', conv([1, 0.5], range(30).map(i => (-0.5) ** i)).slice(0, 30), [1, ...Array(29).fill(0)]);
// ---- DS-05 smoother
{ const a = Math.pow(0.05, 1 / 21); console.log('DS-05 a (95% at n=20):', a, ' tau=10 ->', Math.exp(-0.1)); check('DS-05 step', sim([-a], [1 - a], u, 10), range(10).map(i => 1 - a ** (i + 1))); console.log('  step[20]', 1 - a ** 21); }
// ---- DS-07 oscillator
{
  const w = Math.PI / 5; check('DS-07 imp', sim([-2 * Math.cos(w), 1], [0, Math.sin(w)], d, 20), range(20).map(i => Math.sin(w * i)));
  check('DS-07 ic', sim([-2 * Math.cos(w), 1], [0], zero, 20, { 1: -Math.sin(w), 2: -Math.sin(2 * w) }), range(20).map(i => Math.sin(w * i)));
  check('DS-07 ic y(-1)=0', sim([-2 * Math.cos(w), 1], [0], zero, 20, { 1: 0, 2: -Math.sin(w) }), range(20).map(i => Math.sin(w * (i + 1))));
  console.log('DS-07 2cos', 2 * Math.cos(w), 'sin', Math.sin(w), 'sin2w', Math.sin(2 * w));
}
// ---- DS-08 notch
{
  const w = Math.PI / 5, r = 0.9, c = 2 * Math.cos(w);
  const H = om => {
    const e = [Math.cos(-om), Math.sin(-om)], e2 = [Math.cos(-2 * om), Math.sin(-2 * om)];
    const num = [1 - c * e[0] + e2[0], -c * e[1] + e2[1]], den = [1 - r * c * e[0] + r * r * e2[0], -r * c * e[1] + r * r * e2[1]];
    const m = z => Math.hypot(z[0], z[1]); return m(num) / m(den);
  };
  console.log('DS-08 |H|: dc', H(0).toFixed(4), 'w0', H(w).toExponential(1), 'w0±0.1', H(w - 0.1).toFixed(3), H(w + 0.1).toFixed(3), 'pi', H(Math.PI).toFixed(4));
  console.log('  coef r*c', r * c, 'r^2', r * r, 'H(1)', (2 - c) / (1 - r * c + r * r), 'c', c);
}
// ---- DS-04 MA notch Fs=400, M=8
{ const M = 8, Fs = 400; const H = F => { const om = 2 * Math.PI * F / Fs; let re = 0, im = 0; for (let k = 0; k < M; k++) { re += Math.cos(om * k); im -= Math.sin(om * k); } return Math.hypot(re, im) / M; }; console.log('DS-04 |H| at 0,25,50,100,150,200:', [0, 25, 50, 100, 150, 200].map(F => H(F).toFixed(4)).join(' ')); }
// ---- DS-06 echo
console.log('DS-06 (D=5, 0.5)', sim([0, 0, 0, 0, -0.5], [1], d, 15).join(','));
// ---- DS-09 radar, DS-01/02
console.log('DS-09 range', 3e8 * 20 / (2 * 1e6), 'res@10MHz', 3e8 / (2 * 1e7), '20log13', 20 * Math.log10(13));
console.log('DS-01 bits', Math.ceil((60 - 1.76) / 6.02), 'SQNR10', 6.02 * 10 + 1.76, 'DS-02 L', 4 / 0.001 + 1, 'bits', Math.ceil(Math.log2(4001)), 'dB', 6.02 * 12 + 1.76);
// ---- concepts.js tiny examples
for (let i = 0; i < 12; i++) { check('C alias n=' + i, Math.cos(2 * Math.PI * 50 * i / 75), Math.cos(2 * Math.PI * 25 * i / 75), 1e-9); check('C 5/2 vs 1/2 n=' + i, Math.round(Math.cos(2 * Math.PI * 2.5 * i)), Math.round(Math.cos(2 * Math.PI * 0.5 * i))); }
check('C conv {1,1,1}*{1,2}', conv([1, 1, 1], [1, 2]), [1, 3, 3, 2]);
check('C Z conv', conv([1, 1], [1, 2]), [1, 3, 2]);
check('C y=0.5y(n-1)+delta', sim([-0.5], [1], d, 4), [1, 0.5, 0.25, 0.125]);
check('C step', sim([-0.5], [1], u, 4), [1, 1.5, 1.75, 1.875]);
check('C zi y(-1)=1', sim([-0.5], [1], zero, 3, { 1: 1 }), [0.5, 0.25, 0.125]);
check('C total', sim([-0.5], [1], u, 3, { 1: 1 }), [1.5, 1.75, 1.875]);
check('C zir y(-1)=2 -> 0.5^n', sim([-0.5], [1], zero, 5, { 1: 2 }), range(5).map(i => 0.5 ** i));
check('C zir 0.9', sim([-0.9], [1], zero, 5, { 1: 1 }), range(5).map(i => 0.9 ** (i + 1)));
{ const x = [1, 2, 3], r = l => x.reduce((s, vv, i) => s + vv * (x[i - l] || 0), 0); check('C rxx', [-2, -1, 0, 1, 2].map(r), [3, 8, 14, 8, 3]); }
check('C conv x{2,0,1} h{1,0,-1} sum', conv([2, 0, 1], [1, 0, -1]).reduce((a, b) => a + b, 0), 0);
check('C MA zero-order h', sim([-0.1], [0.2, -0.15], d, 2), [0.2, -0.13]);
check('C sqnr bits', Math.ceil((60 - 1.76) / 6.02), 10);
check('C ramp Z', sim([-2, 1], [0, 1], d, 5), [0, 1, 2, 3, 4]);
check('C n 0.5^n', sim([-1, 0.25], [0, 0.5], d, 6), range(6).map(i => i * 0.5 ** i));
// ---- L4-14..L4-18 (rest of the Lec 4 slide set)
{
  // Z-transform by truncated sum at a test point z (complex via [re,im])
  const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cdiv = (a, b) => { const m = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / m, (a[1] * b[0] - a[0] * b[1]) / m]; };
  const cpow = (z, n) => { const r = Math.hypot(...z) ** n, t = Math.atan2(z[1], z[0]) * n; return [r * Math.cos(t), r * Math.sin(t)]; };
  const zt = (x, z, n0, n1) => { let s = [0, 0]; for (let n = n0; n <= n1; n++) { const t = cmul([x(n), 0], cpow(z, -n)); s = [s[0] + t[0], s[1] + t[1]]; } return s; };
  const cclose = (a, b, name, tol = 1e-6) => check(name, [a[0], a[1]], [b[0], b[1]], tol);
  const w0 = 0.7, ph = 0.4;
  const inv = z => cdiv([1, 0], z); // z^-1
  // (a) 2^n sin(w0 n)u(n), ROC |z|>2: 2 sin w0 z^-1 / (1 - 4 cos w0 z^-1 + 4 z^-2); test at |z|=3
  { const z = [2.4, 1.8], iz = inv(z), iz2 = cmul(iz, iz);
    const num = cmul([2 * Math.sin(w0), 0], iz), den = [1 - 4 * Math.cos(w0) * iz[0] + 4 * iz2[0], -4 * Math.cos(w0) * iz[1] + 4 * iz2[1]];
    cclose(zt(n => 2 ** n * Math.sin(w0 * n), z, 0, 400), cdiv(num, den), 'L4-14a'); }
  // (b) cos(w0 n + phi)u(n): (cos phi - cos(w0-phi) z^-1)/(1 - 2cos w0 z^-1 + z^-2); test at |z|=1.5
  { const z = [1.2, 0.9], iz = inv(z), iz2 = cmul(iz, iz);
    const num = [Math.cos(ph) - Math.cos(w0 - ph) * iz[0], -Math.cos(w0 - ph) * iz[1]], den = [1 - 2 * Math.cos(w0) * iz[0] + iz2[0], -2 * Math.cos(w0) * iz[1] + iz2[1]];
    cclose(zt(n => Math.cos(w0 * n + ph), z, 0, 800), cdiv(num, den), 'L4-14b'); }
  // (c) (1/2)^n[u(n)-u(n-10)] = (1 - (z^-1/2)^10)/(1 - z^-1/2), any z != 0
  { const z = [0.3, -0.4], iz = inv(z), h = [0.5 * iz[0], 0.5 * iz[1]], h10 = cpow(h, 10);
    cclose(zt(n => 0.5 ** n * (u(n) - u(n - 10)), z, 0, 20), cdiv([1 - h10[0], -h10[1]], [1 - h[0], -h[1]]), 'L4-14c'); }
  // (d) a^n u(k-n), a=0.8,k=3, ROC |z|<0.8: (a/z)^k/(1 - z/a); test |z|=0.5
  { const a = 0.8, k = 3, z = [0.3, 0.4], t = cpow(cdiv([a, 0], z), k), q = [1 - z[0] / a, -z[1] / a];
    cclose(zt(n => a ** n * (n <= k ? 1 : 0), z, -400, k), cdiv(t, q), 'L4-14d'); }
}
// ---- L4-15 X=1/((1+z^-1)(1-z^-1)^2)
check('L4-15', sim([-1, -1, 1], [1], d, 12), range(12).map(i => 0.25 * (-1) ** i + 0.25 + 0.5 * (i + 1)));
// ---- L4-16 convolutions
check('L4-16a', conv(range(14).map(i => (1 / 3) ** i), range(14).map(i => 0.5 ** i)).slice(0, 14), range(14).map(i => 3 * 0.5 ** i - 2 * (1 / 3) ** i));
check('L4-16b', conv(range(16).map(i => Math.cos(Math.PI * i / 3)), range(16).map(i => 0.5 ** i)).slice(0, 16), range(16).map(i => (2 / Math.sqrt(3)) * Math.sin(Math.PI * (i + 1) / 3)));
check('L4-16b diffeq', sim([-1, 1], [1], d, 16), range(16).map(i => (2 / Math.sqrt(3)) * Math.sin(Math.PI * (i + 1) / 3)));
// ---- L4-17 system functions
check('L4-17a h', sim([-0.5].map(x => x), [2, 0.5, 1], d, 12).map((v, i) => v), range(12).map(i => (i === 0 ? -5 : 0) + (i === 1 ? -2 : 0) + 7 * 0.5 ** i));
check('L4-17b h', sim([-3, -4], [1, 2], d, 10), range(10).map(i => 1.2 * 4 ** i - 0.2 * (-1) ** i));
{ // zeros of 2z^2+0.5z+1
  const re = -0.125, im = Math.sqrt(8 - 0.25) / 4; check('L4-17a zero', 2 * (re * re - im * im) + 0.5 * re + 1, 0); check('L4-17a zero im', 4 * re * im + 0.5 * im, 0); console.log('L4-17a |zero|', Math.hypot(re, im)); }
// ---- L4-18 cascade of two 1/(1-0.8z^-1), step response, DF-II equivalent
{
  const sec = x => sim([-0.8], [1], x, 40);
  const v = sec(u), y1 = sec(k => v[k]); // placeholder to ensure same length usage
  const y = sim([-0.8], [1], k => sim([-0.8], [1], u, 40)[k], 40);
  check('L4-18 step', y.slice(0, 30), range(30).map(i => 25 - 20 * 0.8 ** i - 4 * (i + 1) * 0.8 ** i));
  check('L4-18 DF2', sim([-1.6, 0.64], [1], u, 30), range(30).map(i => 25 - 20 * 0.8 ** i - 4 * (i + 1) * 0.8 ** i));
  check('L4-18 limit', 1 / (1 - 0.8) ** 2, 25);
}
console.log(fails ? `\n${fails} FAILED of ${n}` : `\nall ${n} checks passed`); process.exit(fails ? 1 : 0);
