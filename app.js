/* App logic: tabs, problem cards, self-grading (localStorage), filters, drill mode, cheat list. */
var STATE_KEY = 'dsp-reviewer-state-v1';
function loadState() { try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch (e) { return {}; } }
function saveState() { try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { } }
var state = loadState();

var LEC_NAMES = { L1: 'Lec 1 · Signals & sampling', L2: 'Lec 2 · DT signals & systems', L3: 'Lec 3 · LCCDE', L4: 'Lec 4 · Z-transform' };
var byId = {}; PROBLEMS.forEach(function (p) { byId[p.id] = p; });
var SOLVE = PROBLEMS.filter(function (p) { return p.kind === 'solve'; });
var DESIGN = PROBLEMS.filter(function (p) { return p.kind === 'design'; });

function updateProgress() {
  var done = PROBLEMS.filter(function (p) { return state[p.id] === 'solved'; }).length;
  document.getElementById('progressPill').textContent = done + ' / ' + PROBLEMS.length + ' solved';
}
function chipFor(id) { return state[id] === 'solved' ? ['solved', 'Got it'] : state[id] === 'missed' ? ['missed', 'Missed'] : ['', '']; }

/* ----- a single problem card (used by lists and by the drill) ----- */
function probCard(p, onGrade) {
  var div = document.createElement('div');
  div.className = 'prob'; div.id = 'prob-' + p.id;
  div.innerHTML =
    '<div class="prob-head"><span class="prob-id">' + p.id + '</span><span class="kind-tag ' + p.kind + '">' + (p.kind === 'design' ? 'Design' : 'Solve') + '</span>' +
    '<span class="kind-tag">' + p.lec + '</span>' + (LOW_PRIORITY.indexOf(p.id) >= 0 ? '<span class="kind-tag low">Low priority</span>' : '') + '<span class="status-chip"></span></div>' +
    '<div class="prob-title">' + inlineMath(p.title) + '</div><div class="prob-body">' + inlineMath(p.q) + '</div>' +
    '<button class="reveal-btn" type="button">Show solution</button>' +
    '<div class="answer" hidden>' + inlineMath(p.a) +
    '<div class="grade"><span>How did you do?</span><button type="button" data-g="solved">Got it ✓</button><button type="button" data-g="missed">Missed ✗</button><button type="button" data-g="">Clear</button></div></div>';
  var chip = div.querySelector('.status-chip'), btn = div.querySelector('.reveal-btn'), ans = div.querySelector('.answer');
  function paint() { var c = chipFor(p.id); chip.className = 'status-chip ' + c[0]; chip.textContent = c[1]; }
  paint();
  btn.addEventListener('click', function () { ans.hidden = !ans.hidden; btn.textContent = ans.hidden ? 'Show solution' : 'Hide solution'; if (!ans.hidden && onGrade && onGrade.onReveal) onGrade.onReveal(); });
  div.querySelector('.grade').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-g]'); if (!b) return;
    if (b.dataset.g) state[p.id] = b.dataset.g; else delete state[p.id];
    saveState(); paint(); updateProgress(); renderMissed();
    if (onGrade && onGrade.onGrade) onGrade.onGrade(b.dataset.g);
  });
  return div;
}

