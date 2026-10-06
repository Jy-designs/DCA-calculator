/* Recurring buy (DCA) calculator.
   Prices: Kraken public OHLC API, weekly EUR candles (no key needed, CORS enabled).
   If Kraken can't be reached, it falls back to data/prices-snapshot.json.
   The result is a hypothetical back-test: each buy uses the price at the start of that week, with no fees. */
(() => {
  const root = document.getElementById('calculator');
  if (!root) return;
  const { t, tf, money, percent } = window.i18n;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WEEK = 7 * 24 * 3600 * 1000;

  // ---------- Options ----------
  // `since` is the first weekly candle Kraken has for the pair, used to disable periods that go back too far
  const ASSETS = [
    // `color` is the coin's brand colour, used for the chart line, fill, dots and legend
    { id: 'BTC',  name: 'Bitcoin',   pair: 'XBTEUR',  icon: 'assets/v2/btc.svg',         since: 2013, color: '#F7931A' },
    { id: 'ETH',  name: 'Ethereum',  pair: 'ETHEUR',  icon: 'assets/v2/eth.svg',         since: 2015, color: '#627EEA' },
    { id: 'SOL',  name: 'Solana',    pair: 'SOLEUR',  icon: 'assets/v2/sol.svg',         since: 2021, color: '#9945FF' },
    { id: 'XRP',  name: 'XRP',       pair: 'XRPEUR',  icon: 'assets/v2/coins/xrp.svg',   since: 2017, color: '#23292F' },
    { id: 'ADA',  name: 'Cardano',   pair: 'ADAEUR',  icon: 'assets/v2/coins/ada.svg',   since: 2018, color: '#0033AD' },
    { id: 'DOT',  name: 'Polkadot',  pair: 'DOTEUR',  icon: 'assets/v2/coins/dot.svg',   since: 2020, color: '#E6007A' },
    { id: 'LINK', name: 'Chainlink', pair: 'LINKEUR', icon: 'assets/v2/coins/link.svg',  since: 2019, color: '#2A5ADA' },
    { id: 'AVAX', name: 'Avalanche', pair: 'AVAXEUR', icon: 'assets/v2/coins/avax.svg',  since: 2021, color: '#E84142' },
    { id: 'DOGE', name: 'Dogecoin',  pair: 'XDGEUR',  icon: 'assets/v2/coins/doge.svg',  since: 2019, color: '#C2A633' },
    { id: 'LTC',  name: 'Litecoin',  pair: 'LTCEUR',  icon: 'assets/v2/coins/ltc.svg',   since: 2013, color: '#345D9D' }
  ];
  const AMOUNTS = [25, 50, 100, 250, 500, 1000];
  const MIN = 10, MAX = 10000;
  const FREQS = [
    { id: 'weekly',   key: 'whatis::frequency::weekly',   step: d => addDays(d, 7) },
    { id: 'biweekly', key: 'whatis::frequency::biweekly', step: d => addDays(d, 14) },
    { id: 'monthly',  key: 'whatis::frequency::monthly',  step: d => addMonths(d, 1) }
  ];
  // Start years: this year back to 2020. Buys run from 1 January of the chosen year until today
  const THIS_YEAR = new Date().getUTCFullYear(), FIRST_YEAR = 2020;
  const YEARS = Array.from({ length: THIS_YEAR - FIRST_YEAR + 1 }, (_, i) => THIS_YEAR - i);
  const state = { asset: 'BTC', amount: 100, freq: 'monthly', since: THIS_YEAR - 1 };

  // ---------- Dates ----------
  function addDays(d, n) { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; }
  function addMonths(d, n) {
    const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
    const last = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + 1, 0)).getUTCDate();
    x.setUTCDate(Math.min(d.getUTCDate(), last));
    return x;
  }
  const todayUTC = () => { const n = new Date(); return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate())); };

  // ---------- Price data ----------
  const memory = {};
  let snapshot = null;
  let lastSource = null;

  async function fetchLive(asset) {
    const key = `venga-ohlc-${asset.id}`;
    try {
      const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (hit && Date.now() - hit.at < 3600e3) return { series: hit.series, source: 'live', at: hit.at };
    } catch (e) {}
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(`https://api.kraken.com/0/public/OHLC?pair=${asset.pair}&interval=10080`, { signal: ctrl.signal });
      const json = await res.json();
      if (json.error && json.error.length) throw new Error(json.error.join(', '));
      const rows = Object.entries(json.result).find(([k]) => k !== 'last')[1];
      // [weekStart (s), open, close]
      const series = rows.map(r => [r[0], +r[1], +r[4]]);
      const at = Date.now();
      try { sessionStorage.setItem(key, JSON.stringify({ at, series })); } catch (e) {}
      return { series, source: 'live', at };
    } finally { clearTimeout(timer); }
  }
  async function fetchSnapshot(asset) {
    if (!snapshot) snapshot = await (await fetch('data/prices-snapshot.json')).json();
    return { series: snapshot.series[asset.id], source: 'snapshot', at: Date.parse(snapshot.fetched) };
  }
  async function getSeries(asset) {
    if (memory[asset.id]) return memory[asset.id];
    let data;
    try { data = await fetchLive(asset); } catch (e) { data = await fetchSnapshot(asset); }
    memory[asset.id] = data;
    return data;
  }

  // ---------- Simulation ----------
  function simulate(series, { amount, freq, since }) {
    const candles = series.map(([s, open, close]) => ({ start: s * 1000, end: s * 1000 + WEEK, open, close }));
    const first = candles[0].start;
    const today = todayUTC();
    let start = new Date(Date.UTC(since, 0, 1));
    if (+start < first) start = new Date(first);
    const priceAt = ms => {
      // price at the start of the week the buy falls in, so a buy never "sees" that week's later prices
      for (let i = candles.length - 1; i >= 0; i--) if (candles[i].start <= ms) return candles[i].open;
      return null;
    };
    const step = FREQS.find(f => f.id === freq).step;
    const buys = [];
    for (let d = start; d < today; d = step(d)) {
      const p = priceAt(+d);
      if (p) buys.push({ t: +d, price: p, units: amount / p });
    }
    if (!buys.length) return null;

    // Value over time: after each buy, and at every weekly close in between
    const events = buys.map(b => ({ t: b.t, buy: b }));
    candles.filter(c => c.end > buys[0].t && c.end <= Date.now()).forEach(c => events.push({ t: c.end, close: c.close }));
    const last = candles[candles.length - 1];
    events.push({ t: Date.now(), close: last.close, final: true });
    events.sort((a, b) => a.t - b.t);

    let units = 0, invested = 0, lastPrice = buys[0].price;
    const points = [];
    for (const e of events) {
      if (e.buy) { units += e.buy.units; invested += amount; lastPrice = e.buy.price; }
      else lastPrice = e.close;
      points.push({ t: e.t, invested, value: units * lastPrice });
    }
    const end = points[points.length - 1];
    return { points, buys: buys.length, invested: end.invested, value: end.value, ret: (end.value / end.invested - 1) * 100, start: buys[0].t, end: end.t };
  }

  // ---------- Chart ----------
  const svg = root.querySelector('.calc__svg');
  const plot = root.querySelector('.calc__plot');
  const xAxis = root.querySelector('.calc__x');
  const tip = root.querySelector('.calc__tip');
  const NS = 'http://www.w3.org/2000/svg';
  let result = null, geo = null;

  function niceStep(max, ticks) {
    const raw = max / ticks, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= raw) return m * mag;
    return 10 * mag;
  }
  const yLabel = v => {
    const loc = window.i18n.locale;
    if (v >= 10000) return new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 }).format(v);
    return money(v, 0);
  };
  // Monotone cubic path (Fritsch–Carlson): smooth like the Figma curve, but never overshoots the data
  function monotone(pts) {
    const n = pts.length;
    if (n < 2) return '';
    const dx = [], dy = [], m = [], tan = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; dy[i] = pts[i + 1][1] - pts[i][1]; m[i] = dx[i] ? dy[i] / dx[i] : 0; }
    tan[0] = m[0]; tan[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) tan[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += `C${(pts[i][0] + h).toFixed(1)},${(pts[i][1] + h * tan[i]).toFixed(1)} ${(pts[i + 1][0] - h).toFixed(1)},${(pts[i + 1][1] - h * tan[i + 1]).toFixed(1)} ${pts[i + 1][0].toFixed(1)},${pts[i + 1][1].toFixed(1)}`;
    }
    return d;
  }
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.appendChild(n); return n; };

  function draw(animate) {
    if (!result) return;
    const W = plot.clientWidth, H = plot.clientHeight;
    if (!W) return;
    const small = W < 560;
    const padR = small ? 52 : 72, padT = 10, padB = 4, x0 = 0, x1 = W - padR, y0 = padT, y1 = H - padB;
    const pts = result.points;
    const tMin = pts[0].t, tMax = pts[pts.length - 1].t;
    const vMax = Math.max(...pts.map(p => Math.max(p.value, p.invested))) || 1;
    const step = niceStep(vMax * 1.04, 5), ticks = Math.max(4, Math.ceil(vMax * 1.04 / step)), yMax = step * ticks;
    const X = tt => x0 + (tt - tMin) / (tMax - tMin || 1) * (x1 - x0);
    const Y = v => y1 - v / yMax * (y1 - y0);
    geo = { X, Y, x0, x1, y0, y1 };

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.textContent = '';
    const defs = el('defs', {}, svg);
    const grad = el('linearGradient', { id: 'calc-fill', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    const coin = ASSETS.find(a => a.id === state.asset).color;
    root.style.setProperty('--coin', coin);
    el('stop', { offset: 0, 'stop-color': coin, 'stop-opacity': .18 }, grad);
    el('stop', { offset: 1, 'stop-color': coin, 'stop-opacity': .02 }, grad);

    const grid = el('g', { class: 'grid' }, svg);
    for (let i = 0; i <= ticks; i++) {
      const v = step * i, y = Y(v);
      el('line', { x1: x0, x2: x1, y1: y, y2: y }, grid);
      const lab = el('text', { class: 'ylab', x: W, y: y + 5, 'text-anchor': 'end' }, svg);
      lab.textContent = yLabel(v);
    }

    const line = pts.map(p => [X(p.t), Y(p.value)]);
    const d = monotone(line);
    el('path', { class: 'area', d: `${d}L${line[line.length - 1][0].toFixed(1)},${y1}L${line[0][0].toFixed(1)},${y1}Z` }, svg);
    let inv = `M${X(pts[0].t).toFixed(1)},${Y(0).toFixed(1)}`;
    pts.forEach(p => { inv += `V${Y(p.invested).toFixed(1)}H${X(p.t).toFixed(1)}`; });
    el('path', { class: 'invested', d: inv }, svg);
    el('path', { class: 'line', d, pathLength: 1 }, svg);
    const [ex, ey] = line[line.length - 1];
    el('circle', { class: 'pulse', cx: ex, cy: ey, r: 7 }, svg);
    el('circle', { class: 'dot--end', cx: ex, cy: ey, r: 6 }, svg);
    el('line', { class: 'cursor', x1: 0, x2: 0, y1: y0, y2: y1, visibility: 'hidden' }, svg);
    el('circle', { class: 'dot', r: 6, visibility: 'hidden' }, svg);

    // X axis: months for up to ~15 months, month + year up to 3 years, otherwise years
    xAxis.textContent = '';
    const loc = window.i18n.locale;
    const labels = [];
    const s = new Date(tMin), e = new Date(tMax);
    const months = (tMax - tMin) / (30.44 * 24 * 3600e3);
    if (months <= 36) {
      const mon = d0 => new Intl.DateTimeFormat(loc, { month: 'short', timeZone: 'UTC' }).format(d0).replace('.', '').slice(0, 3);
      for (let d0 = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() + (s.getUTCDate() > 1 ? 1 : 0), 1)); d0 <= e; d0 = addMonths(d0, 1))
        labels.push([+d0, months <= 15 ? mon(d0) : `${mon(d0)} ’${String(d0.getUTCFullYear()).slice(2)}`]);
    } else {
      for (let y = s.getUTCFullYear() + 1; y <= e.getUTCFullYear(); y++) labels.push([Date.UTC(y, 0, 1), String(y)]);
    }
    // Show every k-th label so the spacing stays even when there isn't room for all of them
    const minGap = small ? 34 : 52;
    const span0 = labels.length > 1 ? X(labels[1][0]) - X(labels[0][0]) : Infinity;
    const k = Math.max(1, Math.ceil(minGap / span0));
    labels.forEach(([tt, txt], i) => {
      const x = X(tt);
      if (i % k || x > x1 - 12) return;
      const span = document.createElement('span');
      span.style.left = `${x}px`;
      span.style.animationDelay = `${(i * 0.03).toFixed(2)}s`;
      span.textContent = txt;
      xAxis.appendChild(span);
    });

    if (animate && !reduce) {
      [...svg.querySelectorAll('.line, .area, .invested, .dot--end, .pulse')].forEach(n => n.classList.add('is-drawing'));
      xAxis.classList.remove('is-drawing'); void xAxis.offsetWidth; xAxis.classList.add('is-drawing');
    }
  }

  // Tooltip
  const fmtDate = ms => new Intl.DateTimeFormat(window.i18n.locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(ms);
  function onMove(e) {
    if (!result || !geo) return;
    const r = svg.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - r.left, geo.x0), geo.x1);
    let best = result.points[0], bd = Infinity;
    for (const p of result.points) { const dd = Math.abs(geo.X(p.t) - x); if (dd < bd) { bd = dd; best = p; } }
    const px = geo.X(best.t), py = geo.Y(best.value);
    const cur = svg.querySelector('.cursor'), dot = svg.querySelector('.dot');
    cur.setAttribute('x1', px); cur.setAttribute('x2', px); cur.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', px); dot.setAttribute('cy', py); dot.setAttribute('visibility', 'visible');
    tip.innerHTML = `<b>${fmtDate(best.t)}</b><p><span>${t('calculator::tooltip::invested')}</span><span>${money(best.invested)}</span></p><p><span>${t('calculator::tooltip::value')}</span><span>${money(best.value)}</span></p>`;
    tip.hidden = false;
    const tw = tip.offsetWidth;
    tip.style.left = `${Math.min(Math.max(px, tw / 2), r.width - tw / 2)}px`;
    tip.style.top = `${Math.max(0, py - tip.offsetHeight - 16)}px`;
  }
  function onLeave() {
    tip.hidden = true;
    svg.querySelectorAll('.cursor, .dot').forEach(n => n.setAttribute('visibility', 'hidden'));
  }
  svg.addEventListener('pointermove', onMove);
  svg.addEventListener('pointerdown', onMove);
  svg.addEventListener('pointerleave', onLeave);

  // ---------- Totals ----------
  const out = { invested: root.querySelector('#calc-invested'), value: root.querySelector('#calc-value'), ret: root.querySelector('#calc-return') };
  const shown = { invested: 0, value: 0, ret: 0 }, tok = {};
  function tween(key, to, fmt, animate) {
    const from = shown[key], my = tok[key] = (tok[key] || 0) + 1;
    shown[key] = to;
    if (!animate || reduce) { out[key].textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 900;
    (function tick(now) {
      if (tok[key] !== my) return; // a newer result took over
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      out[key].textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    // rAF pauses in background tabs; make sure the real figure lands
    setTimeout(() => { if (tok[key] === my) out[key].textContent = fmt(to); }, dur + 80);
  }
  function renderTotals(animate) {
    if (!result) return;
    tween('invested', result.invested, v => money(v, result.invested % 1 ? 2 : 0), animate);
    tween('value', result.value, v => money(v), animate);
    tween('ret', result.ret, v => percent(v), animate);
    out.ret.classList.toggle('is-down', result.ret < 0);
    const a = ASSETS.find(x => x.id === state.asset);
    root.querySelector('#calc-summary').textContent = tf('calculator::summary', {
      n: result.buys, amount: money(state.amount, 0), frequency: t(FREQS.find(f => f.id === state.freq).key).toLowerCase(),
      asset: a.name, start: fmtDate(result.start), invested: money(result.invested), value: money(result.value), end: fmtDate(result.end), ret: percent(result.ret)
    });
  }
  function renderSource() {
    const n = root.querySelector('#calc-source');
    if (!lastSource) { n.textContent = ''; return; }
    n.textContent = tf(lastSource.source === 'live' ? 'calculator::source::live' : 'calculator::source::snapshot', { date: fmtDate(lastSource.at) });
  }

  // ---------- States ----------
  const stateBox = root.querySelector('.calc__state');
  function setState(kind) {
    root.classList.toggle('is-loading', kind === 'loading');
    if (!kind) { stateBox.hidden = true; stateBox.textContent = ''; return; }
    stateBox.hidden = false;
    stateBox.innerHTML = kind === 'loading'
      ? `<i class="spinner"></i><span>${t('calculator::state::loading')}</span>`
      : `<span>${t('calculator::state::error')}</span><button type="button">${t('calculator::state::retry')}</button>`;
    const b = stateBox.querySelector('button');
    if (b) b.addEventListener('click', () => { delete memory[state.asset]; update(true); });
  }

  // ---------- Update ----------
  let seen = false, run = 0;
  async function update(animate = true) {
    const id = ++run;
    const asset = ASSETS.find(a => a.id === state.asset);
    const slow = setTimeout(() => setState('loading'), 150);
    try {
      const data = await getSeries(asset);
      if (id !== run) return;
      lastSource = data;
      clampYears(data.series);
      result = simulate(data.series, state);
      clearTimeout(slow); setState(null);
      renderFields();
      renderTotals(animate && seen);
      renderSource();
      draw(animate && seen);
    } catch (e) {
      clearTimeout(slow);
      if (id === run) setState('error');
    }
  }
  // A start year is available if the coin has prices from the first weeks of January that year
  const firstYear = series => { const d = new Date(series[0][0] * 1000); return d.getUTCMonth() === 0 && d.getUTCDate() <= 14 ? d.getUTCFullYear() : d.getUTCFullYear() + 1; };
  function clampYears(series) {
    const first = firstYear(series);
    if (state.since < first) state.since = Math.min(first, THIS_YEAR);
  }

  // ---------- Fields ----------
  const fields = {};
  root.querySelectorAll('.field').forEach(f => { fields[f.dataset.field] = f; });

  function renderFields() {
    const asset = ASSETS.find(a => a.id === state.asset);
    fields.asset.querySelector('[data-value]').textContent = asset.id;
    fields.asset.querySelector('[data-asset-icon]').src = asset.icon;
    fields.amount.querySelector('[data-value]').textContent = money(state.amount, state.amount % 1 ? 2 : 0);
    fields.frequency.querySelector('[data-value]').textContent = t(FREQS.find(f => f.id === state.freq).key);
    fields.years.querySelector('[data-value]').textContent = state.since;

    const list = (field, items) => {
      const ul = fields[field].querySelector('ul');
      ul.innerHTML = items.map(i => `<li role="option" tabindex="-1" data-v="${i.v}" aria-selected="${i.sel}"${i.dis ? ' aria-disabled="true"' : ''}>${i.html}</li>`).join('');
    };
    list('asset', ASSETS.map(a => ({ v: a.id, sel: a.id === state.asset, html: `<img src="${a.icon}" alt=""><span>${a.name}</span><small>${a.id}</small>` })));
    list('frequency', FREQS.map(f => ({ v: f.id, sel: f.id === state.freq, html: `<span>${t(f.key)}</span>` })));
    const series = memory[state.asset] && memory[state.asset].series;
    const first = series ? firstYear(series) : -Infinity;
    // Only list the years this coin has prices for
    list('years', YEARS.filter(y => y >= first).map(y => ({ v: y, sel: y === state.since, html: `<span>${y}</span>` })));

    const chips = fields.amount.querySelector('.amount-chips');
    chips.innerHTML = AMOUNTS.map(a => `<button type="button" data-v="${a}" aria-pressed="${a === state.amount}">${money(a, 0)}</button>`).join('');
    const input = fields.amount.querySelector('input');
    if (document.activeElement !== input) input.value = state.amount;
  }

  function open(field, yes) {
    Object.values(fields).forEach(f => {
      const on = f === field && yes;
      f.querySelector('.field__btn').setAttribute('aria-expanded', on);
      f.querySelector('.field__menu').hidden = !on;
    });
    if (field && yes) {
      const target = field.querySelector('[aria-selected="true"]') || field.querySelector('li, input');
      target && target.focus();
    }
  }
  Object.values(fields).forEach(f => {
    const btn = f.querySelector('.field__btn'), menu = f.querySelector('.field__menu');
    btn.addEventListener('click', e => { e.stopPropagation(); open(f, menu.hidden); });
    menu.addEventListener('click', e => e.stopPropagation());
    const ul = f.querySelector('ul');
    if (ul) {
      ul.addEventListener('click', e => choose(f, e.target.closest('li')));
      ul.addEventListener('keydown', e => {
        const items = [...ul.querySelectorAll('li:not([aria-disabled="true"])')];
        const i = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(f, document.activeElement.closest('li')); }
      });
    }
  });
  function choose(f, li) {
    if (!li || li.getAttribute('aria-disabled') === 'true') return;
    const v = li.dataset.v;
    if (f.dataset.field === 'asset') state.asset = v;
    if (f.dataset.field === 'frequency') state.freq = v;
    if (f.dataset.field === 'years') state.since = +v;
    open(f, false);
    f.querySelector('.field__btn').focus();
    update(true);
  }

  // Amount: preset chips or a typed amount
  const amountInput = fields.amount.querySelector('input');
  const hint = fields.amount.querySelector('.amount-hint');
  fields.amount.querySelector('.amount-chips').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    state.amount = +b.dataset.v;
    open(fields.amount, false);
    fields.amount.querySelector('.field__btn').focus();
    update(true);
  });
  let typing;
  amountInput.addEventListener('input', () => {
    const v = parseFloat(amountInput.value.replace(',', '.'));
    const ok = v >= MIN && v <= MAX;
    hint.classList.toggle('is-error', !ok && amountInput.value !== '');
    clearTimeout(typing);
    if (ok) typing = setTimeout(() => { state.amount = Math.round(v * 100) / 100; update(true); }, 350);
  });
  amountInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); open(fields.amount, false); fields.amount.querySelector('.field__btn').focus(); } });

  document.addEventListener('click', () => open(null, false));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const openField = Object.values(fields).find(f => !f.querySelector('.field__menu').hidden);
    if (openField) { open(openField, false); openField.querySelector('.field__btn').focus(); }
  });

  // ---------- Wiring ----------
  window.i18n.onChange(() => { renderFields(); renderTotals(false); renderSource(); draw(false); if (!stateBox.hidden) setState(root.classList.contains('is-loading') ? 'loading' : 'error'); });
  new ResizeObserver(() => draw(false)).observe(plot);
  // Play the chart the first time it scrolls into view
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    seen = true; obs.disconnect();
    if (result) { shown.invested = shown.value = shown.ret = 0; renderTotals(true); draw(true); }
  }, { threshold: .3 }).observe(root.querySelector('.calc__chart'));

  renderFields();
  update(false);
})();
