// Reports the size of a visitor's screen and browser window, once per browser,
// so we can see what prototypes are really viewed on. It POSTs a small JSON
// record to VITE_SCREEN_REPORT_URL: a Google Apps Script web app that appends
// a row to a Google Sheet (scripts/screen-report.gs has it and how to set it
// up). No cookies, no IDs: only the numbers below, the page and the time.
//
// Off unless flags.screenReport is on and the URL is set. deploy.sh forces the
// flag off for the live site, which asks for cookie consent before any
// tracking. Local dev never sends: it logs what it would have sent to the
// console, so a dev session doesn't fill the sheet.
//
// Layout calls it on the home page. Anything here reads window, so call it
// from an effect, never during render.
import {flags} from '../flags.js';

const ENDPOINT = import.meta.env.VITE_SCREEN_REPORT_URL;
// Set once the report has gone, so each browser is counted once.
const SENT_KEY = 'igl-screen-reported';
// Already sent from this page load, before localStorage is updated.
let sending = false;

export function reportScreen() {
  if (!flags.screenReport || !ENDPOINT || sending) return;
  try {
    if (localStorage.getItem(SENT_KEY)) return;
  } catch {
    // Storage is blocked: send anyway, at the risk of counting them twice.
  }
  // A page opened in a background tab may have no window size yet: wait
  // until they look at it.
  if (document.hidden || window.innerWidth === 0) {
    document.addEventListener('visibilitychange', reportScreen, {once: true});
    window.addEventListener('resize', reportScreen, {once: true});
    return;
  }
  const report = {
    site: window.location.host,
    path: window.location.pathname,
    version: import.meta.env.VITE_VERSION ?? '',
    // The whole display, in CSS pixels. On a laptop at "Looks like 1440 × 900"
    // this is 1440 × 900 whatever the panel's real resolution.
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    // Device pixels per CSS pixel: 2 on a Retina Mac, 1.25 or 1.5 on many
    // Windows laptops with display scaling. Browser zoom changes it too (110%
    // zoom on a 1× screen reads 1.1), so it isn't the hardware alone.
    pixelRatio: window.devicePixelRatio,
    // The page's own space, which is what the layout responds to: the screen
    // less the taskbar, browser toolbars and any window that isn't full size.
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    // Mostly touch (phone, tablet) rather than a mouse or trackpad.
    touch: window.matchMedia('(pointer: coarse)').matches,
  };

  sending = true;

  if (!import.meta.env.PROD) {
    console.info('Screen report (dev, not sent):', report);
    return;
  }

  // text/plain keeps this a "simple" request, which Apps Script accepts from
  // another site without a CORS preflight; no-cors because its reply can't be
  // read anyway. keepalive lets it finish if they leave the page at once.
  fetch(ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body: JSON.stringify(report),
  })
    .then(() => {
      try {
        localStorage.setItem(SENT_KEY, '1');
      } catch {
        // Not kept: they may be counted again next time.
      }
    })
    .catch(() => {
      // Offline or blocked: try again on their next visit.
    });
}
