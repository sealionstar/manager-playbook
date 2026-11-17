/**
 * Manager Playbook · API (Google Apps Script)
 * วิธีติดตั้ง: ดูไฟล์ README.md
 *
 * ชีตฐานข้อมูล = สเปรดชีตที่ผูกกับสคริปต์นี้ (Extensions > Apps Script)
 * รายชื่อพนักงาน = ชีต Manpower (อ่านอย่างเดียว)
 */

const CONFIG = {
  MANPOWER_ID: '1M_GxBDczDyB26OhzwiXpwCV4msbVjK-H9mSVpp30h_8',
  MANPOWER_TAB: 'All Manpower',
  // ผู้ใช้ตำแหน่ง ASM: ใส่รหัสพนักงาน → ชื่อ (ว่างไว้ = ASM เข้าได้ทุกรหัส และใช้ชื่อ DEFAULT_ASM_NAME)
  ASM_USERS: {
    // '12345': 'ประวิชญา รัตนคช',
  },
  DEFAULT_ASM_NAME: 'ประวิชญา รัตนคช',
  AUDIT_TAB: 'StoreAudit',
  LOG_TAB: 'BmLog',
  EVAL_TAB: 'BmEval',
  SKETCH_FOLDER: 'Manager Playbook · รูปและภาพเขียน',
  MAX_PHOTOS: 10,
  CACHE_SECONDS: 600
};

const BRANCHES = {
  '206': 'Studio 7-Central-Phuket', '256': 'Studio 7-Lotus-Samui', '310': 'Studio 7-Central-Samui',
  '313': 'Studio 7-Jungceylon-Phuket', '329': 'Studio 7-Central-Suratthani', '340': 'Studio 7-Lotus-Krabi',
  '341': 'Studio 7-Lotus-Phuket', '1106': 'Studio 7-Robinson-Thalang-Phuket', '1113': 'Studio 7-Big C-Suratthani',
  '1785': 'Studio 7-Lotus-Mueang-Chumphon', '2744': 'Studio7-Lotus-Thalang', '2909': 'Studio7-Big C-Phuket',
  '2925': 'Studio7-Lotus-Langsuan', '2935': 'Studio7-Big C-Phang Nga', '3025': 'Studio7-Lotus Chalong',
  '3147': 'Studio7-Takuapa Square-Phangnga', '3109': 'Studio7-Sahathai-Suratthani'
};

// บันทึกเครื่องมือ BM: score = ประเมินพนักงาน 10 ข้อ, spot = Spot-check หน้าร้าน, demo = Demo Product, roleplay = Role-play
const LOG_HEADERS = [
  'log_id', 'saved_at', 'type', 'branch_code', 'branch_name', 'bm_id', 'bm_name',
  'staff_id', 'staff_name', 'staff_position', 'topic', 'score', 'max_score', 'pct', 'failed_items', 'note', 'answers_json'
];

const AUDIT_HEADERS = [
  'audit_id', 'saved_at', 'audit_time', 'branch_code', 'branch_name',
  'auditor_id', 'auditor_name', 'staff_position', 'staff_id', 'staff_name',
  'store_pct', 'merch_pct', 'staff_pct', 'total_pct', 'pass_count', 'fail_count',
  'failed_items', 'note', 'answers_json', 'sketch_url', 'photos_json'
];

// ประเมินการทำงานของ BM (AM ประเมินเดือนละครั้ง)
const EVAL_HEADERS = [
  'eval_id', 'saved_at', 'period', 'branch_code', 'branch_name', 'bm_id', 'bm_name', 'bm_position',
  'auditor_id', 'auditor_name', 'auto_score', 'b_score', 'total_score', 'grade', 'sections_json',
  'case_question', 'bm_plan', 'agreements', 'failed_items', 'note', 'sketch_url', 'answers_json', 'photos_json'
];

/* ---------- HTTP ---------- */

function doGet(e) {
  return handle_(e.parameter || {});
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch (err) { return json_({ ok: false, error: 'bad json' }); }
  return handle_(body);
}

