// Google Analytics, in the same property as the WordPress pages. loadAnalytics
// runs Google's snippet; it sends the first page view itself, and GA's "page
// changes based on browser history events" setting sends the rest (keep it on).
//
// It only runs once the visitor has accepted cookies. The answer is kept in
// localStorage under the key the WordPress banner (the
// cookie-consent-autoblock plugin) uses, which is shared across this origin,
// so a choice made on either side holds for both: 1 is accepted, 0 is
// rejected, nothing is not asked yet. CookieBanner asks, and calls
// setConsent. If the WordPress consent plugin changes, update the key here.
//
// Nothing here runs when flags.analytics is off, and Layout leaves out the
// banner and its "Cookie settings" link.
import {flags} from '../flags.js';

const GA_ID = 'G-SFDKZDS9D4';
const CONSENT_KEY = 'SJ_IS_COOKIE_CONSENT';

let loaded = false;

// true, false, or null when the visitor hasn't answered.
export function getConsent() {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY));
    return value === 1 ? true : value === 0 ? false : null;
  } catch {
    return null;
  }
}

// Removes the GA cookies, which are set on the parent domain so WordPress
// shares them. Which domain it was is not known here, so try them all.
function clearCookies() {
  const names = ['_ga', `_ga_${GA_ID.slice(2)}`];
  const labels = window.location.hostname.split('.');
  for (const name of names) {
    // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API isn't in every browser yet
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (let i = 0; i < labels.length - 1; i++) {
      const domain = labels.slice(i).join('.');
      // biome-ignore lint/suspicious/noDocumentCookie: as above
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
    }
  }
}

// Records the visitor's answer. Rejecting switches GA off, including the
// automatic events gtag.js sends, and removes its cookies. Accepting makes sure
// the page they are on is counted: loadAnalytics does it for GA's first start,
// and a page view is sent by hand when they accept again after rejecting,
// because gtag.js is already running and sends nothing on its own.
export function setConsent(accepted) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(accepted ? 1 : 0));
  } catch {
    // Storage is blocked: an answer can't be kept, so nothing is tracked.
  }
  const disableKey = `ga-disable-${GA_ID}`;
  const resumed = loaded && window[disableKey] === true;
  window[disableKey] = !accepted;
  if (!accepted) clearCookies();
  else if (resumed) window.gtag('event', 'page_view');
  else loadAnalytics();
}

// Runs Google's snippet, once the visitor has accepted cookies. GA then sends
// the first page view itself. Call it once on load, for a visitor who accepted
// on an earlier visit or on the WordPress site. Production builds always send;
// local dev only does when run as `VITE_FLAG_GA_DEBUG=on npm run dev`, so it
// never pollutes the data. With that flag on, in any build, every hit is
// marked debug_mode, which shows it in DebugView. Whether it also stays out of
// the reports depends on the property's "Developer traffic" data filter being
// Active, not Testing. (The Google Analytics Debugger extension only logs to
// the console; it doesn't mark anything.)
export function loadAnalytics() {
  if (!flags.analytics) return;
  if (!import.meta.env.PROD && !flags.gaDebug) return;
  if (loaded || getConsent() !== true) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.append(script);
  window.dataLayer = window.dataLayer || [];
  // gtag.js reads the arguments object, so this can't take rest parameters.
  window.gtag = function () {
    // biome-ignore lint/complexity/noArguments: gtag.js needs the arguments object itself
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, flags.gaDebug ? {debug_mode: true} : {});
  loaded = true;
}
