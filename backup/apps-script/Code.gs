/**
 * Sk Nayem Uddin portfolio: content feed and admin panel.
 *
 * Public site:  https://shak-nayem-uddin.github.io  (GitHub Pages) reads  ?format=json
 * Admin panel:  this web app's URL with  ?admin=1  (owner only)
 *
 * Content lives in three tabs of this spreadsheet:
 *   Web Settings  name, contact details, menu pages
 *   Web Sections  every block on every page, in order
 *   Web Photos    the photo library (tags decide where a photo appears)
 * The achievement journal tab is read as before. Only public-safe columns leave this file.
 */
const OWNER = 'shak.nayem.97@gmail.com';
const SITE_URL = 'https://shak-nayem-uddin.github.io/';
const JOURNAL_SHEET = 'Google Sheets for Achievement Journal';
const SETTINGS_SHEET = 'Web Settings';
const SECTIONS_SHEET = 'Web Sections';
const PHOTOS_SHEET = 'Web Photos';
const PHOTO_FOLDER_ID = 'PASTE_PHOTO_FOLDER_ID'; // ID of the Drive folder that holds the site photos (full value in the private Drive backup)
const SHOW_METRICS = false; // true = also publish the "Metric / Result" column

const SETTINGS_COLS = ['Key', 'Value', 'Note'];
const SECTION_COLS = ['ID', 'Page', 'Order', 'Type', 'Tone', 'Column', 'Heading', 'Body', 'Items', 'Show'];
const PHOTO_COLS = ['ID', 'Source', 'Caption', 'Tags', 'Order', 'Show', 'Position'];
const SEED = {
 "settings": [
  [
   "name",
   "Sk Nayem Uddin",
   "Shown in the header, footer and page titles"
  ],
  [
   "role",
   "Operations and Administration Manager",
   "Used in page titles and link previews"
  ],
  [
   "location",
   "Dhaka, Bangladesh",
   "Shown on the contact block"
  ],
  [
   "email",
   "shak.nayem.97@gmail.com",
   "Leave empty to hide"
  ],
  [
   "phone",
   "+880 1882 020679",
   "Leave empty to hide"
  ],
  [
   "linkedin",
   "https://www.linkedin.com/in/sk-nayem",
   "Leave empty to hide"
  ],
  [
   "pages",
   "home=Home; experience=Experience; record=The record; profile=Profile; contact=Contact",
   "Menu order. Each page is id=Menu name, separated by semicolons. The first page is the home page."
  ],
  [
   "rotate_seconds",
   "5",
   "How long each portrait stays before the next one fades in"
  ]
 ],
 "sections": [
  [
   "home-hero",
   "home",
   "10",
   "hero",
   "dark",
   "full",
   "I build the systems that keep an institution running.",
   "Operations and administration manager in Dhaka. I look after procurement, projects and people, and I build the tools behind them.",
   "Read the record | #record\nGet in touch | #contact",
   "Yes"
  ],
  [
   "home-years",
   "home",
   "20",
   "years",
   "dark",
   "full",
   "The record, year by year",
   "",
   "",
   "Yes"
  ],
  [
   "home-asked",
   "home",
   "30",
   "columns",
   "light",
   "full",
   "What I am usually asked to do",
   "",
   "Put structure where there is none | Procurement procedures, approval flows, KPI frameworks and salary policies, written so that a team can follow them without me in the room.\nReplace manual work with a system | Income, expense, inventory and attendance trackers, live dashboards and small web apps, built on tools the team already knows.\nCarry a project to the finish | Construction coordination, annual programmes, staff training and fundraising campaigns, planned and delivered with contractors, scholars and volunteers.",
   "Yes"
  ],
  [
   "home-ground",
   "home",
   "40",
   "gallery",
   "dark",
   "full",
   "On the ground",
   "Most of this work happens in rooms and on sites, not on a screen.",
   "",
   "Yes"
  ],
  [
   "home-latest",
   "home",
   "50",
   "latest",
   "white",
   "full",
   "Latest entries",
   "4",
   "",
   "Yes"
  ],
  [
   "exp-title",
   "experience",
   "10",
   "title",
   "light",
   "full",
   "Experience",
   "Three years running operations for a growing non-profit, after starting out in IT support, automation sales and point-of-sale systems.",
   "",
   "Yes"
  ],
  [
   "exp-jobs",
   "experience",
   "20",
   "roles",
   "light",
   "full",
   "",
   "",
   "Nov 2023 to present | Manager, Administration and Operations | Imam Bukhari Trust, Dhaka | I run the administrative and operational side of a non-profit working in education, dawah, research and social welfare. | Wrote the procurement procedure and manage vendor selection, comparative statements and approvals; Built the tracking systems for income, expenses, KPIs, inventory and attendance; Coordinate mosque construction with contractors, engineers and suppliers; Plan and deliver the annual full-day programme, staff training and fundraising campaigns; Started the move to an ERP covering finance, HR, procurement, inventory and donors\nJul to Nov 2023 | Assistant Manager, Sales and Service | TecTesla Technologies Ltd | Sold industrial automation solutions and managed after-sales service.\nFeb to Jun 2023 | IT Executive | Youthbees | Handled IT support, planned technology improvements and carried out market research.\nFeb to Apr 2018 | MIS, contractual | Sajeeb Group | Management information systems support.\nFeb to Apr 2017 | POS Specialist, contractual | Dot BD Solutions Ltd | Operated point-of-sale software and handled cash at the Chittagong International Trade Fair.",
   "Yes"
  ],
  [
   "exp-side",
   "experience",
   "30",
   "roles",
   "light",
   "full",
   "Alongside the day job",
   "",
   "Since Dec 2025 | Strategic Planning and R&D Committee Member | Kulliyatul Quran Model Madrasha\nSince Jan 2025 | Founding Member | Forum of Strategic Dialogue\nCurrent | Treasurer | AYAH Research & Training Center",
   "Yes"
  ],
  [
   "rec-title",
   "record",
   "10",
   "title",
   "light",
   "full",
   "The record",
   "I keep a journal of what I finish. This page reads it directly, so a new entry in the journal appears here by itself. Select an entry to see how it was done.",
   "",
   "Yes"
  ],
  [
   "rec-list",
   "record",
   "20",
   "record",
   "light",
   "full",
   "",
   "",
   "",
   "Yes"
  ],
  [
   "pro-title",
   "profile",
   "10",
   "title",
   "light",
   "full",
   "Profile",
   "",
   "",
   "Yes"
  ],
  [
   "pro-about",
   "profile",
   "20",
   "text",
   "light",
   "left",
   "",
   "I am an operations and administration manager based in Dhaka. For the past three years I have run the working side of Imam Bukhari Trust: procurement, HR, compliance, construction coordination, events, and the systems that hold them together.\n\nI trained as an electronics and telecommunication engineer and then took an MBA in supply chain management. That mix shapes how I work. I look for the process underneath a problem, write it down, and where I can, build a tool so nobody has to do it by hand again.\n\nOutside operations I co-author research on Islamic education, prepare training material, and keep studying the Islamic sciences and Arabic.",
   "",
   "Yes"
  ],
  [
   "pro-edu",
   "profile",
   "30",
   "list",
   "light",
   "left",
   "Education",
   "",
   "MBA in Supply Chain Management | International Islamic University Chittagong\nBSc in Electronics and Telecommunication Engineering | International Islamic University Chittagong\nTwo-year programme in Islamic Sciences | Zad Academy",
   "Yes"
  ],
  [
   "pro-cert",
   "profile",
   "40",
   "list",
   "light",
   "left",
   "Certificates",
   "",
   "Google Project Management Professional Certificate\nSix Sigma White Belt\nAgile and Scrum\nKPI Development and Analysis\nBudget and Methods of Budgeting",
   "Yes"
  ],
  [
   "pro-photo",
   "profile",
   "50",
   "photo",
   "light",
   "right",
   "",
   "profile",
   "",
   "Yes"
  ],
  [
   "pro-stats",
   "profile",
   "60",
   "stats",
   "light",
   "right",
   "",
   "",
   "",
   "Yes"
  ],
  [
   "con-main",
   "contact",
   "10",
   "contact",
   "light",
   "full",
   "Contact",
   "For roles, projects or collaboration, write or call. I am based in Dhaka, Bangladesh.",
   "",
   "Yes"
  ]
 ],
 "photos": [
  [
   "ph-hero",
   "img/hero.jpg",
   "Studio portrait",
   "portrait",
   "10",
   "Yes",
   "50% 12%"
  ],
  [
   "ph-scarf",
   "img/portrait-2.jpg",
   "Portrait",
   "portrait",
   "20",
   "Yes",
   "50% 18%"
  ],
  [
   "ph-contact",
   "img/contact.jpg",
   "Portrait on the steps",
   "portrait, contact",
   "30",
   "Yes",
   "50% 15%"
  ],
  [
   "ph-profile",
   "img/profile.jpg",
   "Portrait in a suit",
   "portrait, profile",
   "40",
   "Yes",
   "50% 20%"
  ],
  [
   "ph-cert",
   "img/certificate.jpg",
   "Receiving the certificate of paper presentation at an international academic conference, October 2026",
   "gallery, big",
   "50",
   "Yes",
   "15% 30%"
  ],
  [
   "ph-training",
   "img/training.jpg",
   "Leading a staff session on task, time and SMART planning",
   "gallery, big",
   "60",
   "Yes",
   "30% 25%"
  ],
  [
   "ph-site",
   "img/site.jpg",
   "On site with the project team during construction",
   "gallery",
   "70",
   "Yes",
   "50% 50%"
  ],
  [
   "ph-team",
   "img/team.jpg",
   "With colleagues at the conference venue",
   "gallery",
   "80",
   "Yes",
   "50% 50%"
  ],
  [
   "ph-mou",
   "img/mou.jpg",
   "At an MoU signing between partner institutions",
   "gallery",
   "90",
   "Yes",
   "50% 50%"
  ]
 ]
};

