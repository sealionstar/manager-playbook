/* Manager Playbook · v3 (AM + เครื่องมือ BM + ประเมิน BM) */
(function () {
  'use strict';

  /* ---------------- data ---------------- */
  var BRANCHES = [
    ['206', 'Studio 7-Central-Phuket', 'APP', 'ภูเก็ต'], ['256', 'Studio 7-Lotus-Samui', 'AAR', 'เกาะสมุย'],
    ['310', 'Studio 7-Central-Samui', 'AAR', 'เกาะสมุย'], ['313', 'Studio 7-Jungceylon-Phuket', 'AAR', 'ภูเก็ต'],
    ['329', 'Studio 7-Central-Suratthani', 'APR', 'สุราษฎร์ธานี'], ['340', 'Studio 7-Lotus-Krabi', 'AAR Tier1', 'กระบี่'],
    ['341', 'Studio 7-Lotus-Phuket', 'AAR Tier1', 'ภูเก็ต'], ['1106', 'Studio 7-Robinson-Thalang-Phuket', 'AAR Tier1', 'ภูเก็ต'],
    ['1113', 'Studio 7-Big C-Suratthani', 'AAR', 'สุราษฎร์ธานี'], ['1785', 'Studio 7-Lotus-Mueang-Chumphon', 'AAR', 'ชุมพร'],
    ['2744', 'Studio7-Lotus-Thalang', 'AAR', 'ภูเก็ต'], ['2909', 'Studio7-Big C-Phuket', 'AAR', 'ภูเก็ต'],
    ['2925', 'Studio7-Lotus-Langsuan', 'AAR', 'ชุมพร'], ['2935', 'Studio7-Big C-Phang Nga', 'AAR', 'พังงา'],
    ['3025', 'Studio7-Lotus Chalong', 'AAR', 'ภูเก็ต'], ['3147', 'Studio7-Takuapa Square-Phangnga', 'AAR', 'พังงา'],
    ['3109', 'Studio7-Sahathai-Suratthani', 'AAR', 'สุราษฎร์ธานี']
  ].map(function (b) { return { code: b[0], name: b[1], channel: b[2], prov: b[3] }; });

  var SECTIONS = [
    { id: 'store', name: 'Store', hint: 'ร้านและบรรยากาศ · เดินดูรอบร้าน', items: [
      'หน้าร้านและพื้นร้านสะอาด ไฟสว่างครบทุกจุด',
      'เคาน์เตอร์และพื้นที่รับลูกค้าเป็นระเบียบ ไม่มีของวางเกะกะ',
      'เครื่องโชว์เปิดใช้งานได้ แบตพร้อม Demo',
      'Wall ทุกวอลจัดเป็นระเบียบ',
      'อุปกรณ์ Security ติดครบทุกเครื่อง',
      'ความสะอาดในร้านระหว่างวัน'
    ] },
    { id: 'merch', name: 'Merchandise', hint: 'สินค้าและการจัดวาง · ตรวจตามแปลนร้าน', items: [
      'สินค้าโชว์ครบและวางตามแปลน (Planogram)',
      'ป้ายราคาตรงกับสินค้า และเป็นราคาปัจจุบัน',
      'สื่อโปรโมชั่น (POP) ติดตั้งถูกต้อง ไม่หมดอายุ',
      'อุปกรณ์เสริม (ACC) จัดวางครบ เติมของแล้ว',
      'รุ่นขายดีมีสต็อกพร้อมขาย',
      'สินค้าและเครื่องโชว์ไม่มีฝุ่น รอยนิ้วมือ หรือรอยขีดข่วน'
    ] },
    { id: 'staff', name: 'Staff', hint: 'พนักงาน · สังเกตตอนให้บริการลูกค้าจริง', items: [
      'แต่งกายตามระเบียบ ติดป้ายชื่อ',
      'ทักทายลูกค้าทันทีที่เข้าร้าน',
      'Engagement · ยิ้มแย้ม สบตา และให้ความสนใจลูกค้าตลอดการสนทนา',
      'Engagement · เรียกชื่อลูกค้า พูดคุยเรื่องการใช้งานของลูกค้า ไม่เน้นขายอย่างเดียว',
      'ถามครบ 4 ข้อ (Who / Which / Use for / Pain point)',
      'แนะนำรุ่นตรงกับการใช้งาน',
      'Demo สินค้าให้ลูกค้าลองใช้จริง',
      'เสนอคู่ Cover+ (ไม่ได้ซื้อ iPhone ให้เลือกผ่าน)',
      'เสนอ ACC (อุปกรณ์เสริม)',
      'เสนอ Ufund / Trade-in',
      'แจ้งโปรโมชันสินค้าและสิทธิประโยชน์ (รวมส่วนลดนักศึกษา)',
      'เสนอส่วนลดเปิดเบอร์ SIM true',
      'ตอบข้อโต้แย้งและปิดการขาย',
      'ชวนสมัคร 7Club+ (เป็นสมาชิกแล้วให้เลือกผ่าน)',
      'ชวนลูกค้าทำแบบประเมินความพึงพอใจในการรับบริการ',
      'Engagement · ขอบคุณและส่งลูกค้าออกจากร้าน เชิญกลับมาใช้บริการ'
    ] }
  ];
  var POSITIONS = ['PIA', 'Demo Presenter', 'Trainer'];
  var PASS_LINE = 80;

  /* ---------------- utils ---------------- */
  var app = document.getElementById('app');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(sel) { return app.querySelector(sel); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function branch(code) { return BRANCHES.filter(function (b) { return b.code === String(code); })[0]; }
  function pctColor(p) { return p == null || p === '' ? '' : (Number(p) >= PASS_LINE ? 'good' : 'bad'); }
  function fmtDate(iso) { if (!iso) return '–'; var d = new Date(iso); if (isNaN(d)) return String(iso); return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }); }
  function nowParts() { var d = new Date(); return { date: d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }), time: d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), iso: d.toISOString() }; }
  function toast(msg) { var t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 2600); }
  var ICON = {
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    out: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
    check: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/></svg>',
    pen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    cam: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>'
  };

  /* ---------------- API ---------------- */
  function apiUrl() { return window.MP_API || store('mp_api') || ''; }
  function api(params, post) {
    var url = apiUrl();
    if (!url) return Promise.reject(new Error('ยังไม่ได้ตั้งค่า API'));
    var req;
    if (post) {
      req = fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(params), redirect: 'follow' });
    } else {
      var q = Object.keys(params).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
      req = fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + q, { redirect: 'follow', cache: 'no-store' });
    }
    return req.then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.ok === false) throw new Error((j && j.error) || 'เกิดข้อผิดพลาด');
      // เดือนที่ประเมิน: Google Sheet อาจแปลง "2026-11" เป็นวันที่ → แปลงกลับเป็น ปี-เดือน
      if (j.evals) j.evals.forEach(function (e) {
        var v = String(e.period || '');
        if (v && !/^\d{4}-\d{2}$/.test(v)) { var d = new Date(v); if (!isNaN(d)) e.period = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
      });
      return j;
    });
  }

  /* ---------------- session / routing ---------------- */
  function user() { return store('mp_user'); }
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  window.addEventListener('hashchange', render);

  var timers = [];
  function clearTimers() { timers.forEach(clearInterval); timers = []; }

  function render() {
    clearTimers();
    window.scrollTo(0, 0);
    if (!apiUrl()) return viewSetup();
    var u = user();
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/');
    if (!u) return viewLogin();
    if (parts[0] === 'audit' && parts[1] === 'new' && u.role === 'ASM') return viewAuditForm();
    if (parts[0] === 'audit' && parts[1]) return viewAuditDetail(parts[1]);
    if (parts[0] === 'branch' && parts[1]) return viewBranch(parts[1]);
    if (parts[0] === 'results' && u.role === 'ASM') return viewResults();
    if (parts[0] === 'bmeval' && parts[1] === 'new' && u.role === 'ASM') return viewBmEvalForm();
    if (parts[0] === 'bmeval' && parts[1]) return viewBmEvalDetail(parts[1]);
    if (parts[0] === 'bmeval' && u.role === 'ASM') return viewBmEvalList();
    if (parts[0] === 'bm' && u.role !== 'ASM') {
      if (parts[1] === 'score') return viewBmScore(parts[2]);
      if (parts[1] === 'demo') return viewBmDemo();
      if (parts[1] === 'roleplay') return viewBmRoleplay();
      if (parts[1] === 'objection' || parts[1] === 'democards') return viewCards(parts[1]);
    }
    if (u.role === 'ASM') return viewAmHome();
    return viewBmHome();
  }

  /* ---------------- setup ---------------- */
  function viewSetup() {
    app.innerHTML =
      '<div class="wrap narrow"><div class="stack">' +
      '<h1 class="h1">ตั้งค่าครั้งแรก</h1>' +
      '<p class="muted">วาง URL ของ Apps Script Web App (ลงท้ายด้วย /exec) ระบบจะจำไว้ในเครื่องนี้</p>' +
      '<div class="field"><label for="u">API URL</label><input id="u" class="input" type="url" inputmode="url" autocomplete="off" placeholder="https://script.google.com/macros/s/.../exec"></div>' +
      '<div id="err" class="alert" hidden></div>' +
      '<button id="save" class="btn">ทดสอบและบันทึก</button></div></div>';
    $('#save').onclick = function () {
      var v = $('#u').value.trim();
      if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(v)) { $('#err').hidden = false; $('#err').textContent = 'URL ต้องขึ้นต้นด้วย https://script.google.com และลงท้ายด้วย /exec'; return; }
      store('mp_api', v);
      api({ action: 'ping' }).then(function () { toast('เชื่อมต่อสำเร็จ'); render(); })
        .catch(function (e) { store('mp_api', null); $('#err').hidden = false; $('#err').textContent = 'เชื่อมต่อไม่ได้: ' + e.message; });
    };
  }

  /* ---------------- login ---------------- */
  function viewLogin() {
    app.innerHTML =
      '<div class="login-hero"><div style="max-width:440px;margin:0 auto">' +
      '<div class="logo">' + ICON.check + '</div>' +
      '<div style="font-size:30px;font-weight:700;line-height:1.2">Manager Playbook</div>' +
      '<div style="color:#8FB2FF;font-size:14px;margin-top:4px">คู่มือโค้ช BM และทีมขาย</div></div></div>' +
      '<div class="login-body"><form class="inner" id="f" novalidate>' +
      '<div class="field"><label for="id">รหัสพนักงาน</label><input id="id" class="input" inputmode="numeric" autocomplete="username" required></div>' +
      '<div class="field"><label for="pw">รหัสผ่าน</label><input id="pw" class="input" type="password" autocomplete="current-password" autocapitalize="characters" required>' +
      '<span class="small muted">ใช้ชื่อตำแหน่ง: ASM, BM หรือ ABM</span></div>' +
      '<div id="err" class="alert" role="alert" hidden></div>' +
      '<button class="btn" id="go" type="submit">เข้าสู่ระบบ</button>' +
      '<p class="small muted" style="margin:0">ASM เห็นทั้ง 17 สาขา · BM / ABM เห็นเฉพาะสาขาตัวเอง</p>' +
      '</form></div>';
    $('#f').onsubmit = function (ev) {
      ev.preventDefault();
      var id = $('#id').value.trim(), pw = $('#pw').value.trim();
      if (!id || !pw) { $('#err').hidden = false; $('#err').textContent = 'กรอกรหัสพนักงานและรหัสผ่าน'; return; }
      $('#go').disabled = true; $('#go').textContent = 'กำลังตรวจสอบ…';
      api({ action: 'login', id: id, pw: pw }).then(function (j) {
        store('mp_user', j.user); go('#/');
      }).catch(function (e) {
        $('#err').hidden = false; $('#err').textContent = e.message;
        $('#go').disabled = false; $('#go').textContent = 'เข้าสู่ระบบ';
      });
    };
  }

  function logout() { store('mp_user', null); go('#/'); }

  function header(eyebrow, title, back) {
    return '<div class="top">' +
      (back ? '<button class="icon-btn back" data-back aria-label="ย้อนกลับ">' + ICON.back + '</button>' : '') +
      '<div class="grow"><div class="eyebrow ellipsis">' + esc(eyebrow) + '</div><h1 class="h1">' + esc(title) + '</h1></div>' +
      (back ? '' : '<button class="icon-btn" data-logout aria-label="ออกจากระบบ">' + ICON.out + '</button>') + '</div>';
  }
  function wireHeader() {
    var b = app.querySelector('[data-back]'); if (b) b.onclick = function () { history.length > 1 ? history.back() : go('#/'); };
    var l = app.querySelector('[data-logout]'); if (l) l.onclick = logout;
  }
  function loading(msg) { return '<div class="center"><div class="spinner"></div>' + esc(msg || 'กำลังโหลด…') + '</div>'; }

  /* ---------------- AM home ---------------- */
  function viewAmHome() {
    var u = user();
    app.innerHTML = '<div class="wrap">' + header('ASM · ' + u.branchName, 'สวัสดี คุณ' + u.name.split(' ')[0]) +
      '<div class="grid2"><button class="btn" id="start">เริ่มประเมินหน้าร้าน</button><a class="btn ghost" href="#/results">ผลประเมินหน้าร้าน</a></div>' +
      '<div class="grid2" style="margin-top:10px"><a class="btn dark" href="#/bmeval/new">ประเมิน BM</a><a class="btn ghost" href="#/bmeval">ผลประเมิน BM</a></div>' +
      '<div id="body" style="margin-top:14px">' + loading() + '</div></div>';
    wireHeader();
    $('#start').onclick = function () { go('#/audit/new'); };
    api({ action: 'audits', limit: 500 }).then(function (j) {
      var audits = j.audits || [];
      var now = new Date(), ym = now.getFullYear() + '-' + now.getMonth();
      var latest = {}, monthSet = {};
      audits.forEach(function (a) {
        if (!latest[a.branch_code]) latest[a.branch_code] = a;
        var d = new Date(a.saved_at);
        if (d.getFullYear() + '-' + d.getMonth() === ym) monthSet[a.branch_code] = true;
      });
      var monthCount = Object.keys(monthSet).length;
      var scored = BRANCHES.map(function (b) { return latest[b.code]; }).filter(Boolean);
      var avg = scored.length ? Math.round(scored.reduce(function (s, a) { return s + Number(a.total_pct || 0); }, 0) / scored.length) : null;
      var below = scored.filter(function (a) { return Number(a.total_pct) < PASS_LINE; }).length;
      var rows = BRANCHES.slice().sort(function (x, y) {
        var a = latest[x.code], b = latest[y.code];
        if (!a && !b) return 0; if (!a) return -1; if (!b) return 1;
        return Number(a.total_pct) - Number(b.total_pct);
      });
      $('#body').innerHTML =
        '<div class="grid3">' +
        '<div class="card dark stat"><div class="label">ประเมินเดือนนี้</div><div class="value">' + monthCount + '/17</div></div>' +
        '<div class="card stat"><div class="label">คะแนนเฉลี่ย</div><div class="value ' + pctColor(avg) + '">' + (avg == null ? '–' : avg + '%') + '</div></div>' +
        '<div class="card stat"><div class="label">ต่ำกว่า ' + PASS_LINE + '%</div><div class="value bad">' + below + '</div></div></div>' +
        '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">ทุกสาขา</h2><span class="small muted">เรียงจากที่ต้องดูก่อน</span></div>' +
        '<div class="list">' + rows.map(function (b) {
          var a = latest[b.code];
          return '<a href="#/branch/' + b.code + '"><span class="code">' + b.code + '</span>' +
            '<span class="grow" style="min-width:0;flex:1"><span class="ellipsis" style="display:block;font-weight:600">' + esc(b.name) + '</span>' +
            '<span class="small ' + (a ? 'muted' : 'bad') + '">' + (a ? 'ล่าสุด ' + fmtDate(a.saved_at) : 'ยังไม่เคยประเมิน') + '</span></span>' +
            '<span class="score ' + (a ? pctColor(a.total_pct) : 'muted') + '">' + (a ? a.total_pct + '%' : '–') + '</span></a>';
        }).join('') + '</div>';
    }).catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดข้อมูลไม่ได้: ' + esc(e.message) + '</div>'; });
  }

  /* ---------------- branch view (AM drill-down + BM home) ---------------- */
  function viewBranch(code, isHome) {
    var u = user();
    if (u.role !== 'ASM' && String(code) !== String(u.branch)) code = u.branch;
    var b = branch(code) || { code: code, name: u.branchName || '' };
    var title = isHome ? 'สวัสดี คุณ' + u.name.split(' ')[0] : b.name;
    var eyebrow = isHome ? 'สาขา ' + b.code + ' · ' + b.name : 'สาขา ' + b.code + (b.prov ? ' · ' + b.prov : '');
    app.innerHTML = '<div class="wrap">' + header(eyebrow, title, !isHome) +
      (isHome ? '<div class="row" style="margin:-6px 0 14px"><span class="chip blue">' + esc(u.position) + ' · รหัส ' + esc(u.id) + '</span></div>' : '') +
      '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    api({ action: 'audits', branch: b.code, limit: 50 }).then(function (j) {
      var list = j.audits || [];
      if (!list.length) {
        $('#body').innerHTML = '<div class="card"><h2 class="h2">ยังไม่มีผลประเมินหน้าร้าน</h2><p class="muted" style="margin:6px 0 0">เมื่อ AM ประเมินสาขานี้แล้ว ผลจะแสดงที่นี่</p></div>';
        if (u.role === 'ASM') { var bx = document.createElement('div'); bx.style.marginTop = '12px'; $('#body').appendChild(bx); bmActivityCard(b.code, bx); }
        return;
      }
      var a = list[0];
      var fails = String(a.failed_items || '').split(' | ').filter(Boolean);
      $('#body').innerHTML =
        '<div class="card dark"><div class="row between"><span class="muted small">ผลประเมินล่าสุด · ' + fmtDate(a.saved_at) + '</span></div>' +
        '<div class="row" style="align-items:baseline;gap:12px;margin-top:4px"><span style="font-size:40px;font-weight:700;color:' + (Number(a.total_pct) >= PASS_LINE ? '#8FB2FF' : '#FF9B5C') + '">' + a.total_pct + '%</span>' +
        '<span class="small muted">ผ่าน ' + a.pass_count + ' · ไม่ผ่าน ' + a.fail_count + ' ข้อ</span></div>' +
        sectionBars(a, true) + '</div>' +
        '<div class="grid-ipad-2" style="margin-top:12px">' +
        '<div class="card"><h2 class="h2">ต้องแก้ไข (' + fails.length + ')</h2>' +
        (fails.length ? '<ul style="margin:8px 0 0;padding-left:20px">' + fails.map(function (f) { return '<li class="small" style="margin:4px 0">' + esc(f) + '</li>'; }).join('') + '</ul>' : '<p class="small good" style="margin:8px 0 0">ผ่านทุกข้อ</p>') + '</div>' +
        '<div class="card"><h2 class="h2">โน้ตจาก AM</h2><p class="small" style="margin:8px 0 0;white-space:pre-wrap">' + (a.note ? esc(a.note) : '<span class="muted">–</span>') + '</p>' +
        (a.staff_name ? '<p class="small muted" style="margin:10px 0 0">ประเมินพนักงาน: ' + esc(a.staff_name) + ' · ' + esc(a.staff_position) + ' (' + (a.staff_pct === '' ? '–' : a.staff_pct + '%') + ')</p>' : '') + '</div></div>' +
        '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">ประวัติการประเมิน</h2><span class="small muted">' + list.length + ' ครั้ง</span></div>' +
        '<div class="list">' + list.map(function (x) {
          return '<a href="#/audit/' + esc(x.audit_id) + '"><span style="flex:1;min-width:0"><span style="display:block;font-weight:600">' + fmtDate(x.saved_at) + '</span>' +
            '<span class="small muted ellipsis" style="display:block">โดย ASM' + (x.staff_name ? ' · Staff: ' + esc(x.staff_name) : '') + '</span></span>' +
            '<span class="score ' + pctColor(x.total_pct) + '">' + x.total_pct + '%</span></a>';
        }).join('') + '</div>';
      store('mp_audits_' + b.code, list);
      if (u.role === 'ASM') { var box = document.createElement('div'); box.style.marginTop = '12px'; $('#body').appendChild(box); bmActivityCard(b.code, box); }
    }).catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดข้อมูลไม่ได้: ' + esc(e.message) + '</div>'; });
  }

  function sectionBars(a, dark) {
    var rows = [['Store', a.store_pct], ['Merchandise', a.merch_pct], ['Staff', a.staff_pct]];
    return '<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px">' + rows.map(function (r) {
      var p = r[1] === '' || r[1] == null ? null : Number(r[1]);
      return '<div class="row"><span class="small" style="width:96px">' + r[0] + '</span><div class="bar"' + (dark ? ' style="background:#333844"' : '') + '><i class="' + (p != null && p < PASS_LINE ? 'low' : '') + '" style="width:' + (p || 0) + '%"></i></div>' +
        '<span class="small" style="width:44px;text-align:right;font-weight:700">' + (p == null ? '–' : p + '%') + '</span></div>';
    }).join('') + '</div>';
  }

  /* ---------------- audit detail ---------------- */
  function viewAuditDetail(id) {
    app.innerHTML = '<div class="wrap">' + header('ผลประเมินหน้าร้าน', 'รายละเอียด', true) + '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    var u = user();
    var params = { action: 'audits', limit: 500 };
    if (u.role !== 'ASM') params.branch = u.branch;
    api(params).then(function (j) {
      var a = (j.audits || []).filter(function (x) { return String(x.audit_id) === String(id); })[0];
      if (!a) { $('#body').innerHTML = '<div class="alert">ไม่พบผลประเมินนี้</div>'; return; }
      var ans = {}; try { ans = JSON.parse(a.answers_json || '{}'); } catch (e) {}
      var html = '<div class="card dark"><div class="small muted">สาขา ' + esc(a.branch_code) + ' · ' + esc(a.branch_name) + '</div>' +
        '<div style="font-size:36px;font-weight:700;color:' + (Number(a.total_pct) >= PASS_LINE ? '#8FB2FF' : '#FF9B5C') + '">' + a.total_pct + '%</div>' +
        '<div class="small muted">' + fmtDate(a.audit_time || a.saved_at) + ' · โดย ASM</div>' + sectionBars(a, true) + '</div>';
      SECTIONS.forEach(function (s) {
        html += '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">' + s.name + '</h2>' +
          (s.id === 'staff' && a.staff_name ? '<span class="small muted">' + esc(a.staff_name) + ' · ' + esc(a.staff_position) + '</span>' : '') + '</div>';
        s.items.forEach(function (t, i) {
          var r = ans[s.id + '-' + i] || {};
          html += '<div class="item ' + (r.v || '') + '"><div class="q"><span class="n">' + (i + 1) + '</span><span style="flex:1">' + esc(t) + '</span>' +
            '<b class="small ' + (r.v === 'pass' ? 'good' : r.v === 'fail' ? 'bad' : 'muted') + '">' + (r.v === 'pass' ? 'ผ่าน' : r.v === 'fail' ? 'ไม่ผ่าน' : '–') + '</b></div>' +
            (r.note ? '<div class="small muted" style="margin-top:6px">หมายเหตุ: ' + esc(r.note) + '</div>' : '') + '</div>';
        });
      });
      if (a.note) html += '<div class="card" style="margin-top:14px"><h2 class="h2">โน้ตเพิ่มเติม</h2><p class="small" style="margin:8px 0 0;white-space:pre-wrap">' + esc(a.note) + '</p></div>';
      html += photosView(a.photos_json) + sketchView(a.sketch_url);
      $('#body').innerHTML = html;
    }).catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดข้อมูลไม่ได้: ' + esc(e.message) + '</div>'; });
  }

  /* ---------------- audit form (ASM) ---------------- */
  function viewAuditForm() {
    var u = user();
    var draft = store('mp_draft') || {};
    var sk = { url: '', strokes: [] }, ph = { list: [], busy: 0 };
    var st = { branch: draft.branch || '', sec: 0, marks: draft.marks || {}, notes: draft.notes || {}, position: draft.position || '', staffId: draft.staffId || '', note: draft.note || '', staff: [], startedAt: draft.startedAt || new Date().toISOString(), saving: false };
    function saveDraft() { store('mp_draft', { branch: st.branch, marks: st.marks, notes: st.notes, position: st.position, staffId: st.staffId, note: st.note, startedAt: st.startedAt }); }

    function stats() {
      var per = SECTIONS.map(function (s, si) {
        var p = 0, f = 0;
        s.items.forEach(function (t, i) { var v = st.marks[si + '-' + i]; if (v === 'pass') p++; else if (v === 'fail') f++; });
        return { p: p, f: f, done: p + f, n: s.items.length, pct: p + f ? Math.round(p / (p + f) * 100) : null };
      });
      var P = per.reduce(function (a, s) { return a + s.p; }, 0), F = per.reduce(function (a, s) { return a + s.f; }, 0);
      return { per: per, P: P, F: F, total: P + F ? Math.round(P / (P + F) * 100) : null, all: per.every(function (s) { return s.done === s.n; }) };
    }

    function loadStaff() {
      st.staff = [];
      if (!st.branch) return;
      st.staffErr = ''; st.staffLoading = true;
      api({ action: 'staff', branch: st.branch }).then(function (j) { st.staff = j.staff || []; st.staffLoading = false; if (SECTIONS[st.sec].id === 'staff') draw(); })
        .catch(function (e) { st.staffLoading = false; st.staffErr = (e && e.message) || 'ไม่ทราบสาเหตุ'; toast('โหลดรายชื่อพนักงานไม่ได้: ' + st.staffErr); if (SECTIONS[st.sec].id === 'staff') draw(); });
    }

    function draw() {
      var S = stats(), sec = SECTIONS[st.sec], last = st.sec === SECTIONS.length - 1;
      var b = branch(st.branch);
      var staffOpts = st.staff.filter(function (m) { return m.position === st.position; });
      var who = staffOpts.filter(function (m) { return m.id === st.staffId; })[0];
      var whoOk = !!who;
      var html = '<div class="wrap">' + header('ASM · ' + u.name, 'แบบประเมินหน้าร้าน', true) +
        '<div class="field"><label for="br">สาขา</label><select id="br" class="input"><option value="">— เลือกสาขา —</option>' +
        BRANCHES.map(function (x) { return '<option value="' + x.code + '"' + (x.code === st.branch ? ' selected' : '') + '>ID' + x.code + ' : ' + esc(x.name) + '</option>'; }).join('') + '</select>' +
        (b ? '<div class="row" style="gap:6px"><span class="chip blue">Channel ' + esc(b.channel) + '</span><span class="chip">จังหวัด' + esc(b.prov) + '</span></div>' : '') + '</div>' +
        '<div class="card dark row between" style="margin-top:10px;padding:10px 14px"><span class="small muted">วันที่ประเมิน</span><span id="clock" style="font-weight:600;font-variant-numeric:tabular-nums"></span></div>' +
        '<div class="tabs" style="margin-top:12px">' + SECTIONS.map(function (s, i) {
          var cls = i === st.sec ? 'on' : (S.per[i].done === S.per[i].n ? 'done' : '');
          return '<button class="tab ' + cls + '" data-tab="' + i + '" aria-pressed="' + (i === st.sec) + '"><b>' + s.name + '</b><span>' + S.per[i].done + '/' + S.per[i].n + ' ข้อ</span></button>';
        }).join('') + '</div>';

      if (sec.id === 'staff') {
        html += '<div class="card" style="margin-top:12px;border:2px solid ' + (whoOk ? '#1E5BD8' : '#F0A066') + '"><div class="label-strong" style="margin-bottom:8px">พนักงานที่ประเมิน</div>' +
          '<div class="choices">' + POSITIONS.map(function (p) { return '<button class="choice' + (p === st.position ? ' on' : '') + '" data-pos="' + esc(p) + '" aria-pressed="' + (p === st.position) + '">' + esc(p) + '</button>'; }).join('') + '</div>' +
          '<div class="field" style="margin-top:10px"><label for="emp">ชื่อพนักงาน</label><select id="emp" class="input">' +
          '<option value="">' + (!st.branch ? '— เลือกสาขาด้านบนก่อน —' : st.staffLoading ? 'กำลังโหลดรายชื่อ…' : st.staffErr ? '— โหลดรายชื่อไม่ได้ —' : !st.position ? '— เลือกตำแหน่งก่อน —' : staffOpts.length ? '— เลือกชื่อ (' + staffOpts.length + ' คน) —' : '— สาขานี้ไม่มีตำแหน่งนี้ —') + '</option>' +
          staffOpts.map(function (m) { return '<option value="' + esc(m.id) + '"' + (m.id === st.staffId ? ' selected' : '') + '>' + esc(m.id) + ' · ' + esc(m.name) + '</option>'; }).join('') + '</select></div>' +
          (st.staffErr ? '<div class="alert" style="margin-top:8px">โหลดรายชื่อไม่ได้: ' + esc(st.staffErr) + '</div><button class="btn ghost small" id="retryStaff" style="margin-top:8px">ลองโหลดใหม่</button>' : '') +
          '<div class="small ' + (whoOk ? 'good' : 'bad') + '" style="margin-top:6px">' + (whoOk ? 'ประเมิน: ' + esc(who.name) + ' · ' + esc(st.position) : 'เลือกตำแหน่งและชื่อพนักงานก่อนประเมินหมวดนี้') + '</div></div>';
      }

      html += '<p class="small muted" style="margin:12px 4px 8px">' + esc(sec.hint) + '</p>';
      sec.items.forEach(function (t, i) {
        var k = st.sec + '-' + i, v = st.marks[k];
        html += '<div class="item ' + (v || '') + '"><div class="q"><span class="n">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>' +
          '<div class="pf"><button data-mark="' + k + '" data-v="pass" class="' + (v === 'pass' ? 'on-pass' : '') + '" aria-pressed="' + (v === 'pass') + '">ผ่าน</button>' +
          '<button data-mark="' + k + '" data-v="fail" class="' + (v === 'fail' ? 'on-fail' : '') + '" aria-pressed="' + (v === 'fail') + '">ไม่ผ่าน</button></div>' +
          (v === 'fail' ? '<input class="input note" data-note="' + k + '" placeholder="พบอะไร (ไม่บังคับ)" aria-label="หมายเหตุข้อ ' + (i + 1) + '" value="' + esc(st.notes[k] || '') + '">' + itemPhotoBtn(ph, sec.name + ': ' + t) : '') + '</div>';
      });
      html += '<button class="btn ghost" id="allpass" style="margin-top:10px;border-style:dashed;font-size:14px">ติ๊ก "ผ่าน" ข้อที่เหลือในหมวดนี้ทั้งหมด</button>';

      html += '<div class="card" style="margin-top:14px"><div class="row between"><b>คะแนนรวม</b><span style="font-size:28px;font-weight:700" class="' + pctColor(S.total) + '">' + (S.total == null ? '–' : S.total + '%') + '</span></div>' +
        sectionBars({ store_pct: S.per[0].pct == null ? '' : S.per[0].pct, merch_pct: S.per[1].pct == null ? '' : S.per[1].pct, staff_pct: S.per[2].pct == null ? '' : S.per[2].pct }) +
        '<p class="tiny muted" style="margin:8px 0 0">คิดจากข้อที่ผ่าน ÷ ข้อที่ประเมิน · เกณฑ์ผ่าน ' + PASS_LINE + '%</p></div>';
      html += '<div class="field" style="margin-top:12px"><label for="note">โน้ตเพิ่มเติม</label><textarea id="note" class="input" placeholder="เช่น สิ่งที่ทำได้ดี สิ่งที่ต้องแก้ หรือสิ่งที่ตกลงกับ BM">' + esc(st.note) + '</textarea><span class="tiny muted">ไม่บังคับ · BM เห็นในหน้าสาขา · เขียนด้วย Pencil ลงช่องนี้ได้เลย (Scribble)</span></div>' +
        '<div class="field" style="margin-top:12px"><label>รูปภาพ (ไม่บังคับ)</label>' + photoBlock(ph) + '<span class="tiny muted">ถ่ายรูปหรือเลือกจากคลังภาพ ได้สูงสุด ' + MAX_PHOTOS + ' รูป · รูปที่แนบในข้อที่ไม่ผ่านจะรวมอยู่ที่นี่ด้วย</span></div>' +
        '<div class="field" style="margin-top:12px"><label>ภาพเขียนด้วยมือ (ไม่บังคับ)</label>' + sketchBlock(sk) + '</div>';

      var remain = S.per.reduce(function (a, s) { return a + s.n - s.done; }, 0);
      var label, ready = false;
      if (!last) label = 'ต่อไป: ' + SECTIONS[st.sec + 1].name;
      else if (!st.branch) label = 'เลือกสาขาก่อนบันทึก';
      else if (!whoOk) label = 'เลือกพนักงานในหมวด Staff ก่อน';
      else if (!S.all) label = 'ยังเหลือ ' + remain + ' ข้อ';
      else { label = 'บันทึกผลประเมิน' + (ph.list.length ? ' + รูป ' + ph.list.length : ''); ready = true; }
      html += '</div><div class="bottombar"><div class="inner"><button class="btn" id="next"' + (!last || ready ? '' : ' disabled') + '>' + (st.saving ? 'กำลังบันทึก…' : label) + '</button></div></div>';
      app.innerHTML = html;
      wireHeader();
      tick();

      $('#br').onchange = function (e) { st.branch = e.target.value; st.staffId = ''; saveDraft(); loadStaff(); draw(); };
      app.querySelectorAll('[data-tab]').forEach(function (el) { el.onclick = function () { st.sec = Number(el.getAttribute('data-tab')); draw(); window.scrollTo(0, 0); }; });
      app.querySelectorAll('[data-pos]').forEach(function (el) { el.onclick = function () { st.position = el.getAttribute('data-pos'); st.staffId = ''; saveDraft(); draw(); }; });
      var rs = $('#retryStaff'); if (rs) rs.onclick = function () { loadStaff(); draw(); };
      var emp = $('#emp'); if (emp) emp.onchange = function (e) { st.staffId = e.target.value; saveDraft(); draw(); };
      app.querySelectorAll('[data-mark]').forEach(function (el) {
        el.onclick = function () {
          var k = el.getAttribute('data-mark'), v = el.getAttribute('data-v');
          st.marks[k] = st.marks[k] === v ? undefined : v; saveDraft();
          var y = window.scrollY; draw(); window.scrollTo(0, y);
        };
      });
      app.querySelectorAll('[data-note]').forEach(function (el) { el.oninput = function () { st.notes[el.getAttribute('data-note')] = el.value; saveDraft(); }; });
      $('#note').oninput = function (e) { st.note = e.target.value; saveDraft(); };
      wireSketch(sk, function () { var y = window.scrollY; draw(); window.scrollTo(0, y); });
      wirePhotos(ph, function () { var y = window.scrollY; draw(); window.scrollTo(0, y); });
      $('#allpass').onclick = function () { sec.items.forEach(function (t, i) { var k = st.sec + '-' + i; if (!st.marks[k]) st.marks[k] = 'pass'; }); saveDraft(); var y = window.scrollY; draw(); window.scrollTo(0, y); };
      $('#next').onclick = function () {
        if (!last) { st.sec++; draw(); window.scrollTo(0, 0); return; }
        if (!ready || st.saving) return;
        if (ph.busy) { toast('รอเตรียมรูปสักครู่'); return; }
        submit(S, who);
      };
    }

    function tick() {
      var c = document.getElementById('clock'); if (!c) return;
      var n = nowParts(); c.textContent = n.date + ' · ' + n.time;
    }
    timers.push(setInterval(tick, 1000));

    function submit(S, who) {
      st.saving = true; draw();
      var answers = {}, failed = [];
      SECTIONS.forEach(function (s, si) {
        s.items.forEach(function (t, i) {
          var k = si + '-' + i, v = st.marks[k];
          answers[s.id + '-' + i] = { v: v, note: st.notes[k] || '' };
          if (v === 'fail') failed.push(s.name + ': ' + t + (st.notes[k] ? ' (' + st.notes[k] + ')' : ''));
        });
      });
      var audit = {
        branch: st.branch, auditTime: new Date().toISOString(), auditorId: u.id, auditorName: u.name,
        staffPosition: st.position, staffId: who.id, staffName: who.name,
        storePct: S.per[0].pct, merchPct: S.per[1].pct, staffPct: S.per[2].pct, totalPct: S.total,
        passCount: S.P, failCount: S.F, failedItems: failed, note: st.note, answers: answers, sketch: sk.url, photos: photosPayload(ph)
      };
      api({ action: 'saveAudit', audit: audit }, true).then(function () {
        store('mp_draft', null); toast('บันทึกผลประเมินแล้ว'); go('#/branch/' + st.branch);
      }).catch(function (e) { st.saving = false; draw(); toast('บันทึกไม่สำเร็จ: ' + e.message); });
    }

    loadStaff();
    draw();
  }

  /* =====================================================================
     v2 · ผลประเมินหน้าร้าน (AM) + เครื่องมือ BM
     ===================================================================== */
  var C = window.MP_CONTENT || {};
  var LOG_TYPES = { score: 'ประเมินพนักงาน', spot: 'Spot-check', demo: 'Demo Product', roleplay: 'Role-play' };

  function monthKey(d) { d = new Date(d); return isNaN(d) ? '' : d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function monthLabel(k) { if (k === 'all') return 'ทั้งหมด'; var p = k.split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }); }
  function isToday(d) { d = new Date(d); var n = new Date(); return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate(); }
  function avgOf(arr) { var v = arr.filter(function (x) { return x !== '' && x != null && !isNaN(Number(x)); }).map(Number); return v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length) : null; }
  function pctTxt(p) { return p == null ? '–' : p + '%'; }
  function firstName(n) { return String(n || '').split(' ')[0]; }

  var teamCache = {};
  function loadTeam(code) {
    if (teamCache[code]) return Promise.resolve(teamCache[code]);
    return api({ action: 'staff', branch: code, scope: 'team' }).then(function (j) { teamCache[code] = j.staff || []; return teamCache[code]; });
  }
  function saveLog(log) {
    var u = user();
    log.bmId = u.id; log.bmName = u.name; log.branch = log.branch || u.branch;
    return api({ action: 'saveLog', log: log }, true);
  }

  function bar(p, dark) {
    return '<div class="bar"' + (dark ? ' style="background:#333844"' : '') + '><i class="' + (p != null && p < PASS_LINE ? 'low' : '') + '" style="width:' + (p || 0) + '%"></i></div>';
  }
  function staffSelect(id, team, sel, filterFn, placeholder) {
    var list = filterFn ? team.filter(filterFn) : team;
    return '<select id="' + id + '" class="input"><option value="">' + esc(placeholder || '— เลือกพนักงาน (' + list.length + ' คน) —') + '</option>' +
      list.map(function (m) { return '<option value="' + esc(m.id) + '"' + (m.id === sel ? ' selected' : '') + '>' + esc(m.name) + ' · ' + esc(m.position) + '</option>'; }).join('') + '</select>';
  }

  /* ---------------- AM · ผลประเมินหน้าร้าน ---------------- */
  function viewResults() {
    var st = { month: monthKey(new Date()), audits: null, logs: null };
    app.innerHTML = '<div class="wrap">' + header('ASM · 17 สาขา', 'ผลประเมินหน้าร้าน', true) + '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    Promise.all([api({ action: 'audits', limit: 2000 }), api({ action: 'logs', limit: 3000 }).catch(function () { return { logs: [] }; })])
      .then(function (r) { st.audits = r[0].audits || []; st.logs = r[1].logs || []; draw(); })
      .catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดข้อมูลไม่ได้: ' + esc(e.message) + '</div>'; });

    function draw() {
      var months = {}; months[monthKey(new Date())] = 1;
      st.audits.forEach(function (a) { months[monthKey(a.saved_at)] = 1; });
      var mlist = Object.keys(months).filter(Boolean).sort().reverse();
      var inM = function (d) { return st.month === 'all' || monthKey(d) === st.month; };
      var audits = st.audits.filter(function (a) { return inM(a.saved_at); });
      var logs = st.logs.filter(function (l) { return inM(l.saved_at); });
      var latest = {}, countBy = {};
      audits.forEach(function (a) { if (!latest[a.branch_code]) latest[a.branch_code] = a; countBy[a.branch_code] = (countBy[a.branch_code] || 0) + 1; });
      var done = BRANCHES.filter(function (b) { return latest[b.code]; });
      var L = done.map(function (b) { return latest[b.code]; });
      var avgT = avgOf(L.map(function (a) { return a.total_pct; }));
      var passN = L.filter(function (a) { return Number(a.total_pct) >= PASS_LINE; }).length;
      var secAvg = { store_pct: avgOf(L.map(function (a) { return a.store_pct; })), merch_pct: avgOf(L.map(function (a) { return a.merch_pct; })), staff_pct: avgOf(L.map(function (a) { return a.staff_pct; })) };

      // ข้อที่ไม่ผ่านบ่อย (นับจากทุกครั้งที่ประเมินในช่วงนี้)
      var failCount = {}, seen = {};
      audits.forEach(function (a) {
        var ans = {}; try { ans = JSON.parse(a.answers_json || '{}'); } catch (e) {}
        Object.keys(ans).forEach(function (k) {
          seen[k] = (seen[k] || 0) + 1;
          if (ans[k] && ans[k].v === 'fail') { failCount[k] = failCount[k] || { n: 0, br: {} }; failCount[k].n++; failCount[k].br[a.branch_code] = 1; }
        });
      });
      var secName = {}; SECTIONS.forEach(function (s) { secName[s.id] = s; });
      var tops = Object.keys(failCount).map(function (k) {
        var p = k.split('-'), s = secName[p[0]];
        return { k: k, sec: s ? s.name : p[0], text: s ? s.items[Number(p[1])] : k, n: failCount[k].n, of: seen[k], br: Object.keys(failCount[k].br) };
      }).sort(function (a, b) { return b.n - a.n; }).slice(0, 8);

      // กิจกรรม BM ต่อสาขา
      var act = {};
      BRANCHES.forEach(function (b) { act[b.code] = { score: [], spotBills: 0, spotOk: 0, spotN: 0, demo: 0 }; });
      logs.forEach(function (l) {
        var a = act[l.branch_code]; if (!a) return;
        if (l.type === 'score') a.score.push(l);
        if (l.type === 'spot') { a.spotBills++; a.spotOk += Number(l.score) || 0; a.spotN += Number(l.max_score) || 0; }
        if (l.type === 'demo' && Number(l.pct) === 100) a.demo++;
      });

      var rows = BRANCHES.slice().sort(function (x, y) {
        var a = latest[x.code], b = latest[y.code];
        if (!a && !b) return 0; if (!a) return 1; if (!b) return -1;
        return Number(a.total_pct) - Number(b.total_pct);
      });

      var html =
        '<div class="field"><label for="m">ช่วงเวลา</label><select id="m" class="input">' +
        mlist.map(function (k) { return '<option value="' + k + '"' + (k === st.month ? ' selected' : '') + '>' + esc(monthLabel(k)) + '</option>'; }).join('') +
        '<option value="all"' + (st.month === 'all' ? ' selected' : '') + '>ทั้งหมด</option></select></div>' +
        '<div class="grid3" style="margin-top:12px">' +
        '<div class="card dark stat"><div class="label">ประเมินแล้ว</div><div class="value">' + done.length + '/17</div></div>' +
        '<div class="card stat"><div class="label">คะแนนเฉลี่ย</div><div class="value ' + pctColor(avgT) + '">' + pctTxt(avgT) + '</div></div>' +
        '<div class="card stat"><div class="label">ผ่าน ' + PASS_LINE + '%</div><div class="value">' + passN + '<span class="small muted"> สาขา</span></div></div></div>' +
        '<div class="grid-ipad-2" style="margin-top:12px">' +
        '<div class="card"><h2 class="h2">เฉลี่ยรายหมวด</h2>' + (L.length ? sectionBars(secAvg) : '<p class="small muted">ยังไม่มีข้อมูลในช่วงนี้</p>') +
        '<p class="tiny muted" style="margin:8px 0 0">ใช้ผลล่าสุดของแต่ละสาขาในช่วงที่เลือก</p></div>' +
        '<div class="card"><h2 class="h2">ข้อที่ไม่ผ่านบ่อยที่สุด</h2>' +
        (tops.length ? '<div style="margin-top:6px">' + tops.map(function (t) {
          return '<div style="padding:8px 0;border-top:1px solid #ECEEF1"><div class="row between" style="align-items:flex-start"><span class="small" style="flex:1"><span class="chip" style="margin-right:6px">' + esc(t.sec) + '</span>' + esc(t.text) + '</span>' +
            '<b class="small bad" style="flex:none">' + t.n + '/' + t.of + '</b></div><div class="tiny muted" style="margin-top:2px">สาขา ' + t.br.join(', ') + '</div></div>';
        }).join('') + '</div>' : '<p class="small good" style="margin:8px 0 0">' + (audits.length ? 'ผ่านทุกข้อ' : 'ยังไม่มีข้อมูล') + '</p>') + '</div></div>' +

        '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">รายสาขา</h2><span class="small muted">ต่ำสุดขึ้นก่อน</span></div>' +
        '<div class="card" style="padding:0;overflow-x:auto"><table class="tbl"><thead><tr><th>สาขา</th><th>Store</th><th>Merch</th><th>Staff</th><th>รวม</th><th>ครั้ง</th></tr></thead><tbody>' +
        rows.map(function (b) {
          var a = latest[b.code];
          if (!a) return '<tr><td><a href="#/branch/' + b.code + '"><b>' + b.code + '</b> <span class="muted">' + esc(b.name.replace(/^Studio ?7-?/, '')) + '</span></a></td><td colspan="5" class="bad small">ยังไม่ประเมิน</td></tr>';
          var c = function (v) { return '<td class="num ' + pctColor(v) + '">' + (v === '' || v == null ? '–' : v) + '</td>'; };
          return '<tr><td><a href="#/branch/' + b.code + '"><b>' + b.code + '</b> <span class="muted">' + esc(b.name.replace(/^Studio ?7-?/, '')) + '</span></a></td>' +
            c(a.store_pct) + c(a.merch_pct) + c(a.staff_pct) + '<td class="num"><b class="' + pctColor(a.total_pct) + '">' + a.total_pct + '%</b></td><td class="num muted">' + countBy[b.code] + '</td></tr>';
        }).join('') + '</tbody></table></div>' +

        '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">กิจกรรมโค้ชของ BM</h2><span class="small muted">' + esc(monthLabel(st.month)) + '</span></div>' +
        '<div class="card" style="padding:0;overflow-x:auto"><table class="tbl"><thead><tr><th>สาขา</th><th>ประเมินพนักงาน</th><th>เฉลี่ย</th><th>Role-play</th><th>Demo ผ่าน</th></tr></thead><tbody>' +
        BRANCHES.map(function (b) {
          var a = act[b.code], sAvg = avgOf(a.score.map(function (l) { return l.pct; }));
          var people = {}; a.score.forEach(function (l) { people[l.staff_id] = 1; });
          var none = !a.score.length && !a.demo;
          var rp = a.score.filter(function (l) { return /^Role-play/.test(l.topic || ''); }).length;
          return '<tr><td><a href="#/branch/' + b.code + '"><b>' + b.code + '</b> <span class="muted">' + esc(b.name.replace(/^Studio ?7-?/, '')) + '</span></a></td>' +
            (none ? '<td colspan="4" class="small bad">ยังไม่มีบันทึก</td>' :
              '<td class="num">' + Object.keys(people).length + ' คน</td><td class="num ' + pctColor(sAvg) + '">' + pctTxt(sAvg) + '</td>' +
              '<td class="num">' + rp + ' ครั้ง</td><td class="num">' + a.demo + '</td>') + '</tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="tiny muted" style="margin:8px 4px 0">Demo ผ่าน = จำนวนครั้งที่ PIA Demo ผ่านครบ 4 ขั้น · Role-play = ครั้งที่ BM ให้คะแนนหลัง Role-play</p>';
      $('#body').innerHTML = html;
      $('#m').onchange = function (e) { st.month = e.target.value; draw(); };
    }
  }

  /* ---------------- AM · กิจกรรม BM ในหน้าสาขา ---------------- */
  function bmActivityCard(code, el) {
    api({ action: 'logs', branch: code, limit: 300 }).then(function (j) {
      var mk = monthKey(new Date());
      var logs = (j.logs || []).filter(function (l) { return monthKey(l.saved_at) === mk; });
      var sc = logs.filter(function (l) { return l.type === 'score'; }), dm = logs.filter(function (l) { return l.type === 'demo'; });
      el.innerHTML = '<div class="card"><div class="row between"><h2 class="h2">กิจกรรมโค้ชของ BM เดือนนี้</h2></div>' +
        '<div class="grid3" style="margin-top:10px">' +
        '<div class="stat"><div class="label">ประเมินพนักงาน</div><div class="value" style="font-size:20px">' + sc.length + ' <span class="small muted">ครั้ง · ' + pctTxt(avgOf(sc.map(function (l) { return l.pct; }))) + '</span></div></div>' +
        '<div class="stat"><div class="label">Role-play</div><div class="value" style="font-size:20px">' + sc.filter(function (l) { return /^Role-play/.test(l.topic || ''); }).length + ' <span class="small muted">ครั้ง</span></div></div>' +
        '<div class="stat"><div class="label">Demo Product</div><div class="value" style="font-size:20px">' + dm.filter(function (l) { return Number(l.pct) === 100; }).length + ' <span class="small muted">ผ่าน</span></div></div></div>' +
        (logs.length ? '<div class="list" style="margin-top:10px;border:1px solid #ECEEF1">' + logs.slice(0, 6).map(logRow).join('') + '</div>' : '<p class="small bad" style="margin:10px 0 0">BM ยังไม่มีบันทึกเดือนนี้</p>') + '</div>';
    }).catch(function () { el.innerHTML = ''; });
  }

  function logRow(l) {
    var p = l.pct === '' || l.pct == null ? null : Number(l.pct);
    return '<div><span style="flex:1;min-width:0"><span class="ellipsis" style="display:block;font-weight:600">' + esc(LOG_TYPES[l.type] || l.type) + (l.topic ? ' · ' + esc(l.topic) : '') + '</span>' +
      '<span class="small muted ellipsis" style="display:block">' + (l.staff_name ? esc(l.staff_name) + ' · ' : '') + fmtDate(l.saved_at) + '</span></span>' +
      '<span class="score ' + pctColor(p) + '">' + (l.type === 'spot' || l.type === 'demo' ? l.score + '/' + l.max_score : pctTxt(p)) + '</span></div>';
  }

  /* ---------------- BM · หน้าแรก ---------------- */
  var BM_TOOLS = [
    ['score', 'ประเมินพนักงาน', '10 ข้อ · หลังสังเกตการขายจริง'],
    ['demo', 'Demo Product', 'เฉพาะ PIA · Mac iPad Pencil Watch'],
    ['roleplay', 'Role-play', 'สุ่มโจทย์ตามอุปกรณ์ · จับเวลา 5 นาที'],
    ['objection', 'การ์ดข้อโต้แย้ง', 'ฝึกตอบใน 1 ประโยค'],
    ['democards', 'การ์ดคำถาม Demo', 'คำถามลูกค้าระหว่าง Demo']
  ];

  function viewBmHome() {
    var u = user(), b = branch(u.branch) || { code: u.branch, name: u.branchName || '' };
    app.innerHTML = '<div class="wrap">' + header('สาขา ' + b.code + ' · ' + b.name, 'สวัสดี คุณ' + firstName(u.name)) +
      '<div class="row" style="margin:-6px 0 14px"><span class="chip blue">' + esc(u.position) + ' · รหัส ' + esc(u.id) + '</span></div>' +
      '<div id="audit">' + loading('กำลังโหลดผลประเมิน…') + '</div><div id="bmeval"></div>' +
      '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">เครื่องมือโค้ชทีม</h2></div>' +
      '<div class="grid2 tools">' + BM_TOOLS.map(function (t) {
        return '<a class="card tool" href="#/bm/' + t[0] + '"><b>' + esc(t[1]) + '</b><span class="small muted">' + esc(t[2]) + '</span></a>';
      }).join('') + '</div>' +
      '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">ทีมเดือนนี้</h2><span class="small muted">' + esc(monthLabel(monthKey(new Date()))) + '</span></div>' +
      '<div id="team">' + loading() + '</div></div>';
    wireHeader();

    bmEvalCard($('#bmeval'));
    api({ action: 'audits', branch: b.code, limit: 1 }).then(function (j) {
      var a = (j.audits || [])[0];
      $('#audit').innerHTML = a ?
        '<a class="card dark" href="#/branch/' + b.code + '" style="display:block;color:#fff"><div class="row between"><span class="small muted">ผลประเมินหน้าร้านจาก AM · ' + fmtDate(a.saved_at) + '</span><span class="small" style="color:#8FB2FF">ดูรายละเอียด ›</span></div>' +
        '<div class="row" style="align-items:baseline;gap:12px;margin-top:4px"><span style="font-size:36px;font-weight:700;color:' + (Number(a.total_pct) >= PASS_LINE ? '#8FB2FF' : '#FF9B5C') + '">' + a.total_pct + '%</span>' +
        '<span class="small muted">ต้องแก้ ' + a.fail_count + ' ข้อ</span></div>' + sectionBars(a, true) + '</a>' :
        '<div class="card"><b>ยังไม่มีผลประเมินหน้าร้าน</b><p class="small muted" style="margin:4px 0 0">เมื่อ AM ประเมินสาขานี้แล้ว ผลจะแสดงที่นี่</p></div>';
    }).catch(function (e) { $('#audit').innerHTML = '<div class="alert">โหลดผลประเมินไม่ได้: ' + esc(e.message) + '</div>'; });

    Promise.all([loadTeam(b.code), api({ action: 'logs', branch: b.code, limit: 500 })]).then(function (r) {
      var team = r[0], logs = r[1].logs || [], mk = monthKey(new Date());
      var month = logs.filter(function (l) { return monthKey(l.saved_at) === mk; });
      var scored = {}; month.filter(function (l) { return l.type === 'score'; }).forEach(function (l) { if (!scored[l.staff_id]) scored[l.staff_id] = l; });
      var pia = team.filter(function (m) { return m.position === 'PIA'; });
      var dm = demoMatrix(logs, pia);
      var full = pia.filter(function (m) { return dm[m.id].filter(Boolean).length === C.demoDevices.length; }).length;
      var notYet = team.filter(function (m) { return !scored[m.id]; });
      $('#team').innerHTML =
        '<div class="grid2">' +
        '<a class="card stat" href="#/bm/score"><div class="label">ประเมินพนักงาน</div><div class="value">' + Object.keys(scored).length + '/' + team.length + '</div><div class="tiny muted">คน</div></a>' +
        '<a class="card stat" href="#/bm/demo"><div class="label">Demo ผ่านครบ 4</div><div class="value">' + full + '/' + pia.length + '</div><div class="tiny muted">PIA</div></a></div>' +
        (notYet.length ? '<div class="card" style="margin-top:12px"><b class="small">ยังไม่ได้ประเมินเดือนนี้ (' + notYet.length + ' คน)</b><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px">' +
          notYet.map(function (m) { return '<a class="chip orange" href="#/bm/score/' + esc(m.id) + '">' + esc(firstName(m.name)) + ' · ' + esc(m.position) + '</a>'; }).join('') + '</div></div>' : '') +
        (logs.length ? '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">บันทึกล่าสุด</h2></div><div class="list">' + logs.slice(0, 8).map(logRow).join('') + '</div>' : '');
    }).catch(function (e) { $('#team').innerHTML = '<div class="alert">โหลดข้อมูลทีมไม่ได้: ' + esc(e.message) + '</div>'; });
  }

  /* ---------------- BM · ประเมินพนักงาน 10 ข้อ ---------------- */
  function viewBmScore(preId) {
    var u = user(), items = C.scoreItems || [];
    var rp = store('mp_rp'); store('mp_rp', null);
    var st = { team: null, staffId: preId || (rp && rp.staffId) || '', marks: {}, note: '', topic: rp ? 'Role-play · ' + rp.who : '', saving: false, hist: [] };
    app.innerHTML = '<div class="wrap">' + header('สาขา ' + u.branch + ' · ' + u.name, 'ประเมินพนักงาน', true) + '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    Promise.all([loadTeam(u.branch), api({ action: 'logs', branch: u.branch, type: 'score', limit: 300 }).catch(function () { return { logs: [] }; })])
      .then(function (r) { st.team = r[0]; st.hist = r[1].logs || []; draw(); })
      .catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดรายชื่อไม่ได้: ' + esc(e.message) + '</div>'; });

    function draw() {
      var who = st.team.filter(function (m) { return m.id === st.staffId; })[0];
      var p = 0, f = 0; items.forEach(function (t, i) { if (st.marks[i] === 'pass') p++; else if (st.marks[i] === 'fail') f++; });
      var all = p + f === items.length, pct = p + f ? Math.round(p / (p + f) * 100) : null;
      var grade = !all ? 'ให้คะแนนให้ครบ ' + items.length + ' ข้อ' : pct === 100 ? 'เกรด A · พร้อมขายจริง' : pct >= 80 ? 'เกรด B · ใกล้แล้ว' : pct >= 60 ? 'เกรด C · ฝึกซ้ำสัปดาห์นี้' : 'เกรด D · โค้ชตัวต่อตัว';
      var prev = who ? st.hist.filter(function (l) { return l.staff_id === who.id; }).slice(0, 3) : [];
      var html =
        '<div class="field"><label for="emp">พนักงาน</label>' + staffSelect('emp', st.team, st.staffId) + '</div>' +
        (st.topic ? '<div class="row" style="margin-top:8px"><span class="chip blue">' + esc(st.topic) + '</span></div>' : '') +
        (prev.length ? '<p class="small muted" style="margin:8px 4px 0">ครั้งก่อน: ' + prev.map(function (l) { return fmtDate(l.saved_at).split(' ').slice(0, 2).join(' ') + ' <b class="' + pctColor(l.pct) + '">' + l.pct + '%</b>'; }).join(' · ') + '</p>' : '') +
        '<div style="margin-top:12px">' + items.map(function (t, i) {
          var v = st.marks[i];
          return '<div class="item ' + (v || '') + '"><div class="q"><span class="n">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>' +
            '<div class="pf"><button data-i="' + i + '" data-v="pass" class="' + (v === 'pass' ? 'on-pass' : '') + '" aria-pressed="' + (v === 'pass') + '">ผ่าน</button>' +
            '<button data-i="' + i + '" data-v="fail" class="' + (v === 'fail' ? 'on-fail' : '') + '" aria-pressed="' + (v === 'fail') + '">ไม่ผ่าน</button></div></div>';
        }).join('') + '</div>' +
        '<div class="card dark" style="margin-top:12px"><div class="row between"><span class="small muted">คะแนน</span><span style="font-size:28px;font-weight:700;color:' + (pct != null && pct < PASS_LINE ? '#FF9B5C' : '#8FB2FF') + '">' + p + '/' + items.length + '</span></div><div class="small" style="margin-top:2px">' + esc(grade) + '</div></div>' +
        '<div class="field" style="margin-top:12px"><label for="note">โน้ตโค้ช</label><textarea id="note" class="input" placeholder="เช่น จุดที่ทำได้ดี และสิ่งที่จะฝึกต่อ">' + esc(st.note) + '</textarea></div>';
      var ready = who && all && !st.saving;
      html += '</div><div class="bottombar"><div class="inner"><button class="btn" id="save"' + (ready ? '' : ' disabled') + '>' + (st.saving ? 'กำลังบันทึก…' : !who ? 'เลือกพนักงานก่อน' : !all ? 'ยังเหลือ ' + (items.length - p - f) + ' ข้อ' : 'บันทึกผล') + '</button></div></div>';
      $('#body').innerHTML = html;
      $('#emp').onchange = function (e) { st.staffId = e.target.value; draw(); };
      app.querySelectorAll('[data-i]').forEach(function (el) {
        el.onclick = function () { var i = el.getAttribute('data-i'), v = el.getAttribute('data-v'); st.marks[i] = st.marks[i] === v ? undefined : v; var y = window.scrollY; draw(); window.scrollTo(0, y); };
      });
      $('#note').oninput = function (e) { st.note = e.target.value; };
      $('#save').onclick = function () {
        if (!ready) return;
        st.saving = true; draw();
        var answers = {}, failed = [];
        items.forEach(function (t, i) { answers[i] = st.marks[i]; if (st.marks[i] === 'fail') failed.push(t); });
        saveLog({ type: 'score', staffId: who.id, staffName: who.name, staffPosition: who.position, topic: st.topic, score: p, maxScore: items.length, pct: pct, failedItems: failed, note: st.note, answers: answers })
          .then(function () { toast('บันทึกผลของ ' + firstName(who.name) + ' แล้ว'); go('#/'); })
          .catch(function (e) { st.saving = false; draw(); toast('บันทึกไม่สำเร็จ: ' + e.message); });
      };
    }
  }

  /* ---------------- BM · Spot-check หน้าร้าน ---------------- */
  function viewBmSpot() {
    var u = user(), items = C.spotItems || [];
    var st = { team: null, staffId: '', marks: {}, today: [], saving: false };
    app.innerHTML = '<div class="wrap">' + header('สาขา ' + u.branch + ' · สุ่มดูบิลจริง', 'Spot-check หน้าร้าน', true) + '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    Promise.all([loadTeam(u.branch), api({ action: 'logs', branch: u.branch, type: 'spot', limit: 300 }).catch(function () { return { logs: [] }; })])
      .then(function (r) { st.team = r[0]; st.today = (r[1].logs || []).filter(function (l) { return isToday(l.saved_at); }); draw(); })
      .catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดรายชื่อไม่ได้: ' + esc(e.message) + '</div>'; });

    function draw() {
      var who = st.team.filter(function (m) { return m.id === st.staffId; })[0];
      var n = Object.keys(st.marks).filter(function (k) { return st.marks[k]; }).length, all = n === items.length;
      var ok = items.filter(function (t, i) { return st.marks[i] === 'do'; }).length;
      // สรุปวันนี้รายข้อ
      var sum = items.map(function (t, i) {
        var rel = st.today.map(function (l) { var a = {}; try { a = JSON.parse(l.answers_json || '{}'); } catch (e) {} return a[i]; }).filter(Boolean);
        var y = rel.filter(function (v) { return v === 'do'; }).length;
        return { t: t, y: y, n: rel.length, p: rel.length ? Math.round(y / rel.length * 100) : null };
      });
      var people = {}; st.today.forEach(function (l) { people[l.staff_id] = 1; });
      var html =
        '<div class="card dark"><div class="row between"><span class="small muted">วันนี้</span><span class="small muted">' + st.today.length + ' บิล · ' + Object.keys(people).length + ' คน</span></div>' +
        (st.today.length ? '<div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">' + sum.map(function (s) {
          return '<div class="row"><span class="small ellipsis" style="width:46%">' + esc(s.t.replace(/\s*\(.*\)$/, '')) + '</span>' + bar(s.p, true) + '<span class="small" style="width:56px;text-align:right;font-weight:700">' + s.y + '/' + s.n + '</span></div>';
        }).join('') + '</div>' : '<p class="small muted" style="margin:6px 0 0">ยังไม่มีบิลที่ตรวจวันนี้</p>') + '</div>' +
        '<div class="field" style="margin-top:14px"><label for="emp">พนักงานที่ปิดบิลนี้</label>' + staffSelect('emp', st.team, st.staffId) + '</div>' +
        '<div style="margin-top:12px">' + items.map(function (t, i) {
          var v = st.marks[i];
          return '<div class="item ' + (v === 'do' ? 'pass' : v === 'no' ? 'fail' : '') + '"><div class="q"><span class="n">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>' +
            '<div class="pf"><button data-i="' + i + '" data-v="do" class="' + (v === 'do' ? 'on-pass' : '') + '" aria-pressed="' + (v === 'do') + '">ทำ</button>' +
            '<button data-i="' + i + '" data-v="no" class="' + (v === 'no' ? 'on-fail' : '') + '" aria-pressed="' + (v === 'no') + '">ไม่ได้ทำ</button></div></div>';
        }).join('') + '</div>';
      var ready = who && all && !st.saving;
      html += '</div><div class="bottombar"><div class="inner"><button class="btn" id="save"' + (ready ? '' : ' disabled') + '>' + (st.saving ? 'กำลังบันทึก…' : !who ? 'เลือกพนักงานก่อน' : !all ? 'ยังเหลือ ' + (items.length - n) + ' ข้อ' : 'บันทึกบิลนี้ (' + ok + '/' + items.length + ')') + '</button></div></div>';
      $('#body').innerHTML = html;
      $('#emp').onchange = function (e) { st.staffId = e.target.value; draw(); };
      app.querySelectorAll('[data-i]').forEach(function (el) {
        el.onclick = function () { var i = el.getAttribute('data-i'), v = el.getAttribute('data-v'); st.marks[i] = st.marks[i] === v ? undefined : v; var y = window.scrollY; draw(); window.scrollTo(0, y); };
      });
      $('#save').onclick = function () {
        if (!ready) return;
        st.saving = true; draw();
        var answers = {}, failed = [];
        items.forEach(function (t, i) { answers[i] = st.marks[i]; if (st.marks[i] === 'no') failed.push(t); });
        var log = { type: 'spot', staffId: who.id, staffName: who.name, staffPosition: who.position, score: ok, maxScore: items.length, pct: Math.round(ok / items.length * 100), failedItems: failed, answers: answers };
        saveLog(log).then(function () {
          toast('บันทึกบิลแล้ว · ตรวจบิลถัดไปได้เลย');
          st.today.unshift({ saved_at: new Date().toISOString(), staff_id: who.id, answers_json: JSON.stringify(answers) });
          st.marks = {}; st.staffId = ''; st.saving = false; draw(); window.scrollTo(0, 0);
        }).catch(function (e) { st.saving = false; draw(); toast('บันทึกไม่สำเร็จ: ' + e.message); });
      };
    }
  }

  /* ---------------- BM · Demo Product (เฉพาะ PIA) ---------------- */
  function demoMatrix(logs, pia) {
    var m = {};
    pia.forEach(function (p) { m[p.id] = C.demoDevices.map(function () { return false; }); });
    logs.forEach(function (l) {
      if (l.type !== 'demo' || !m[l.staff_id] || Number(l.pct) !== 100) return;
      var i = C.demoDevices.indexOf(l.topic); if (i >= 0) m[l.staff_id][i] = true;
    });
    return m;
  }

  function viewBmDemo() {
    var u = user(), devs = C.demoDevices || [];
    var st = { pia: null, logs: [], filter: 'all', staffId: '', dev: devs[0], ticks: {}, saving: false };
    app.innerHTML = '<div class="wrap">' + header('สาขา ' + u.branch + ' · เฉพาะ PIA', 'Demo Product', true) + '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    Promise.all([loadTeam(u.branch), api({ action: 'logs', branch: u.branch, type: 'demo', limit: 1000 }).catch(function () { return { logs: [] }; })])
      .then(function (r) { st.pia = r[0].filter(function (m) { return m.position === 'PIA'; }); st.logs = r[1].logs || []; draw(); })
      .catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดรายชื่อไม่ได้: ' + esc(e.message) + '</div>'; });

    function draw() {
      var mx = demoMatrix(st.logs, st.pia);
      var rows = st.pia.filter(function (m) {
        if (st.filter === 'all') return true;
        if (st.filter === 'todo') return mx[m.id].filter(Boolean).length < devs.length;
        return m.id === st.filter;
      });
      var full = st.pia.filter(function (m) { return mx[m.id].filter(Boolean).length === devs.length; }).length;
      var steps = (C.demoSteps || {})[st.dev] || [];
      var nTick = steps.filter(function (s, i) { return st.ticks[i]; }).length;
      var who = st.pia.filter(function (m) { return m.id === st.staffId; })[0];
      var html =
        '<div class="card"><div class="row between"><h2 class="h2">ผ่านครบ 4 อุปกรณ์</h2><b>' + full + '/' + st.pia.length + ' คน</b></div>' +
        '<div class="field" style="margin-top:10px"><label for="flt">ตัวกรอง</label><select id="flt" class="input">' +
        '<option value="all"' + (st.filter === 'all' ? ' selected' : '') + '>ทุกคน (' + st.pia.length + ')</option>' +
        '<option value="todo"' + (st.filter === 'todo' ? ' selected' : '') + '>ยังผ่านไม่ครบ 4 อุปกรณ์ (' + (st.pia.length - full) + ')</option>' +
        st.pia.map(function (m) { return '<option value="' + esc(m.id) + '"' + (st.filter === m.id ? ' selected' : '') + '>' + esc(m.name) + '</option>'; }).join('') + '</select></div>' +
        '<div style="margin-top:10px"><table class="tbl compact"><thead><tr><th>PIA</th>' + devs.map(function (d) { return '<th class="num">' + esc(d) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        (rows.length ? rows.map(function (m) {
          return '<tr data-pick="' + esc(m.id) + '" style="cursor:pointer"><td>' + esc(m.name) + '</td>' + mx[m.id].map(function (ok) { return '<td class="num">' + (ok ? '<span class="dot ok" aria-label="ผ่าน"></span>' : '<span class="dot" aria-label="ยังไม่ผ่าน"></span>') + '</td>'; }).join('') + '</tr>';
        }).join('') : '<tr><td colspan="5" class="small good">ทุกคนผ่านครบแล้ว</td></tr>') + '</tbody></table></div>' +
        '<p class="tiny muted" style="margin:6px 0 0">แตะชื่อเพื่อเลือกคนที่จะ Demo</p></div>' +

        '<div class="card" style="margin-top:12px"><h2 class="h2">บันทึก Demo</h2>' +
        '<div class="field" style="margin-top:10px"><label for="emp">PIA</label>' + staffSelect('emp', st.pia, st.staffId, null, '— เลือก PIA (' + st.pia.length + ' คน) —') + '</div>' +
        '<div class="choices four" style="margin-top:10px">' + devs.map(function (d) {
          var ok = who && mx[who.id][devs.indexOf(d)];
          return '<button class="choice' + (d === st.dev ? ' on' : '') + '" data-dev="' + esc(d) + '" aria-pressed="' + (d === st.dev) + '">' + esc(d) + (ok ? ' ✓' : '') + '</button>';
        }).join('') + '</div>' +
        '<div style="margin-top:10px">' + steps.map(function (s, i) {
          return '<button class="step' + (st.ticks[i] ? ' on' : '') + '" data-tick="' + i + '" aria-pressed="' + !!st.ticks[i] + '"><span class="box">' + (st.ticks[i] ? '✓' : '') + '</span><span>' + (i + 1) + '. ' + esc(s) + '</span></button>';
        }).join('') + '</div>' +
        '<p class="tiny muted" style="margin:8px 0 0">ไม่จำกัดเวลา · ผ่านเมื่อทำครบ ' + steps.length + ' ขั้น</p></div>';
      var ready = who && nTick > 0 && !st.saving;
      html += '</div><div class="bottombar"><div class="inner"><button class="btn' + (nTick === steps.length ? '' : ' dark') + '" id="save"' + (ready ? '' : ' disabled') + '>' +
        (st.saving ? 'กำลังบันทึก…' : !who ? 'เลือก PIA ก่อน' : !nTick ? 'ติ๊กขั้นที่ทำได้' : nTick === steps.length ? 'ผ่าน · บันทึก ' + st.dev : 'บันทึก ' + nTick + '/' + steps.length + ' ขั้น (ยังไม่ผ่าน)') + '</button></div></div>';
      $('#body').innerHTML = html;
      $('#flt').onchange = function (e) { st.filter = e.target.value; if (st.filter !== 'all' && st.filter !== 'todo') st.staffId = st.filter; draw(); };
      $('#emp').onchange = function (e) { st.staffId = e.target.value; st.ticks = {}; draw(); };
      app.querySelectorAll('[data-pick]').forEach(function (el) { el.onclick = function () { st.staffId = el.getAttribute('data-pick'); st.ticks = {}; draw(); var t = $('#emp'); if (t) t.scrollIntoView({ block: 'center' }); }; });
      app.querySelectorAll('[data-dev]').forEach(function (el) { el.onclick = function () { st.dev = el.getAttribute('data-dev'); st.ticks = {}; var y = window.scrollY; draw(); window.scrollTo(0, y); }; });
      app.querySelectorAll('[data-tick]').forEach(function (el) { el.onclick = function () { var i = el.getAttribute('data-tick'); st.ticks[i] = !st.ticks[i]; var y = window.scrollY; draw(); window.scrollTo(0, y); }; });
      $('#save').onclick = function () {
        if (!ready) return;
        st.saving = true; draw();
        var answers = {}, failed = [];
        steps.forEach(function (s, i) { answers[i] = !!st.ticks[i]; if (!st.ticks[i]) failed.push(s); });
        var pct = Math.round(nTick / steps.length * 100);
        saveLog({ type: 'demo', staffId: who.id, staffName: who.name, staffPosition: 'PIA', topic: st.dev, score: nTick, maxScore: steps.length, pct: pct, failedItems: failed, answers: answers })
          .then(function () {
            toast(pct === 100 ? firstName(who.name) + ' ผ่าน ' + st.dev + ' แล้ว' : 'บันทึกแล้ว · ฝึกซ้ำขั้นที่ยังไม่ได้');
            st.logs.unshift({ type: 'demo', staff_id: who.id, topic: st.dev, pct: pct, saved_at: new Date().toISOString() });
            st.ticks = {}; st.saving = false; draw();
          }).catch(function (e) { st.saving = false; draw(); toast('บันทึกไม่สำเร็จ: ' + e.message); });
      };
    }
  }

  /* ---------------- BM · Role-play ---------------- */
  function viewBmRoleplay() {
    var u = user(), all = C.roleplay || [], DEVS = ['ทั้งหมด'].concat(C.roleplayDevices || []), TOTAL = 300;
    var pref = store('mp_rp_dev');
    var st = { dev: DEVS.indexOf(pref) >= 0 ? pref : 'ทั้งหมด', c: null, left: TOTAL, running: false, team: null, staffId: '', deck: null };
    var timer = null;
    function stop() { if (timer) { clearInterval(timer); timers = timers.filter(function (t) { return t !== timer; }); timer = null; } st.running = false; }
    // สำรับโจทย์: สุ่มลำดับแล้ววนจนครบทุกข้อก่อนเริ่มรอบใหม่ (จำไว้ในเครื่อง)
    function pool() { return all.map(function (c, i) { return i; }).filter(function (i) { return st.dev === 'ทั้งหมด' || all[i].dev === st.dev; }); }
    function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
    function nextCase() {
      var key = 'mp_rp_deck_' + st.dev, d = store(key), p = pool();
      if (!d || !d.order || d.pos >= d.order.length || d.order.some(function (i) { return p.indexOf(i) < 0; }) || d.order.length !== p.length) {
        var last = d && d.order ? d.order[d.order.length - 1] : -1;
        var order = shuffle(p.slice());
        if (order.length > 1 && order[0] === last) { order.push(order.shift()); }
        d = { order: order, pos: 0, round: (d && d.round || 0) + 1 };
      }
      st.c = all[d.order[d.pos]]; st.deck = { pos: d.pos + 1, n: d.order.length, round: d.round };
      d.pos++; store(key, d);
    }
    nextCase();
    app.innerHTML = '<div class="wrap">' + header('สาขา ' + u.branch + ' · BM เล่นเป็นลูกค้า', 'Role-play', true) + '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    loadTeam(u.branch).then(function (t) { st.team = t; draw(); }).catch(function () { st.team = []; draw(); });

    function draw() {
      var c = st.c, mm = Math.floor(st.left / 60), ss = String(st.left % 60).padStart(2, '0');
      var html =
        '<div class="field"><label for="emp">พนักงานที่ฝึก</label>' + staffSelect('emp', st.team, st.staffId) + '</div>' +
        '<div class="label-strong" style="margin:12px 0 6px">อุปกรณ์</div>' +
        '<div class="seg">' + DEVS.map(function (d) { var n = d === 'ทั้งหมด' ? all.length : all.filter(function (x) { return x.dev === d; }).length; return '<button class="choice' + (d === st.dev ? ' on' : '') + '" data-dev="' + esc(d) + '" aria-pressed="' + (d === st.dev) + '">' + esc(d) + ' <span class="tiny" style="opacity:.7">' + n + '</span></button>'; }).join('') + '</div>' +
        '<div class="card dark" style="margin-top:12px"><div class="row between" style="flex-wrap:wrap;gap:6px"><span class="row" style="gap:6px"><span class="chip" style="background:#1E5BD8;color:#fff">' + esc(c.dev) + '</span><span class="chip" style="background:#262A33;color:#B9BFCA">' + esc(c.type) + '</span></span>' +
        '<span class="small muted">โจทย์ ' + st.deck.pos + '/' + st.deck.n + (st.deck.round > 1 ? ' · รอบ ' + st.deck.round : '') + '</span></div>' +
        '<div class="small muted" style="margin-top:10px">ลูกค้าวันนี้คือ</div>' +
        '<div style="font-size:24px;font-weight:700;margin-top:2px">' + esc(c.who) + '</div>' +
        '<div class="grid-rp" style="margin-top:10px">' +
        '<div><div class="tiny" style="color:#8FB2FF;font-weight:700">WHICH · ใช้อะไรอยู่</div><div class="small">' + esc(c.which) + '</div></div>' +
        '<div><div class="tiny" style="color:#8FB2FF;font-weight:700">USE FOR · ใช้ทำอะไร</div><div class="small">' + esc(c.use) + '</div></div>' +
        '<div><div class="tiny" style="color:#8FB2FF;font-weight:700">PAIN POINT</div><div class="small">' + esc(c.pain) + '</div></div>' +
        '<div><div class="tiny" style="color:#FF9B5C;font-weight:700">ข้อโต้แย้งที่จะเจอ</div><div class="small">“' + esc(c.objection) + '”</div></div></div>' +
        '<p class="tiny muted" style="margin:10px 0 0">ห้ามบอกข้อมูลในการ์ดถ้าพนักงานไม่ถาม</p></div>' +
        '<details class="card" style="margin-top:12px"><summary class="small" style="font-weight:700;cursor:pointer">เฉลยสำหรับ BM · สิ่งที่พนักงานควรเสนอ</summary><p class="small" style="margin:8px 0 0">' + esc(c.offer) + '</p></details>' +
        '<div class="card" style="margin-top:12px;text-align:center"><div class="small muted">เวลาขาย</div>' +
        '<div id="clock" style="font-size:56px;font-weight:700;font-variant-numeric:tabular-nums;color:' + (st.left <= 30 ? '#B4400B' : '#16181D') + '">' + mm + ':' + ss + '</div>' +
        '<div class="bar" style="margin:4px 0 12px"><i style="width:' + Math.round(st.left / TOTAL * 100) + '%"></i></div>' +
        '<div class="grid2"><button class="btn" id="run">' + (st.running ? 'หยุดชั่วคราว' : st.left === 0 ? 'หมดเวลา' : 'เริ่มจับเวลา') + '</button><button class="btn ghost" id="reset">เริ่มใหม่</button></div></div>' +
        '<div class="card" style="margin-top:12px"><b class="small">พนักงานต้องทำให้ครบ</b><ol class="small" style="margin:6px 0 0;padding-left:20px"><li>ถาม Who / Which / Use for / Pain point</li><li>แนะนำรุ่นตรงการใช้งาน</li><li>เสนอคู่ Cover+ / AppleCare+ และ ACC</li><li>เสนอ Ufund / Trade-in</li><li>ตอบข้อโต้แย้งและปิดการขาย</li></ol></div>' +
        '<button class="btn ghost" id="next" style="margin-top:12px">โจทย์ถัดไป</button>';
      html += '</div><div class="bottombar"><div class="inner"><button class="btn dark" id="score"' + (st.staffId ? '' : ' disabled') + '>' + (st.staffId ? 'จบ · ให้คะแนน' : 'เลือกพนักงานก่อนให้คะแนน') + '</button></div></div>';
      var det = app.querySelector('details'), open = det && det.open;
      $('#body').innerHTML = html;
      if (open) app.querySelector('details').open = true;
      $('#emp').onchange = function (e) { st.staffId = e.target.value; draw(); };
      app.querySelectorAll('[data-dev]').forEach(function (el) {
        el.onclick = function () { stop(); st.left = TOTAL; st.dev = el.getAttribute('data-dev'); store('mp_rp_dev', st.dev); nextCase(); draw(); };
      });
      $('#run').onclick = function () {
        if (st.running) { stop(); draw(); return; }
        if (st.left === 0) return;
        st.running = true;
        timer = setInterval(function () { st.left = Math.max(0, st.left - 1); if (st.left === 0) { stop(); if (navigator.vibrate) navigator.vibrate(300); } draw(); }, 1000);
        timers.push(timer); draw();
      };
      $('#reset').onclick = function () { stop(); st.left = TOTAL; draw(); };
      $('#next').onclick = function () { stop(); st.left = TOTAL; nextCase(); draw(); window.scrollTo(0, 0); };
      $('#score').onclick = function () {
        if (!st.staffId) return;
        stop(); store('mp_rp', { staffId: st.staffId, who: c.dev + ' · ' + c.who }); go('#/bm/score/' + st.staffId);
      };
    }
  }

  /* ---------------- BM · การ์ดฝึก (ข้อโต้แย้ง / คำถาม Demo) ---------------- */
  function viewCards(kind) {
    var u = user(), isDemo = kind === 'democards';
    var all = isDemo ? (C.demoCards || []) : (C.objections || []);
    var tabs = isDemo ? ['ทั้งหมด'].concat(C.demoDevices, ['รวม']) : null;
    var st = { tab: 'ทั้งหมด', order: [], pos: 0, flipped: false, res: [] };
    function deck() { return isDemo && st.tab !== 'ทั้งหมด' ? all.filter(function (c) { return c.dev === st.tab; }) : all; }
    function shuffle() { var d = deck(); st.order = d.map(function (c, i) { return i; }); for (var i = st.order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = st.order[i]; st.order[i] = st.order[j]; st.order[j] = t; } st.pos = 0; st.flipped = false; st.res = []; }
    shuffle();
    app.innerHTML = '<div class="wrap">' + header('สาขา ' + u.branch + ' · ใช้ตอน Huddle เช้า', isDemo ? 'การ์ดคำถาม Demo' : 'การ์ดข้อโต้แย้ง', true) + '<div id="body"></div></div>';
    wireHeader();
    function draw() {
      var d = deck(), total = d.length, done = st.pos >= total, c = done ? null : d[st.order[st.pos]];
      var known = st.res.filter(function (x) { return x; }).length;
      var html = (tabs ? '<div class="seg">' + tabs.map(function (t) { return '<button class="choice' + (t === st.tab ? ' on' : '') + '" data-tab="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="row" style="gap:4px;margin:12px 0 10px;flex-wrap:wrap">' + d.map(function (x, i) {
          var col = st.res[i] === true ? '#1E5BD8' : st.res[i] === false ? '#C2410C' : i === st.pos ? '#16181D' : '#D3D7DE';
          return '<span style="width:10px;height:10px;border-radius:5px;background:' + col + '"></span>';
        }).join('') + '<span class="small muted" style="margin-left:6px">' + Math.min(st.pos + 1, total) + '/' + total + '</span></div>';
      if (done) {
        html += '<div class="card dark" style="text-align:center"><div class="small muted">ผลรอบนี้</div><div style="font-size:44px;font-weight:700;color:#8FB2FF">' + known + '/' + total + '</div>' +
          '<p class="small muted" style="margin:4px 0 12px">' + (isDemo ? 'ข้อที่ยังตอบไม่ได้ ให้ฝึก Demo กับเครื่องโชว์ซ้ำก่อนรอบถัดไป' : 'การ์ดที่ยังตอบไม่ได้ ให้ฝึกซ้ำในรอบถัดไป') + '</p>' +
          '<button class="btn" id="again">เริ่มรอบใหม่</button></div>';
      } else {
        html += '<div class="card dark flash">' +
          '<div class="small muted">' + (isDemo ? 'ลูกค้าถามระหว่าง Demo · <b style="color:#8FB2FF">' + esc(c.dev) + '</b>' : 'ลูกค้าพูดว่า') + '</div>' +
          '<div style="font-size:24px;font-weight:700;line-height:1.35;margin-top:6px">“' + esc(c.q) + '”</div>' +
          (st.flipped ? '<div style="border-top:1px solid #333844;margin-top:14px;padding-top:12px">' +
            '<div class="tiny" style="color:#8FB2FF;font-weight:700">' + (isDemo ? 'แนวทางตอบ' : 'ตอบใน 1 ประโยค') + '</div><div style="margin-top:2px">' + esc(c.a) + '</div>' +
            (isDemo ? '<div class="tiny" style="color:#8FB2FF;font-weight:700;margin-top:10px">Demo ให้ดู</div><div class="small" style="margin-top:2px">' + esc(c.show) + '</div>' : '') +
            '<div class="row" style="margin-top:10px"><span class="chip" style="background:#262A33;color:#B9BFCA">ต่อยอด · ' + esc(c.tag) + '</span></div></div>' :
            '<p class="small muted" style="margin:14px 0 0">' + (isDemo ? 'ให้พนักงานตอบพร้อมจับเครื่องโชว์ทำให้ดูจริง แล้วค่อยกดดูแนวทาง' : 'ให้พนักงานลองตอบออกเสียงก่อน แล้วค่อยกดดูคำตอบ') + '</p>') + '</div>' +
          (st.flipped ? '<div class="grid2" style="margin-top:12px"><button class="btn ghost" data-ans="0">ยังตอบไม่ได้</button><button class="btn" data-ans="1">' + (isDemo ? 'ตอบและ Demo ได้' : 'ตอบได้แล้ว') + '</button></div>'
            : '<button class="btn dark" id="flip" style="margin-top:12px">' + (isDemo ? 'ดูแนวทางตอบ' : 'ดูคำตอบ') + '</button>');
      }
      $('#body').innerHTML = html;
      app.querySelectorAll('[data-tab]').forEach(function (el) { el.onclick = function () { st.tab = el.getAttribute('data-tab'); shuffle(); draw(); }; });
      var f = $('#flip'); if (f) f.onclick = function () { st.flipped = true; draw(); };
      app.querySelectorAll('[data-ans]').forEach(function (el) { el.onclick = function () { st.res[st.pos] = el.getAttribute('data-ans') === '1'; st.pos++; st.flipped = false; draw(); }; });
      var a = $('#again'); if (a) a.onclick = function () { shuffle(); draw(); };
    }
    draw();
  }


  /* =====================================================================
     v3 · กระดานเขียนด้วย Apple Pencil + ประเมินการทำงานของ BM
     ===================================================================== */

  /* ---------------- กระดานเขียนด้วยมือ ---------------- */
  // openSketch(strokes, done) · strokes = เส้นเดิม (แก้ต่อได้) · done(dataUrl, strokes)
  function openSketch(initial, done) {
    var strokes = (initial || []).map(function (s) { return { c: s.c, pts: s.pts.slice() }; });
    var mode = 'pen', penSeen = false, cur = null;
    var ov = document.createElement('div');
    ov.className = 'sketch-ov';
    ov.innerHTML = '<div class="sketch-bar">' +
      '<button class="btn ghost small" data-k="cancel">ยกเลิก</button>' +
      '<div class="row" style="gap:6px"><button class="choice on" data-k="pen" aria-pressed="true">ปากกา</button><button class="choice" data-k="eraser" aria-pressed="false">ยางลบ</button>' +
      '<button class="choice" data-k="undo">ย้อน</button><button class="choice" data-k="clear">ล้าง</button></div>' +
      '<button class="btn small" data-k="done">เสร็จ</button></div>' +
      '<div class="sketch-wrap"><canvas></canvas><div class="sketch-hint">เขียนด้วย Apple Pencil หรือนิ้ว · ใช้ Pencil แล้วระบบจะไม่รับการแตะของฝ่ามือ</div></div>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    var cv = ov.querySelector('canvas'), ctx = cv.getContext('2d'), wrap = ov.querySelector('.sketch-wrap'), hint = ov.querySelector('.sketch-hint');
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      W = wrap.clientWidth; H = wrap.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      redraw();
    }
    function drawStroke(c, s) {
      var P = s.pts; if (!P.length) return;
      c.strokeStyle = s.c === 'e' ? '#fff' : '#16181D'; c.lineCap = 'round'; c.lineJoin = 'round';
      if (P.length === 1) { c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(P[0][0] * W, P[0][1] * H, P[0][2] / 2, 0, Math.PI * 2); c.fill(); return; }
      for (var i = 1; i < P.length; i++) {
        c.lineWidth = s.c === 'e' ? 22 : (P[i - 1][2] + P[i][2]) / 2;
        c.beginPath(); c.moveTo(P[i - 1][0] * W, P[i - 1][1] * H); c.lineTo(P[i][0] * W, P[i][1] * H); c.stroke();
      }
    }
    function redraw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      strokes.forEach(function (s) { drawStroke(ctx, s); });
      hint.hidden = strokes.length > 0;
    }
    function pt(e) {
      var r = cv.getBoundingClientRect();
      var w = e.pointerType === 'pen' ? 1.2 + (e.pressure || 0.5) * 3.6 : 2.6;
      return [(e.clientX - r.left) / W, (e.clientY - r.top) / H, w];
    }
    cv.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'pen') penSeen = true;
      if (penSeen && e.pointerType === 'touch') return; // กันฝ่ามือ
      e.preventDefault(); cv.setPointerCapture(e.pointerId);
      cur = { c: mode === 'eraser' ? 'e' : 'p', pts: [pt(e)], id: e.pointerId };
      strokes.push(cur); redraw();
    });
    cv.addEventListener('pointermove', function (e) {
      if (!cur || e.pointerId !== cur.id) return;
      e.preventDefault();
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      if (!evs.length) evs = [e];
      var c0 = cur.pts.length - 1;
      evs.forEach(function (ev) { cur.pts.push(pt(ev)); });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStroke(ctx, { c: cur.c, pts: cur.pts.slice(c0) });
    });
    function end(e) { if (cur && e.pointerId === cur.id) cur = null; }
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    ['touchstart', 'touchmove'].forEach(function (t) { cv.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false }); });

    function close() { window.removeEventListener('resize', size); ov.remove(); document.body.style.overflow = ''; }
    ov.querySelector('.sketch-bar').onclick = function (e) {
      var b = e.target.closest('[data-k]'); if (!b) return;
      var k = b.getAttribute('data-k');
      if (k === 'pen' || k === 'eraser') {
        mode = k;
        ov.querySelectorAll('[data-k="pen"],[data-k="eraser"]').forEach(function (x) { var on = x.getAttribute('data-k') === k; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
      }
      if (k === 'undo') { strokes.pop(); redraw(); }
      if (k === 'clear') { strokes = []; redraw(); }
      if (k === 'cancel') close();
      if (k === 'done') {
        var keep = strokes.filter(function (s) { return s.c === 'p'; }).length ? strokes : [];
        var url = '';
        if (keep.length) {
          var maxW = 1400, sc = Math.min(1, maxW / W), out = document.createElement('canvas');
          out.width = Math.round(W * sc * 1.5); out.height = Math.round(H * sc * 1.5);
          var o = out.getContext('2d'), saveW = W, saveH = H;
          o.fillStyle = '#fff'; o.fillRect(0, 0, out.width, out.height);
          W = out.width; H = out.height; keep.forEach(function (s) { drawStroke(o, { c: s.c, pts: s.pts.map(function (p) { return [p[0], p[1], p[2] * sc * 1.5]; }) }); });
          W = saveW; H = saveH;
          url = out.toDataURL('image/png');
        }
        close(); done(url, keep);
      }
    };
    window.addEventListener('resize', size);
    size();
  }

  // ช่องภาพเขียนในฟอร์ม
  function sketchBlock(sk) {
    return '<div class="sketch-field">' +
      (sk && sk.url ? '<img src="' + sk.url + '" alt="ภาพเขียนด้วยมือ">' : '') +
      '<div class="row" style="gap:8px;margin-top:' + (sk && sk.url ? '8px' : '0') + '">' +
      '<button class="btn ghost small" data-sketch="open" style="flex:1">' + ICON.pen + (sk && sk.url ? ' แก้ไขภาพเขียน' : ' เขียนด้วย Pencil') + '</button>' +
      (sk && sk.url ? '<button class="btn ghost small" data-sketch="del">ลบภาพ</button>' : '') + '</div></div>';
  }
  function wireSketch(sk, redraw) {
    var o = app.querySelector('[data-sketch="open"]');
    if (o) o.onclick = function () { openSketch(sk.strokes, function (url, strokes) { sk.url = url; sk.strokes = strokes; redraw(); }); };
    var d = app.querySelector('[data-sketch="del"]');
    if (d) d.onclick = function () { sk.url = ''; sk.strokes = []; redraw(); };
  }
  function sketchView(url) {
    return url ? '<div class="card" style="margin-top:12px"><h2 class="h2">ภาพเขียนด้วยมือ</h2><img class="sketch-img" src="' + esc(url) + '" alt="ภาพเขียนด้วยมือ" loading="lazy"></div>' : '';
  }

  /* ---------------- ประเมิน BM · คำนวณ ---------------- */
  function gradeOf(t) { return t == null ? '–' : t >= 90 ? 'A' : t >= 80 ? 'B' : t >= 70 ? 'C' : 'D'; }
  function gradeCls(g) { return g === 'A' || g === 'B' ? 'good' : g === '–' ? 'muted' : 'bad'; }
  function round1(x) { return Math.round(x * 10) / 10; }

  function computeAuto(period, team, logs, audits) {
    var inP = function (d) { return monthKey(d) === period; };
    var scored = {}; logs.forEach(function (l) { if (l.type === 'score' && inP(l.saved_at)) scored[l.staff_id] = 1; });
    var pia = team.filter(function (m) { return m.position === 'PIA'; });
    var mx = demoMatrix(logs, pia);
    var full = pia.filter(function (m) { return mx[m.id].filter(Boolean).length === C.demoDevices.length; }).length;
    var a = audits[0];
    var raw = {
      scoreCover: { v: Object.keys(scored).length + '/' + team.length + ' คน', r: team.length ? Object.keys(scored).length / team.length : 0 },
      demo: { v: full + '/' + pia.length + ' PIA', r: pia.length ? full / pia.length : 0 },
      audit: { v: a ? a.total_pct + '% · ' + fmtDate(a.saved_at).split(' ').slice(0, 3).join(' ') : 'ยังไม่มีผลประเมิน', r: a ? Number(a.total_pct) / 80 : 0 }
    };
    var rows = C.bmEvalAuto.map(function (d) { var x = raw[d.k]; return { k: d.k, name: d.name, how: d.how, w: d.w, v: x.v, pts: round1(d.w * Math.min(1, x.r)) }; });
    return { rows: rows, score: round1(rows.reduce(function (s, r) { return s + r.pts; }, 0)), max: rows.reduce(function (s, r) { return s + r.w; }, 0) };
  }

  /* ---------------- ประเมิน BM · ฟอร์ม (ASM) ---------------- */
  function viewBmEvalForm() {
    var u = user(), SECS = C.bmEvalSections || [];
    var TABS = [{ id: 'auto', name: 'อัตโนมัติ' }].concat(SECS).concat([{ id: 'sum', name: 'สรุป' }]);
    var st = { branch: '', bmId: '', mgrs: null, data: null, prev: null, tab: 0, marks: {}, notes: {}, caseQ: '', plan: '', agree: '', note: '', sk: { url: '', strokes: [] }, ph: { list: [], busy: 0 }, saving: false, period: monthKey(new Date()), loadErr: '' };

    function load() {
      st.mgrs = null; st.data = null; st.prev = null; st.loadErr = ''; draw();
      var code = st.branch;
      Promise.all([
        api({ action: 'staff', branch: code, scope: 'mgr' }),
        loadTeam(code),
        api({ action: 'logs', branch: code, limit: 1000 }),
        api({ action: 'audits', branch: code, limit: 5 }),
        api({ action: 'evals', branch: code, limit: 12 })
      ]).then(function (r) {
        if (code !== st.branch) return;
        st.mgrs = (r[0].staff || []).sort(function (a, b) { return a.position === 'BM' ? -1 : b.position === 'BM' ? 1 : 0; });
        if (!st.mgrs.some(function (m) { return m.id === st.bmId; })) st.bmId = st.mgrs[0] ? st.mgrs[0].id : '';
        st.data = { team: r[1], logs: r[2].logs || [], audits: r[3].audits || [] };
        st.evals = r[4].evals || [];
        draw();
      }).catch(function (e) { st.loadErr = e.message; draw(); });
    }

    function stats() {
      var auto = st.data ? computeAuto(st.period, st.data.team, st.data.logs, st.data.audits) : null;
      var secs = SECS.map(function (s) {
        var p = 0, f = 0;
        s.items.forEach(function (t, i) { var v = st.marks[s.id + '-' + i]; if (v === 'pass') p++; else if (v === 'fail') f++; });
        return { id: s.id, name: s.name, w: s.w, p: p, f: f, n: s.items.length, done: p + f === s.items.length, pts: round1(s.w * p / s.items.length) };
      });
      var bScore = round1(secs.reduce(function (a, s) { return a + s.pts; }, 0));
      var total = auto ? Math.round(auto.score + bScore) : null;
      return { auto: auto, secs: secs, bScore: bScore, total: total, all: secs.every(function (s) { return s.done; }), remain: secs.reduce(function (a, s) { return a + s.n - s.p - s.f; }, 0) };
    }

    function draw() {
      var S = stats(), tab = TABS[st.tab], b = branch(st.branch);
      var bm = (st.mgrs || []).filter(function (m) { return m.id === st.bmId; })[0];
      var prev = (st.evals || []).filter(function (e) { return !bm || String(e.bm_id) === bm.id; })[0];
      var html = '<div class="wrap">' + header('ASM · ' + u.name + ' · ' + monthLabel(st.period), 'ประเมิน BM', true) +
        '<div class="grid-ipad-2"><div class="field"><label for="br">สาขา</label><select id="br" class="input"><option value="">— เลือกสาขา —</option>' +
        BRANCHES.map(function (x) { return '<option value="' + x.code + '"' + (x.code === st.branch ? ' selected' : '') + '>ID' + x.code + ' : ' + esc(x.name) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="bm">BM / ABM ที่ประเมิน</label><select id="bm" class="input"' + (st.mgrs ? '' : ' disabled') + '>' +
        (!st.branch ? '<option>— เลือกสาขาก่อน —</option>' : !st.mgrs ? '<option>' + (st.loadErr ? 'โหลดไม่ได้' : 'กำลังโหลด…') + '</option>' : !st.mgrs.length ? '<option value="">ไม่พบ BM / ABM ในชีต</option>' :
          st.mgrs.map(function (m) { return '<option value="' + esc(m.id) + '"' + (m.id === st.bmId ? ' selected' : '') + '>' + esc(m.name) + ' · ' + esc(m.position) + '</option>'; }).join('')) + '</select></div></div>' +
        (st.loadErr ? '<div class="alert" style="margin-top:8px">โหลดข้อมูลสาขาไม่ได้: ' + esc(st.loadErr) + '</div>' : '');

      if (st.branch && st.data) {
        if (prev) {
          html += '<div class="card" style="margin-top:12px;border:1px solid var(--line)"><div class="row between"><b class="small">ครั้งก่อน · ' + esc(monthLabel(prev.period)) + '</b><b class="' + gradeCls(prev.grade) + '">' + prev.total_score + ' · เกรด ' + esc(prev.grade) + '</b></div>' +
            (prev.agreements ? '<div class="small" style="margin-top:6px"><span class="muted">ข้อตกลง:</span> <span style="white-space:pre-wrap">' + esc(prev.agreements) + '</span></div>' : '') +
            (prev.bm_plan ? '<div class="small" style="margin-top:4px"><span class="muted">แผนแก้ปัญหาของ BM:</span> <span style="white-space:pre-wrap">' + esc(prev.bm_plan) + '</span></div>' : '') + '</div>';
        }
        html += '<div class="seg" style="margin-top:12px">' + TABS.map(function (t, i) {
          var sec = S.secs.filter(function (s) { return s.id === t.id; })[0];
          var lab = t.id === 'auto' ? 'A · อัตโนมัติ' : t.id === 'sum' ? 'สรุป' : 'B' + i + ' · ' + t.name;
          var sub = t.id === 'auto' ? S.auto.score + '/' + S.auto.max : t.id === 'sum' ? (S.total == null ? '' : S.total + ' คะแนน') : (sec.p + sec.f) + '/' + sec.n + ' ข้อ';
          return '<button class="tab' + (i === st.tab ? ' on' : sec && sec.done ? ' done' : '') + '" data-tab="' + i + '" style="min-width:132px"><b>' + esc(lab) + '</b><span>' + esc(sub) + '</span></button>';
        }).join('') + '</div>';

        if (tab.id === 'auto') {
          html += '<p class="small muted" style="margin:12px 4px 8px">ระบบคำนวณจากข้อมูลที่ BM บันทึกในแอปเดือนนี้ · AM ไม่ต้องกรอก</p>' +
            S.auto.rows.map(function (r) {
              return '<div class="item ' + (r.pts >= r.w ? 'pass' : 'fail') + '"><div class="row between" style="align-items:flex-start"><div style="flex:1"><b>' + esc(r.name) + '</b><div class="small muted">' + esc(r.how) + '</div><div class="small" style="margin-top:4px">ผล: <b>' + esc(r.v) + '</b></div></div>' +
                '<div class="score" style="min-width:64px">' + r.pts + '<span class="small muted">/' + r.w + '</span></div></div></div>';
            }).join('');
        } else if (tab.id === 'sum') {
          html += '<div class="card dark" style="margin-top:12px"><div class="row between"><span class="small muted">คะแนนรวม · ' + esc(bm ? bm.name : '') + '</span><span class="small muted">' + (S.all ? '' : 'ยังเหลือ ' + S.remain + ' ข้อ') + '</span></div>' +
            '<div class="row" style="align-items:baseline;gap:12px"><span style="font-size:44px;font-weight:700;color:' + (S.total >= 80 ? '#8FB2FF' : '#FF9B5C') + '">' + S.total + '</span><span style="font-size:20px;font-weight:700">เกรด ' + gradeOf(S.total) + '</span></div>' +
            '<div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">' +
            [{ name: 'A · อัตโนมัติ', pts: S.auto.score, w: S.auto.max }].concat(S.secs).map(function (s) {
              var p = Math.round(s.pts / s.w * 100);
              return '<div class="row"><span class="small ellipsis" style="width:42%">' + esc(s.name) + '</span>' + bar(p, true) + '<span class="small" style="width:60px;text-align:right;font-weight:700">' + s.pts + '/' + s.w + '</span></div>';
            }).join('') + '</div><p class="tiny muted" style="margin:8px 0 0">เกรด A 90+ · B 80–89 · C 70–79 · D ต่ำกว่า 70</p></div>' +
            '<div class="field" style="margin-top:14px"><label for="agree">ข้อตกลงครั้งนี้ (1–3 ข้อ)</label><textarea id="agree" class="input" placeholder="เช่น 1. Huddle ทุกเช้า 10 นาที แจ้งยอด ATT รายคน&#10;2. Spot-check 5 บิล/สัปดาห์">' + esc(st.agree) + '</textarea>' +
            '<span class="tiny muted">BM เห็นที่หน้าแรก · ครั้งหน้าระบบจะดึงมาให้เช็กในข้อ "ทำตามข้อตกลงครั้งก่อน" · เขียนด้วย Pencil ลงช่องนี้ได้เลย (Scribble)</span></div>' +
            '<div class="field" style="margin-top:12px"><label for="note">โน้ตเพิ่มเติม</label><textarea id="note" class="input" placeholder="จุดแข็ง สิ่งที่ต้องพัฒนา">' + esc(st.note) + '</textarea></div>' +
            '<div class="field" style="margin-top:12px"><label>รูปภาพ (ไม่บังคับ)</label>' + photoBlock(st.ph) + '<span class="tiny muted">เช่น รูปบอร์ดเป้า ตารางงาน หรือจุดที่ต้องแก้ · สูงสุด ' + MAX_PHOTOS + ' รูป</span></div>' +
            '<div class="field" style="margin-top:12px"><label>ภาพเขียนด้วยมือ (ไม่บังคับ)</label>' + sketchBlock(st.sk) + '<span class="tiny muted">วาดแผนผังร้าน วงจุดที่ต้องแก้ หรือจดอิสระ · เก็บเป็นรูปใน Google Drive</span></div>';
        } else {
          var si = SECS.indexOf(tab);
          if (tab.caseQuestion) {
            html += '<div class="card" style="margin-top:12px;border:2px solid var(--blue)"><div class="field"><label for="caseQ">โจทย์ประจำครั้ง · ถาม BM 1 ข้อ</label><textarea id="caseQ" class="input" style="min-height:72px" placeholder="พิมพ์หรือเขียนด้วย Pencil">' + esc(st.caseQ) + '</textarea></div>' +
              '<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px">' + C.bmEvalCaseExamples.map(function (q, i) { return '<button class="chip blue" data-ex="' + i + '" style="border:0;cursor:pointer;text-align:left">' + esc(q) + '</button>'; }).join('') + '</div>' +
              '<div class="field" style="margin-top:10px"><label for="plan">แผนที่ BM เสนอ</label><textarea id="plan" class="input" placeholder="ทำอะไร ใครทำ เสร็จเมื่อไหร่ วัดผลด้วยตัวเลขอะไร">' + esc(st.plan) + '</textarea>' +
              '<span class="tiny muted">ครั้งหน้าระบบจะดึงแผนนี้มาให้เช็กในข้อ "ติดตามผลและปรับแผน"</span></div></div>';
          }
          html += '<p class="small muted" style="margin:12px 4px 8px">' + esc(tab.name) + ' · ' + tab.w + ' คะแนน · ติ๊กผ่าน / ไม่ผ่าน</p>';
          tab.items.forEach(function (t, i) {
            var k = tab.id + '-' + i, v = st.marks[k];
            var ref = '';
            if (prev && tab.id === 'b4' && /ข้อตกลง/.test(t) && prev.agreements) ref = 'ข้อตกลงครั้งก่อน: ' + prev.agreements;
            if (prev && tab.id === 'b5' && /ติดตามผล/.test(t) && prev.bm_plan) ref = 'แผนครั้งก่อน: ' + prev.bm_plan;
            html += '<div class="item ' + (v || '') + '"><div class="q"><span class="n">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>' +
              (ref ? '<div class="small" style="margin:8px 0 0;background:var(--bg);border-radius:8px;padding:8px 10px;white-space:pre-wrap">' + esc(ref) + '</div>' : '') +
              '<div class="pf"><button data-mark="' + k + '" data-v="pass" class="' + (v === 'pass' ? 'on-pass' : '') + '" aria-pressed="' + (v === 'pass') + '">ผ่าน</button>' +
              '<button data-mark="' + k + '" data-v="fail" class="' + (v === 'fail' ? 'on-fail' : '') + '" aria-pressed="' + (v === 'fail') + '">ไม่ผ่าน</button></div>' +
              (v === 'fail' ? '<input class="input note" data-note="' + k + '" placeholder="พบอะไร (ไม่บังคับ)" value="' + esc(st.notes[k] || '') + '">' + itemPhotoBtn(st.ph, tab.name + ': ' + t) : '') + '</div>';
          });
        }
      } else if (st.branch) {
        html += st.loadErr ? '' : loading('กำลังดึงข้อมูลสาขา…');
      } else {
        html += '<div class="card" style="margin-top:12px"><b>เลือกสาขาเพื่อเริ่มประเมิน</b><p class="small muted" style="margin:4px 0 0">ระบบจะดึงชื่อ BM / ABM จากชีต Manpower และคำนวณส่วน A ให้อัตโนมัติ</p></div>';
      }

      var last = st.tab === TABS.length - 1, ready = st.data && bm && S.all && !st.saving;
      var label = !st.data ? 'เลือกสาขาก่อน' : !last ? 'ต่อไป: ' + (TABS[st.tab + 1].id === 'sum' ? 'สรุป' : TABS[st.tab + 1].name) : !bm ? 'เลือก BM ก่อน' : !S.all ? 'ยังเหลือ ' + S.remain + ' ข้อ' : st.saving ? 'กำลังบันทึก…' : 'บันทึกผลประเมิน BM';
      html += '</div><div class="bottombar"><div class="inner"><button class="btn" id="next"' + (st.data && (!last || ready) ? '' : ' disabled') + '>' + esc(label) + '</button></div></div>';
      app.innerHTML = html;
      wireHeader();

      $('#br').onchange = function (e) { st.branch = e.target.value; st.bmId = ''; st.tab = 0; st.marks = {}; st.notes = {}; if (st.branch) load(); else draw(); };
      var bs = $('#bm'); if (bs) bs.onchange = function (e) { st.bmId = e.target.value; draw(); };
      app.querySelectorAll('[data-tab]').forEach(function (el) { el.onclick = function () { st.tab = Number(el.getAttribute('data-tab')); draw(); window.scrollTo(0, 0); }; });
      app.querySelectorAll('[data-mark]').forEach(function (el) {
        el.onclick = function () { var k = el.getAttribute('data-mark'), v = el.getAttribute('data-v'); st.marks[k] = st.marks[k] === v ? undefined : v; var y = window.scrollY; draw(); window.scrollTo(0, y); };
      });
      app.querySelectorAll('[data-note]').forEach(function (el) { el.oninput = function () { st.notes[el.getAttribute('data-note')] = el.value; }; });
      app.querySelectorAll('[data-ex]').forEach(function (el) { el.onclick = function () { st.caseQ = C.bmEvalCaseExamples[Number(el.getAttribute('data-ex'))]; var y = window.scrollY; draw(); window.scrollTo(0, y); }; });
      [['caseQ', 'caseQ'], ['plan', 'plan'], ['agree', 'agree'], ['note', 'note']].forEach(function (p) { var el = $('#' + p[0]); if (el) el.oninput = function () { st[p[1]] = el.value; }; });
      wireSketch(st.sk, function () { var y = window.scrollY; draw(); window.scrollTo(0, y); });
      wirePhotos(st.ph, function () { var y = window.scrollY; draw(); window.scrollTo(0, y); });
      $('#next').onclick = function () {
        if (!st.data) return;
        if (!last) { st.tab++; draw(); window.scrollTo(0, 0); return; }
        if (!ready) return;
        if (st.ph.busy) { toast('รอเตรียมรูปสักครู่'); return; }
        submit(S, bm);
      };
    }

    function submit(S, bm) {
      st.saving = true; draw();
      var failed = [];
      SECS.forEach(function (s) { s.items.forEach(function (t, i) { var k = s.id + '-' + i; if (st.marks[k] === 'fail') failed.push(s.name + ': ' + t + (st.notes[k] ? ' (' + st.notes[k] + ')' : '')); }); });
      var answers = {}; Object.keys(st.marks).forEach(function (k) { answers[k] = { v: st.marks[k], note: st.notes[k] || '' }; });
      var sections = { auto: S.auto.rows.map(function (r) { return { k: r.k, v: r.v, pts: r.pts, w: r.w }; }) };
      S.secs.forEach(function (s) { sections[s.id] = { pts: s.pts, w: s.w, p: s.p, n: s.n }; });
      api({ action: 'saveEval', ev: {
        period: st.period, branch: st.branch, bmId: bm.id, bmName: bm.name, bmPosition: bm.position,
        auditorId: u.id, auditorName: u.name, autoScore: S.auto.score, bScore: S.bScore, totalScore: S.total, grade: gradeOf(S.total),
        sections: sections, caseQuestion: st.caseQ, bmPlan: st.plan, agreements: st.agree, failedItems: failed, note: st.note, sketch: st.sk.url, photos: photosPayload(st.ph), answers: answers
      } }, true).then(function (j) { toast('บันทึกผลประเมิน BM แล้ว'); go('#/bmeval/' + j.id); })
        .catch(function (e) { st.saving = false; draw(); toast('บันทึกไม่สำเร็จ: ' + e.message); });
    }
    draw();
  }

  /* ---------------- ประเมิน BM · ภาพรวม 17 สาขา (ASM) ---------------- */
  function viewBmEvalList() {
    var st = { month: monthKey(new Date()), evals: null };
    app.innerHTML = '<div class="wrap">' + header('ASM · 17 สาขา', 'ผลประเมิน BM', true) +
      '<a class="btn" href="#/bmeval/new">ประเมิน BM</a><div id="body" style="margin-top:14px">' + loading() + '</div></div>';
    wireHeader();
    api({ action: 'evals', limit: 1000 }).then(function (j) { st.evals = j.evals || []; draw(); })
      .catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดข้อมูลไม่ได้: ' + esc(e.message) + '</div>'; });
    function draw() {
      var months = {}; months[monthKey(new Date())] = 1; st.evals.forEach(function (e) { if (e.period) months[e.period] = 1; });
      var mlist = Object.keys(months).sort().reverse();
      var inM = st.evals.filter(function (e) { return e.period === st.month; });
      var latest = {}; inM.forEach(function (e) { if (!latest[e.branch_code]) latest[e.branch_code] = e; });
      var hist = {}; st.evals.forEach(function (e) { hist[e.branch_code] = hist[e.branch_code] || {}; if (!hist[e.branch_code][e.period]) hist[e.branch_code][e.period] = e; });
      var L = Object.keys(latest).map(function (k) { return latest[k]; });
      var avg = avgOf(L.map(function (e) { return e.total_score; }));
      var gc = { A: 0, B: 0, C: 0, D: 0 }; L.forEach(function (e) { if (gc[e.grade] != null) gc[e.grade]++; });
      // หมวดเฉลี่ย
      var secAvg = (C.bmEvalSections || []).map(function (s) {
        var v = L.map(function (e) { try { var x = JSON.parse(e.sections_json || '{}')[s.id]; return x ? x.pts / x.w * 100 : null; } catch (er) { return null; } });
        return { name: s.name, p: avgOf(v) };
      });
      var autoAvg = avgOf(L.map(function (e) { return Number(e.auto_score) / 35 * 100; }));
      var fails = {}; L.forEach(function (e) { String(e.failed_items || '').split(' | ').filter(Boolean).forEach(function (f) { var k = f.replace(/\s*\(.*\)$/, ''); fails[k] = fails[k] || []; fails[k].push(e.branch_code); }); });
      var tops = Object.keys(fails).map(function (k) { return { t: k, br: fails[k] }; }).sort(function (a, b) { return b.br.length - a.br.length; }).slice(0, 6);
      var prevMonths = mlist.filter(function (m) { return m < st.month; }).slice(0, 2).reverse();
      var rows = BRANCHES.slice().sort(function (x, y) { var a = latest[x.code], b = latest[y.code]; if (!a && !b) return 0; if (!a) return 1; if (!b) return -1; return Number(b.total_score) - Number(a.total_score); });
      var rank = 0;
      $('#body').innerHTML =
        '<div class="field"><label for="m">เดือน</label><select id="m" class="input">' + mlist.map(function (k) { return '<option value="' + k + '"' + (k === st.month ? ' selected' : '') + '>' + esc(monthLabel(k)) + '</option>'; }).join('') + '</select></div>' +
        '<div class="grid3" style="margin-top:12px"><div class="card dark stat"><div class="label">ประเมินแล้ว</div><div class="value">' + L.length + '/17</div></div>' +
        '<div class="card stat"><div class="label">คะแนนเฉลี่ย</div><div class="value ' + pctColor(avg) + '">' + (avg == null ? '–' : avg) + '</div></div>' +
        '<div class="card stat"><div class="label">เกรด A · B · C · D</div><div class="value" style="font-size:18px">' + gc.A + ' · ' + gc.B + ' · <span class="bad">' + gc.C + ' · ' + gc.D + '</span></div></div></div>' +
        '<div class="grid-ipad-2" style="margin-top:12px"><div class="card"><h2 class="h2">เฉลี่ยรายหมวด (%)</h2><div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">' +
        [{ name: 'A · อัตโนมัติ', p: autoAvg }].concat(secAvg).map(function (s) { return '<div class="row"><span class="small ellipsis" style="width:46%">' + esc(s.name) + '</span>' + bar(s.p) + '<span class="small" style="width:44px;text-align:right;font-weight:700">' + pctTxt(s.p) + '</span></div>'; }).join('') + '</div></div>' +
        '<div class="card"><h2 class="h2">ข้อที่ BM ยังไม่ผ่านบ่อย</h2>' + (tops.length ? tops.map(function (t) { return '<div style="padding:8px 0;border-top:1px solid #ECEEF1"><div class="row between" style="align-items:flex-start"><span class="small" style="flex:1">' + esc(t.t) + '</span><b class="small bad">' + t.br.length + ' สาขา</b></div><div class="tiny muted">' + t.br.join(', ') + '</div></div>'; }).join('') : '<p class="small muted" style="margin:8px 0 0">' + (L.length ? 'ผ่านทุกข้อ' : 'ยังไม่มีข้อมูลเดือนนี้') + '</p>') + '</div></div>' +
        '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">อันดับ BM</h2><span class="small muted">' + esc(monthLabel(st.month)) + '</span></div>' +
        '<div class="card" style="padding:0;overflow-x:auto"><table class="tbl"><thead><tr><th>#</th><th>สาขา · BM</th>' + prevMonths.map(function (m) { return '<th class="num">' + esc(monthLabel(m).split(' ')[0].slice(0, 6)) + '</th>'; }).join('') + '<th class="num">A</th><th class="num">B</th><th class="num">รวม</th><th class="num">เกรด</th></tr></thead><tbody>' +
        rows.map(function (b) {
          var e = latest[b.code];
          var pm = prevMonths.map(function (m) { var x = hist[b.code] && hist[b.code][m]; return '<td class="num muted">' + (x ? x.total_score : '–') + '</td>'; }).join('');
          if (!e) return '<tr><td></td><td><b>' + b.code + '</b> <span class="muted">' + esc(b.name.replace(/^Studio ?7-?/, '')) + '</span></td>' + pm + '<td colspan="4" class="small bad">ยังไม่ประเมิน</td></tr>';
          rank++;
          return '<tr data-go="' + esc(e.eval_id) + '" style="cursor:pointer"><td class="muted">' + rank + '</td><td><b>' + b.code + '</b> ' + esc(firstName(e.bm_name)) + '<div class="tiny muted">' + esc(b.name.replace(/^Studio ?7-?/, '')) + '</div></td>' + pm +
            '<td class="num">' + e.auto_score + '</td><td class="num">' + e.b_score + '</td><td class="num"><b class="' + pctColor(e.total_score) + '">' + e.total_score + '</b></td><td class="num"><b class="' + gradeCls(e.grade) + '">' + esc(e.grade) + '</b></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="tiny muted" style="margin:8px 4px 0">A = อัตโนมัติ 35 คะแนน · B = AM ประเมิน 65 คะแนน · แตะแถวเพื่อดูรายละเอียด</p>';
      $('#m').onchange = function (e) { st.month = e.target.value; draw(); };
      app.querySelectorAll('[data-go]').forEach(function (el) { el.onclick = function () { go('#/bmeval/' + el.getAttribute('data-go')); }; });
    }
  }

  /* ---------------- ประเมิน BM · รายละเอียด (ASM + BM) ---------------- */
  function viewBmEvalDetail(id) {
    var u = user();
    app.innerHTML = '<div class="wrap">' + header('ผลประเมินการทำงานของ BM', 'รายละเอียด', true) + '<div id="body">' + loading() + '</div></div>';
    wireHeader();
    var params = { action: 'evals', limit: 1000 }; if (u.role !== 'ASM') params.branch = u.branch;
    api(params).then(function (j) {
      var e = (j.evals || []).filter(function (x) { return String(x.eval_id) === String(id); })[0];
      if (!e) { $('#body').innerHTML = '<div class="alert">ไม่พบผลประเมินนี้</div>'; return; }
      var sec = {}, ans = {}; try { sec = JSON.parse(e.sections_json || '{}'); } catch (er) {} try { ans = JSON.parse(e.answers_json || '{}'); } catch (er) {}
      var html = '<div class="card dark"><div class="small muted">สาขา ' + esc(e.branch_code) + ' · ' + esc(e.branch_name) + '</div>' +
        '<div style="font-size:18px;font-weight:700;margin-top:2px">' + esc(e.bm_name) + ' <span class="small muted">· ' + esc(e.bm_position) + '</span></div>' +
        '<div class="row" style="align-items:baseline;gap:12px"><span style="font-size:44px;font-weight:700;color:' + (Number(e.total_score) >= 80 ? '#8FB2FF' : '#FF9B5C') + '">' + e.total_score + '</span><span style="font-size:20px;font-weight:700">เกรด ' + esc(e.grade) + '</span></div>' +
        '<div class="small muted">' + esc(monthLabel(e.period)) + ' · ' + fmtDate(e.saved_at) + ' · โดย ASM</div>' +
        '<div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">' +
        [{ name: 'A · อัตโนมัติ', pts: Number(e.auto_score), w: 35 }].concat((C.bmEvalSections || []).map(function (s) { var x = sec[s.id] || {}; return { name: s.name, pts: x.pts || 0, w: s.w }; })).map(function (s) {
          return '<div class="row"><span class="small ellipsis" style="width:42%">' + esc(s.name) + '</span>' + bar(Math.round(s.pts / s.w * 100), true) + '<span class="small" style="width:60px;text-align:right;font-weight:700">' + s.pts + '/' + s.w + '</span></div>';
        }).join('') + '</div></div>';
      if (e.agreements) html += '<div class="card" style="margin-top:12px;border:2px solid var(--blue)"><h2 class="h2">ข้อตกลงครั้งนี้</h2><p style="margin:8px 0 0;white-space:pre-wrap">' + esc(e.agreements) + '</p></div>';
      if (e.case_question || e.bm_plan) html += '<div class="card" style="margin-top:12px"><h2 class="h2">โจทย์คิดวิเคราะห์</h2>' + (e.case_question ? '<p class="small" style="margin:8px 0 0"><span class="muted">โจทย์:</span> ' + esc(e.case_question) + '</p>' : '') + (e.bm_plan ? '<p class="small" style="margin:6px 0 0;white-space:pre-wrap"><span class="muted">แผนของ BM:</span> ' + esc(e.bm_plan) + '</p>' : '') + '</div>';
      if (sec.auto) html += '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">A · อัตโนมัติ</h2></div><div class="list">' + sec.auto.map(function (r) {
        var d = (C.bmEvalAuto || []).filter(function (x) { return x.k === r.k; })[0] || { name: { spot: 'Spot-check สม่ำเสมอ' }[r.k] || r.k };
        return '<div><span style="flex:1"><b class="small">' + esc(d.name) + '</b><span class="small muted" style="display:block">' + esc(r.v) + '</span></span><span class="score">' + r.pts + '<span class="small muted">/' + r.w + '</span></span></div>';
      }).join('') + '</div>';
      (C.bmEvalSections || []).forEach(function (s) {
        html += '<div class="row between" style="margin:18px 4px 8px"><h2 class="h2">' + esc(s.name) + '</h2><span class="small muted">' + ((sec[s.id] || {}).pts || 0) + '/' + s.w + '</span></div>';
        s.items.forEach(function (t, i) {
          var r = ans[s.id + '-' + i] || {};
          html += '<div class="item ' + (r.v || '') + '"><div class="q"><span class="n">' + (i + 1) + '</span><span style="flex:1">' + esc(t) + '</span><b class="small ' + (r.v === 'pass' ? 'good' : r.v === 'fail' ? 'bad' : 'muted') + '">' + (r.v === 'pass' ? 'ผ่าน' : r.v === 'fail' ? 'ไม่ผ่าน' : '–') + '</b></div>' +
            (r.note ? '<div class="small muted" style="margin-top:6px">หมายเหตุ: ' + esc(r.note) + '</div>' : '') + '</div>';
        });
      });
      if (e.note) html += '<div class="card" style="margin-top:14px"><h2 class="h2">โน้ตเพิ่มเติม</h2><p class="small" style="margin:8px 0 0;white-space:pre-wrap">' + esc(e.note) + '</p></div>';
      html += photosView(e.photos_json) + sketchView(e.sketch_url);
      $('#body').innerHTML = html;
    }).catch(function (er) { $('#body').innerHTML = '<div class="alert">โหลดข้อมูลไม่ได้: ' + esc(er.message) + '</div>'; });
  }

  /* ---------------- BM home · ผลประเมินการทำงานจาก AM ---------------- */
  function bmEvalCard(el) {
    var u = user();
    api({ action: 'evals', branch: u.branch, limit: 20 }).then(function (j) {
      var list = (j.evals || []).filter(function (e) { return String(e.bm_id) === String(u.id); });
      var e = list[0];
      if (!e) { el.innerHTML = ''; return; }
      el.innerHTML = '<a class="card" href="#/bmeval/' + esc(e.eval_id) + '" style="display:block;color:var(--text);margin-top:12px;border:2px solid var(--blue)">' +
        '<div class="row between"><span class="small muted">ผลประเมินการทำงานจาก AM · ' + esc(monthLabel(e.period)) + '</span><span class="small" style="color:var(--blue)">ดูรายละเอียด ›</span></div>' +
        '<div class="row" style="align-items:baseline;gap:10px;margin-top:2px"><span style="font-size:32px;font-weight:700" class="' + pctColor(e.total_score) + '">' + e.total_score + '</span><b class="' + gradeCls(e.grade) + '">เกรด ' + esc(e.grade) + '</b>' +
        (list[1] ? '<span class="small muted">ครั้งก่อน ' + list[1].total_score + '</span>' : '') + '</div>' +
        (e.agreements ? '<div class="small" style="margin-top:8px;background:var(--blue-soft);border-radius:10px;padding:8px 10px"><b>ข้อตกลงกับ AM</b><div style="white-space:pre-wrap;margin-top:2px">' + esc(e.agreements) + '</div></div>' : '') + '</a>';
    }).catch(function () { el.innerHTML = ''; });
  }


  /* ---------------- อัปโหลดรูป (ถ่ายรูป / เลือกจากคลังภาพ) ---------------- */
  var MAX_PHOTOS = 10;
  var photoInput = null;
  function pickPhotos(onFiles) {
    if (!photoInput) {
      photoInput = document.createElement('input');
      photoInput.type = 'file'; photoInput.accept = 'image/*'; photoInput.multiple = true; photoInput.hidden = true;
      document.body.appendChild(photoInput);
    }
    photoInput.value = '';
    photoInput.onchange = function () { onFiles(Array.prototype.slice.call(photoInput.files || [])); };
    photoInput.click();
  }
  // ย่อรูปให้เล็กลงก่อนส่ง (ด้านยาวสุด 1280px · JPEG)
  function shrinkImage(file) {
    return new Promise(function (resolve, reject) {
      var rd = new FileReader();
      rd.onerror = reject;
      rd.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('เปิดรูปไม่ได้')); };
        img.onload = function () {
          var max = 1280, w = img.naturalWidth, h = img.naturalHeight, sc = Math.min(1, max / Math.max(w, h));
          var c = document.createElement('canvas'); c.width = Math.round(w * sc); c.height = Math.round(h * sc);
          var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.72));
        };
        img.src = rd.result;
      };
      rd.readAsDataURL(file);
    });
  }
  // ph = { list: [{ url, caption }], busy: 0 }
  function photoThumbs(ph, caption) {
    var items = ph.list.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return caption == null || x.p.caption === caption; });
    if (!items.length) return '';
    return '<div class="thumbs">' + items.map(function (x) {
      return '<div class="thumb"><img src="' + x.p.url + '" alt="รูปที่แนบ ' + (x.i + 1) + '">' +
        (caption == null && x.p.caption ? '<span class="cap">' + esc(x.p.caption) + '</span>' : '') +
        '<button class="del" data-photo-del="' + x.i + '" aria-label="ลบรูป">×</button></div>';
    }).join('') + '</div>';
  }
  function photoBlock(ph) {
    return '<div class="photo-field">' + photoThumbs(ph) +
      '<button class="btn ghost small" data-photo-add="" style="width:100%;margin-top:' + (ph.list.length ? '8px' : '0') + '"' + (ph.list.length >= MAX_PHOTOS ? ' disabled' : '') + '>' + ICON.cam +
      (ph.busy ? ' กำลังเตรียมรูป…' : ph.list.length >= MAX_PHOTOS ? ' ครบ ' + MAX_PHOTOS + ' รูปแล้ว' : ' ถ่ายรูป / อัปโหลดรูป (' + ph.list.length + '/' + MAX_PHOTOS + ')') + '</button></div>';
  }
  function itemPhotoBtn(ph, caption) {
    return photoThumbs(ph, caption) + '<button class="btn ghost small" data-photo-add="' + esc(caption) + '" style="margin-top:8px"' + (ph.list.length >= MAX_PHOTOS ? ' disabled' : '') + '>' + ICON.cam + ' แนบรูปข้อนี้</button>';
  }
  function wirePhotos(ph, redraw) {
    app.querySelectorAll('[data-photo-add]').forEach(function (el) {
      el.onclick = function () {
        var cap = el.getAttribute('data-photo-add');
        pickPhotos(function (files) {
          files = files.slice(0, MAX_PHOTOS - ph.list.length);
          if (!files.length) return;
          ph.busy += files.length; redraw();
          files.forEach(function (f) {
            shrinkImage(f).then(function (url) { if (ph.list.length < MAX_PHOTOS) ph.list.push({ url: url, caption: cap }); })
              .catch(function () { toast('เปิดรูปบางรูปไม่ได้'); })
              .then(function () { ph.busy--; redraw(); });
          });
        });
      };
    });
    app.querySelectorAll('[data-photo-del]').forEach(function (el) {
      el.onclick = function () { ph.list.splice(Number(el.getAttribute('data-photo-del')), 1); redraw(); };
    });
  }
  function photosPayload(ph) { return ph.list.map(function (p) { return { data: p.url, caption: p.caption }; }); }
  function photosView(json) {
    var list = []; try { list = JSON.parse(json || '[]') || []; } catch (e) {}
    if (!list.length) return '';
    return '<div class="card" style="margin-top:12px"><h2 class="h2">รูปที่แนบ (' + list.length + ')</h2><div class="thumbs view">' + list.map(function (p) {
      return '<a class="thumb" href="' + esc(String(p.url).replace('sz=w1600', 'sz=w2400')) + '" target="_blank" rel="noopener"><img src="' + esc(p.url) + '" alt="' + esc(p.caption || 'รูปที่แนบ') + '" loading="lazy">' + (p.caption ? '<span class="cap">' + esc(p.caption) + '</span>' : '') + '</a>';
    }).join('') + '</div></div>';
  }


  render();
})();
