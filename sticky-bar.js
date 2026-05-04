// sticky-bar.js — barre de stats persistante sur toutes les pages
(function () {
  const STYLE = `
    #fitcouple-sticky {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg, #fff);
      border-bottom: 0.5px solid rgba(0,0,0,0.08);
      padding: 8px 12px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }
    .fsb-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 7px 4px;
      border-radius: 10px;
      background: rgba(0,0,0,0.04);
      cursor: pointer;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
    }
    .fsb-item.fsb-active { background: rgba(0,0,0,0.08); }
    .fsb-icon  { font-size: 14px; }
    .fsb-val   { font-size: 14px; font-weight: 600; color: var(--text, #111); }
    .fsb-label { font-size: 9px; color: var(--muted, #888); }
    .fsb-bar   { width: 100%; height: 3px; border-radius: 2px; background: rgba(0,0,0,0.08); margin-top: 2px; overflow: hidden; }
    .fsb-fill  { height: 100%; border-radius: 2px; transition: width 0.5s; }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  // Detect current page
  const path = location.pathname.split('/').pop() || 'index.html';
  const PAGES = {
    'index.html':     { key: 'repas',     href: 'repas.html' },
    'repas.html':     { key: 'repas',     href: 'repas.html' },
    'sport.html':     { key: 'defis',     href: 'sport.html' },
    'objectifs.html': { key: 'objectifs', href: 'objectifs.html' },
    'caca.html':      { key: 'poop',      href: 'caca.html' },
  };

  const bar = document.createElement('div');
  bar.id = 'fitcouple-sticky';
  bar.innerHTML = `
    <a class="fsb-item ${path === 'repas.html' ? 'fsb-active' : ''}" href="repas.html">
      <span class="fsb-icon">🥗</span>
      <span class="fsb-val" id="fsb-meals">—</span>
      <span class="fsb-label">Repas</span>
      <div class="fsb-bar"><div class="fsb-fill" id="fsb-bar-meals" style="background:#639922;width:0%"></div></div>
    </a>
    <a class="fsb-item ${path === 'sport.html' ? 'fsb-active' : ''}" href="sport.html">
      <span class="fsb-icon">⚡</span>
      <span class="fsb-val" id="fsb-defis">—</span>
      <span class="fsb-label">Défis</span>
      <div class="fsb-bar"><div class="fsb-fill" id="fsb-bar-defis" style="background:#7F77DD;width:0%"></div></div>
    </a>
    <a class="fsb-item ${path === 'caca.html' ? 'fsb-active' : ''}" href="caca.html">
      <span class="fsb-icon">💩</span>
      <span class="fsb-val" id="fsb-poop">—</span>
      <span class="fsb-label">Passages</span>
      <div class="fsb-bar"><div class="fsb-fill" id="fsb-bar-poop" style="background:#D85A30;width:0%"></div></div>
    </a>
    <a class="fsb-item ${path === 'objectifs.html' ? 'fsb-active' : ''}" href="objectifs.html">
      <span class="fsb-icon">🎯</span>
      <span class="fsb-val" id="fsb-goals">—</span>
      <span class="fsb-label">Objectifs</span>
      <div class="fsb-bar"><div class="fsb-fill" id="fsb-bar-goals" style="background:#1D9E75;width:0%"></div></div>
    </a>
  `;

  // Insert after .hdr
  function insertBar() {
    const hdr = document.querySelector('.hdr');
    if (hdr && hdr.parentNode) {
      hdr.parentNode.insertBefore(bar, hdr.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  function set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setBar(id, pct) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }

  async function loadStats() {
    try {
      const { data: { session } } = await db.auth.getSession();
      if (!session) return;

      const { data: profile } = await db.from('profiles').select('*').eq('id', session.user.id).single();
      if (!profile) return;

      const coupleId = profile.couple_id;
      const today = new Date().toISOString().split('T')[0];

      const [mRes, cRes, pRes] = await Promise.all([
        db.from('meals').select('id', { count: 'exact' }).eq('couple_id', coupleId).eq('date', today),
        db.from('challenges').select('id, completed').eq('couple_id', coupleId).eq('challenge_date', today),
        db.from('poop_logs').select('id', { count: 'exact' }).eq('couple_id', coupleId).gte('logged_at', today + 'T00:00:00').lte('logged_at', today + 'T23:59:59'),
      ]);

      const meals  = mRes.count ?? (mRes.data?.length ?? 0);
      const challenges = cRes.data || [];
      const done   = challenges.filter(c => c.completed).length;
      const total  = challenges.length;
      const poop   = pRes.count ?? (pRes.data?.length ?? 0);
      const goalPct = total > 0 ? Math.round((done / total) * 100) : 0;

      set('fsb-meals', meals);
      set('fsb-defis', total > 0 ? `${done}/${total}` : '0');
      set('fsb-poop',  poop);
      set('fsb-goals', goalPct + '%');

      setBar('fsb-bar-meals', meals * 14);
      setBar('fsb-bar-defis', total > 0 ? (done / total) * 100 : 0);
      setBar('fsb-bar-poop',  poop * 14);
      setBar('fsb-bar-goals', goalPct);
    } catch (e) {
      console.warn('sticky-bar: erreur chargement stats', e);
    }
  }

  // Wait for DOM + db (config.js)
  function waitForDb(cb, tries = 0) {
    if (typeof db !== 'undefined') { cb(); return; }
    if (tries > 20) return;
    setTimeout(() => waitForDb(cb, tries + 1), 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { insertBar(); waitForDb(loadStats); });
  } else {
    insertBar();
    waitForDb(loadStats);
  }
})();
