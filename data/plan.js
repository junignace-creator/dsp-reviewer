/* Study plan: sessions of checkable tasks. Each task = [html, minutes]. Links: P(...problem ids), C(lectureIndex, sectionNumber...). */
function P() { return Array.prototype.map.call(arguments, function (i) { return '<a data-goto="' + i + '">' + i + '</a>'; }).join(', '); }
function C(lec, a, b) {
  var secs = [], s;
  for (s = a; s <= (b || a); s++) secs.push(s);
  return '<a data-concept="' + (lec - 1) + ':' + (a - 1) + '">Lec ' + lec + ' Concepts §' + a + (b && b !== a ? '–' + b : '') + '</a>';
}

var PLAN = {
  loop: [
    '<b>Read</b> the concept section slowly. Open every <i>? check yourself</i> box and answer it in your head or on paper first.',
    '<b>Try</b> the matching problem for at least 5 minutes <i>before</i> opening the solution. Being stuck is part of learning.',
    '<b>Compare:</b> show the solution and follow it step by step against the recipe. Don’t just nod along.',
    '<b>Redo:</b> hide the solution and solve the same problem again from a blank page.',
    '<b>Grade honestly:</b> <i>Got it</i> only if you solved the redo without peeking; otherwise <i>Missed</i>. Missed problems show up in the Drill (“Missed only”) and the Cheat List.'
  ],
  quick: {
    title: 'Short on time? The survival set',
    when: 'If you only have one or two days left, do these instead of the full plan. They cover the most reusable methods.',
    tasks: [
      ['Aliasing and quantization: ' + P('L1-01', 'L1-05') + '. Read ' + C(1, 3, 4) + '.', '30m'],
      ['System properties and convolution: ' + P('L2-03', 'L2-05') + '. Read ' + C(2, 3, 4) + '.', '40m'],
      ['LCCDE direct method and realization: ' + P('L3-01', 'L3-05') + '. Read ' + C(3, 3, 4) + ' and ' + C(3, 6) + '.', '45m'],
      ['Z-transform: ROC and inverse via partial fractions, then H(z): ' + P('L4-01', 'L4-05', 'L4-10') + '. Read ' + C(4, 2) + ', ' + C(4, 5, 6) + '.', '60m'],
      ['Read the whole <b>Cheat List</b> tab, then the <b>Recipes</b> for classify-a-system, convolution table and the inverse-Z decision tree.', '25m']
    ]
  },
  sessions: [
    {
      day: 'Session 1', focus: 'Lecture 1 · Signals, sampling and quantization',
      tasks: [
        ['Read ' + C(1, 1, 2) + ': signal types, CT vs DT sinusoids. Answer both check boxes.', '20m'],
        ['Read ' + C(1, 3) + ' (sampling, aliasing, Nyquist). Say the aliasing rule out loud: subtract a whole number until f lands in −½…½.', '20m'],
        ['Solve ' + P('L1-01', 'L1-02', 'L1-03') + ' (aliasing). Use the <b>Recipes → Aliasing</b> steps.', '30m'],
        ['Read ' + C(1, 4, 5) + ' (quantization, SQNR, signal classes).', '20m'],
        ['Solve ' + P('L1-04', 'L1-05', 'L1-06', 'L1-07', 'L1-08') + '.', '30m'],
        ['Redo every problem you marked <i>Missed</i>. Then read the Lec 1 formulas in the <b>Formula Sheet</b>.', '15m']
      ]
    },
    {
      day: 'Session 2', focus: 'Lecture 2 (part 1) · Signal operations and system properties',
      tasks: [
        ['Read ' + C(2, 1, 2) + ' (impulse, step, ramp, shifting, folding, sifting).', '20m'],
        ['Solve ' + P('L2-01', 'L2-02') + ' (fold/delay, sketches). Build a table of n against the argument of x each time.', '30m'],
        ['Read ' + C(2, 3) + ' (the five system properties). This is the most testable page of the lecture.', '25m'],
        ['Solve ' + P('L2-03', 'L2-04') + ' (classify systems). Follow <b>Recipes → Classify a system</b> literally.', '35m'],
        ['Redo missed problems; read the Lec 2 red flags in the <b>Cheat List</b>.', '15m']
      ]
    },
    {
      day: 'Session 3', focus: 'Lecture 2 (part 2) · Convolution, interconnections and correlation',
      tasks: [
        ['Read ' + C(2, 4) + ' (why convolution appears). Re-derive on paper why y = Σ x(k)h(n−k).', '25m'],
        ['Solve ' + P('L2-05', 'L2-06') + ' (convolution). Use the length and sum checks every time.', '35m'],
        ['Read ' + C(2, 5) + ', then solve ' + P('L2-07', 'L2-10') + ' (cascade, parallel, impulses).', '30m'],
        ['Read ' + C(2, 6) + ', then solve ' + P('L2-08', 'L2-09') + ' (correlation).', '30m'],
        ['Redo missed problems.', '15m']
      ]
    },
    {
      day: 'Session 4', focus: 'Lecture 3 (part 1) · Difference equations, ZIR/ZSR, the direct method',
      tasks: [
        ['Read ' + C(3, 1, 2) + ' (what an LCCDE is; zero-input vs zero-state).', '25m'],
        ['Read ' + C(3, 3, 4) + ' (homogeneous and particular solutions).', '30m'],
        ['Solve ' + P('L3-01') + ' step by step with the <b>Recipes → Direct method</b>. Then redo it from scratch.', '25m'],
        ['Solve ' + P('L3-04', 'L3-02', 'L3-03') + '.', '30m'],
        ['Solve ' + P('L3-08') + ' (resonance and sinusoidal input).', '10m']
      ]
    },
    {
      day: 'Session 5', focus: 'Lecture 3 (part 2) · Realizations, then the Z-transform basics',
      tasks: [
        ['Read ' + C(3, 5, 6) + ' (impulse response, Direct Form I and II).', '25m'],
        ['Solve ' + P('L3-05', 'L3-06', 'L3-07') + '. Always normalize the y(n) coefficient first.', '40m'],
        ['Solve ' + P('L3-09') + ' (recursive vs IIR).', '10m'],
        ['Read ' + C(4, 1, 2) + ' (what the Z-transform is; the region of convergence).', '25m'],
        ['Solve ' + P('L4-01', 'L4-02') + '.', '20m']
      ]
    },
    {
      day: 'Session 6', focus: 'Lecture 4 (part 1) · Properties and the inverse Z-transform',
      tasks: [
        ['Read ' + C(4, 3, 4) + ' (properties and the transform pairs).', '30m'],
        ['Solve ' + P('L4-03', 'L4-14') + ' (properties; sinusoid, window and left-sided transforms).', '30m'],
        ['Read ' + C(4, 5) + ' (the inverse-Z decision tree).', '20m'],
        ['Solve ' + P('L4-04', 'L4-05', 'L4-06') + ' (long division, partial fractions, improper).', '40m'],
        ['Solve ' + P('L4-07', 'L4-08', 'L4-09', 'L4-15', 'L4-16') + ' (repeated poles, complex poles, convolution).', '45m']
      ]
    },
    {
      day: 'Session 7', focus: 'Lecture 4 (part 2) · H(z), stability, initial conditions, first design problems',
      tasks: [
        ['Read ' + C(4, 6, 7) + ' (system function, poles and zeros, one-sided Z).', '25m'],
        ['Solve ' + P('L4-10', 'L4-11', 'L4-17', 'L4-18') + ' (H(z), one-sided Z, cascade).', '45m'],
        ['Solve ' + P('L4-12', 'L4-13') + ' (ROC vs stability, pole location).', '15m'],
        ['Design problems: ' + P('DS-05', 'DS-09') + '. Follow <b>Recipes → Pole-zero placement</b>.', '35m'],
        ['Redo missed problems.', '15m']
      ]
    },
    {
      day: 'Session 8', focus: 'Final consolidation and mock test',
      tasks: [
        ['Open <b>Drill</b>, set the pool to <i>Missed only</i>, and clear every problem there.', '30m'],
        ['<b>Formula dump:</b> on blank paper, write every formula you remember for each lecture, then check against the <b>Formula Sheet</b>.', '20m'],
        ['<b>Mock test:</b> in <b>Drill</b> choose <i>Everything</i> and finish 5 problems back to back, about 8 minutes each, without looking at solutions until you commit.', '45m'],
        ['Remaining design problems you skipped: ' + P('DS-01', 'DS-02', 'DS-03', 'DS-04', 'DS-06', 'DS-07', 'DS-08') + '.', '40m'],
        ['Read the <b>Cheat List</b> one last time, then stop and rest.', '10m']
      ]
    }
  ]
};
