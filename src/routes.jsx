import {flags} from './flags.js';
import Home from './pages/Home.jsx';

// Every page in the app, in one list. App.jsx gives each its URL,
// entry-server.jsx prerenders it to static HTML (the deployed host serves only
// files, so a page that isn't prerendered is a 404 there), and
// scripts/screenshots.js screenshots it. Adding a page is one line here.
//
//   path     The URL, as React Router writes it ('/guides/:slug').
//   element  The page, imported at the top of this file.
//   load     Instead of `element`, for a page behind a flag:
//            () => import('./pages/Beta.jsx'). Its code is then fetched only
//            when the flag is on; when it is, every page waits for it before
//            the app starts, so once a page is live for good, use `element`.
//   flag     Optional: a key of `flags`. The page exists only when it's on;
//            otherwise its URL is the not-found page.
//   paths    Needed when `path` has a parameter: every real URL to prerender,
//            or [] for pages made from a visitor's own data, which can't be.
const PAGES = [
  {path: '/', element: <Home />},
  {
    path: '/components',
    load: () => import('./pages/Components.jsx'),
    flag: 'componentsPage',
  },
  // {path: '/beta', load: () => import('./pages/Beta.jsx'), flag: 'beta'},
  // {path: '/guides/:slug', element: <Guide />, paths: guides.map((g) => `/guides/${g.slug}`)},
];

for (const page of PAGES) {
  if (page.flag && !(page.flag in flags)) {
    throw new Error(`${page.path}: no flag "${page.flag}" in src/flags.js`);
  }
  if (!page.element === !page.load) {
    throw new Error(`${page.path} needs either \`element\` or \`load\``);
  }
  if (page.path.includes(':') && !page.paths) {
    throw new Error(
      `${page.path} has a URL parameter, so it needs \`paths\`: every URL to prerender, or [] if it can't be`,
    );
  }
  for (const path of page.paths ?? [page.path]) {
    if (!path.startsWith('/') || path.includes(':')) {
      throw new Error(
        `${page.path}: "${path}" must be a real URL starting with /`,
      );
    }
  }
}

// The pages this build has: those behind a flag that's off are left out. Pages
// with `load` are fetched here, before the app first renders, so prerendering
// and hydration see them like any other.
export const pages = await Promise.all(
  PAGES.filter((page) => !page.flag || flags[page.flag]).map(async (page) => {
    if (!page.load) return page;
    const {default: Page} = await page.load();
    return {...page, element: <Page />};
  }),
);

// Every URL to prerender and screenshot.
export const paths = pages.flatMap((page) => page.paths ?? [page.path]);