function handle_(p) {
  try {
    switch (p.action) {
      case 'ping': return json_({ ok: true, time: new Date().toISOString() });
      case 'login': return json_(login_(p.id, p.pw));
      case 'staff': return json_({ ok: true, staff: staffOf_(p.branch, p.scope) });
      case 'saveLog': return json_(saveLog_(p.log));
      case 'logs': return json_({ ok: true, logs: listLogs_(p.branch, p.type, Number(p.limit) || 500) });
      case 'saveAudit': return json_(saveAudit_(p.audit));
      case 'audits': return json_({ ok: true, audits: listAudits_(p.branch, Number(p.limit) || 200) });
      case 'saveEval': return json_(saveEval_(p.ev));
      case 'evals': return json_({ ok: true, evals: listRows_(evalSheet_(), EVAL_HEADERS, p.branch, 3, Number(p.limit) || 300) });
      default: return json_({ ok: false, error: 'unknown action' });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Manpower ---------- */

function manpower_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('manpower');
  if (hit) return JSON.parse(hit);
  const sh = SpreadsheetApp.openById(CONFIG.MANPOWER_ID).getSheetByName(CONFIG.MANPOWER_TAB);
  const rows = sh.getDataRange().getValues().slice(1);
  const list = rows
    .filter(function (r) { return r[0] !== '' && r[4] !== ''; })
    .map(function (r) {
      return {
        id: String(r[0]).trim(),
        name: (String(r[1]).trim() + ' ' + String(r[2]).trim()).trim(),
        position: String(r[3]).trim(),
        branch: String(r[4]).trim()
      };
    });
  try { cache.put('manpower', JSON.stringify(list), CONFIG.CACHE_SECONDS); } catch (e) {}
  return list;
}

function roleOf_(position) {
  if (position === 'Branch Sales Manager' || position === 'Acting Branch Manager') return 'BM';
  if (position.indexOf('Assistant Branch') >= 0) return 'ABM';
  return '';
}

function shortPos_(position) {
  if (position === 'PIA') return 'PIA';
  if (position === 'Demo Presenter') return 'Demo Presenter';
  if (position === 'Store Trainer') return 'Trainer';
  return '';
}

// ทีมขายทั้งหมดของสาขา (ใช้ในเครื่องมือ BM) · ไม่รวม BM/ABM, แคชเชียร์, สต็อก, PIA BTB Dedicate
function teamPos_(position) {
  const s = shortPos_(position);
  if (s) return s;
  if (position === 'PIS') return 'PIS';
  if (position.indexOf('Supersales') === 0) return 'Supersales';
  return '';
}

function login_(id, pw) {
  id = String(id || '').trim();
  pw = String(pw || '').trim().toUpperCase();
  if (!/^\d{3,10}$/.test(id)) return { ok: false, error: 'รหัสพนักงานต้องเป็นตัวเลข' };
  if (['ASM', 'BM', 'ABM'].indexOf(pw) < 0) return { ok: false, error: 'รหัสผ่านไม่ถูกต้อง · ใช้ ASM, BM หรือ ABM' };

  if (pw === 'ASM') {
    const allow = Object.keys(CONFIG.ASM_USERS);
    if (allow.length && allow.indexOf(id) < 0) return { ok: false, error: 'รหัสนี้ไม่มีสิทธิ์ ASM' };
    return { ok: true, user: { id: id, name: CONFIG.ASM_USERS[id] || CONFIG.DEFAULT_ASM_NAME, position: 'Area Sales Manager', role: 'ASM', branch: '', branchName: 'โซนใต้ · 17 สาขา' } };
  }

  // BM บางคนดูแลหลายสาขา (มีชื่อในชีตมากกว่า 1 แถว) → ส่งทุกสาขากลับไปให้เลือก
  const recs = manpower_().filter(function (m) { return m.id === id && roleOf_(m.position); });
  const rec = recs[0] || manpower_().filter(function (m) { return m.id === id; })[0];
  if (!rec) return { ok: false, error: 'ไม่พบรหัสพนักงานนี้ในรายชื่อ' };
  const role = roleOf_(rec.position);
  if (!role) return { ok: false, error: 'ตำแหน่ง ' + rec.position + ' ยังไม่มีสิทธิ์เข้าระบบ' };
  if (role !== pw) return { ok: false, error: 'รหัสนี้เป็นตำแหน่ง ' + role + ' · กรุณาใช้รหัสผ่าน ' + role };
  const branches = [];
  recs.forEach(function (m) { if (branches.indexOf(m.branch) < 0) branches.push(m.branch); });
  return { ok: true, user: { id: id, name: rec.name, position: rec.position, role: role, branch: rec.branch, branchName: BRANCHES[rec.branch] || '', branches: branches } };
}

function staffOf_(branch, scope) {
  const fn = scope === 'team' ? teamPos_ : scope === 'mgr' ? roleOf_ : shortPos_;
  return manpower_()
    .filter(function (m) { return m.branch === String(branch) && fn(m.position); })
    .map(function (m) { return { id: m.id, name: m.name, position: fn(m.position) }; });
}

/* ---------- Store audits ---------- */

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.setFrozenRows(1);
  }
  // เพิ่มหัวคอลัมน์ใหม่ให้อัตโนมัติ ถ้าชีตเดิมยังไม่มี
  if (sh.getRange(1, headers.length).getValue() !== headers[headers.length - 1]) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  }
  return sh;
}