/* ----- list tabs with lecture + status filters ----- */
function buildList(prefix, items) {
  var f = { lec: 'all', st: 'all' };
  var bar = document.getElementById('filters' + prefix), list = document.getElementById('list' + prefix);
  var lecs = ['all', 'L1', 'L2', 'L3', 'L4'], sts = ['all', 'todo', 'missed', 'solved'];
  var stLabel = { all: 'Any status', todo: 'Unsolved', missed: 'Missed', solved: 'Solved' };
  function draw() {
    bar.innerHTML = lecs.map(function (l) { return '<button type="button" data-k="lec" data-v="' + l + '" class="' + (f.lec === l ? 'active' : '') + '">' + (l === 'all' ? 'All lectures' : l) + '</button>'; }).join('') +
      '<span class="sep"></span>' + sts.map(function (s) { return '<button type="button" data-k="st" data-v="' + s + '" class="' + (f.st === s ? 'active' : '') + '">' + stLabel[s] + '</button>'; }).join('');
    list.innerHTML = '';
    var shown = items.filter(function (p) {
      if (f.lec !== 'all' && p.lec !== f.lec) return false;
      var s = state[p.id] || '';
      if (f.st === 'todo') return s !== 'solved';
      if (f.st === 'missed') return s === 'missed';
      if (f.st === 'solved') return s === 'solved';
      return true;
    });
    var last = '';
    shown.forEach(function (p) {
      if (p.lec !== last) { var h = document.createElement('div'); h.className = 'topic-h'; h.textContent = LEC_NAMES[p.lec]; list.appendChild(h); last = p.lec; }
      list.appendChild(probCard(p));
    });
    if (!shown.length) list.innerHTML = '<p class="empty">Nothing matches this filter.</p>';
  }
  bar.addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (!b) return; f[b.dataset.k] = b.dataset.v; draw(); });
  draw();
  return { redraw: draw, filters: f };
}

/* ----- tabs ----- */
function showPane(name) {
  document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.pane === name); });
  document.querySelectorAll('section.pane').forEach(function (p) { p.classList.toggle('active', p.id === 'pane-' + name); });
  try { history.replaceState(null, '', '#' + name); } catch (e) { }
  window.scrollTo(0, 0);
}
document.getElementById('tabs').addEventListener('click', function (e) { var b = e.target.closest('button[data-pane]'); if (b) showPane(b.dataset.pane); });

var listP, listD;
function gotoProblem(id) {
  var p = byId[id]; if (!p) return;
  var l = p.kind === 'design' ? listD : listP; l.filters.lec = 'all'; l.filters.st = 'all'; l.redraw();
  showPane(p.kind === 'design' ? 'design' : 'problems');
  var el = document.getElementById('prob-' + id); if (el) el.scrollIntoView({ block: 'start' });
}

/* ----- drill ----- */
var drill = { timer: null, t0: 0 };
function fmtTime(s) { var m = Math.floor(s / 60); s = s % 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; }
function buildDrill() {
  var ctl = document.getElementById('drillCtl'), out = document.getElementById('drillOut');
  ctl.innerHTML =
    ['L1', 'L2', 'L3', 'L4'].map(function (l) { return '<label><input type="checkbox" data-lec="' + l + '" checked>' + l + '</label>'; }).join('') +
    '<label><input type="checkbox" id="dSolve" checked>Solve</label><label><input type="checkbox" id="dDesign" checked>Design</label>' +
    '<select id="dPool"><option value="open">Unsolved + missed</option><option value="missed">Missed only</option><option value="all">Everything</option></select>' +
    '<button class="big-btn" id="dGo" type="button">Draw a problem</button>';
  function pool() {
    var lecs = Array.prototype.map.call(ctl.querySelectorAll('input[data-lec]:checked'), function (i) { return i.dataset.lec; });
    var kinds = []; if (document.getElementById('dSolve').checked) kinds.push('solve'); if (document.getElementById('dDesign').checked) kinds.push('design');
    var mode = document.getElementById('dPool').value;
    return PROBLEMS.filter(function (p) {
      if (lecs.indexOf(p.lec) < 0 || kinds.indexOf(p.kind) < 0) return false;
      var s = state[p.id] || '';
      return mode === 'all' || (mode === 'missed' ? s === 'missed' : s !== 'solved');
    });
  }
  function stop() { if (drill.timer) { clearInterval(drill.timer); drill.timer = null; } }
  function draw() {
    stop();
    var pl = pool();
    if (!pl.length) { out.innerHTML = '<p class="empty">No problems in this pool — widen the filters or switch to "Everything".</p>'; return; }
    var p = pl[Math.floor(Math.random() * pl.length)];
    out.innerHTML = '<div class="timer" id="dTimer" style="text-align:right;margin:0 0 6px">00:00</div><div id="dCard"></div><p style="margin-top:10px"><button class="ghost-btn" id="dNext" type="button">Next problem →</button> <span class="formula-note" style="display:inline">' + pl.length + ' in pool</span></p>';
    drill.t0 = Date.now();
    drill.timer = setInterval(function () { var el = document.getElementById('dTimer'); if (el) el.textContent = fmtTime(Math.floor((Date.now() - drill.t0) / 1000)); }, 500);
    document.getElementById('dCard').appendChild(probCard(p, { onReveal: stop }));
    document.getElementById('dNext').addEventListener('click', draw);
  }
  document.getElementById('dGo').addEventListener('click', draw);
}

