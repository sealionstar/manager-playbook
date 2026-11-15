/* Manager Playbook · v1 (ฝั่ง AM + BM ดูผลสาขาตัวเอง) */
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
      req = fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + q, { redirect: 'follow' });
    }
    return req.then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.ok === false) throw new Error((j && j.error) || 'เกิดข้อผิดพลาด');
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
    if (u.role === 'ASM') return viewAmHome();
    return viewBranch(u.branch, true);
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
      '<button class="btn" id="start">เริ่มประเมินหน้าร้าน</button>' +
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
            '<span class="small muted ellipsis" style="display:block">โดย ' + esc(x.auditor_name) + (x.staff_name ? ' · Staff: ' + esc(x.staff_name) : '') + '</span></span>' +
            '<span class="score ' + pctColor(x.total_pct) + '">' + x.total_pct + '%</span></a>';
        }).join('') + '</div>';
      store('mp_audits_' + b.code, list);
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
        '<div class="small muted">' + fmtDate(a.audit_time || a.saved_at) + ' · โดย ' + esc(a.auditor_name) + '</div>' + sectionBars(a, true) + '</div>';
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
      $('#body').innerHTML = html;
    }).catch(function (e) { $('#body').innerHTML = '<div class="alert">โหลดข้อมูลไม่ได้: ' + esc(e.message) + '</div>'; });
  }

  /* ---------------- audit form (ASM) ---------------- */
  function viewAuditForm() {
    var u = user();
    var draft = store('mp_draft') || {};
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
      api({ action: 'staff', branch: st.branch }).then(function (j) { st.staff = j.staff || []; if (SECTIONS[st.sec].id === 'staff') draw(); })
        .catch(function () { toast('โหลดรายชื่อพนักงานไม่ได้'); });
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
          '<option value="">' + (!st.branch ? '— เลือกสาขาด้านบนก่อน —' : !st.position ? '— เลือกตำแหน่งก่อน —' : staffOpts.length ? '— เลือกชื่อ (' + staffOpts.length + ' คน) —' : '— สาขานี้ไม่มีตำแหน่งนี้ —') + '</option>' +
          staffOpts.map(function (m) { return '<option value="' + esc(m.id) + '"' + (m.id === st.staffId ? ' selected' : '') + '>' + esc(m.id) + ' · ' + esc(m.name) + '</option>'; }).join('') + '</select></div>' +
          '<div class="small ' + (whoOk ? 'good' : 'bad') + '" style="margin-top:6px">' + (whoOk ? 'ประเมิน: ' + esc(who.name) + ' · ' + esc(st.position) : 'เลือกตำแหน่งและชื่อพนักงานก่อนประเมินหมวดนี้') + '</div></div>';
      }

      html += '<p class="small muted" style="margin:12px 4px 8px">' + esc(sec.hint) + '</p>';
      sec.items.forEach(function (t, i) {
        var k = st.sec + '-' + i, v = st.marks[k];
        html += '<div class="item ' + (v || '') + '"><div class="q"><span class="n">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>' +
          '<div class="pf"><button data-mark="' + k + '" data-v="pass" class="' + (v === 'pass' ? 'on-pass' : '') + '" aria-pressed="' + (v === 'pass') + '">ผ่าน</button>' +
          '<button data-mark="' + k + '" data-v="fail" class="' + (v === 'fail' ? 'on-fail' : '') + '" aria-pressed="' + (v === 'fail') + '">ไม่ผ่าน</button></div>' +
          (v === 'fail' ? '<input class="input note" data-note="' + k + '" placeholder="พบอะไร (ไม่บังคับ)" aria-label="หมายเหตุข้อ ' + (i + 1) + '" value="' + esc(st.notes[k] || '') + '">' : '') + '</div>';
      });
      html += '<button class="btn ghost" id="allpass" style="margin-top:10px;border-style:dashed;font-size:14px">ติ๊ก "ผ่าน" ข้อที่เหลือในหมวดนี้ทั้งหมด</button>';

      html += '<div class="card" style="margin-top:14px"><div class="row between"><b>คะแนนรวม</b><span style="font-size:28px;font-weight:700" class="' + pctColor(S.total) + '">' + (S.total == null ? '–' : S.total + '%') + '</span></div>' +
        sectionBars({ store_pct: S.per[0].pct == null ? '' : S.per[0].pct, merch_pct: S.per[1].pct == null ? '' : S.per[1].pct, staff_pct: S.per[2].pct == null ? '' : S.per[2].pct }) +
        '<p class="tiny muted" style="margin:8px 0 0">คิดจากข้อที่ผ่าน ÷ ข้อที่ประเมิน · เกณฑ์ผ่าน ' + PASS_LINE + '%</p></div>';
      html += '<div class="field" style="margin-top:12px"><label for="note">โน้ตเพิ่มเติม</label><textarea id="note" class="input" placeholder="เช่น สิ่งที่ทำได้ดี สิ่งที่ต้องแก้ หรือสิ่งที่ตกลงกับ BM">' + esc(st.note) + '</textarea><span class="tiny muted">ไม่บังคับ · BM เห็นในหน้าสาขา</span></div>';

      var remain = S.per.reduce(function (a, s) { return a + s.n - s.done; }, 0);
      var label, ready = false;
      if (!last) label = 'ต่อไป: ' + SECTIONS[st.sec + 1].name;
      else if (!st.branch) label = 'เลือกสาขาก่อนบันทึก';
      else if (!whoOk) label = 'เลือกพนักงานในหมวด Staff ก่อน';
      else if (!S.all) label = 'ยังเหลือ ' + remain + ' ข้อ';
      else { label = 'บันทึกผลประเมิน'; ready = true; }
      html += '</div><div class="bottombar"><div class="inner"><button class="btn" id="next"' + (!last || ready ? '' : ' disabled') + '>' + (st.saving ? 'กำลังบันทึก…' : label) + '</button></div></div>';
      app.innerHTML = html;
      wireHeader();
      tick();

      $('#br').onchange = function (e) { st.branch = e.target.value; st.staffId = ''; saveDraft(); loadStaff(); draw(); };
      app.querySelectorAll('[data-tab]').forEach(function (el) { el.onclick = function () { st.sec = Number(el.getAttribute('data-tab')); draw(); window.scrollTo(0, 0); }; });
      app.querySelectorAll('[data-pos]').forEach(function (el) { el.onclick = function () { st.position = el.getAttribute('data-pos'); st.staffId = ''; saveDraft(); draw(); }; });
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
      $('#allpass').onclick = function () { sec.items.forEach(function (t, i) { var k = st.sec + '-' + i; if (!st.marks[k]) st.marks[k] = 'pass'; }); saveDraft(); var y = window.scrollY; draw(); window.scrollTo(0, y); };
      $('#next').onclick = function () {
        if (!last) { st.sec++; draw(); window.scrollTo(0, 0); return; }
        if (!ready || st.saving) return;
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
        passCount: S.P, failCount: S.F, failedItems: failed, note: st.note, answers: answers
      };
      api({ action: 'saveAudit', audit: audit }, true).then(function () {
        store('mp_draft', null); toast('บันทึกผลประเมินแล้ว'); go('#/branch/' + st.branch);
      }).catch(function (e) { st.saving = false; draw(); toast('บันทึกไม่สำเร็จ: ' + e.message); });
    }

    loadStaff();
    draw();
  }

  render();
})();
