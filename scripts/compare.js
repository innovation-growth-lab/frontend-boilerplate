// Puts two sets of screenshots side by side, one image per screen.
//
//   node scripts/compare.js screens/before screens/after screens/compare

import {mkdirSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright';

const [left, right, out] = process.argv.slice(2);
mkdirSync(out, {recursive: true});

const dataUrl = (file) =>
  `data:image/png;base64,${readFileSync(file).toString('base64')}`;

const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width: 2900, height: 900}});

for (const name of readdirSync(left).filter((f) => f.endsWith('.png'))) {
  let other;
  try {
    other = dataUrl(join(right, name));
  } catch {
    console.log('skip', name, '(missing on the right)');
    continue;
  }
  await page.setContent(`
    <body style="margin:0;display:flex;gap:20px;background:#c00;align-items:flex-start">
      <img src="${dataUrl(join(left, name))}" style="width:1440px;display:block">
      <img src="${other}" style="width:1440px;display:block">
    </body>`);
  await page.evaluate(() =>
    Promise.all([...document.images].map((i) => i.decode())),
  );
  await page.screenshot({path: join(out, name), fullPage: true});
  console.log('ok  ', name);
}

await browser.close();
