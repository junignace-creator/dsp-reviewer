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
      day: 'Today · Block 1 (3 h)', focus: 'Lecture 1 and the system properties of Lecture 2',
      tasks: [
        ['Read ' + C(1, 1, 3) + ' (signal types, sinusoids, sampling and aliasing). Say the aliasing rule out loud: subtract a whole number until f lands in −½…½.', '20m'],
        ['Solve ' + P('L1-01', 'L1-02', 'L1-03') + ' (aliasing). Use <b>Recipes → Aliasing</b>.', '30m'],
        ['Read ' + C(1, 4, 5) + ', then solve ' + P('L1-04', 'L1-05', 'L1-06', 'L1-07', 'L1-08') + ' (quantization, SQNR, periodicity).', '40m'],
        ['Read ' + C(2, 1, 2) + ', then solve ' + P('L2-01', 'L2-02') + ' (fold/delay, sketches). Build a table of n against the argument every time.', '35m'],
        ['Read ' + C(2, 3) + ', then solve ' + P('L2-03', 'L2-04') + ' (classify systems; the most testable page of Lec 2).', '40m'],
        ['<b>Notes tab:</b> read the derivations for the sampling relation and SQNR = 6.02b + 1.76. Write both once from memory.', '15m']
      ]
    },
    {
      day: 'Today · Block 2 (3 h)', focus: 'Convolution, then Lecture 3 (LCCDE and realizations)',
      tasks: [
        ['Read ' + C(2, 4, 5) + ', then solve ' + P('L2-05', 'L2-06', 'L2-07', 'L2-10') + ' (convolution, interconnections). Re-derive y = Σ x(k)h(n−k) on paper.', '40m'],
        ['Skim ' + C(2, 6) + ' and solve ' + P('L2-08', 'L2-09') + ' (correlation; the lowest-priority topic).', '15m'],
        ['Read ' + C(3, 1, 4) + ' (zero-input vs zero-state, homogeneous and particular solutions).', '35m'],
        ['Solve ' + P('L3-01', 'L3-04') + ' with <b>Recipes → Direct method</b>; redo ' + P('L3-01') + ' blind. ' + P('L3-02', 'L3-03', 'L3-08') + ' only if time.', '40m'],
        ['Read ' + C(3, 5, 6) + ', then solve ' + P('L3-05', 'L3-06', 'L3-07', 'L3-09') + ' (Direct Form I and II, block diagrams). Draw each diagram by hand.', '45m'],
        ['<b>Notes tab:</b> read the derivations for the convolution sum and H(z) from an LCCDE.', '5m']
      ]
    },
    {
      day: 'Monday night (2 h)', focus: 'Z-transform: ROC, properties and the inverse',
      tasks: [
        ['Read ' + C(4, 1, 2) + ', then solve ' + P('L4-01', 'L4-02') + ' (finite sequences and ROC).', '30m'],
        ['Read ' + C(4, 3, 4) + ', then solve ' + P('L4-03', 'L4-14') + ' (properties and table pairs).', '35m'],
        ['Read ' + C(4, 5) + ' (the inverse-Z decision tree), then solve ' + P('L4-04', 'L4-05', 'L4-06') + '.', '35m'],
        ['Solve ' + P('L4-07', 'L4-08', 'L4-15') + ' (repeated and complex poles).', '20m']
      ]
    },
    {
      day: 'Tuesday night (2 h)', focus: 'H(z), stability, one-sided Z and the first design problems',
      tasks: [
        ['Read ' + C(4, 6, 7) + ' (system function, poles and zeros, one-sided Z).', '15m'],
        ['Solve ' + P('L4-10', 'L4-17', 'L4-18') + ' (H(z), improper H, cascade).', '35m'],
        ['Solve ' + P('L4-11', 'L4-12', 'L4-13') + ' (initial conditions, ROC vs stability, pole location).', '25m'],
        ['Solve ' + P('L4-09', 'L4-16') + ' (convolution through Z).', '10m'],
        ['Design: ' + P('DS-08', 'DS-09') + ' (oscillator and notch). Follow <b>Recipes → Pole-zero placement</b>.', '35m']
      ]
    },
    {
      day: 'Wednesday night (2 h)', focus: 'Design problems and graphing (what the exam asks)',
      tasks: [
        ['Design: ' + P('DS-01', 'DS-02', 'DS-03', 'DS-04') + ' (ADC sizing, equalizer, radar). Write each answer as spec → design → verify.', '40m'],
        ['Design: ' + P('DS-05', 'DS-06', 'DS-07') + ' (smoother, reverb, moving average).', '35m'],
        ['<b>Graphing practice</b> (Notes tab → Graphing). Redraw from blank paper: the pole-zero plot with ROC shading for ' + P('L4-02', 'L4-10', 'L4-12') + ' and the stem plots in ' + P('L2-01', 'L2-02') + '.', '35m'],
        ['<b>Missed only</b> drill: clear whatever is left.', '10m']
      ]
    },
    {
      day: 'Thursday', focus: 'No review. Optional 5 minutes: print the Notes tab.',
      tasks: [
        ['Open the <b>Notes (print)</b> tab and press Print (or save as PDF and print later). Check that the page count is what you want (about 8–10 pages double-sided).', '5m']
      ]
    },
    {
      day: 'Friday morning (2 h)', focus: 'Final pass before the exam',
      tasks: [
        ['<b>Missed only</b> drill: clear every problem left in the pool.', '30m'],
        ['<b>Read your printed notes</b> like the exam is open: tab the derivations and recipes you would reach for first. Highlight anything you do not understand.', '30m'],
        ['<b>Blind derivations:</b> without looking, derive the Z-transform of aⁿu(n), the shift property, and H(z) from an LCCDE.', '20m'],
        ['<b>Timed mock:</b> two design problems (' + P('DS-03', 'DS-09') + ' or any you missed), 15 minutes each, then check.', '30m'],
        ['Read the <b>Cheat List</b> red flags once, then stop and rest.', '10m']
      ]
    }
  ]
};