// ---------------------------------------------------------------- web entry
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.format === 'json') {
    return ContentService.createTextOutput(JSON.stringify(buildFeed_()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (p.admin) {
    if (!isOwner_()) {
      return HtmlService.createHtmlOutput('<p style="font:16px system-ui,sans-serif;padding:40px;max-width:36em">This page is only for the site owner. Sign in to Google with the owner account, then open this link again.</p>').setTitle('Portfolio admin');
    }
    return HtmlService.createTemplateFromFile('Admin').evaluate()
      .setTitle('Portfolio admin')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return HtmlService.createHtmlOutput('<p style="font:16px system-ui,sans-serif;padding:40px">This portfolio lives at <a href="' + SITE_URL + '" target="_top">' + SITE_URL + '</a></p>')
    .setTitle('Sk Nayem Uddin');
}

// ---------------------------------------------------------------- public feed
function buildFeed_() {
  const cms = readCms_();
  return {
    updated: new Date().toISOString(),
    site: cms.site,
    pages: cms.pages,
    sections: cms.sections.filter(function (s) { return s.show; }),
    photos: cms.photos.filter(function (p) { return p.show; }).map(function (p) {
      return { id: p.id, url: photoUrl_(p.source, 1400), caption: p.caption, tags: p.tags, position: p.position };
    }),
    items: getAchievements_()
  };
}

function getAchievements_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(JOURNAL_SHEET);
  const rows = sh.getDataRange().getDisplayValues();
  const head = rows.shift().map(function (h) { return String(h).trim().toLowerCase(); });
  const col = function (name) {
    for (var i = 0; i < head.length; i++) if (head[i].indexOf(name) === 0) return i;
    return -1;
  };
  const c = {
    year: col('year'), date: col('date'), cat: col('category'), ach: col('achievement'),
    action: col('action'), metric: col('metric'), skills: col('skills'),
    tools: col('tools'), org: col('for what'), show: col('show on portfolio')
  };
  const get = function (r, i) { return i < 0 ? '' : String(r[i] || '').trim(); };
  const out = [];
  rows.forEach(function (r) {
    const ach = get(r, c.ach);
    if (!ach) return;
    if (get(r, c.show).toLowerCase() === 'no') return;
    out.push({
      year: get(r, c.year), date: get(r, c.date),
      cat: get(r, c.cat).replace(/^Admistration$/i, 'Administration'),
      ach: ach, action: get(r, c.action),
      metric: SHOW_METRICS ? get(r, c.metric) : '',
      skills: get(r, c.skills), tools: get(r, c.tools), org: get(r, c.org)
    });
  });
  return out;
}

// ---------------------------------------------------------------- content tabs
function sheet_(name) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); }