function auditSheet_() { return sheet_(CONFIG.AUDIT_TAB, AUDIT_HEADERS); }
function evalSheet_() { return sheet_(CONFIG.EVAL_TAB, EVAL_HEADERS); }

function listRows_(sh, headers, branch, branchCol, limit) {
  const last = sh.getLastRow();
  if (last < 2) return [];
  const rows = sh.getRange(2, 1, last - 1, headers.length).getValues();
  const out = [];
  for (let i = rows.length - 1; i >= 0 && out.length < limit; i--) {
    const r = rows[i];
    if (branch && String(r[branchCol]) !== String(branch)) continue;
    const o = {};
    headers.forEach(function (h, k) { o[h] = r[k] instanceof Date ? r[k].toISOString() : r[k]; });
    out.push(o);
  }
  return out;
}

/* ---------- ภาพเขียนด้วยมือ (Apple Pencil) → Google Drive ---------- */

function folder_() {
  const it = DriveApp.getFoldersByName(CONFIG.SKETCH_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(CONFIG.SKETCH_FOLDER);
}

function saveImage_(dataUrl, name) {
  const m = /^data:image\/(png|jpeg);base64,/.exec(String(dataUrl || ''));
  if (!m) return '';
  const type = 'image/' + m[1];
  const bytes = Utilities.base64Decode(String(dataUrl).split(',')[1]);
  const file = folder_().createFile(Utilities.newBlob(bytes, type, name + (m[1] === 'png' ? '.png' : '.jpg')));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1600';
}

function saveSketch_(dataUrl, name) { return saveImage_(dataUrl, name); }

// รูปที่อัปโหลด: [{ data: dataUrl, caption: 'ข้อที่เกี่ยวข้อง' }] → [{ url, caption }]
function savePhotos_(list, name) {
  const out = [];
  (list || []).slice(0, CONFIG.MAX_PHOTOS).forEach(function (p, i) {
    const url = saveImage_(p && p.data, name + '_photo' + (i + 1));
    if (url) out.push({ url: url, caption: String(p.caption || '').slice(0, 200) });
  });
  return out.length ? JSON.stringify(out) : '';
}

function saveAudit_(a) {
  if (!a || !a.branch || !a.auditorId) return { ok: false, error: 'ข้อมูลไม่ครบ' };
  const id = 'A' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  // บันทึกรูปลง Drive ก่อนล็อกชีต เพื่อไม่ให้คนอื่นต้องรอ
  const sketchUrl = saveSketch_(a.sketch, id + '_' + a.branch);
  const photos = savePhotos_(a.photos, id + '_' + a.branch);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = auditSheet_();
    sh.appendRow([
      id, new Date(), a.auditTime || '', String(a.branch), BRANCHES[a.branch] || '',
      String(a.auditorId), a.auditorName || '', a.staffPosition || '', String(a.staffId || ''), a.staffName || '',
      a.storePct, a.merchPct, a.staffPct, a.totalPct, a.passCount, a.failCount,
      (a.failedItems || []).join(' | '), a.note || '', JSON.stringify(a.answers || {}),
      sketchUrl, photos
    ]);
    return { ok: true, id: id };
  } finally {
    lock.releaseLock();
  }
}

