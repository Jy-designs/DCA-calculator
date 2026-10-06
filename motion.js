(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const { t, money, percent } = window.i18n;

  // ---------- Copy first, so everything below measures the real text ----------
  window.i18n.apply();

  // ---------- Headlines: split into words so they can rise in any language ----------
  function splitWords(el) {
    const text = el.dataset.text || el.textContent.trim();
    el.dataset.text = text;
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map((w, i) => `<span class="w" aria-hidden="true" style="--wi:${i}"><span>${w}</span></span>`).join(' ');
  }
  const headlines = [...document.querySelectorAll('[data-words]')];
  headlines.forEach(splitWords);

  // ---------- Count-up numbers ----------
  const fmt = (el, v) => {
    const dec = el.dataset.dec !== undefined ? +el.dataset.dec : 2;
    el.textContent = el.hasAttribute('data-percent') ? percent(v) : money(v, dec);
  };
  function countUp(el, dur = 1400, delay = 0) {
    const target = +el.dataset.count;
    if (reduce) return fmt(el, target);
    el.dataset.counting = '1';
    fmt(el, 0);
    setTimeout(() => {
      const t0 = performance.now();
      (function tick(now) {
        const p = clamp((now - t0) / dur);
        fmt(el, target * easeOut(p));
        if (p < 1) requestAnimationFrame(tick); else delete el.dataset.counting;
      })(t0);
    }, delay);
    // rAF pauses in background tabs; make sure the real figure always lands
    setTimeout(() => { fmt(el, target); delete el.dataset.counting; }, delay + dur + 120);
  }
  document.querySelectorAll('[data-count]').forEach(el => fmt(el, +el.dataset.count));

  // ---------- Hero intro ----------
  const hero = document.querySelector('.hero');
  const start = () => {
    document.body.classList.add('is-loaded');
    hero.querySelectorAll('[data-reveal],[data-words]').forEach(el => el.classList.add('is-in'));
  };
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 350))]).then(() => requestAnimationFrame(start));

  // ---------- Scroll reveals ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('is-in');
      el.querySelectorAll('[data-count]').forEach(n => countUp(n, 1300, 350));
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
  document.querySelectorAll('main > section:not(.hero) [data-reveal], main > section:not(.hero) [data-words], .tile, .scard')
    .forEach(el => io.observe(el));

  // ---------- Tiles: scale each Figma-sized illustration to its tile ----------
  const fitStage = glass => {
    const stage = glass.querySelector('.tile__stage');
    const cap = glass.querySelector('.tile__cap');
    const w = +stage.dataset.w;
    // Use the real height of the illustration: text can make cards taller than the Figma frame,
    // and tilted cards reach further down than their box. Measured on the unscaled layout, using
    // each card's own rotate/scale (but not hover or reveal offsets, which are temporary).
    const bottomOf = c => {
      if (c.classList.contains('float')) return 0; // decorative coins may overflow
      const m = new DOMMatrixReadOnly(getComputedStyle(c).transform === 'none' ? undefined : getComputedStyle(c).transform);
      const hw = c.offsetWidth / 2, hh = c.offsetHeight / 2;
      return c.offsetTop + hh + Math.abs(m.b) * hw + Math.abs(m.d) * hh;
    };
    const h = Math.max(+stage.dataset.h, ...[...stage.children].map(bottomOf));
    stage.style.width = w + 'px'; stage.style.height = h + 'px';
    // Fit into the space above the caption, keeping a gap so nothing touches it
    const gw = glass.clientWidth, gh = (cap ? cap.offsetTop : glass.clientHeight) - 14;
    const k = Math.min(gw / w, gh / h);
    stage.style.setProperty('--k', k.toFixed(4));
    stage.style.setProperty('--tx', `${((gw - w * k) / 2).toFixed(1)}px`);
    stage.style.setProperty('--ty', `${Math.max(0, (gh - h * k) / 2).toFixed(1)}px`);
  };
  // Refit when the tile resizes, or when its caption changes size (web font loading, language switch)
  // A resize can report in-between sizes, so refit every tile on the next frame and again once it settles
  const glasses = [...document.querySelectorAll('.tile__glass')];
  const fitAll = () => glasses.forEach(fitStage);
  let fitFrame, fitTimer;
  const scheduleFit = () => {
    cancelAnimationFrame(fitFrame); clearTimeout(fitTimer);
    fitFrame = requestAnimationFrame(fitAll);
    fitTimer = setTimeout(fitAll, 250);
  };
  const ro = new ResizeObserver(scheduleFit);
  glasses.forEach(g => { ro.observe(g); ro.observe(g.querySelector('.tile__cap')); });
  addEventListener('resize', scheduleFit);
  if (document.fonts) document.fonts.ready.then(fitAll);
  fitAll();

  // ---------- Nav ----------
  const nav = document.getElementById('nav');
  const onNav = () => nav.classList.toggle('is-scrolled', scrollY > 40);
  const burger = nav.querySelector('.nav__burger');
  const setMenu = open => { nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav__menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Language switcher
  const langBtn = nav.querySelector('.lang__btn');
  const langList = nav.querySelector('.lang__list');
  const setLangOpen = open => { langList.hidden = !open; langBtn.setAttribute('aria-expanded', open); };
  langBtn.addEventListener('click', e => { e.stopPropagation(); setLangOpen(langList.hidden); });
  langList.addEventListener('click', e => {
    const li = e.target.closest('[data-lang]');
    if (!li) return;
    setLangOpen(false);
    window.i18n.set(li.dataset.lang);
  });
  langList.querySelectorAll('li').forEach(li => { li.tabIndex = 0; li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); li.click(); } }); });
  document.addEventListener('click', e => { if (!nav.contains(e.target)) { setLangOpen(false); setMenu(false); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setLangOpen(false); setMenu(false); } });

  // When the language changes: re-split headlines (replaying the rise for those on screen) and re-format numbers
  window.i18n.onChange(() => {
    headlines.forEach(el => {
      const r = el.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < innerHeight;
      splitWords(el);
      if (visible && el.classList.contains('is-in') && !reduce) {
        el.classList.remove('is-in'); void el.offsetWidth; el.classList.add('is-in');
      }
    });
    document.querySelectorAll('[data-count]').forEach(el => { if (!el.dataset.counting) fmt(el, +el.dataset.count); });
    document.querySelectorAll('.tile__glass').forEach(fitStage);
  });

  // ---------- FAQ accordion ----------
  document.getElementById('faq-list').addEventListener('click', e => {
    const q = e.target.closest('.qa__q');
    if (!q) return;
    const item = q.parentElement, open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    q.setAttribute('aria-expanded', open);
  });

  // ---------- Blog: pick an article, or step through with the arrows ----------
  const articles = [...document.querySelectorAll('.article')];
  const cover = document.querySelector('.blog__cover');
  let current = 0;
  function show(i) {
    current = (i + articles.length) % articles.length;
    articles.forEach((a, n) => {
      a.classList.toggle('is-active', n === current);
      a.querySelector('.article__head').setAttribute('aria-expanded', n === current);
    });
    if (!reduce) { cover.classList.add('is-swapping'); setTimeout(() => cover.classList.remove('is-swapping'), 220); }
  }
  articles.forEach((a, n) => a.querySelector('.article__head').addEventListener('click', () => show(n)));
  document.querySelector('.blog__arrow--prev').addEventListener('click', () => show(current - 1));
  document.querySelector('.blog__arrow--next').addEventListener('click', () => show(current + 1));

  // ---------- Stacking step cards: covered cards shrink back and dim ----------
  const cards = [...document.querySelectorAll('.scard')];
  function stack() {
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      const top = parseFloat(getComputedStyle(c).top);
      c.classList.toggle('is-stuck', c.getBoundingClientRect().top <= top + 1);
      let p = 0;
      if (next) p = clamp(1 - (next.getBoundingClientRect().top - top) / c.offsetHeight);
      c.style.transform = p ? `scale(${1 - p * .06}) translateY(${-p * 12}px)` : '';
      const shade = c.querySelector('.scard__shade');
      if (shade) shade.style.opacity = (p * .18).toFixed(3);
    });
  }

  // ---------- Photo parallax ----------
  const photo = document.getElementById('photo');
  const photoImg = photo.querySelector('.photo__img');
  function parallax() {
    const r = photo.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    const p = clamp((vh - r.top) / (vh + r.height));
    photoImg.style.setProperty('--py', `${((p - .5) * -40).toFixed(1)}px`);
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onNav(); if (!reduce) { stack(); parallax(); } ticking = false; });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