function rows_(name) {
  const sh = sheet_(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const v = sh.getDataRange().getDisplayValues();
  const head = v.shift().map(function (h) { return String(h).trim(); });
  return v.filter(function (r) { return r.join('').trim(); }).map(function (r) {
    const o = {};
    head.forEach(function (h, i) { o[h] = String(r[i] == null ? '' : r[i]); });
    return o;
  });
}

function yes_(v) { return !/^(no|false|0|hide|hidden)$/i.test(String(v).trim()); }

function parsePages_(s) {
  return String(s || '').split(';').map(function (x) { return x.trim(); }).filter(Boolean).map(function (x) {
    const i = x.indexOf('=');
    const id = (i > 0 ? x.slice(0, i) : x).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    return { id: id, label: (i > 0 ? x.slice(i + 1) : x).trim() };
  });
}

function readCms_() {
  const site = {};
  rows_(SETTINGS_SHEET).forEach(function (r) { if (r.Key) site[r.Key.trim()] = r.Value; });
  const pages = parsePages_(site.pages);
  const pageIndex = function (id) { const i = pages.map(function (p) { return p.id; }).indexOf(id); return i < 0 ? 999 : i; };
  const sections = rows_(SECTIONS_SHEET).map(function (r) {
    return {
      id: r.ID, page: String(r.Page).trim().toLowerCase(), order: Number(r.Order) || 0,
      type: String(r.Type).trim().toLowerCase(), tone: (String(r.Tone).trim() || 'light').toLowerCase(),
      column: (String(r.Column).trim() || 'full').toLowerCase(),
      heading: r.Heading, body: r.Body, items: r.Items, show: yes_(r.Show)
    };
  }).sort(function (a, b) { return pageIndex(a.page) - pageIndex(b.page) || a.order - b.order; });
  const photos = rows_(PHOTOS_SHEET).map(function (r) {
    return {
      id: r.ID, source: String(r.Source).trim(), caption: r.Caption,
      tags: String(r.Tags).split(',').map(function (t) { return t.trim().toLowerCase(); }).filter(Boolean),
      order: Number(r.Order) || 0, show: yes_(r.Show), position: String(r.Position).trim()
    };
  }).sort(function (a, b) { return a.order - b.order; });
  return { site: site, pages: pages, sections: sections, photos: photos };
}

function photoUrl_(src, w) {
  if (/^drive:/.test(src)) return 'https://lh3.googleusercontent.com/d/' + src.slice(6) + '=w' + (w || 1400);
  return src;
}

// ---------------------------------------------------------------- admin (owner only)
function isOwner_() {
  try { return String(Session.getActiveUser().getEmail()).toLowerCase() === OWNER; } catch (err) { return false; }
}
function guard_() { if (!isOwner_()) throw new Error('Only the site owner can make changes. Sign in with the owner account.'); }

function adminLoad() {
  guard_();
  const cms = readCms_();
  cms.photos.forEach(function (p) {
    p.preview = /^(drive:|https?:)/.test(p.source) ? photoUrl_(p.source, 500) : SITE_URL + p.source.replace(/^\//, '');
  });
  return { cms: cms, siteUrl: SITE_URL, sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl(), journalCount: getAchievements_().length };
}

function adminSaveSettings(obj) {
  guard_();
  const sh = sheet_(SETTINGS_SHEET);
  const v = sh.getDataRange().getValues();
  const at = {};
  v.forEach(function (r, i) { if (i) at[String(r[0]).trim()] = i + 1; });
  Object.keys(obj || {}).forEach(function (k) {
    if (at[k]) { sh.getRange(at[k], 2).setNumberFormat('@').setValue(String(obj[k])); }
    else { sh.appendRow([k, '', '']); sh.getRange(sh.getLastRow(), 2).setNumberFormat('@').setValue(String(obj[k])); }
  });
  return adminLoad();
}

function upsert_(name, cols, rec) {
  const sh = sheet_(name);
  if (!rec.ID) rec.ID = Utilities.getUuid().slice(0, 8);
  const vals = [cols.map(function (c) { return rec[c] == null ? '' : String(rec[c]); })];
  const v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) {
    if (String(v[i][0]) === String(rec.ID)) {
      sh.getRange(i + 1, 1, 1, cols.length).setNumberFormat('@').setValues(vals);
      return;
    }
  }
  const row = sh.getLastRow() + 1;
  sh.getRange(row, 1, 1, cols.length).setNumberFormat('@').setValues(vals);
}

function remove_(name, id) {
  const sh = sheet_(name);
  const v = sh.getDataRange().getValues();
  for (var i = v.length - 1; i >= 1; i--) if (String(v[i][0]) === String(id)) sh.deleteRow(i + 1);
}

function move_(name, cols, list, id, dir) {
  const i = list.map(function (x) { return x.id; }).indexOf(id), j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  list.forEach(function (x, k) { x.order = (k + 1) * 10; });
  const t = list[i].order; list[i].order = list[j].order; list[j].order = t;
  const sh = sheet_(name), v = sh.getDataRange().getValues(), oc = cols.indexOf('Order') + 1;
  list.forEach(function (x) {
    for (var r = 1; r < v.length; r++) if (String(v[r][0]) === x.id) sh.getRange(r + 1, oc).setNumberFormat('@').setValue(String(x.order));
  });
}

function adminSaveSection(rec) { guard_(); upsert_(SECTIONS_SHEET, SECTION_COLS, rec); return adminLoad(); }
function adminDeleteSection(id) { guard_(); remove_(SECTIONS_SHEET, id); return adminLoad(); }
function adminMoveSection(id, dir) {
  guard_();
  const all = readCms_().sections, s = all.filter(function (x) { return x.id === id; })[0];
  if (s) move_(SECTIONS_SHEET, SECTION_COLS, all.filter(function (x) { return x.page === s.page; }), id, dir);
  return adminLoad();
}

function adminSavePhoto(rec) { guard_(); upsert_(PHOTOS_SHEET, PHOTO_COLS, rec); return adminLoad(); }
function adminMovePhoto(id, dir) { guard_(); move_(PHOTOS_SHEET, PHOTO_COLS, readCms_().photos, id, dir); return adminLoad(); }
function adminDeletePhoto(id) {
  guard_();
  const p = readCms_().photos.filter(function (x) { return x.id === id; })[0];
  remove_(PHOTOS_SHEET, id);
  if (p && /^drive:/.test(p.source)) { try { DriveApp.getFileById(p.source.slice(6)).setTrashed(true); } catch (err) {} }
  return adminLoad();
}

function adminUploadPhoto(dataUrl, name, meta) {
  guard_();
  const m = String(dataUrl).match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
  if (!m) throw new Error('That file is not an image.');
  const blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], name || 'photo.jpg');
  const file = DriveApp.getFolderById(PHOTO_FOLDER_ID).createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); // the public site shows it
  meta = meta || {};
  upsert_(PHOTOS_SHEET, PHOTO_COLS, {
    ID: '', Source: 'drive:' + file.getId(), Caption: meta.caption || '', Tags: meta.tags || 'gallery',
    Order: String(meta.order || 999), Show: 'Yes', Position: meta.position || '50% 30%'
  });
  return adminLoad();
}