/* ----- recipes, formulas, cheat ----- */
function renderRecipes() {
  var root = document.getElementById('recipeList');
  root.innerHTML = '<div class="exam-note">Short, repeatable procedures. If a problem stalls, find its recipe here and follow the numbered steps literally.</div>';
  RECIPES.forEach(function (g) {
    var h = document.createElement('div'); h.className = 'topic-h'; h.textContent = g.topic; root.appendChild(h);
    g.items.forEach(function (r) {
      var c = document.createElement('div'); c.className = 'card note-sec';
      c.innerHTML = '<h3>' + r.name + '</h3>' + (r.when ? '<p style="color:var(--muted);margin:4px 0 6px">' + inlineMath(r.when) + '</p>' : '') + '<ol>' + r.steps.map(function (s) { return '<li>' + inlineMath(s) + '</li>'; }).join('') + '</ol>' + (r.tip ? '<div class="callout"><span class="callout-tag">Watch out</span>' + inlineMath(r.tip) + '</div>' : '');
      root.appendChild(c);
    });
  });
}
/* italicize single-letter variables and lowercase Greek in formula text (not inside tags; e, j, d, π stay upright) */
function mathify(html) {
  return html.split(/(<[^>]*>)/).map(function (seg) {
    if (seg.charAt(0) === '<') return seg;
    return seg.replace(/[A-Za-z]+/g, function (m) { return (m.length === 1 && 'ejd'.indexOf(m) < 0) ? '<i>' + m + '</i>' : m; })
      .replace(/[α-ωϕθλμσδφω]/g, function (c) { return c === 'π' ? c : '<i>' + c + '</i>'; });
  }).join('');
}
function renderConcepts() {
  var tabs = document.getElementById('conceptTabs'), body = document.getElementById('conceptBody'), cur = 0;
  try { cur = +localStorage.getItem('dsp-reviewer-concept-tab') || 0; } catch (e) { }
  if (cur >= CONCEPTS.length) cur = 0;
  function draw() {
    tabs.innerHTML = CONCEPTS.map(function (c, i) { return '<button type="button" data-i="' + i + '" class="' + (i === cur ? 'active' : '') + '">' + c.label + '</button>'; }).join('');
    body.innerHTML = CONCEPTS[cur].sections.map(function (s) { return '<div class="card note-sec"><h3>' + s.h + '</h3>' + inlineMath(s.html) + '</div>'; }).join('');
  }
  window.openConcept = function (i, s) { cur = i; try { localStorage.setItem('dsp-reviewer-concept-tab', cur); } catch (x) { } draw(); showPane('concepts'); var c = body.querySelectorAll('.card')[s]; if (c) c.scrollIntoView({ block: 'start' }); };
  tabs.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (!b) return; cur = +b.dataset.i; try { localStorage.setItem('dsp-reviewer-concept-tab', cur); } catch (x) { } draw(); window.scrollTo(0, 0); });
  draw();
}
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[data-goto]'); if (a) gotoProblem(a.dataset.goto);
  var c = e.target.closest('a[data-concept]'); if (c) { var p = c.dataset.concept.split(':'); window.openConcept(+p[0], +p[1]); }
});
var PLAN_KEY = 'dsp-reviewer-plan-v1', planState = {};
try { planState = JSON.parse(localStorage.getItem(PLAN_KEY) || '{}'); } catch (e) { planState = {}; }
function renderPlan() {
  document.getElementById('planLoop').innerHTML = '<h3>How to study every problem (the loop)</h3><ol>' + PLAN.loop.map(function (s) { return '<li>' + inlineMath(s) + '</li>'; }).join('') + '</ol>';
  function taskList(prefix, tasks) {
    return '<ul class="tasklist">' + tasks.map(function (t, i) {
      var id = prefix + '-t' + i, on = !!planState[id];
      return '<li class="' + (on ? 'done' : '') + '"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><label class="tasktext" for="' + id + '">' + inlineMath(t[0]) + '</label><span class="taskmin">' + t[1] + '</span></li>';
    }).join('') + '</ul>';
  }
  function mins(tasks) { return tasks.reduce(function (s, t) { return s + parseInt(t[1], 10); }, 0); }
  var q = PLAN.quick;
  document.getElementById('planQuick').innerHTML = '<div class="card note-sec"><h3>' + q.title + '</h3><p style="color:var(--muted);margin:4px 0 0">' + q.when + '</p>' + taskList('q', q.tasks) + '</div>';
  var lw = PLAN.low;
  document.getElementById('planQuick').innerHTML += '<div class="card note-sec low-card"><h3>' + lw.title + '</h3><p style="color:var(--muted);margin:4px 0 0">' + lw.when + '</p>' + taskList('l', lw.tasks) + '</div>';
  var list = document.getElementById('planList');
  list.innerHTML = '<span class="plan-pill" id="planPill"></span>' + PLAN.sessions.map(function (s, n) {
    return '<div class="card note-sec"><div class="night-head"><div><span class="night-tag">' + s.day + '</span><div style="margin-top:6px;font-weight:600">' + s.focus + '</div></div><div class="night-mins">~' + mins(s.tasks) + ' min</div></div>' + taskList('s' + n, s.tasks) + '</div>';
  }).join('');
  function pill() {
    var boxes = list.querySelectorAll('input[type=checkbox]'), done = list.querySelectorAll('input[type=checkbox]:checked').length;
    document.getElementById('planPill').textContent = 'Plan progress: ' + done + ' / ' + boxes.length + ' tasks';
  }
  document.getElementById('pane-plan').addEventListener('change', function (e) {
    if (!e.target.matches('input[type=checkbox]')) return;
    planState[e.target.id] = e.target.checked;
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(planState)); } catch (x) { }
    e.target.closest('li').classList.toggle('done', e.target.checked);
    pill();
  });
  pill();
}
function renderFormulas() {
  var root = document.getElementById('formulaList');
  root.innerHTML = '<div class="exam-note">Grouped by lecture. Anything flagged <span class="watch">⚠</span> is a spot where notation or a sign is easy to get wrong.</div>';
  FORMULAS.forEach(function (g) {
    var h = document.createElement('div'); h.className = 'topic-h'; h.textContent = g.topic; root.appendChild(h);
    var card = document.createElement('div'); card.className = 'card';
    g.items.forEach(function (it) {
      var d = document.createElement('div'); d.className = 'formula-item';
      d.innerHTML = '<div class="formula-name">' + it.name + '</div><div class="math-block">' + mathify(it.eq) + '</div>' + (it.note ? '<div class="formula-note">' + inlineMath(it.note) + '</div>' : '');
      card.appendChild(d);
    });
    root.appendChild(card);
  });
}
function renderCheat() {
  document.getElementById('cheatStatic').innerHTML = CHEAT.map(function (g) {
    return '<div class="card note-sec"><h3>' + g.title + '</h3><ul>' + g.items.map(function (i) { return '<li>' + inlineMath(i) + '</li>'; }).join('') + '</ul></div>';
  }).join('');
}
function renderMissed() {
  var box = document.getElementById('missedBox');
  var m = PROBLEMS.filter(function (p) { return state[p.id] === 'missed'; });
  box.innerHTML = m.length ? '<ul class="missed-list">' + m.map(function (p) { return '<li><a data-id="' + p.id + '">' + p.id + '</a> — ' + p.title + '</li>'; }).join('') + '</ul>' : '<p class="empty">Nothing marked <i>Missed</i> yet.</p>';
}
document.getElementById('missedBox').addEventListener('click', function (e) { var a = e.target.closest('a[data-id]'); if (a) gotoProblem(a.dataset.id); });
document.getElementById('resetBtn').addEventListener('click', function () {
  if (!confirm('Clear all Got it / Missed marks on this device?')) return;
  state = {}; saveState(); updateProgress(); renderMissed(); listP.redraw(); listD.redraw();
});

