// Full-page screenshots of every screen, for checking one build against another.
//
//   node scripts/screenshots.js <url> <out-dir>
//   node scripts/screenshots.js http://localhost:5173/ screens/before
//
// Then put two sets side by side with scripts/compare.js. ONLY=<regex> limits
// the run to matching screen names.
//
// Every page in src/routes.jsx is screenshotted on its own, named after its
// URL ('/' is home, '/guides/intro' is guides-intro), using the flags this
// script runs with: run it with the same VITE_FLAG_* as the server it points
// at. STATES adds what a plain page load doesn't show.
//
// Each screen starts from empty storage, with cookies already rejected so the
// banner stays out of the way, and the clock and Math.random pinned so dates
// and anything random come out the same on every run.
//
// Uses the installed Google Chrome rather than a Playwright-downloaded browser.

import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {createServer} from 'vite';

const [url = 'http://localhost:5173/', out = 'screens/app'] =
  process.argv.slice(2);
const NOW = new Date('2026-10-01T10:00:00');

// Buttons and links alike.
const click = (p, name) =>
  p
    .getByRole('button', {name, exact: typeof name === 'string'})
    .or(p.getByRole('link', {name, exact: typeof name === 'string'}))
    .first()
    .click();

// Screens beyond one per page. path is the app's own path; steps find things
// by visible text, so they don't depend on how a build is put together.
// consent: null leaves the cookie question unanswered, so the banner shows.
const STATES = {
  'not-found': {path: '/no-such-page'},
  'cookie-banner': {path: '/', consent: null},
  'cookie-settings': {path: '/', steps: [(p) => click(p, 'Cookie settings')]},
};

// The app's own list of pages, loaded through Vite since it's JSX.
const vite = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  server: {middlewareMode: true, hmr: false},
  appType: 'custom',
  logLevel: 'error',
  // Its own cache, so it never makes the dev server re-optimise and reload.
  cacheDir: 'node_modules/.vite-screenshots',
});
const {routes} = await vite.ssrLoadModule('/src/entry-server.jsx');
await vite.close();

const SCREENS = {...STATES};
for (const path of routes) {
  const name = path.slice(1).replaceAll('/', '-') || 'home';
  if (name in SCREENS) throw new Error(`Two screens named ${name}`);
  SCREENS[name] = {path};
}

const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null;

const browser = await chromium.launch({channel: 'chrome'});
mkdirSync(out, {recursive: true});

for (const [name, {path, steps = [], consent = 0}] of Object.entries(SCREENS)) {
  if (only && !only.test(name)) continue;
  const context = await browser.newContext({
    viewport: {width: 1440, height: 900},
  });
  const page = await context.newPage();
  await page.clock.setFixedTime(NOW);
  await page.addInitScript((consent) => {
    // The key src/lib/ga.js keeps the cookie answer under.
    if (consent !== null) localStorage.SJ_IS_COOKIE_CONSENT = consent;
    let seed = 42;
    Math.random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
  }, consent);
  try {
    // Relative to `url`, so a server on a sub-path works too.
    await page.goto(new URL(path.slice(1), url).href);
    for (const step of steps) await step(page);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({
      path: join(out, `${name}.png`),
      fullPage: true,
      animations: 'disabled',
    });
    console.log('ok  ', name);
  } catch (e) {
    console.log('FAIL', name, '—', e.message.split('\n')[0]);
  }
  await context.close();
}

await browser.close();
