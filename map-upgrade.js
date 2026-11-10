(function () {
  'use strict';
  const css = `
  html:not(.mu-ready) .app{ opacity:0; }
  .app{ transition:opacity .3s ease; }

  .drawer-overlay{ display:none !important; }
  .drawer{ width:480px; }
  .drawer:not(.open){ visibility:hidden; box-shadow:none !important; transition:transform .3s ease, visibility 0s linear .3s; }
  .drawer.open{ visibility:visible; transition:transform .3s ease, visibility 0s; }
  .filter-panel:not(.open){ box-shadow:none !important; }
  .drawer-head h2{ padding-right:112px; }
  .drawer-head .badge-row{ padding-right:128px; }
  .dr-nav{ position:absolute; top:14px; right:56px; display:flex; align-items:center; gap:4px; }
  .dr-nav button{ width:30px; height:30px; border-radius:50%; border:1px solid var(--line); background:var(--panel); cursor:pointer; font-size:17px; line-height:1; color:var(--emerald-deep); }
  .dr-nav span{ font-size:11px; color:var(--muted); min-width:34px; text-align:center; }
  .dr-handle{ display:none; }
  .drawer-price .cmp{ margin-top:6px; font-size:12px; color:#d8e6de; }
  #dBody > div:first-child iframe{ height:230px !important; }

  .mu-span{ grid-area:1 / 1 / -1 / -1 !important; width:100% !important; min-width:0 !important; }

  .sidebar{
    position:absolute !important; left:0; top:0; bottom:0; height:100% !important;
    width:min(350px, 88vw) !important; max-width:none !important;
    z-index:700 !important; box-sizing:border-box; padding-top:54px;
    background:var(--panel, #fffdf9); border-right:1px solid var(--line, #e4dcc5);
    transform:translateX(-105%); visibility:hidden;
    transition:transform .3s ease, visibility 0s linear .3s;
  }
  .app.side-open .sidebar{ transform:none; visibility:visible; box-shadow:6px 0 24px rgba(0,0,0,.25); transition:transform .3s ease, visibility 0s; }

  .top-ctl{ position:absolute; z-index:800; left:12px; top:12px; display:flex; flex-wrap:wrap; gap:8px; align-items:center; max-width:calc(100% - 24px); }
  .app.dr-open .top-ctl{ max-width:calc(100% - 504px); }
  .app.side-open .top-ctl > :not(.side-btn){ display:none !important; }
  .side-btn, .tour-btn{
    display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:20px;
    background:var(--emerald-deep, #0a352a); color:var(--gold-light, #f0dfb0);
    border:1.5px solid var(--gold, #b98b3e); font-family:inherit; font-size:12.5px; font-weight:700;
    cursor:pointer; box-shadow:0 4px 14px rgba(0,0,0,.25); transition:all .2s; white-space:nowrap;
  }
  .side-btn:hover, .tour-btn:hover{ background:var(--emerald, #0f4d3a); transform:translateY(-1px); }
  .tour-btn.active{ background:var(--red, #DA2128); border-color:#fff; color:#fff; animation:tourPulse 1.5s infinite; }
  @keyframes tourPulse{
    0%{ box-shadow:0 0 0 0 rgba(218,33,40,.6); }
    70%{ box-shadow:0 0 0 10px rgba(218,33,40,0); }
    100%{ box-shadow:0 0 0 0 rgba(218,33,40,0); }
  }
  .map-summary{ display:flex; gap:8px; align-items:center; padding:7px 14px; background:rgba(255,253,249,.95); border:1px solid var(--line, #e4dcc5); border-radius:20px; font-size:12px; color:var(--emerald-deep, #0a352a); box-shadow:0 2px 8px rgba(0,0,0,.12); }
  .map-summary b{ font-weight:800; }
  .map-summary span{ color:var(--muted, #8b8371); }
  .clear-chip{ display:none; padding:7px 14px; border:none; border-radius:20px; background:var(--red, #DA2128); color:#fff; font-family:inherit; font-size:12px; font-weight:700; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.25); }
  .clear-chip.show{ display:block; }

  .mu-legend{ left:12px !important; right:auto !important; top:auto !important; bottom:12px !important; z-index:400 !important; }

  .radar-pulse-icon{ position:relative; width:0; height:0; }
  .radar-ring{
    position:absolute; width:40px; height:40px; top:-20px; left:-20px;
    border-radius:50%; background:rgba(218,33,40,.35); border:1.5px solid var(--red, #DA2128);
    animation:radarWave 2.4s infinite cubic-bezier(0.215,0.61,0.355,1); pointer-events:none;
  }
  @keyframes radarWave{
    0%{ transform:scale(.3); opacity:1; }
    80%{ transform:scale(3.2); opacity:0; }
    100%{ transform:scale(3.5); opacity:0; }
  }

  path.leaflet-interactive.flow-line{ stroke-dasharray:8,12 !important; animation:flowDash 1.2s linear infinite !important; }
  @keyframes flowDash{ from{ stroke-dashoffset:40; } to{ stroke-dashoffset:0; } }

  .pp{ position:absolute; left:0; top:0; transform:translate(-50%,-100%); margin-top:-8px; }
  .pp-body{ position:relative; display:flex; align-items:center; gap:4px; padding:4px 10px 4px 7px; border-radius:16px; color:#fff; font-size:12px; font-weight:800; white-space:nowrap; border:2px solid #fff; box-shadow:0 3px 9px rgba(0,0,0,.35); cursor:pointer; transform-origin:50% 100%; transition:transform .18s ease; }
  .pp-body::after{ content:''; position:absolute; left:50%; bottom:-8px; margin-left:-6px; border:6px solid transparent; border-top-color:inherit; }
  .pp-near .pp-body{ background:var(--emerald, #0f4d3a); border-top-color:#fff; }
  .pp-far .pp-body{ background:var(--gold, #b98b3e); }
  .pp-near .pp-body::after{ border-top-color:var(--emerald, #0f4d3a); }
  .pp-far .pp-body::after{ border-top-color:var(--gold, #b98b3e); }
  .pp:hover .pp-body{ transform:scale(1.1); }
  .pp-sel .pp-body{ background:var(--emerald-deep, #0a352a); transform:scale(1.18); animation:ppRing 1.5s ease-out infinite; }
  .pp-sel .pp-body::after{ border-top-color:var(--emerald-deep, #0a352a); }
  .pp-in .pp-body{ animation:ppPop .4s cubic-bezier(.2,1.4,.4,1) both; }
  @keyframes ppPop{ from{ transform:scale(0); opacity:0; } to{ transform:scale(1); opacity:1; } }
  @keyframes ppRing{ 0%{ box-shadow:0 0 0 0 rgba(185,139,62,.8), 0 6px 16px rgba(0,0,0,.4); } 100%{ box-shadow:0 0 0 16px rgba(185,139,62,0), 0 6px 16px rgba(0,0,0,.4); } }
  .pin-tip{ font-family:inherit; font-size:12px; font-weight:700; color:var(--emerald-deep, #0a352a); border-radius:10px; border:1px solid var(--line, #e4dcc5); box-shadow:0 4px 12px rgba(0,0,0,.2); }

  .dir-chip{
    --tx:-50%; --ty:-50%;
    position:absolute; transform:translate(var(--tx), var(--ty));
    padding:3px 9px; border-radius:12px; font-size:11px; font-weight:800; color:#fff;
    background:var(--emerald-deep, #0a352a); border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.35);
    white-space:nowrap; animation:chipIn .35s both;
  }
  .dir-chip.to{ --ty:-135%; }
  .dir-chip.back{ --ty:35%; background:var(--gold, #b98b3e); }
  @keyframes chipIn{
    from{ transform:translate(var(--tx), var(--ty)) scale(0); opacity:0; }
    to{ transform:translate(var(--tx), var(--ty)) scale(1); opacity:1; }
  }
  .gate-chip{ position:absolute; transform:translate(-50%,-100%); margin-top:-4px; padding:3px 9px; border-radius:12px; background:var(--red, #DA2128); color:#fff; font-size:11px; font-weight:800; border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.35); white-space:nowrap; }

  .tour-btn.hidden{ display:none !important; }
  .tour-progress{ position:absolute; z-index:900; left:0; top:0; height:4px; width:0; background:linear-gradient(90deg,var(--gold,#b98b3e),var(--gold-light,#f0dfb0)); transition:width .8s ease, opacity .4s; pointer-events:none; opacity:0; }
  .app.touring .tour-progress{ opacity:1; }
  .show-card{ position:absolute; inset:0; z-index:850; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0; transition:opacity .5s ease; padding:16px; box-sizing:border-box; }
  .show-card.on{ opacity:1; }
  .sc-box{ background:rgba(10,53,42,.94); color:#fff; border:2px solid var(--gold,#b98b3e); border-radius:20px; padding:20px 22px; max-width:min(540px,92%); width:100%; box-shadow:0 12px 40px rgba(0,0,0,.4); transform:scale(.92); transition:transform .5s cubic-bezier(.2,1.2,.4,1); text-align:center; }
  .show-card.on .sc-box{ transform:scale(1); }
  .sc-box h3{ margin:0 0 6px; font-size:19px; color:var(--gold-light,#f0dfb0); }
  .sc-box p{ margin:0 0 12px; font-size:13px; opacity:.85; }
  .sc-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px; text-align:left; }
  .sc-item{ background:rgba(255,255,255,.09); border-radius:12px; padding:8px 10px; font-size:12px; animation:cardIn .5s ease both; }
  .sc-item b{ display:block; font-size:14px; color:var(--gold-light,#f0dfb0); }
  .sc-item small{ opacity:.75; }
  .tour-flag{ margin:14px 22px 0; padding:9px 14px; border-radius:12px; background:linear-gradient(90deg,var(--gold,#b98b3e),#d9b26a); color:#2a1d05; font-weight:800; font-size:13.5px; animation:flagIn .6s cubic-bezier(.2,1.3,.4,1) both; }
  @keyframes flagIn{ from{ opacity:0; transform:translateY(-10px) scale(.9); } to{ opacity:1; transform:none; } }

  .card-in{ animation:cardIn .35s ease both; }
  @keyframes cardIn{ from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:none; } }
  .card-trip{ font-size:11.5px; color:var(--muted, #8b8371); margin-top:3px; }

  .stat-row{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:14px 22px 4px; }
  .stat-tile{ background:#fbf8f1; border:1px solid var(--line, #e4dcc5); border-radius:12px; padding:9px 4px; text-align:center; animation:cardIn .4s ease both; }
  .stat-tile b{ display:block; font-size:13.5px; color:var(--emerald-deep, #0a352a); }
  .stat-tile span{ font-size:10.5px; color:var(--muted, #8b8371); }
  .blk{ padding:14px 22px 4px; }
  .blk h4{ margin:0 0 8px; font-size:13px; color:var(--emerald-deep, #0a352a); }
  .jwrap{ display:grid; gap:10px; }
  .jcard{ border:1.5px solid var(--line, #e4dcc5); border-radius:12px; padding:10px 12px; cursor:pointer; background:#fff; transition:border-color .2s, opacity .2s, box-shadow .2s; animation:cardIn .4s ease both; }
  .jcard.on{ border-color:var(--emerald, #0f4d3a); box-shadow:0 0 0 2px rgba(15,77,58,.15); }
  .jcard.dim{ opacity:.45; }
  .jc-top{ display:flex; justify-content:space-between; align-items:center; font-size:13px; margin-bottom:2px; }
  .jc-line{ display:inline-block; width:46px; border-radius:3px; background:var(--emerald, #0f4d3a); }
  .jc-line.to{ height:7px; opacity:.55; }
  .jc-line.back{ height:3px; }
  .jc-stats{ display:flex; gap:18px; margin-top:8px; font-size:12.5px; font-weight:700; color:var(--emerald-deep, #0a352a); }
  .jc-stats i{ font-style:normal; margin-right:4px; }
  .jnote{ font-size:11px; color:var(--muted, #8b8371); margin-top:6px; line-height:1.5; }
  .rb{ display:grid; grid-template-columns:118px 1fr 22px; gap:8px; align-items:center; margin:8px 0; font-size:12px; }
  .rb-t{ position:relative; height:10px; background:#ece6d4; border-radius:6px; }
  .rb-f{ height:100%; width:0; border-radius:6px; background:linear-gradient(90deg,var(--emerald, #0f4d3a),#2f8f5b); transition:width .8s cubic-bezier(.2,.8,.2,1); }
  .rb-avg{ position:absolute; top:-3px; width:2px; height:16px; background:var(--gold, #b98b3e); border-radius:1px; }
  .rb-v{ font-weight:800; color:var(--gold, #b98b3e); text-align:right; }

  @media (max-width:820px){
    .drawer{ top:auto !important; left:0 !important; right:0 !important; bottom:0 !important; width:100% !important; max-width:none !important; height:78% !important; border-radius:20px 20px 0 0; transform:translateY(105%) !important; box-shadow:0 -8px 30px rgba(15,77,58,.3) !important; transition:transform .3s ease, height .3s ease, visibility 0s linear .3s; }
    .drawer.open{ transform:translateY(0) !important; transition:transform .3s ease, height .3s ease, visibility 0s; }
    .drawer.full{ height:92% !important; }
    .drawer.low{ height:30% !important; }
    .dr-handle{ display:block; height:22px; cursor:pointer; flex-shrink:0; }
    .dr-handle::before{ content:''; display:block; width:40px; height:5px; background:#ccc; border-radius:3px; margin:9px auto 0; }
    .drawer-head{ padding:8px 16px 6px !important; }
    .drawer-head h2{ font-size:16px !important; margin-bottom:2px !important; }
    .badge-row{ margin-bottom:4px !important; gap:4px !important; }
    .badge{ padding:2px 7px !important; font-size:10px !important; }
    .drawer-price{ padding:8px 16px !important; }
    .drawer-price .amount{ font-size:21px !important; }
    .drawer-price .cmp{ margin-top:2px !important; font-size:11px !important; line-height:1.3 !important; }
    .drawer-head h2{ padding-right:44px !important; }
    .drawer-head .badge-row{ padding-right:0 !important; }
    .dr-nav{ position:static !important; align-self:flex-end; margin:0 40px 6px auto; width:max-content; }
    .drawer-close{ top:8px; }
    .app.dr-open .top-ctl{ max-width:calc(100% - 24px); }
    .app.dr-open .map-summary, .app.dr-open .mu-legend{ display:none !important; }
    .top-ctl{ gap:6px; }
    .side-btn, .tour-btn{ padding:6px 12px; font-size:11.5px; }
    #dBody > div:first-child iframe{ height:180px !important; }
    .rb{ grid-template-columns:104px 1fr 22px; }
  }

  @media (max-height:520px){
    .drawer{ overflow-y:auto !important; overflow-x:hidden !important; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; touch-action:pan-y; }
    .drawer > *{ flex-shrink:0 !important; }
    #dBody{ overflow:visible !important; height:auto !important; max-height:none !important; flex:none !important; }
    .drawer-head h2{ font-size:16px; }
    #dBody > div:first-child iframe{ height:150px !important; }
    .map-summary{ display:none; }
    .app.dr-open .top-ctl{ max-width:calc(100% - 60%); }
  }
  @media (min-width:821px) and (max-height:520px){
    .drawer{ width:min(440px, 56%) !important; }
  }
  @media (max-width:820px) and (max-height:520px){
    .drawer{ height:90% !important; }
    .app.dr-open .top-ctl{ max-width:calc(100% - 24px); }
  }
  `;
  const styleEl = document.createElement('style');
  styleEl.id = 'mapUpgradeCss';
  styleEl.textContent = css;
  (document.head || document.documentElement).appendChild(styleEl);

  const reveal = () => document.documentElement.classList.add('mu-ready');
  setTimeout(reveal, 3500); 

  function init() {
    if (typeof housing === 'undefined' || typeof markers === 'undefined' || typeof map === 'undefined' ||
        typeof buildSpans === 'undefined' || typeof render === 'undefined' || typeof openDrawer === 'undefined') {
      console.warn('[map-upgrade] ไม่พบตัวแปรหลักของแผนที่ ข้ามการอัปเกรดเพื่อป้องกันหน้าเว็บพัง');
      styleEl.remove();
      return;
    }
    const $ = id => document.getElementById(id);
    const isMobile = () => window.innerWidth <= 820;
    const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
    const numOrNull = v => { if (v === undefined || v === null || v === '') return null; const n = parseFloat(String(v).replace(/,/g, '')); return Number.isFinite(n) ? n : null; };
    const fmtN = n => Math.round(n).toLocaleString('en-US');
    const kLabel = r => r >= 1000 ? (r / 1000).toFixed(r % 1000 === 0 ? 0 : 1) + 'k' : String(r);
    const drawer = $('drawer');

    const app = document.querySelector('.app');
    if (!app || !drawer) { styleEl.remove(); return; }

    const mapEl = map.getContainer();
    for (let n = mapEl; n && n !== app; n = n.parentElement) n.classList.add('mu-span');
    const fixSize = () => { try { map.invalidateSize({ animate: false }); } catch (e) {} };
    setTimeout(fixSize, 50);
    window.addEventListener('resize', fixSize);
    window.addEventListener('orientationchange', () => setTimeout(fixSize, 250));
    if (window.ResizeObserver) new ResizeObserver(fixSize).observe(mapEl);

    const topCtl = document.createElement('div');
    topCtl.className = 'top-ctl';
    app.appendChild(topCtl);

    const sideBtn = document.createElement('button');
    sideBtn.className = 'side-btn'; sideBtn.type = 'button';
    sideBtn.innerHTML = '☰ รายการที่พัก';
    topCtl.appendChild(sideBtn);

    const tourBtn = document.createElement('button');
    tourBtn.className = 'tour-btn'; tourBtn.id = 'tourBtn'; tourBtn.type = 'button';
    tourBtn.innerHTML = '▶ ไฮไลต์';
    topCtl.appendChild(tourBtn);

    const tourAllBtn = document.createElement('button');
    tourAllBtn.className = 'tour-btn'; tourAllBtn.id = 'tourAllBtn'; tourAllBtn.type = 'button';
    tourAllBtn.innerHTML = '▶▶ ทุกที่พัก';
    topCtl.appendChild(tourAllBtn);

    const progEl = document.createElement('div');
    progEl.className = 'tour-progress';
    app.appendChild(progEl);
    const cardEl = document.createElement('div');
    cardEl.className = 'show-card';
    app.appendChild(cardEl);

    const summaryEl = document.createElement('div');
    summaryEl.className = 'map-summary'; summaryEl.id = 'mapSummary';
    topCtl.appendChild(summaryEl);

    const chip = document.createElement('button');
    chip.className = 'clear-chip'; chip.id = 'clearChip'; chip.type = 'button';
    chip.textContent = '✕ ล้างเส้นทาง';
    topCtl.appendChild(chip);

    try {
      const cands = Array.from(app.querySelectorAll('div')).filter(el =>
        !el.closest('.sidebar, .drawer, .top-ctl, #list') &&
        /ประสานมิตร/.test(el.textContent) && /3\s*กม/.test(el.textContent) &&
        /absolute|fixed/.test(getComputedStyle(el).position));
      cands.sort((a, b) => a.textContent.length - b.textContent.length);
      if (cands[0]) cands[0].classList.add('mu-legend');
    } catch (e) {}

    /* ---- เปิด/ปิดแถบซ้าย ---- */
    function setSide(open) {
      if (open && drawer.classList.contains('open') && typeof closeDrawer === 'function') closeDrawer();
      app.classList.toggle('side-open', !!open);
      sideBtn.innerHTML = open ? '✕ ปิดรายการ' : '☰ รายการที่พัก';
    }
    sideBtn.addEventListener('click', () => { stopTour(); setSide(!app.classList.contains('side-open')); });

    if (typeof CENTER !== 'undefined' && map) {
      L.marker(CENTER, {
        icon: L.divIcon({ className: '', html: '<div class="radar-pulse-icon"><div class="radar-ring"></div></div>', iconSize: [0, 0] }),
        interactive: false
      }).addTo(map);
    }

    const head = drawer.querySelector('.drawer-head');
    if (head) {
      const nav = document.createElement('div');
      nav.className = 'dr-nav';
      nav.innerHTML = '<button type="button" id="drPrev" aria-label="ที่พักก่อนหน้า">‹</button><span id="drPos"></span><button type="button" id="drNext" aria-label="ที่พักถัดไป">›</button>';
      head.insertBefore(nav, head.firstChild);
    }
    const handle = document.createElement('div');
    handle.className = 'dr-handle';
    drawer.insertBefore(handle, drawer.firstChild);
    handle.addEventListener('click', () => {
      if (drawer.classList.contains('full')) { drawer.classList.remove('full'); drawer.classList.add('low'); }
      else if (drawer.classList.contains('low')) { drawer.classList.remove('low'); }
      else drawer.classList.add('full');
    });

    let sel = -1;
    function pinIcon(h, selected, anim, delay) {
      const near = h.distanceKm <= 3;
      return L.divIcon({
        className: '', iconSize: [0, 0], iconAnchor: [0, 0],
        html: '<div class="pp ' + (near ? 'pp-near' : 'pp-far') + (selected ? ' pp-sel' : '') + (anim ? ' pp-in' : '') + '">'
          + '<div class="pp-body"' + (anim ? ' style="animation-delay:' + (delay || 0) + 'ms"' : '') + '><span>' + typeIcon(h.type) + '</span><b>' + kLabel(h.rent) + '</b></div></div>'
      });
    }

    housing.forEach((h, i) => {
      const m = markers[i]; if (!m) return;
      if (m.unbindPopup) m.unbindPopup();
      m.setIcon(pinIcon(h, false, true, Math.min(i * 18, 700)));
      m.on('click', () => { stopTour(); showHouse(i); });
      m.bindTooltip(h.name + ' · ' + fmtN(h.rent) + ' บาท', { direction: 'top', offset: [0, -38], className: 'pin-tip' });
      m.on('mouseover', () => m.setZIndexOffset(600));
      m.on('mouseout', () => m.setZIndexOffset(i === sel ? 1000 : 0));
    });

    function setSel(i) {
      sel = i;
      syncPins(new Set(visibleOrder()));
      document.querySelectorAll('#list .card').forEach(c => c.classList.toggle('selected', Number(c.dataset.index) === i));
      if (i >= 0) setSide(false); 
    }

    function visibleOrder() {
      let items = housing.map((h, i) => ({ h, i }));
      const searchInput = $('searchInput');
      const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      if (q) items = items.filter(o => searchableText(o.h).includes(q));
      if (state.dist === 'near') items = items.filter(o => o.h.distanceKm <= 3);
      if (state.dist === 'far') items = items.filter(o => o.h.distanceKm > 3);
      if (state.type !== 'all') items = items.filter(o => o.h.type === state.type);
      const checked = Array.from(document.querySelectorAll('.amenityCheck:checked')).map(c => c.dataset.amenity);
      if (checked.length) items = items.filter(o => checked.every(a => hasAmenity(o.h, a)));
      const s = state.sort;
      if (s === 'price-asc') items.sort((a, b) => a.h.rent - b.h.rent);
      if (s === 'price-desc') items.sort((a, b) => b.h.rent - a.h.rent);
      if (s === 'dist-asc') items.sort((a, b) => a.h.distanceKm - b.h.distanceKm);
      if (s === 'rating-desc') items.sort((a, b) => avgRating(b.h) - avgRating(a.h));
      return items.map(o => o.i);
    }
    function syncPins(vis) {
      housing.forEach((h, i) => {
        const m = markers[i]; if (!m) return;
        const on = (sel >= 0) ? (i === sel) : vis.has(i);
        if (on && !map.hasLayer(m)) { m.addTo(map); m.setIcon(pinIcon(h, i === sel, true, 0)); }
        else if (!on && map.hasLayer(m)) { map.removeLayer(m); }
      });
    }
    function updateSummary(order) {
      if (!order.length) { summaryEl.innerHTML = 'ไม่พบที่พักตามเงื่อนไข'; return; }
      const hs = order.map(i => housing[i]);
      const rents = hs.map(h => numOrNull(h.rent)).filter(v => v != null);
      const dmin = Math.min.apply(null, hs.map(h => h.distanceKm));
      summaryEl.innerHTML = '<b>' + order.length + '</b> แห่ง <span>·</span> เฉลี่ย <b>' + fmtN(mean(rents)) + '</b> บาท <span>·</span> ใกล้สุด <b>' + dmin.toFixed(1) + '</b> กม.';
    }
    function tripText(h) {
      const a = h.travelTimeGo, b = h.travelTimeBack;
      const ok = v => v !== undefined && v !== null && v !== '';
      if (!ok(a) && !ok(b)) return '';
      return '🕒 ไป ' + (ok(a) ? a : '–') + ' · กลับ ' + (ok(b) ? b : '–') + ' นาที';
    }
    let lastKey = '';
    function newRender() {
      const order = visibleOrder();
      updateToolbar(order.length);
      syncPins(new Set(order));
      updateSummary(order);
      const key = order.join(',');
      const animate = key !== lastKey; lastKey = key;
      const listEl = $('list');
      if (!listEl) return;
      listEl.innerHTML = '';
      if (!order.length) {
        listEl.innerHTML = '<div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:12.5px;">ไม่พบที่พักตามเงื่อนไขที่เลือก<br>ลองปรับตัวกรองหรือคำค้นหา</div>';
        return;
      }
      order.forEach((i, k) => {
        const h = housing[i], near = h.distanceKm <= 3;
        const card = document.createElement('div');
        card.className = 'card' + (animate ? ' card-in' : '') + (i === sel ? ' selected' : '');
        card.dataset.index = i;
        if (animate) card.style.animationDelay = Math.min(k * 28, 280) + 'ms';
        const trip = tripText(h);
        card.innerHTML =
          '<div class="card-top"><span class="name">' + typeIcon(h.type) + ' ' + h.name + (h.nameTh ? '<span class="name-th">' + h.nameTh + '</span>' : '') + '</span>'
          + '<span class="radius-tag ' + (near ? '' : 'far') + '">' + h.distanceKm.toFixed(1) + ' กม.</span></div>'
          + '<div class="card-meta">' + h.type + ' · ⭐ ' + avgRating(h) + '</div>'
          + '<div class="card-price">' + h.rent.toLocaleString() + ' บาท/เดือน</div>'
          + (trip ? '<div class="card-trip">' + trip + '</div>' : '');
        card.addEventListener('click', () => { stopTour(); showHouse(i); });
        listEl.appendChild(card);
      });
    }
    window.render = newRender;

    document.querySelectorAll('.amenityCheck').forEach(cb => {
      const c = cb.cloneNode(true);
      if (cb.parentNode) cb.parentNode.replaceChild(c, cb);
      c.addEventListener('change', () => window.render());
    });

    const searchSuggest = $('searchSuggest');
    if (searchSuggest) {
      searchSuggest.addEventListener('click', e => {
        const it = e.target.closest ? e.target.closest('.sg-item') : null;
        if (!it) return;
        e.stopPropagation();
        const i = parseInt(it.dataset.index, 10);
        if (!housing[i]) return;
        const searchInput = $('searchInput');
        if (searchInput) searchInput.value = housing[i].name;
        searchSuggest.classList.remove('show');
        window.render();
        stopTour();
        showHouse(i);
      }, true);
    }

    function fitVisible() {
      const order = visibleOrder(); if (!order.length) return;
      const pts = order.map(i => [housing[i].lat, housing[i].lng]).concat([[UNI_GATE.lat, UNI_GATE.lng]]);
      map.flyToBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 15, duration: 0.9 });
      setSide(false);
    }
    const filterApply = $('filterApply');
    if (filterApply) filterApply.addEventListener('click', fitVisible);

    /* ------------------------------------------------------ เส้นทาง ไป+กลับ */
    const routeCache = new Map();
    async function roadCached(from, to, profile) {
      const key = profile + '|' + [from.lat, from.lng, to.lat, to.lng].map(v => (+v).toFixed(6)).join(',');
      if (routeCache.has(key)) return routeCache.get(key);
      const pts = await fetchRoad([from, to], profile);
      if (pts && pts.length > 2) routeCache.set(key, pts);
      return pts;
    }

    async function buildDirection(h, dir) {
      const spans = buildSpans(h, dir);
      const segs = [], stops = [];
      for (let si = 0; si < spans.length; si++) {
        const span = spans[si];
        let pts;
        if (span.rail) {
          pts = smoothLine(stationSequence(span.rail.line, span.rail.a, span.rail.b).map(w => [w.lat, w.lng]), 2);
        } else if (span.bus) {
          pts = await roadCached(span.from, span.to, 'car');
        } else {
          const rideMode = span.steps.find(s => s !== 'เดิน');
          pts = await roadCached(span.from, span.to, profileFor(rideMode || 'เดิน'));
        }
        const parts = splitByModes(pts, span.steps);
        span.steps.forEach((mode, k) => { if (parts[k] && parts[k].length >= 2) segs.push({ mode, pts: parts[k] }); });
        const c0 = tStyle(span.steps[0]).color;
        if (si > 0) stops.push({ kind: 'dot', pt: span.from, color: c0 });
        if (si < spans.length - 1) stops.push({ kind: 'dot', pt: span.to, color: c0 });
        if (span.rail || span.bus) {
          const st = tStyle(span.rail ? span.rail.line : 'รถโดยสารประจำทาง');
          stops.push({ kind: 'station', pt: span.from, st });
          stops.push({ kind: 'station', pt: span.to, st });
        }
      }
      return { segs, stops };
    }

    const pathLen = pts => { let t = 0; for (let i = 1; i < pts.length; i++) t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return t; };
    function pointAt(pts, f) {
      const cum = [0];
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const total = cum[cum.length - 1] || 1, target = f * total;
      let k = 1; while (k < cum.length - 1 && cum[k] < target) k++;
      const seg = (cum[k] - cum[k - 1]) || 1, u = Math.min(1, Math.max(0, (target - cum[k - 1]) / seg));
      return [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * u, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * u];
    }

    let journeyToken = 0, J = null, focus = 'both';

    function growLine(line, pts, ms, token) {
      return new Promise(resolve => {
        const cum = [0];
        for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        const total = cum[cum.length - 1] || 1, t0 = performance.now();
        function step(now) {
          if (token !== journeyToken) return resolve();
          const t = Math.min(1, (now - t0) / ms);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const target = e * total;
          let k = 1; while (k < cum.length - 1 && cum[k] < target) k++;
          const seg = (cum[k] - cum[k - 1]) || 1, f = Math.min(1, Math.max(0, (target - cum[k - 1]) / seg));
          const hd = [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * f, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * f];
          line.setLatLngs(pts.slice(0, k).concat([hd]));
          if (t < 1) requestAnimationFrame(step); else { line.setLatLngs(pts); resolve(); }
        }
        requestAnimationFrame(step);
      });
    }

    const isShown = dir => focus === 'both' || focus === dir;

    function makeStopMarker(s) {
      if (s.kind === 'station') {
        return L.marker([s.pt.lat, s.pt.lng], { icon: L.divIcon({ className: '', iconSize: [20, 20],
          html: '<div class="station-dot" style="border-color:' + s.st.color + ';color:' + s.st.color + '">' + s.st.icon + '</div>' }) })
          .bindTooltip(s.pt.label, { permanent: false });
      }
      return L.marker([s.pt.lat, s.pt.lng], { icon: L.divIcon({ className: '', iconSize: [11, 11],
        html: '<div class="waypoint-dot" style="border-color:' + s.color + '"></div>' }) })
        .bindTooltip(s.pt.label, { permanent: false });
    }
    function makeDirLabel(dir, segs) {
      const all = []; segs.forEach(s => s.pts.forEach(p => all.push(p)));
      if (all.length < 2) return null;
      return L.marker(pointAt(all, dir === 'to' ? 0.3 : 0.7), { interactive: false, keyboard: false,
        icon: L.divIcon({ className: '', iconSize: [0, 0], html: '<div class="dir-chip ' + dir + '">' + (dir === 'to' ? 'ไป ➜' : '⬅ กลับ') + '</div>' }) });
    }

    async function playDirection(dir, data, token) {
      const segs = data.segs; if (!segs.length) return;
      const outer = dir === 'to';
      const lens = segs.map(s => pathLen(s.pts)), total = lens.reduce((a, b) => a + b, 0) || 1;
      const lines = segs.map(seg => {
        const st = tStyle(seg.mode), walk = seg.mode === 'เดิน';
        const line = L.polyline([seg.pts[0], seg.pts[0]], {
          color: st.color, weight: outer ? 7 : 3.5, opacity: outer ? 0.55 : 1,
          lineCap: 'round', lineJoin: 'round', dashArray: walk ? (outer ? '1 12' : '1 8') : null,
          className: 'flow-line', interactive: false });
        J[dir].layers.push(line);
        if (isShown(dir)) line.addTo(map);
        return line;
      });
      for (let k = 0; k < segs.length; k++) {
        if (token !== journeyToken) return;
        await growLine(lines[k], segs[k].pts, Math.max(280, 1900 * lens[k] / total), token);
      }
      if (token !== journeyToken) return;
      data.stops.forEach(s => { const mk = makeStopMarker(s); J[dir].layers.push(mk); if (isShown(dir)) mk.addTo(map); });
      const lab = makeDirLabel(dir, segs);
      if (lab) { J[dir].layers.push(lab); if (isShown(dir)) lab.addTo(map); }
    }

    function clearJourneyLayers() {
      if (!J) return;
      ['to', 'back'].forEach(d => J[d].layers.forEach(l => { if (map.hasLayer(l)) map.removeLayer(l); }));
      if (J.gate && map.hasLayer(J.gate)) map.removeLayer(J.gate);
      J = null;
    }
    function flyToJourney(h) {
      const pts = [[h.lat, h.lng], [UNI_GATE.lat, UNI_GATE.lng]];
      ['to', 'back'].forEach(d => buildSpans(h, d).forEach(s => { pts.push([s.from.lat, s.from.lng], [s.to.lat, s.to.lng]); }));
      const size = map.getSize();
      let tl, br;
      if (isMobile()) { tl = [30, 70]; br = [30, Math.min(Math.round(size.y * 0.62) + 12, Math.max(size.y - 120, 40))]; }
      else { tl = [40, 70]; br = [Math.min(500, Math.round(size.x * 0.55)), 60]; }
      map.flyToBounds(L.latLngBounds(pts), { paddingTopLeft: tl, paddingBottomRight: br, maxZoom: 16, duration: 1.0 });
    }
    async function drawJourney(h) {
      const token = ++journeyToken;
      clearJourneyLayers();
      const t0 = performance.now();
      let dTo, dBack;
      try { const r = await Promise.all([buildDirection(h, 'to'), buildDirection(h, 'back')]); dTo = r[0]; dBack = r[1]; }
      catch (err) { console.warn('[map-upgrade] สร้างเส้นทางไม่สำเร็จ', err); return; }
      if (token !== journeyToken) return;
      const wait = Math.max(0, 950 - (performance.now() - t0));
      if (wait) await new Promise(r => setTimeout(r, wait));
      if (token !== journeyToken) return;
      J = { token, to: { layers: [] }, back: { layers: [] }, gate: null };
      J.gate = L.marker([UNI_GATE.lat, UNI_GATE.lng], { interactive: false, keyboard: false,
        icon: L.divIcon({ className: '', iconSize: [0, 0], html: '<div class="gate-chip">🎓 มศว</div>' }) }).addTo(map);
      updateJCards();
      await Promise.all([playDirection('to', dTo, token), playDirection('back', dBack, token)]);
      if (token === journeyToken) updateChip();
    }

    function setFocus(f) {
      focus = f;
      if (J) {
        ['to', 'back'].forEach(d => {
          const show = isShown(d);
          J[d].layers.forEach(l => { if (show) { if (!map.hasLayer(l)) l.addTo(map); } else if (map.hasLayer(l)) map.removeLayer(l); });
        });
      }
      updateJCards();
    }
    const toggleFocus = dir => setFocus(focus === dir ? 'both' : dir);
    function updateJCards() {
      document.querySelectorAll('#dBody .jcard').forEach(c => {
        const d = c.dataset.dir;
        c.classList.toggle('on', focus === d);
        c.classList.toggle('dim', focus !== 'both' && focus !== d);
      });
    }
    function updateChip() { chip.classList.toggle('show', !!J && !drawer.classList.contains('open')); }
    new MutationObserver(() => {
      app.classList.toggle('dr-open', drawer.classList.contains('open'));
      updateChip();
    }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
    chip.addEventListener('click', () => { journeyToken++; clearJourneyLayers(); setSel(-1); updateChip(); stopTour(); });

    const RK = [['location', 'ทำเลที่ตั้ง'], ['cleanliness', 'ความสะอาด'], ['safety', 'ความปลอดภัย'], ['service', 'การบริการ'],
                ['facilities', 'สิ่งอำนวยความสะดวก'], ['parking', 'ที่จอดรถ'], ['value', 'ความคุ้มค่ากับราคา']];
    let avgR = null;
    function avgRatings() {
      if (!avgR) avgR = RK.map(r => mean(housing.map(x => x.ratings && x.ratings[r[0]]).filter(v => typeof v === 'number')) || 0);
      return avgR;
    }
    function tripVal(v, unit, isCost) {
      if (v === undefined || v === null || v === '') return 'ไม่มีข้อมูล';
      const n = Number(v);
      return (Number.isFinite(n) ? (isCost ? n.toLocaleString('en-US') : String(n)) : String(v)) + ' ' + unit;
    }
    function statRowHTML(h) {
      const size = numOrNull(h.roomSize), psm = (size && h.rent) ? Math.round(h.rent / size) : null;
      const t = (v, l) => '<div class="stat-tile"><b>' + v + '</b><span>' + l + '</span></div>';
      return '<div class="stat-row">'
        + t(h.distanceKm.toFixed(1) + ' กม.', 'ห่างจาก มศว') + t(size ? size + ' ตร.ม.' : '—', 'ขนาดห้อง')
        + t(h.floor ? 'ชั้น ' + h.floor : '—', 'ชั้นที่พัก') + t(psm ? fmtN(psm) : '—', 'บาท/ตร.ม.') + '</div>';
    }
    function jcardHTML(h, dir) {
      const t = dir === 'to' ? h.travelTimeGo : h.travelTimeBack, c = dir === 'to' ? h.travelCostGo : h.travelCostBack;
      return '<div class="jcard" data-dir="' + dir + '"><div class="jc-top"><b>' + (dir === 'to' ? '➜ ขาไป มศว' : '⬅ ขากลับที่พัก') + '</b><span class="jc-line ' + dir + '"></span></div>'
        + routeChipsHTML(h, dir)
        + '<div class="jc-stats"><div><i>🕒</i>' + tripVal(t, 'นาที', false) + '</div><div><i>💸</i>' + tripVal(c, 'บาท', true) + '</div></div></div>';
    }
    function journeyBlockHTML(h) {
      return '<div class="blk"><h4>🚏 เส้นทางไป–กลับ แสดงบนแผนที่พร้อมกัน</h4><div class="jwrap">' + jcardHTML(h, 'to') + jcardHTML(h, 'back') + '</div>'
        + '<div class="jnote">เส้นหนา = ขาไป · เส้นบาง = ขากลับ · แตะการ์ดเพื่อดูเฉพาะทิศทางนั้น แตะอีกครั้งเพื่อกลับมาดูทั้งคู่</div></div>';
    }
    function ratingBlockHTML(h) {
      if (!h.ratings) return '';
      const av = avgRatings();
      const rows = RK.map((r, idx) => {
        const v = h.ratings[r[0]]; if (typeof v !== 'number') return '';
        return '<div class="rb"><span>' + r[1] + '</span><div class="rb-t"><div class="rb-f" data-w="' + (v / 5 * 100) + '"></div><i class="rb-avg" style="left:' + (av[idx] / 5 * 100) + '%"></i></div><b class="rb-v">' + v + '</b></div>';
      }).join('');
      return '<div class="blk"><h4>⭐ คะแนนรีวิว (เฉลี่ย ' + avgRating(h) + ') <small style="font-weight:500;color:var(--muted)">· เส้นทอง = ค่าเฉลี่ยทุกที่พัก</small></h4>' + rows + '</div>';
    }
    function cmpHTML(h) {
      const same = housing.filter(x => x.type === h.type).map(x => numOrNull(x.rent)).filter(v => v != null);
      if (same.length < 2 || !h.rent) return '';
      const avg = mean(same), d = (h.rent - avg) / avg * 100;
      const txt = Math.abs(d) < 3 ? 'ใกล้เคียงค่าเฉลี่ย' + h.type : (d < 0 ? 'ถูกกว่า ' : 'แพงกว่า ') + Math.abs(Math.round(d)) + '% เมื่อเทียบกับค่าเฉลี่ย' + h.type;
      return '<div class="cmp">' + txt + ' (เฉลี่ย ' + fmtN(avg) + ' บาท)</div>';
    }
    let cuId = 0;
    function countUp(el, to) {
      if (!el) return;
      const id = ++cuId, t0 = performance.now();
      function step(now) {
        if (id !== cuId) return;
        const t = Math.min(1, (now - t0) / 800), e = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(to * e).toLocaleString('en-US');
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const origOpenDrawer = window.openDrawer;
    window.openDrawer = function (i) {
      if (typeof origOpenDrawer === 'function') origOpenDrawer(i);
      const h = housing[i];
      const overlay = $('overlay');
      if (overlay) overlay.classList.remove('open');
      drawer.classList.remove('full', 'low');
      const body = $('dBody');
      if (!body) return;
      body.querySelectorAll('details.section').forEach(d => { if (d.querySelector('#routeTabTo') || d.querySelector('.stars-row')) d.remove(); });
      const html = statRowHTML(h) + journeyBlockHTML(h) + ratingBlockHTML(h);
      const first = body.firstElementChild;
      if (first) first.insertAdjacentHTML('afterend', html); else body.insertAdjacentHTML('afterbegin', html);
      if (pendingFlag && body.firstElementChild) {
        body.firstElementChild.insertAdjacentHTML('afterend', '<div class="tour-flag">' + pendingFlag + '</div>');
        pendingFlag = '';
      }
      body.querySelectorAll('.jcard').forEach(c => c.addEventListener('click', () => toggleFocus(c.dataset.dir)));
      updateJCards();
      requestAnimationFrame(() => requestAnimationFrame(() => body.querySelectorAll('.rb-f').forEach(el => { el.style.width = el.dataset.w + '%'; })));
      body.scrollTop = 0;
      drawer.scrollTop = 0;
      const strip = drawer.querySelector('.drawer-price');
      if (strip) {
        strip.querySelectorAll('.cmp').forEach(n => n.remove());
        strip.insertAdjacentHTML('beforeend', cmpHTML(h));
      }
      countUp($('dRent'), numOrNull(h.rent) || 0);
      const order = visibleOrder(), pos = order.indexOf(i);
      const drPos = $('drPos');
      if (drPos) drPos.textContent = pos >= 0 ? (pos + 1) + '/' + order.length : '';
    };

    const IDLE_MS = 20000;
    let tourTimer = null, isTouring = false, tourRun = 0, scrollToken = 0;
    let pendingFlag = '', pausedByUser = false, idleTimer = null;

    function getScroller() {
      const body = $('dBody');
      const can = el => el && el.scrollHeight - el.clientHeight > 4 && /(auto|scroll)/.test(getComputedStyle(el).overflowY);
      return can(body) ? body : (can(drawer) ? drawer : body);
    }
    function cancelAutoScroll() { scrollToken++; }
    function autoScrollDrawer() {
      const token = ++scrollToken;
      const el = getScroller();
      return new Promise(resolve => {
        if (!el) return resolve();
        el.scrollTop = 0;

        const maxScroll = el.scrollHeight - el.clientHeight;
        const blks = $('dBody') ? $('dBody').querySelectorAll('.blk') : [];
        const last = blks.length ? blks[blks.length - 1] : null;
        let dist = maxScroll;
        if (last) {
          const want = el.scrollTop + (last.getBoundingClientRect().bottom - el.getBoundingClientRect().top) - el.clientHeight + 16;
          dist = Math.max(0, Math.min(maxScroll, want));
        }
        if (dist <= 4) return resolve();
        const ms = Math.min(9000, Math.max(2500, dist * 12));
        const t0 = performance.now();
        function step(now) {
          if (token !== scrollToken) return resolve();
          const t = Math.min(1, (now - t0) / ms);
          el.scrollTop = dist * t;
          if (t < 1) requestAnimationFrame(step); else resolve();
        }
        requestAnimationFrame(step);
      });
    }
    const tourWait = ms => new Promise(r => { tourTimer = setTimeout(r, ms); });

    const setProgress = f => { progEl.style.width = Math.round(Math.max(0, Math.min(1, f)) * 100) + '%'; };
    function showCard(html) { cardEl.innerHTML = '<div class="sc-box">' + html + '</div>'; requestAnimationFrame(() => cardEl.classList.add('on')); }
    function hideCard() { cardEl.classList.remove('on'); }

    const rentOf = h => numOrNull(h.rent) || 0;
    const ratingOf = h => Number(avgRating(h)) || 0;
    const sc = (b, small) => '<div class="sc-item"><b>' + b + '</b><small>' + small + '</small></div>';

    function highlightPicks() {
      const hs = visibleOrder().map(i => ({ i, h: housing[i] }));
      if (!hs.length) return [];
      const tGo = o => numOrNull(o.h.travelTimeGo);
      const sz = o => numOrNull(o.h.roomSize);
      const cats = [
        ['📍 ใกล้ มศว ที่สุด', () => true, (a, b) => a.h.distanceKm - b.h.distanceKm, o => 'ห่างเพียง ' + o.h.distanceKm.toFixed(1) + ' กม.'],
        ['💰 ค่าเช่าถูกที่สุด', o => rentOf(o.h) > 0, (a, b) => rentOf(a.h) - rentOf(b.h), o => fmtN(rentOf(o.h)) + ' บาท/เดือน'],
        ['⭐ รีวิวดีที่สุด', () => true, (a, b) => ratingOf(b.h) - ratingOf(a.h), o => 'คะแนนเฉลี่ย ' + ratingOf(o.h)],
        ['⚡ เดินทางไป มศว เร็วที่สุด', o => tGo(o) != null, (a, b) => tGo(a) - tGo(b), o => tGo(o) + ' นาที'],
        ['📐 ห้องใหญ่ที่สุด', o => sz(o) != null, (a, b) => sz(b) - sz(a), o => sz(o) + ' ตร.ม.'],
        ['💎 ค่าเช่าสูงที่สุด', () => true, (a, b) => rentOf(b.h) - rentOf(a.h), o => fmtN(rentOf(o.h)) + ' บาท/เดือน'],
        ['🛣️ ไกลที่สุด', () => true, (a, b) => b.h.distanceKm - a.h.distanceKm, o => o.h.distanceKm.toFixed(1) + ' กม.']
      ];
      const used = new Set(), out = [];
      cats.forEach(c => {
        const pick = hs.filter(c[1]).filter(o => !used.has(o.i)).sort(c[2])[0];
        if (pick) { used.add(pick.i); out.push({ i: pick.i, flag: c[0] + ' · ' + c[3](pick) }); }
      });
      return out;
    }
    const allPicks = () => visibleOrder().slice().sort((a, b) => housing[a].distanceKm - housing[b].distanceKm).map(i => ({ i, flag: '' }));

    function introHTML(mode) {
      const hs = visibleOrder().map(i => housing[i]);
      const rents = hs.map(rentOf).filter(v => v > 0);
      const minD = Math.min.apply(null, hs.map(h => h.distanceKm));
      return '<h3>🎓 ผลสำรวจที่พักรอบ มศว ประสานมิตร</h3>'
        + '<p>' + (mode === 'all' ? 'พาชมทุกที่พัก จากใกล้ไปไกล' : 'พาชมที่พักไฮไลต์ที่น่าสนใจ') + '</p>'
        + '<div class="sc-grid">' + sc(hs.length + ' แห่ง', 'ที่พักทั้งหมดที่สำรวจ') + sc(fmtN(mean(rents) || 0) + ' บาท', 'ค่าเช่าเฉลี่ย')
        + sc(minD.toFixed(1) + ' กม.', 'ใกล้ มศว ที่สุด') + sc(fmtN(Math.min.apply(null, rents)) + ' บาท', 'ถูกที่สุด') + '</div>';
    }
    function finaleHTML() {
      const hs = visibleOrder().map(i => housing[i]);
      if (!hs.length) return '';
      const withRent = hs.filter(h => rentOf(h) > 0);
      const cheap = withRent.slice().sort((a, b) => rentOf(a) - rentOf(b))[0];
      const near = hs.slice().sort((a, b) => a.distanceKm - b.distanceKm)[0];
      const best = hs.slice().sort((a, b) => ratingOf(b) - ratingOf(a))[0];
      const groups = {};
      hs.forEach(h => { (groups[h.type] = groups[h.type] || []).push(rentOf(h)); });
      const types = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length).slice(0, 4);
      let items = '';
      if (cheap) items += sc('💰 ' + fmtN(rentOf(cheap)) + ' บาท', 'ถูกสุด: ' + cheap.name);
      if (near) items += sc('📍 ' + near.distanceKm.toFixed(1) + ' กม.', 'ใกล้สุด: ' + near.name);
      if (best) items += sc('⭐ ' + ratingOf(best), 'รีวิวดีสุด: ' + best.name);
      items += sc('🏠 ' + hs.length + ' แห่ง', 'เฉลี่ย ' + fmtN(mean(withRent.map(rentOf)) || 0) + ' บาท');
      types.forEach(t => { const g = groups[t].filter(v => v > 0); items += sc(t, g.length + ' แห่ง · เฉลี่ย ' + fmtN(mean(g) || 0) + ' บาท'); });
      return '<h3>📊 สรุปผลสำรวจ</h3><p>ข้อมูลภาพรวมของที่พักรอบ มศว ประสานมิตร</p><div class="sc-grid">' + items + '</div>';
    }

    function overview() {
      journeyToken++; clearJourneyLayers();
      if (drawer.classList.contains('open') && typeof closeDrawer === 'function') closeDrawer(); else setSel(-1);
      updateChip();
      const order = visibleOrder();
      const pts = order.map(i => [housing[i].lat, housing[i].lng]).concat([[UNI_GATE.lat, UNI_GATE.lng]]);
      map.flyToBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 15, duration: 2.2 });
    }
    async function runTour(mode) {
      const run = ++tourRun;
      const alive = () => isTouring && run === tourRun;
      while (alive()) {
        const list = mode === 'all' ? allPicks() : highlightPicks();
        if (!list.length) { stopTour(); return; }
        overview(); showCard(introHTML(mode)); setProgress(0);
        await tourWait(4200); if (!alive()) return;
        hideCard();
        await tourWait(600); if (!alive()) return;
        for (let k = 0; k < list.length; k++) {
          if (!alive()) return;
          setProgress(k / list.length);
          pendingFlag = list[k].flag;
          showHouse(list[k].i);
          await tourWait(2200); if (!alive()) return;
          await autoScrollDrawer(); if (!alive()) return;
          await tourWait(1800); if (!alive()) return;
        }
        setProgress(1);
        overview(); showCard(finaleHTML());
        await tourWait(10000); if (!alive()) return;
        hideCard();
        await tourWait(900);
      }
    }

    function startTour(mode) {
      if (isTouring) return;
      if (!visibleOrder().length) return;
      mode = mode === 'all' ? 'all' : 'hi';
      isTouring = true; pausedByUser = false;
      clearTimeout(idleTimer);
      setSide(false);
      app.classList.add('touring');
      const act = mode === 'all' ? tourAllBtn : tourBtn, other = mode === 'all' ? tourBtn : tourAllBtn;
      act.classList.add('active'); act.innerHTML = '⏸ หยุดนำเสนอ';
      other.classList.add('hidden');
      runTour(mode);
    }

    function stopTour() {
      cancelAutoScroll();
      if (!isTouring) return;
      isTouring = false; tourRun++;
      if (tourTimer) clearTimeout(tourTimer);
      pendingFlag = '';
      hideCard(); setProgress(0);
      app.classList.remove('touring');
      tourBtn.classList.remove('active', 'hidden'); tourBtn.innerHTML = '▶ ไฮไลต์';
      tourAllBtn.classList.remove('active', 'hidden'); tourAllBtn.innerHTML = '▶▶ ทุกที่พัก';
      resetIdle();
    }

    function resetIdle() {
      clearTimeout(idleTimer);
      if (!IDLE_MS || isTouring || pausedByUser) return;
      idleTimer = setTimeout(() => {
        if (isTouring) return;
        if (app.classList.contains('side-open') || document.hidden) return resetIdle();
        startTour('hi');
      }, IDLE_MS);
    }
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(ev => document.addEventListener(ev, resetIdle, { passive: true }));

    ['touchstart', 'wheel', 'mousedown'].forEach(ev =>
      drawer.addEventListener(ev, () => { if (isTouring) stopTour(); else cancelAutoScroll(); }, { passive: true }));

    tourBtn.addEventListener('click', () => { if (isTouring) { pausedByUser = true; stopTour(); } else startTour('hi'); });
    tourAllBtn.addEventListener('click', () => { if (isTouring) { pausedByUser = true; stopTour(); } else startTour('all'); });

    function showHouse(i) {
      const h = housing[i]; if (!h) return;
      cancelAutoScroll();
      setSel(i);
      focus = 'both';
      window.openDrawer(i);
      flyToJourney(h);
      drawJourney(h);
    }
    function stepHouse(d) {
      const order = visibleOrder(); if (!order.length) return;
      let pos = order.indexOf(sel);
      pos = pos < 0 ? (d > 0 ? 0 : order.length - 1) : (pos + d + order.length) % order.length;
      showHouse(order[pos]);
    }

    const drPrev = $('drPrev');
    const drNext = $('drNext');
    if (drPrev) drPrev.addEventListener('click', () => { stopTour(); stepHouse(-1); });
    if (drNext) drNext.addEventListener('click', () => { stopTour(); stepHouse(1); });

    document.addEventListener('keydown', e => {
      if (!drawer.classList.contains('open')) return;
      const tag = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === 'ArrowRight') { stopTour(); stepHouse(1); }
      else if (e.key === 'ArrowLeft') { stopTour(); stepHouse(-1); }
      else if (e.key === 'Escape') { stopTour(); closeDrawer(); }
    });

    const origCloseDrawer = window.closeDrawer;
    if (typeof origCloseDrawer === 'function') {
      window.closeDrawer = function () {
        origCloseDrawer();
        setSel(-1);
      };
    }

    map.on('click', () => {
      if (app.classList.contains('side-open')) setSide(false);
      if (drawer.classList.contains('open')) { stopTour(); closeDrawer(); }
    });

    window.mapUpgrade = { show: showHouse, order: visibleOrder, clear: () => chip.click(), startTour, stopTour, openList: () => setSide(true), closeList: () => setSide(false) };
    window.render();
    setTimeout(fixSize, 300);
    if (/[?&]autoplay/.test(location.search)) setTimeout(() => startTour('hi'), 2000); // เปิดลิงก์ ...?autoplay=1 -> เริ่มเองทันที
    else resetIdle();
  }

  function boot() {
    try { init(); }
    catch (err) { console.error('[map-upgrade] error', err); }
    finally { reveal(); }
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
