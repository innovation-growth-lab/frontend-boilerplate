// Runs after `vite build` and `vite build --ssr`: renders every route to
// static HTML so crawlers and first paint get real content, then the client
// bundle hydrates it.
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {pathToFileURL} from 'node:url';

const dist = 'dist';
const serverDir = 'dist-server';
const {render, routes} = await import(
  pathToFileURL(join(serverDir, 'entry-server.js'))
);
const template = await readFile(join(dist, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) {
  throw new Error('No empty <div id="root"></div> in dist/index.html');
}

async function write(route, file) {
  let html = render(route);
  // React puts <title> where it's rendered; it belongs in <head>.
  const title = html.match(/<title>[\s\S]*?<\/title>/)?.[0];
  if (title) html = html.replace(title, '');
  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, (t) => title ?? t)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
  await mkdir(dirname(file), {recursive: true});
  await writeFile(file, page);
}

for (const route of routes) {
  await write(route, join(dist, route, 'index.html'));
}

// The host serves this, with a 404 status, for any path that isn't a page. It
// shows the not-found page whatever the URL, and hydrates like the others.
await write('/404', join(dist, '404.html'));

await rm(serverDir, {recursive: true});
console.log(`Prerendered ${routes.length} pages plus 404.html`);
