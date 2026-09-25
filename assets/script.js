(function(){
  var root = document.documentElement;
  var buttons = [].slice.call(document.querySelectorAll('.switch button'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncButtons(){
    var t = root.getAttribute('data-theme') || 'ink';
    buttons.forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.set === t)); });
  }
  buttons.forEach(function(b){
    b.addEventListener('click', function(){
      root.setAttribute('data-theme', b.dataset.set);
      syncButtons(); readColours(); drawBaseline();
    });
  });
  syncButtons();

  var C = { ink:'#E9E7E2', accent:'#E9A93C', rule:'rgba(255,255,255,.17)' };
  function readColours(){
    var cs = getComputedStyle(root);
    C.ink = cs.getPropertyValue('--ink').trim() || C.ink;
    C.accent = cs.getPropertyValue('--accent').trim() || C.accent;
    C.rule = cs.getPropertyValue('--rule').trim() || C.rule;
  }
  readColours();

  var base = document.getElementById('baseline');
  function drawBaseline(){
    var w = base.clientWidth || 800;
    var parts = ['<line x1="0" y1="1" x2="'+w+'" y2="1" stroke="'+C.rule+'" stroke-width="1" />'];
    for (var x = 0; x <= w; x += 44){
      parts.push('<line x1="'+x+'" y1="1" x2="'+x+'" y2="6" stroke="'+C.rule+'" stroke-width="1" />');
    }
    base.setAttribute('viewBox', '0 0 ' + w + ' 18');
    base.innerHTML = parts.join('');
  }

  var cvs = document.getElementById('nameCanvas');
  var ctx = cvs.getContext('2d');
  var pts = [], W = 0, H = 0, start = 0, raf = null;
  function easeOut(t){ return 1 - Math.pow(1 - t, 3); }

  function build(){
    var rect = cvs.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = W * dpr; cvs.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var off = document.createElement('canvas');
    off.width = W; off.height = H;
    var o = off.getContext('2d');
    var stacked = W < 700;
    var size = stacked ? Math.min(W / 5.0, 96) : Math.min(W / 9.6, 148);
    o.fillStyle = '#000'; o.textBaseline = 'middle'; o.textAlign = 'left';
    o.font = '700 ' + size + 'px "IBM Plex Sans", system-ui, sans-serif';
    if (stacked){ o.fillText('AYUSH', 0, H * 0.31); o.fillText('UMMADI', 0, H * 0.74); }
    else { o.fillText('AYUSH UMMADI', 0, H * 0.54); }

    var data = o.getImageData(0, 0, W, H).data;
    var step = W < 520 ? 3 : 4;
    var targets = [];
    for (var y = 0; y < H; y += step){
      for (var x = 0; x < W; x += step){
        if (data[(y * W + x) * 4 + 3] > 128) targets.push([x, y]);
      }
    }
    var max = W < 700 ? 900 : 1500;
    var stride = Math.max(1, Math.ceil(targets.length / max));
    pts = [];
    for (var i = 0; i < targets.length; i += stride){
      var t = Math.random();
      var sx = t * W;
      var sy = Math.max(2, Math.min(H - 2, H * 0.92 - t * H * 0.62 + (Math.random() - 0.5) * H * 0.55));
      pts.push({
        sx: sx, sy: sy, tx: targets[i][0], ty: targets[i][1],
        d: (targets[i][0] / W) * 420 + Math.random() * 260,
        p: Math.random() * Math.PI * 2,
        a: Math.random() < 0.07
      });
    }
    start = performance.now();
  }

  function frame(now){
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++){
      var p = pts[i], k = (now - start - p.d) / 1000, x, y, e;
      if (k <= 0){ x = p.sx; y = p.sy; }
      else if (k < 1){ e = easeOut(k); x = p.sx + (p.tx - p.sx) * e; y = p.sy + (p.ty - p.sy) * e; }
      else { x = p.tx; y = p.ty + Math.sin(now / 1400 + p.p) * 0.7; }
      ctx.fillStyle = p.a ? C.accent : C.ink;
      ctx.fillRect(x, y, p.a ? 2.6 : 2, p.a ? 2.6 : 2);
    }
    raf = requestAnimationFrame(frame);
  }

  function still(){
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++){
      var p = pts[i];
      ctx.fillStyle = p.a ? C.accent : C.ink;
      ctx.fillRect(p.tx, p.ty, p.a ? 2.6 : 2, p.a ? 2.6 : 2);
    }
  }

  function boot(){
    build(); drawBaseline();
    if (raf) cancelAnimationFrame(raf);
    if (reduce) still(); else raf = requestAnimationFrame(frame);
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  else window.addEventListener('load', boot);

  var pairs = document.getElementById('pairs');
  if (pairs){
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.2 });
      io.observe(pairs);
    } else { pairs.classList.add('in'); }
  }

  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var navlinks = document.getElementById('navlinks');
  var links = [].slice.call(navlinks.querySelectorAll('a[href^="#"]'));
  var targets = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });

  function closeMenu(){
    navlinks.removeAttribute('data-open');
    menuBtn.setAttribute('aria-expanded','false');
    menuBtn.setAttribute('aria-label','Open menu');
  }
  menuBtn.addEventListener('click', function(){
    var open = navlinks.getAttribute('data-open') === 'true';
    if (open){ closeMenu(); }
    else {
      navlinks.setAttribute('data-open','true');
      menuBtn.setAttribute('aria-expanded','true');
      menuBtn.setAttribute('aria-label','Close menu');
    }
  });
  links.forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeMenu(); });

  var ticking = false;
  function onScroll(){
    nav.classList.toggle('stuck', (window.scrollY || window.pageYOffset) > 24);
    nav.classList.toggle('named', cvs.getBoundingClientRect().bottom < 58);
    var cur = -1;
    for (var i = 0; i < targets.length; i++){
      var t = targets[i];
      if (t && t.getBoundingClientRect().top <= 96) cur = i;
    }
    links.forEach(function(a, i){
      if (a.classList.contains('cta')) return;
      a.classList.toggle('current', i === cur);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(onScroll); }
  }, { passive:true });
  onScroll();

  var rt;
  window.addEventListener('resize', function(){
    clearTimeout(rt);
    rt = setTimeout(function(){ if (reduce){ build(); still(); drawBaseline(); } else boot(); }, 180);
  });
})();
