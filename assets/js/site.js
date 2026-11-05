/* Shared behaviour for every page: mobile nav, scroll reveal, active nav link, writing index + filters,
   command palette (⌘K / Ctrl+K / "/"), scroll progress. */
(function () {
  const SCRIPT = document.currentScript;
  const ROOT = SCRIPT ? new URL('../../', SCRIPT.src) : new URL('/', location.href);
  document.documentElement.classList.remove('no-js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.prefersReducedMotion = () => reduceMotion.matches;

  // Theme toggle: light/dark override of the system setting, remembered per browser
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches;
  const themeBtn = document.querySelector('.theme-toggle');
  const syncThemeBtn = () => {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', `Switch to ${isDark() ? 'light' : 'dark'} theme`);
    themeBtn.textContent = isDark() ? '☀' : '☾';
  };
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable: theme lasts for this page */ }
      syncThemeBtn();
      document.dispatchEvent(new CustomEvent('themechange'));
    });
    systemDark.addEventListener('change', syncThemeBtn);
    syncThemeBtn();
  }

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Writing index (index.html only): rendered from window.POSTS in data.js, with topic filters
  const grid = document.getElementById('writing-grid');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (grid && window.POSTS) {
    const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en', { month: 'short', year: 'numeric' });
    const TONE = { Efficiency: 'copper', Reliability: 'accent', Security: 'fault' };
    const posts = [...window.POSTS].sort((a, b) =>
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.date.localeCompare(a.date));
    grid.innerHTML = posts.map(p => {
      const ext = p.kind === 'external';
      const tone = TONE[p.tag] || '';
      const cls = tone === 'copper' ? ' eff' : tone === 'fault' ? ' sec' : '';
      return `<a class="card post-card reveal${p.featured ? ' featured' : ''}${cls}" data-tag="${esc(p.tag)}" href="${esc(p.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>
        <div class="post-meta">
          <span class="chip${tone ? ' chip-' + tone : ''}">${esc(p.tag)}</span>
          <span>${fmt(p.date)}${p.minutes ? ` · ${p.minutes} min` : ''}</span>
          ${ext ? '<span class="post-kind">Read ↗</span>' : ''}
        </div>
        <h3 class="post-title">${esc(p.title)}</h3>
        <p class="post-summary">${esc(p.summary)}</p>
      </a>`;
    }).join('');
    const bar = document.getElementById('writing-filters');
    if (bar) {
      const counts = posts.reduce((m, p) => (m[p.tag] = (m[p.tag] || 0) + 1, m), {});
      const tags = ['All', ...Object.keys(counts).sort((a, b) => counts[b] - counts[a])];
      bar.innerHTML = tags.map(t => `<button type="button" data-f="${esc(t)}" aria-pressed="${t === 'All'}">${esc(t)}<span class="c">${t === 'All' ? posts.length : counts[t]}</span></button>`).join('');
      bar.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const f = b.dataset.f;
        bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        grid.querySelectorAll('.post-card').forEach(c => c.classList.toggle('hide', f !== 'All' && c.dataset.tag !== f));
      });
    }
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  }

  // Highlight the nav link for the section in view
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => so.observe(s));
  }

  // Scroll progress (thin tricolour bar under the nav)
  const nav = document.querySelector('.nav');
  if (nav && !reduceMotion.matches) {
    const bar = document.createElement('div'); bar.className = 'nav-progress'; bar.setAttribute('aria-hidden', 'true');
    nav.appendChild(bar);
    let ticking = false;
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--progress', h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  // Toast
  let toastEl = null, toastT = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  // Command palette: ⌘K / Ctrl+K / "/" opens; arrows + Enter; Esc closes.
  const EMAIL = 'nareshns2004@gmail.com';
  const onHome = !!document.getElementById('writing-grid');
  const href = h => onHome && h.startsWith('#') ? h : new URL('index.html' + h, ROOT).href;
  const ext = u => ({ go: () => window.open(u, '_blank', 'noopener') });
  const items = [
    ...[['Work', '#work'], ['Security · threat map', '#security'], ['Writing', '#writing'], ['Evidence', '#evidence'],
        ['Toolbox', '#foundations'], ['Profiles & socials', '#profiles'], ['Contact', '#contact']]
      .map(([t, h]) => ({ k: 'section', t, go: () => { location.href = href(h); } })),
    ...(window.POSTS || []).map(p => ({ k: p.tag, t: p.title, go: () => { location.href = new URL(p.url, ROOT).href; } })),
    { k: 'repo', t: 'goodput: fault-tolerant training orchestrator', ...ext('https://github.com/nareshns2004/fault-tolerant-training-orchestrator') },
    { k: 'repo', t: 'kvwire: disaggregated inference engine', ...ext('https://github.com/nareshns2004/disaggregated-inference-engine') },
    { k: 'repo', t: 'nicprof: NIC counter → step-time attribution', ...ext('https://github.com/nareshns2004/ai-nic-performance-profiler') },
    { k: 'repo', t: 'kptk: kernel performance toolkit', ...ext('https://github.com/nareshns2004/kernel-performance-toolkit') },
    { k: 'profile', t: 'GitHub', ...ext('https://github.com/nareshns2004') },
    { k: 'profile', t: 'Hugging Face', ...ext('https://huggingface.co/nareshns2004') },
    { k: 'profile', t: 'LinkedIn', ...ext('https://www.linkedin.com/in/nareshns2004/') },
    { k: 'profile', t: 'Substack', ...ext('https://substack.com/@nareshns2004') },
    { k: 'profile', t: 'YouTube', ...ext('https://www.youtube.com/@nareshns2004') },
    { k: 'profile', t: 'Docker Hub', ...ext('https://hub.docker.com/u/nareshns2004') },
    { k: 'profile', t: 'X / Twitter · @naresh_swe24', ...ext('https://x.com/naresh_swe24') },
    { k: 'profile', t: 'LeetCode', ...ext('https://leetcode.com/u/nareshns2004/') },
    { k: 'action', t: 'Copy email address', go: () => {
        const ok = () => toast('Copied ' + EMAIL);
        navigator.clipboard ? navigator.clipboard.writeText(EMAIL).then(ok, () => { location.href = 'mailto:' + EMAIL; }) : (location.href = 'mailto:' + EMAIL);
      } },
    { k: 'action', t: 'Email Naresh', go: () => { location.href = 'mailto:' + EMAIL + '?subject=Opportunity%20for%20Naresh'; } },
    { k: 'action', t: 'Toggle light / dark theme', go: () => themeBtn && themeBtn.click() },
  ];
  let pal = null, input, list, sel = 0, shown = [], lastFocus = null;
  function score(q, t) {
    if (!q) return 1;
    t = t.toLowerCase(); q = q.toLowerCase();
    const i = t.indexOf(q); if (i >= 0) return 100 - i;
    let j = 0, s = 0;
    for (const ch of t) { if (ch === q[j]) { j++; s++; if (j === q.length) return s; } }
    return 0;
  }
  function render() {
    const q = input.value.trim();
    shown = items.map(it => ({ it, s: Math.max(score(q, it.t), score(q, it.k) * 0.5) })).filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s).slice(0, 40).map(x => x.it);
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length ? shown.map((it, i) =>
      `<li role="option" id="pal-${i}" aria-selected="${i === sel}" data-i="${i}"><span class="pk">${esc(it.k)}</span><span>${esc(it.t)}</span></li>`).join('')
      : '<li class="empty">No matches. Try “rdma”, “pickle” or “agent”.</li>';
    input.setAttribute('aria-activedescendant', shown.length ? 'pal-' + sel : '');
    const cur = list.querySelector('[aria-selected="true"]'); if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function build() {
    pal = document.createElement('div');
    pal.className = 'palette'; pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-modal', 'true'); pal.setAttribute('aria-label', 'Command palette');
    pal.innerHTML = `<div class="palette-backdrop"></div><div class="palette-box">
      <input class="palette-input" type="text" role="combobox" aria-expanded="true" aria-controls="pal-list" aria-autocomplete="list" placeholder="Jump to a post, section, repo or profile…" autocomplete="off" spellcheck="false">
      <ul class="palette-list" id="pal-list" role="listbox"></ul>
      <div class="palette-foot"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div></div>`;
    document.body.appendChild(pal);
    input = pal.querySelector('input'); list = pal.querySelector('ul');
    input.addEventListener('input', () => { sel = 0; render(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    list.addEventListener('mousemove', e => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; render(); } });
    list.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) run(+li.dataset.i); });
    pal.querySelector('.palette-backdrop').addEventListener('click', close);
  }
  function open() {
    if (!pal) build();
    lastFocus = document.activeElement;
    pal.classList.add('open'); input.value = ''; sel = 0; render(); input.focus();
  }
  function close() { if (!pal) return; pal.classList.remove('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function run(i) { const it = shown[i]; if (!it) return; close(); it.go(); }
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); pal && pal.classList.contains('open') ? close() : open(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); open(); }
  });
  document.querySelectorAll('[data-palette-open]').forEach(b => b.addEventListener('click', open));
  if (!/Mac|iPhone|iPad/.test(navigator.platform || '')) document.querySelectorAll('kbd').forEach(k => { if (k.textContent === '⌘K') k.textContent = 'Ctrl K'; });

  // For the engineers who open DevTools first.
  try {
    console.log('%c NK %c Reading the source? Good instinct.', 'background:#1D4ED8;color:#fff;font-weight:700;padding:2px 6px;border-radius:3px', 'font-weight:600');
    console.log('No framework, no build step, no trackers. Source: https://github.com/nareshns2004/portfolio-webapp\nHiring for GPU infra or AI-infra security? ' + EMAIL);
  } catch (e) { /* no console */ }
})();
