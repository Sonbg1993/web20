document.addEventListener('DOMContentLoaded', () => {

  /* ==================== CẤU HÌNH ==================== */
  const CONFIG = {
    loveStartDate: '2026-04-10T00:00:00',   // ngày bắt đầu yêu
    recipientName: 'Hường yêu ơi là yêu',
    senderName: 'Sơn'
  };

  const $ = (s) => document.querySelector(s); const $$ = (s) => [...document.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const welcome = $('#welcome-screen'), envelope = $('#envelope'), openBtn = $('#open-gift-btn');
  const stage = $('#main-content'), bgMusic = $('#bg-music'), musicBtn = $('#music-toggle-btn');
  const pauseBtn = $('#pause-btn'), modal = $('#secret-modal');    /* ==================== CÁC TAB TỰ CHẠY ==================== */ const tabs = $$('.tab');
  const navBtns = $$('#tabnav button'); const bars = $$('#tabnav .bar i');
  const durs = tabs.map((t) => +t.dataset.dur || 8000);
  const slides = $$('.slide'); const dots = $$('#dots i');
  const GALLERY = 2;

  let cur = -1, elapsed = 0, last = 0, started = false;
  let userPaused = false;
  const holds = new Set();
  const isPaused = () => userPaused || holds.size > 0 || document.hidden;

  tabs.forEach((tab) => tab.querySelectorAll('.it').forEach((el, k) => el.style.setProperty('--k', k)));

  function showSlide(i) {
    slides.forEach((s, k) => s.classList.toggle('on', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
  }

  function setTab(n) {
    if (n === cur) return;
    cur = n; elapsed = 0;
    tabs.forEach((t, i) => t.classList.toggle('active', i === n));
    navBtns.forEach((b, i) => b.setAttribute('aria-current', i === n ? 'true' : 'false'));
    bars.forEach((b, i) => (b.style.transform = `scaleX(${i < n ? 1 : 0})`));
    tabs[n].scrollTop = 0;
    if (n === GALLERY) showSlide(0);
  }

  function frame(ts) {
    const dt = Math.min(ts - last, 100);
    last = ts;
    if (started && cur >= 0 && !isPaused()) {
      elapsed += dt;
      const p = Math.min(elapsed / durs[cur], 1);
      bars[cur].style.transform = `scaleX(${p})`;
      if (cur === GALLERY) showSlide(Math.min(slides.length - 1, Math.floor(p * slides.length)));
      if (p >= 1) setTab((cur + 1) % tabs.length);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame((t) => { last = t; frame(t); });

  const go = (n) => { setTab(((n % tabs.length) + tabs.length) % tabs.length); };
  navBtns.forEach((b) => b.addEventListener('click', () => go(+b.dataset.tab)));
  $$('#dots i').forEach((d, i) => d.addEventListener('click', () => {
    if (cur === GALLERY) elapsed = (durs[GALLERY] * i) / slides.length + 1;
  }));
  document.addEventListener('keydown', (e) => {
    if (!started) return;
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
    if (e.key === 'Escape') closeModal();
  });

  const tabsEl = $('#tabs');
  tabsEl.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') holds.add('hover'); });
  tabsEl.addEventListener('pointerleave', () => holds.delete('hover'));
  tabsEl.addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) holds.add('press'); });
  ['pointerup', 'pointercancel'].forEach((ev) => addEventListener(ev, () => holds.delete('press')));

  let sx = 0, sy = 0, st = 0;
  tabsEl.addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  tabsEl.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - st < 800) go(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });

  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.classList.toggle('is-paused', userPaused);
    pauseBtn.setAttribute('aria-label', userPaused ? 'Tiếp tục tự chuyển trang' : 'Tạm dừng tự chuyển trang');
  });

  /* ==================== MỞ QUÀ ==================== */
  let opened = false;
  function openGift() {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');
    burstFromEnvelope();
    playAudio();
    setTimeout(() => {
      welcome.classList.add('fade-out');
      stage.classList.remove('hidden');
      started = true;
      setTab(0);
      initLoveTimer();
      typeName();
    }, 1400);
    setTimeout(() => welcome.classList.add('hidden'), 2500);
  }
  envelope.addEventListener('click', openGift);
  envelope.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); } });
  openBtn.addEventListener('click', openGift);

  function burstFromEnvelope() {
    const box = $('#hearts-burst'), glyphs = ['♥', '♡', '✧', '◆'], n = 16;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      const ang = (Math.PI * 2 * i) / n, dist = 65 + Math.random() * 80;
      el.className = 'burst-heart';
      el.textContent = glyphs[i % glyphs.length];
      el.style.setProperty('--x', Math.cos(ang) * dist + 'px');
      el.style.setProperty('--y', Math.sin(ang) * dist + 'px');
      el.style.setProperty('--rotate', rand(-30, 30) + 'deg');
      box.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  /* ==================== NHẠC NỀN ==================== */
  function playAudio() {
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
      musicBtn.classList.add('playing');
      let v = 0;
      const f = setInterval(() => { v = Math.min(v + 0.05, 0.7); bgMusic.volume = v; if (v >= 0.7) clearInterval(f); }, 120);
    }).catch((err) => console.log('Không thể tự phát nhạc:', err));
  }
  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) playAudio();
    else { bgMusic.pause(); musicBtn.classList.remove('playing'); }
  });

  /* ==================== HIỆU ỨNG GÕ TÊN ==================== */
  function typeName() {
    const el = $('#typewriter-name');
    if (reduce) return;
    const full = CONFIG.recipientName;
    el.textContent = '';
    el.style.minHeight = '1.1em';
    let i = 0;
    const tick = () => { el.textContent = full.slice(0, ++i); if (i < full.length) setTimeout(tick, 110); };
    setTimeout(tick, 800);
  }

  /* ==================== ĐỒNG HỒ TÌNH YÊU ==================== */
  function initLoveTimer() {
    const start = new Date(CONFIG.loveStartDate).getTime();
    const set = (id, v) => { $('#' + id).textContent = String(v).padStart(2, '0'); };
    const update = () => {
      const diff = Math.max(0, Date.now() - start);
      set('days', Math.floor(diff / 864e5));
      set('hours', Math.floor((diff % 864e5) / 36e5));
      set('minutes', Math.floor((diff % 36e5) / 6e4));
      set('seconds', Math.floor((diff % 6e4) / 1e3));
    };
    update();
    setInterval(update, 1000);
  }

  /* ==================== LỜI NHẮN BÍ MẬT ==================== */
  function openModal() { modal.classList.remove('hidden'); holds.add('modal'); $('#close-modal-btn').focus(); }
  function closeModal() { modal.classList.add('hidden'); holds.delete('modal'); }
  $('#open-secret-letter-btn').addEventListener('click', openModal);
  $('#close-modal-btn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* ==================== GỬI TRÁI TIM ==================== */
  $('#send-love-btn').addEventListener('click', () => {
    if (reduce) return;
    const total = innerWidth < 600 ? 16 : 26, glyphs = ['♥', '♡', '♥', '✧'];
    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'floating-heart';
        el.textContent = glyphs[i % glyphs.length];
        el.style.left = rand(5, 95) + 'vw';
        el.style.fontSize = rand(16, 30) + 'px';
        el.style.animationDuration = rand(2.2, 3.8) + 's';
        el.style.setProperty('--drift', rand(-70, 70) + 'px');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }, i * 65);
    }
  });

  /* ==================== BỤI VÀNG & CÁNH HOA (CANVAS) ==================== */
  if (reduce) return;
  const cv = $('#particles-canvas'), ctx = cv.getContext('2d');
  const mobile = innerWidth < 640;
  let W, H, dpr;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
    W = cv.width = Math.round(innerWidth * dpr);
    H = cv.height = Math.round(innerHeight * dpr);
  };
  resize();
  addEventListener('resize', resize);

  const sprite = (draw, size = 64) => {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const x = c.getContext('2d'); x.translate(size / 2, size / 2); draw(x); return c;
  };
  const dustSprite = sprite((x) => {
    const g = x.createRadialGradient(0, 0, 0, 0, 0, 30);
    g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(.25, 'rgba(216,184,120,.7)'); g.addColorStop(1, 'rgba(216,184,120,0)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, 30, 0, 7); x.fill();
  });
  const petalSprites = [['#ffb3c1', '#ff758f'], ['#ffccd5', '#ff8fa3'], ['#ff8fa3', '#ff4d6d']].map(([a, b]) => sprite((x) => {
    const g = x.createLinearGradient(0, -28, 0, 28); g.addColorStop(0, a); g.addColorStop(1, b);
    x.fillStyle = g; x.beginPath(); x.moveTo(0, -28);
    x.bezierCurveTo(26, -14, 20, 24, 0, 28); x.bezierCurveTo(-20, 24, -26, -14, 0, -28); x.fill();
  }));

  const makeDust = (init) => ({ kind: 0, x: rand(0, W), y: init ? rand(0, H) : H + 20 * dpr, s: rand(5, 14) * dpr, vy: -rand(.12, .4) * dpr, ph: rand(0, 6.28), tw: rand(.0008, .002), a: rand(.35, .85) });
  const makePetal = (init) => ({ kind: 1, spr: petalSprites[Math.floor(rand(0, 3))], x: rand(0, W), y: init ? rand(-H, H) : -rand(30, 90) * dpr,
    s: rand(12, 22) * dpr, vy: rand(.45, 1) * dpr, sway: rand(.0008, .0018), ph: rand(0, 6.28), amp: rand(.3, .9) * dpr, rot: rand(0, 6.28), vr: rand(-.01, .01), flip: rand(0, 6.28), vf: rand(.01, .025), a: rand(.35, .7) });
  const dust = Array.from({ length: mobile ? 14 : 30 }, () => makeDust(true));
  const petals = Array.from({ length: mobile ? 7 : 14 }, () => makePetal(true));

  const loop = (t) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < dust.length; i++) {
      const p = dust[i];
      p.y += p.vy; p.x += Math.sin(t * p.tw + p.ph) * .25 * dpr;
      if (p.y < -20 * dpr) { dust[i] = makeDust(false); continue; }
      ctx.globalAlpha = p.a * (.55 + .45 * Math.sin(t * p.tw * 3 + p.ph));
      ctx.setTransform(p.s / 64, 0, 0, p.s / 64, p.x, p.y);
      ctx.drawImage(dustSprite, -32, -32);
    }
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.vy; p.x += Math.sin(t * p.sway + p.ph) * p.amp; p.rot += p.vr; p.flip += p.vf;
      if (p.y > H + 40 * dpr) { petals[i] = makePetal(false); continue; }
      const k = p.s / 64, f = .55 + .45 * Math.abs(Math.cos(p.flip)), c = Math.cos(p.rot) * k, s = Math.sin(p.rot) * k;
      ctx.globalAlpha = p.a;
      ctx.setTransform(c, s, -s * f, c * f, p.x, p.y);
      ctx.drawImage(p.spr, -32, -32);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
});
