(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  // Scale the fixed 1440px desktop layout down on narrower screens
  const zoom = () => parseFloat(document.body.style.zoom) || 1;
  function fit() { const w = document.documentElement.clientWidth; document.body.style.zoom = w < 1440 ? (w / 1440).toFixed(4) : ''; }
  addEventListener('resize', fit); fit();

  // ---------- Count-up numbers ----------
  const fmt = (el, v) => {
    const d = +el.dataset.decimals || 0, p = el.dataset.prefix || '';
    const n = el.hasAttribute('data-plain') ? v.toFixed(d) : v.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
    el.textContent = p + n;
  };
  function countUp(el, dur = 1400, delay = 0) {
    const target = +el.dataset.count;
    if (reduce) return fmt(el, target);
    fmt(el, 0);
    setTimeout(() => {
      const t0 = performance.now();
      (function tick(now) {
        const t = clamp((now - t0) / dur);
        fmt(el, target * easeOut(t));
        if (t < 1) requestAnimationFrame(tick);
      })(t0);
    }, delay);
    // rAF pauses in background tabs; make sure the real figure always lands
    setTimeout(() => fmt(el, target), delay + dur + 100);
  }

  // ---------- Intro ----------
  const hero = document.querySelector('.hero');
  const start = () => {
    document.body.classList.add('is-loaded');
    hero.querySelectorAll('[data-reveal],[data-lines]').forEach(el => el.classList.add('is-in'));
    hero.querySelectorAll('[data-count]').forEach(el => countUp(el, 1700, 1150));
  };
  // Wait briefly for fonts so the headline doesn't reflow mid-animation, but never hold the intro back long
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 350))]).then(() => {
    requestAnimationFrame(start);
  });

  // ---------- Scroll reveals ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      e.target.querySelectorAll('[data-count]').forEach(el => countUp(el, 1200, 400));
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
  document.querySelectorAll('main > section:not(.hero) [data-reveal], main > section:not(.hero) [data-lines], .scard')
    .forEach(el => io.observe(el));

  // ---------- Nav: tighten once the page scrolls ----------
  const nav = document.getElementById('nav');
  const onNav = () => nav.classList.toggle('is-scrolled', scrollY > 40);

  // ---------- Stacking step cards: covered cards shrink back and dim ----------
  const cards = [...document.querySelectorAll('.scard')];
  function stack() {
    const z = zoom();
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      let t = 0;
      const top = parseFloat(getComputedStyle(c).top) * z;
      c.classList.toggle('is-stuck', c.getBoundingClientRect().top <= top + 1);
      if (next) {
        const nt = next.getBoundingClientRect().top;
        t = clamp(1 - (nt - top) / (c.offsetHeight * z));
      }
      c.style.transform = t ? `scale(${1 - t * .06}) translateY(${-t * 12}px)` : '';
      const shade = c.querySelector('.scard__shade');
      if (shade) shade.style.opacity = (t * .18).toFixed(3);
    });
  }

  // ---------- Photo parallax ----------
  const photo = document.getElementById('photo');
  const photoImg = photo.querySelector('.photo__img img');
  function parallax() {
    const r = photo.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh - r.top) / (vh + r.height)); // 0 entering → 1 leaving
    photoImg.style.setProperty('--py', `${(p - .5) * -48}px`);
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