// ---------------------------------------------------------------- one-time setup (run from the editor)
function setupCms() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  [[SETTINGS_SHEET, SETTINGS_COLS, SEED.settings], [SECTIONS_SHEET, SECTION_COLS, SEED.sections], [PHOTOS_SHEET, PHOTO_COLS, SEED.photos]].forEach(function (t) {
    if (ss.getSheetByName(t[0])) return; // never overwrite existing content
    const sh = ss.insertSheet(t[0]);
    sh.getRange(1, 1, 1, t[1].length).setValues([t[1]]).setFontWeight('bold').setBackground('#0D1B2E').setFontColor('#FAFBFD');
    sh.getRange(2, 1, Math.max(t[2].length, 1) + 200, t[1].length).setNumberFormat('@').setVerticalAlignment('top').setWrap(true);
    if (t[2].length) sh.getRange(2, 1, t[2].length, t[1].length).setValues(t[2]);
    sh.setFrozenRows(1);
  });
  const sec = ss.getSheetByName(SECTIONS_SHEET), ph = ss.getSheetByName(PHOTOS_SHEET), st = ss.getSheetByName(SETTINGS_SHEET);
  const list = function (vals) { return SpreadsheetApp.newDataValidation().requireValueInList(vals, true).setAllowInvalid(false).build(); };
  sec.getRange('D2:D500').setDataValidation(list(['hero', 'years', 'latest', 'record', 'stats', 'title', 'text', 'columns', 'list', 'roles', 'gallery', 'photo', 'contact']));
  sec.getRange('E2:E500').setDataValidation(list(['dark', 'light', 'white']));
  sec.getRange('F2:F500').setDataValidation(list(['full', 'left', 'right']));
  sec.getRange('J2:J500').setDataValidation(list(['Yes', 'No']));
  ph.getRange('F2:F500').setDataValidation(list(['Yes', 'No']));
  [[sec, [90, 90, 55, 80, 60, 60, 240, 320, 420, 50]], [ph, [90, 200, 320, 160, 55, 50, 90]], [st, [120, 360, 380]]].forEach(function (x) {
    x[1].forEach(function (w, i) { x[0].setColumnWidth(i + 1, w); });
  });
  return 'Content tabs are ready.';
}

// Run once from the editor so Google asks for the permissions the admin panel needs.
function authorize() {
  DriveApp.getFolderById(PHOTO_FOLDER_ID).getName();
  Session.getActiveUser().getEmail();
  return setupCms();
}
