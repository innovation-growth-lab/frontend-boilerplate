// Full-page screenshots of every screen, for checking one build against another.
//
//   node scripts/screenshots.js <url> <out-dir>
//   node scripts/screenshots.js http://localhost:5173/ screens/before
//
// Then put two sets side by side with scripts/compare.js. ONLY=<regex> limits
// the run to matching screen names.
//
// Each screen starts from empty storage, with cookies already rejected so the
// banner stays out of the way, and the clock and Math.random pinned so dates
// and anything random come out the same on every run.
//
// Uses the installed Google Chrome rather than a Playwright-downloaded browser.

import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright';

const [url = 'http://localhost:5173/', out = 'screens/app'] =
  process.argv.slice(2);
const NOW = new Date('2026-10-01T10:00:00');

// name: a path under `url`, and optionally steps to run before the shot, which
// find things by visible text so they don't depend on how a build is put
// together. Add each new page, and each state worth checking, here:
//   'home-about': {path: '', steps: [(p) => click(p, 'About')]},
const SCREENS = {
  home: {path: ''},
  'not-found': {path: 'no-such-page'},
  // consent: null leaves the cookie question unanswered, so the banner shows.
  'cookie-banner': {path: '', consent: null},
  'cookie-settings': {path: '', steps: [(p) => click(p, 'Cookie settings')]},
};

// Buttons and links alike.
const click = (p, name) =>
  p
    .getByRole('button', {name, exact: typeof name === 'string'})
    .or(p.getByRole('link', {name, exact: typeof name === 'string'}))
    .first()
    .click();

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
    await page.goto(new URL(path, url).href);
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
