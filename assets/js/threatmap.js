/* Homepage §Security: incident ticker + layered threat map, rendered from security-data.js.
   The map auto-advances through layers until the visitor interacts (never under reduced motion,
   never while off-screen). Tabs follow the WAI-ARIA tabs pattern: arrows move, Home/End jump. */
(function () {
  const L = window.SEC_LAYERS, I = window.SEC_INCIDENTS;
  const stack = document.getElementById('tm-stack'), panel = document.getElementById('tm-panel');
  if (!L || !I || !stack || !panel) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const KIND = { exploited: 'exploited in the wild', incident: 'incident', disclosed: 'disclosed · fixed', research: 'research' };
  const fmt = d => new Date(d + '-01T00:00:00').toLocaleDateString('en', { month: 'short', year: 'numeric' });
  const byLayer = id => I.filter(x => x.layer === id).sort((a, b) => b.date.localeCompare(a.date));

  // Ticker: newest first, duplicated once for a seamless loop (single copy under reduced motion).
  const ticker = document.getElementById('ticker');
  if (ticker) {
    const row = [...I].sort((a, b) => b.date.localeCompare(a.date)).map(x =>
      `<span class="ticker-item"><i>${esc(x.date)}</i><b>${esc(x.name)}</b><span class="k k-${x.kind}">${esc(KIND[x.kind])}</span></span>`).join('');
    ticker.innerHTML = reduce.matches ? row : row + row;
  }

  // Layer tabs, top of the stack first (agents) down to artifacts.
  stack.innerHTML = L.map((l, i) => `<button class="tm-layer" role="tab" id="tm-tab-${l.id}" aria-controls="tm-panel"
      aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">
      <span class="lid">${esc(l.short)}</span><span class="lname">${esc(l.name)}</span>
      <span class="lcount" title="public incidents mapped to this layer">${byLayer(l.id).length}</span><span class="pulse"></span></button>`).join('');
  const tabs = [...stack.querySelectorAll('.tm-layer')];

  let cur = -1;
  function show(i, focus) {
    if (i === cur) return;
    cur = i;
    const l = L[i];
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    tabs[i].classList.remove('hot'); void tabs[i].offsetWidth; tabs[i].classList.add('hot');
    if (focus) tabs[i].focus();
    panel.setAttribute('aria-labelledby', tabs[i].id);
    const inc = byLayer(l.id);
    panel.innerHTML = `
      <h3>${esc(l.name)}<small>${esc(l.what)}</small></h3>
      <p class="tm-risk">${esc(l.risk)}</p>
      <div><p class="tm-h">Controls I design for</p><ul class="tm-controls">${l.controls.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
      <div><p class="tm-h">Already happened here · ${inc.length}</p><ul class="tm-inc">${inc.map(x => `
        <li><span class="d">${esc(fmt(x.date))}<br><span class="k k-${x.kind}">${esc(x.kind)}</span></span>
          <span><span class="n">${esc(x.name)}</span><span class="l">${esc(x.lesson)}</span>
          <span class="s">${x.src.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</span></span></li>`).join('')}
      </ul></div>
      <p class="fig-note" style="margin:0">Full write-ups in the <a href="posts/ai-infra-breaches.html#layer-${l.id}">field guide →</a></p>`;
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  }

  let auto = null, touched = false, onScreen = false;
  function stopAuto() { clearInterval(auto); auto = null; }
  function startAuto() {
    if (auto || touched || reduce.matches || !onScreen || document.hidden) return;
    auto = setInterval(() => show((cur + 1) % L.length), 5200);
  }
  const userPick = (i, focus) => { touched = true; stopAuto(); show(i, focus); };

  stack.addEventListener('click', e => { const b = e.target.closest('.tm-layer'); if (b) userPick(+b.dataset.i); });
  stack.addEventListener('keydown', e => {
    const k = e.key, n = L.length;
    const next = k === 'ArrowDown' || k === 'ArrowRight' ? (cur + 1) % n : k === 'ArrowUp' || k === 'ArrowLeft' ? (cur - 1 + n) % n
      : k === 'Home' ? 0 : k === 'End' ? n - 1 : null;
    if (next !== null) { e.preventDefault(); userPick(next, true); }
  });
  panel.addEventListener('pointerenter', () => { touched = true; stopAuto(); });
  panel.addEventListener('focusin', () => { touched = true; stopAuto(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? startAuto() : stopAuto(); }, { threshold: 0.35 })
      .observe(document.getElementById('threatmap'));
  }
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
  show(0);
})();