function listAudits_(branch, limit) {
  const sh = auditSheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  const rows = sh.getRange(2, 1, last - 1, AUDIT_HEADERS.length).getValues();
  const out = [];
  for (let i = rows.length - 1; i >= 0 && out.length < limit; i--) {
    const r = rows[i];
    if (branch && String(r[3]) !== String(branch)) continue;
    const o = {};
    AUDIT_HEADERS.forEach(function (h, k) { o[h] = r[k] instanceof Date ? r[k].toISOString() : r[k]; });
    out.push(o);
  }
  return out;
}

/* ---------- ประเมิน BM ---------- */

function saveEval_(v) {
  if (!v || !v.branch || !v.bmId || !v.auditorId) return { ok: false, error: 'ข้อมูลไม่ครบ' };
  const id = 'E' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const sketchUrl = saveSketch_(v.sketch, id + '_' + v.branch);
  const photos = savePhotos_(v.photos, id + '_' + v.branch);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    evalSheet_().appendRow([
      id, new Date(), "'" + (v.period || ''), String(v.branch), BRANCHES[v.branch] || '', String(v.bmId), v.bmName || '', v.bmPosition || '',
      String(v.auditorId), v.auditorName || '', v.autoScore, v.bScore, v.totalScore, v.grade || '', JSON.stringify(v.sections || {}),
      v.caseQuestion || '', v.bmPlan || '', v.agreements || '', (v.failedItems || []).join(' | '), v.note || '',
      sketchUrl, JSON.stringify(v.answers || {}), photos
    ]);
    return { ok: true, id: id };
  } finally {
    lock.releaseLock();
  }
}

/* ---------- BM tool logs ---------- */

function logSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG.LOG_TAB);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.LOG_TAB);
    sh.getRange(1, 1, 1, LOG_HEADERS.length).setValues([LOG_HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function saveLog_(l) {
  if (!l || !l.type || !l.branch || !l.bmId) return { ok: false, error: 'ข้อมูลไม่ครบ' };
  if (['score', 'spot', 'demo', 'roleplay'].indexOf(l.type) < 0) return { ok: false, error: 'ประเภทไม่ถูกต้อง' };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const id = 'L' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
    logSheet_().appendRow([
      id, new Date(), l.type, String(l.branch), BRANCHES[l.branch] || '', String(l.bmId), l.bmName || '',
      String(l.staffId || ''), l.staffName || '', l.staffPosition || '', l.topic || '',
      l.score, l.maxScore, l.pct, (l.failedItems || []).join(' | '), l.note || '', JSON.stringify(l.answers || {})
    ]);
    return { ok: true, id: id };
  } finally {
    lock.releaseLock();
  }
}

function listLogs_(branch, type, limit) {
  const sh = logSheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  const rows = sh.getRange(2, 1, last - 1, LOG_HEADERS.length).getValues();
  const out = [];
  for (let i = rows.length - 1; i >= 0 && out.length < limit; i--) {
    const r = rows[i];
    if (branch && String(r[3]) !== String(branch)) continue;
    if (type && String(r[2]) !== String(type)) continue;
    const o = {};
    LOG_HEADERS.forEach(function (h, k) { o[h] = r[k] instanceof Date ? r[k].toISOString() : r[k]; });
    out.push(o);
  }
  return out;
}

/* ใช้ทดสอบใน Apps Script: Run > testSetup */
function testSetup() {
  auditSheet_();
  logSheet_();
  evalSheet_();
  // ขอสิทธิ์ Google Drive สำหรับเก็บภาพเขียนด้วย Pencil
  folder_();
  Logger.log(manpower_().length + ' rows in Manpower');
}
