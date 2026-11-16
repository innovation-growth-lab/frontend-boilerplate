// Receives screen reports from src/lib/screen-report.js and adds each one as
// a row in a Google Sheet. It runs in Google Apps Script, not in this repo.
//
// Setting it up (once; one sheet can collect several prototypes, told apart
// by the "site" column):
//
// 1. Make a Google Sheet. Extensions > Apps Script, replace the code there
//    with this file, and save.
// 2. Deploy > New deployment > type "Web app". Execute as: Me. Who has
//    access: Anyone. Deploy, and authorise it when asked.
// 3. Copy the web app URL (it ends in /exec) into VITE_SCREEN_REPORT_URL:
//    in .env.local for a local production build, and in the Vercel project's
//    environment variables for the prototype. Rebuild or redeploy.
//
// After changing this code, Deploy > Manage deployments > edit > Version:
// New version, so the same URL runs the new code.
//
// "Anyone" means anyone with the URL can add rows, and the URL is in the
// site's JavaScript. That's fine for a prototype's screen sizes; the checks
// below keep each row to the expected columns and stop a value being read as
// a formula, but don't treat the sheet as trustworthy beyond that.

const SHEET_NAME = 'Screens';
const COLUMNS = [
  'site',
  'path',
  'version',
  'screenWidth',
  'screenHeight',
  'pixelRatio',
  'windowWidth',
  'windowHeight',
  'touch',
];
const NUMBERS = new Set([
  'screenWidth',
  'screenHeight',
  'pixelRatio',
  'windowWidth',
  'windowHeight',
]);

function doPost(e) {
  let report;
  try {
    report = JSON.parse(e.postData.contents);
  } catch (_) {
    return reply('not JSON');
  }
  const row = COLUMNS.map((name) => {
    const value = report[name];
    if (NUMBERS.has(name)) {
      const n = Number(value);
      return Number.isFinite(n) ? n : '';
    }
    if (name === 'touch') return value === true;
    // A leading = + - or @ would make the sheet treat it as a formula.
    const text = String(value ?? '').slice(0, 200);
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow(['received', ...COLUMNS]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), ...row]);
  } finally {
    lock.releaseLock();
  }
  return reply('ok');
}

function reply(text) {
  return ContentService.createTextOutput(text);
}