listP = buildList('Problems', SOLVE);
listD = buildList('Design', DESIGN);

function renderNotes() {
  var root = document.getElementById('notesBody'), h = '';
  function sec(title, inner) { return '<div class="nsec"><h3>' + title + '</h3>' + inner + '</div>'; }
  function ol(a) { return '<ol>' + a.map(function (s) { return '<li>' + inlineMath(s) + '</li>'; }).join('') + '</ol>'; }
  h += '<div class="topic-h">Quick rules (traps and shortcuts)</div>';
  RULES.forEach(function (g) { h += sec(g.title, ol(g.steps)); });
  h += '<div class="topic-h">Part A · Derivations (how to arrive at the equation)</div>';
  DERIVE.forEach(function (g) {
    h += '<div class="topic-h">' + g.topic + '</div>';
    g.items.forEach(function (d) { h += sec(d.name, ol(d.steps)); });
  });
  h += '<div class="topic-h">Part B · Graphing rules</div>';
  GRAPHS.forEach(function (g) { h += sec(g.title, ol(g.steps)); });
  h += '<div class="topic-h">Part C · Formula sheet</div>';
  FORMULAS.forEach(function (g) {
    h += '<div class="topic-h">' + g.topic + '</div>';
    g.items.forEach(function (it) {
      h += sec(it.name, '<div class="math-block nmath">' + mathify(it.eq) + '</div>' + (it.note ? '<div class="formula-note">' + inlineMath(it.note) + '</div>' : ''));
    });
  });
  h += '<div class="topic-h">Part D · Recipes</div>';
  RECIPES.forEach(function (g) {
    h += '<div class="topic-h">' + g.topic + '</div>';
    g.items.forEach(function (r) { h += sec(r.name, ol(r.steps) + (r.tip ? '<div class="formula-note">' + inlineMath(r.tip) + '</div>' : '')); });
  });
  h += '<div class="topic-h">Part E · Red flags</div>';
  CHEAT.forEach(function (g) {
    h += sec(g.title, '<ul>' + g.items.map(function (i) { return '<li>' + inlineMath(i) + '</li>'; }).join('') + '</ul>');
  });
  function probs(title, list) {
    var o = '<div class="topic-h">' + title + '</div>';
    list.forEach(function (p) {
      o += '<div class="nsec nprob"><h3>' + p.id + ' · ' + inlineMath(p.title) + '</h3><div class="nq">' + inlineMath(p.q) + '</div><div class="na">' + inlineMath(p.a) + '</div></div>';
    });
    return o;
  }
  var okP = function (p) { return LOW_PRIORITY.indexOf(p.id) < 0; };
  h += '<div id="notesProblems">' + probs('Part F · Design problems (worked)', PROBLEMS.filter(function (p) { return p.kind === 'design'; })) +
    probs('Part G · Solved problems (worked, with figures)', PROBLEMS.filter(function (p) { return p.kind === 'solve' && okP(p); })) + '</div>';
  root.innerHTML = h;
}
document.getElementById('printBtn').addEventListener('click', function () { document.body.classList.remove('compact'); showPane('notes'); window.print(); });
document.getElementById('printAllBtn').addEventListener('click', function () { document.body.classList.add('compact', 'withprob'); showPane('notes'); window.print(); });
document.getElementById('printCompactBtn').addEventListener('click', function () { document.body.classList.add('compact'); showPane('notes'); window.print(); });
window.addEventListener('afterprint', function () { document.body.classList.remove('compact', 'withprob'); });
renderNotes(); renderPlan(); renderConcepts(); buildDrill(); renderRecipes(); renderFormulas(); renderCheat(); renderMissed(); updateProgress();
(function () { var h = (location.hash || '').slice(1); if (h && document.getElementById('pane-' + h)) showPane(h); })();
