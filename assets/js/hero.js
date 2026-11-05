/* Hero figure: ring all-reduce loses a link, the stall spreads, every rank times out, the job restores
   onto a spare; then an unattested host tries to join the communicator and is denied while training
   continues. A goodput timeline records the cost and a terminal line narrates each phase (illustrative).
   Static single frame under reduced motion; paused when off-screen or when the tab is hidden. */
(function () {
  const svg = document.getElementById('hero-fig');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const N = 8, CX = 220, CY = 165, R = 122;
  const PAINT = new Set(['fill', 'stroke']);
  const pos = i => { const a = -Math.PI / 2 + 2 * Math.PI * i / N; return [CX + R * Math.cos(a), CY + R * Math.sin(a)]; };

  // Paint values go through style so var() works everywhere (presentation attributes don't take var() in all browsers).
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) {
      if (PAINT.has(k) && String(attrs[k]).includes('var(')) e.style.setProperty(k, attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function draw(s) {
    svg.textContent = '';
    const defs = el('defs', {}, svg);
    const pat = el('pattern', { id: 'hero-hatch', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: 'var(--graphite)', 'stroke-width': 2 }, pat);
    const hatch = 'url(#hero-hatch)';

    for (let i = 0; i < N; i++) {
      const [x1, y1] = pos(i), [x2, y2] = pos((i + 1) % N);
      const down = s.linkDown && i === 2;
      el('line', { x1, y1, x2, y2, stroke: down ? 'var(--fault)' : 'var(--ink)', 'stroke-width': down ? 2 : 1.2, 'stroke-dasharray': down ? '4 4' : 'none' }, svg);
      if (down) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        el('path', { d: `M${mx - 7},${my - 7} L${mx + 7},${my + 7} M${mx + 7},${my - 7} L${mx - 7},${my + 7}`, stroke: 'var(--fault)', 'stroke-width': 2.5 }, svg);
      }
      if (s.flowing) {
        const t = s.t % 1;
        el('circle', { cx: x1 + (x2 - x1) * t, cy: y1 + (y2 - y1) * t, r: 3.5, fill: 'var(--signal)' }, svg);
      }
    }
    for (let i = 0; i < N; i++) {
      const [x, y] = pos(i);
      const spare = s.spare && i === 3;
      el('rect', { x: x - 27, y: y - 15, width: 54, height: 30, rx: 2, fill: 'var(--paper)', stroke: s.timeout ? 'var(--fault)' : 'var(--ink)', 'stroke-width': 1.3, 'stroke-dasharray': spare ? '3 2' : 'none' }, svg);
      if (s.stalled.has(i)) el('rect', { x: x - 27, y: y - 15, width: 54, height: 30, rx: 2, fill: hatch, opacity: 0.5 }, svg);
      el('text', { x, y: y + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 600, fill: 'var(--ink)' }, svg).textContent = spare ? 'GPU3′' : 'GPU' + i;
    }
    if (s.rogue) {
      const RX = 400, RY = 262, [gx, gy] = pos(2);
      const x1 = RX - 14, y1 = RY - 15, x2 = gx + 8, y2 = gy + 15, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      el('line', { x1, y1, x2, y2, stroke: 'var(--fault)', 'stroke-width': 1.6, 'stroke-dasharray': '4 3', 'stroke-dashoffset': -(s.t * 30) % 14 }, svg);
      el('rect', { x: RX - 27, y: RY - 15, width: 54, height: 30, rx: 2, fill: 'var(--paper)', stroke: 'var(--fault)', 'stroke-width': 1.3, 'stroke-dasharray': '3 2' }, svg);
      el('text', { x: RX, y: RY + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 600, fill: 'var(--fault)' }, svg).textContent = '??';
      const g = el('g', { transform: `translate(${mx - 10} ${my - 11})` }, svg);
      el('path', { d: 'M10 0 L20 4 V10.5 C20 16.5 15.5 20.5 10 22 C4.5 20.5 0 16.5 0 10.5 V4 Z', fill: 'var(--paper)', stroke: 'var(--signal)', 'stroke-width': 1.8 }, g);
      el('path', { d: 'M6 11 l3 3 l5 -6', fill: 'none', stroke: 'var(--signal)', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    el('text', { x: CX, y: CY - 4, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--graphite)' }, svg).textContent = 'ring all-reduce';
    el('text', { x: CX, y: CY + 14, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 600, fill: s.labelColor || 'var(--graphite)' }, svg).textContent = s.label || '';

    // Goodput timeline
    const BX = 20, BW = 400, BY = 338;
    el('text', { x: BX, y: BY - 8, 'font-size': 10.5, fill: 'var(--graphite)', 'letter-spacing': '0.06em' }, svg).textContent = 'GOODPUT TIMELINE';
    el('rect', { x: BX, y: BY, width: BW, height: 14, fill: 'none', stroke: 'var(--rule-strong)' }, svg);
    const total = s.bar.reduce((a, [, l]) => a + l, 0) || 1;
    const scale = Math.min(1, BW / (total * 34));
    let x = BX;
    for (const [kind, len] of s.bar) {
      const w = Math.max(0, len * 34 * scale);
      el('rect', { x, y: BY, width: w, height: 14, fill: kind === 'ok' ? 'var(--signal)' : kind === 'stall' ? hatch : 'var(--fault)' }, svg);
      x += w;
    }
    const lost = s.bar.some(([k]) => k !== 'ok');
    el('text', { x: BX, y: BY + 32, 'font-size': 10.5, fill: 'var(--graphite)' }, svg).textContent =
      lost ? 'blue = training · hatched = stalled · red = restart' : 'blue = productive training time';
  }

  // Reduced motion: one frame that tells the whole story (spare in place, all three bar segments).
  const STATIC = { flowing: true, t: 0.5, spare: true, rogue: true, stalled: new Set(),
    bar: [['ok', 5], ['stall', 2.4], ['restart', 1.4], ['ok', 2.4]], label: 'restored · intruder denied', phase: 'intrude' };

  const SCRIPT = [['flow', 3.4], ['fail', 0.7], ['spread', 2.2], ['timeout', 1.1], ['restore', 1.6], ['resume', 2.2], ['intrude', 2.8], ['steady', 1.0]];
  const CYCLE = SCRIPT.reduce((a, [, d]) => a + d, 0);
  const startOf = p => { let a = 0; for (const [q, d] of SCRIPT) { if (q === p) return a; a += d; } return a; };
  const dur = p => SCRIPT.find(([q]) => q === p)[1];

  function stateAt(t) {
    let phase = 'flow', pt = 0;
    for (const [p, d] of SCRIPT) { const a = startOf(p); if (t < a + d) { phase = p; pt = (t - a) / d; break; } }
    const s = { stalled: new Set(), bar: [['ok', Math.min(t, startOf('spread'))]], t: t * 1.4, phase, pt };
    if (phase === 'flow') { s.flowing = true; s.label = 'all ranks progressing'; }
    if (phase === 'fail') { s.linkDown = true; s.label = 'link 2→3 fails'; s.labelColor = 'var(--fault)'; }
    if (phase === 'spread' || phase === 'timeout') {
      s.linkDown = true;
      const k = phase === 'spread' ? Math.floor(pt * N) + 1 : N;
      for (let j = 0; j < k; j++) s.stalled.add((3 + j) % N);
      s.bar.push(['stall', t - startOf('spread')]);
      s.timeout = phase === 'timeout';
      s.label = phase === 'spread' ? 'stall spreads hop by hop' : 'all 8 ranks time out';
      if (s.timeout) s.labelColor = 'var(--fault)';
    }
    if (phase === 'restore' || phase === 'resume' || phase === 'intrude' || phase === 'steady') {
      s.spare = true;
      s.bar.push(['stall', dur('spread') + dur('timeout')]);
      s.bar.push(['restart', phase === 'restore' ? t - startOf('restore') : dur('restore')]);
      if (phase === 'restore') { s.label = 'restoring on spare'; s.stalled = new Set([...Array(N).keys()]); }
      else {
        s.flowing = true; s.bar.push(['ok', t - startOf('resume')]);
        s.label = phase === 'intrude' ? 'unattested peer denied' : phase === 'steady' ? 'all ranks progressing' : 'training resumed';
        if (phase === 'intrude') { s.rogue = true; s.labelColor = 'var(--fault)'; }
      }
    }
    return s;
  }

  // Terminal narration under the figure, typed out at the start of each phase.
  const termP = document.getElementById('hero-term-p'), termT = document.getElementById('hero-term');
  const TERM = {
    flow: ['$', '', 'goodput watch --job llm-512 · 8/8 ranks healthy'],
    fail: ['!', 'w', 'rank 3 stopped posting sends · no error anywhere yet'],
    spread: ['!', 'w', 'ring stalls hop by hop · every rank waiting'],
    timeout: ['!', 'e', 'watchdog: ALLREDUCE timed out on 8/8 ranks'],
    restore: ['→', 'o', 'culprit: rank 3 · mlx5_2 link_downed · swap → spare'],
    resume: ['✓', 'o', 'resumed · one node replaced, no full-job restart'],
    intrude: ['✗', 'e', 'denied: unattested host tried to join the communicator'],
    steady: ['$', '', 'goodput watch --job llm-512 · 8/8 ranks healthy'],
  };
  let lastTerm = '';
  function term(s, full) {
    if (!termT) return;
    const [p, cls, text] = TERM[s.phase] || TERM.flow;
    const n = full ? text.length : Math.min(text.length, Math.floor(s.pt * dur(s.phase) * 48));
    const shown = text.slice(0, n), key = s.phase + n;
    if (key === lastTerm) return;
    lastTerm = key;
    termP.textContent = p; termP.className = 'ht-p' + (cls ? ' ' + cls : '');
    termT.textContent = shown;
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = null, onScreen = true, t0 = performance.now(), elapsed = 0;
  function frame(now) {
    const t = ((elapsed + (now - t0)) / 1000) % CYCLE;
    const s = stateAt(t);
    draw(s); term(s);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (raf || reduce.matches || document.hidden || !onScreen) return;
    t0 = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf); raf = null;
    elapsed += performance.now() - t0;
  }
  function apply() { if (reduce.matches) { stop(); draw(STATIC); term(STATIC, true); } else start(); }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop(); }).observe(svg);
  }
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  reduce.addEventListener('change', apply);
  draw(reduce.matches ? STATIC : stateAt(0));
  term(reduce.matches ? STATIC : stateAt(0), reduce.matches);
  apply();
})();
