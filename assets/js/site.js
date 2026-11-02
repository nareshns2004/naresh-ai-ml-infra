/* Shared behaviour for every page: mobile nav, scroll reveal, active nav link, writing index. */
(function () {
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

  // Writing index (index.html only): rendered from window.POSTS in data.js
  const grid = document.getElementById('writing-grid');
  if (grid && window.POSTS) {
    const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en', { month: 'short', year: 'numeric' });
    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const posts = [...window.POSTS].sort((a, b) =>
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.date.localeCompare(a.date));
    grid.innerHTML = posts.map(p => {
      const ext = p.kind === 'external';
      const tone = p.tag === 'Efficiency' ? 'copper' : p.tag === 'Reliability' ? 'accent' : '';
      return `<a class="card post-card reveal${p.featured ? ' featured' : ''}${tone === 'copper' ? ' eff' : ''}" href="${esc(p.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>
        <div class="post-meta">
          <span class="chip${tone ? ' chip-' + tone : ''}">${esc(p.tag)}</span>
          <span>${fmt(p.date)}${p.minutes ? ` · ${p.minutes} min` : ''}</span>
          ${ext ? '<span class="post-kind">Read ↗</span>' : ''}
        </div>
        <h3 class="post-title">${esc(p.title)}</h3>
        <p class="post-summary">${esc(p.summary)}</p>
      </a>`;
    }).join('');
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
})();
