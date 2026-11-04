# Frontend Boilerplate

A starting point IGL's interactive web tools, using Vite, React Router
and Tailwind in the IGL brand, prerendering to static HTML at build time,
with Google Analytics behind a cookie banner, feature flags, a deploy
script for the IGL WordPress server, and basic snapshotting.

There is no backend; everything builds to static HTML to host anywhere.

## Starting a project

1. Copy this repo, then set `name` in `package.json`.
2. `src/config.js`: the tool's name, nav links, footer and the "by Nesta"
   switch.
3. `index.html`: change the fallback `<title>`.
4. `deploy.sh`: set `BASE`, the URL path on innovationgrowthlab.org. The
   script won't run until this is changed.
5. Replace `src/pages/Home.jsx`'s content and add your own pages.

## Running it

On first run,

```sh
npm install
```

and add the Brown font files, which aren't in the repo due to licensing.

then,

```sh
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
npm run lint       # Biome; lefthook also formats on commit and lints on push
```

Pages are listed in `src/routes.jsx`. `AGENTS.md` says where everything else
is and how to check visual changes with before/after screenshots.

## Feature flags

Each flag is `VITE_FLAG_<NAME>=on|off`, with its default in `src/flags.js` and
a line in `.env.example`. Set in `.env.local`, or locally:

```
VITE_FLAG_ANALYTICS=off npm run dev
```

Vite fixes flags into the bundle at build time. A feature that's off is
hidden but its code is still bundled.

`deploy.sh` has overrides as a safeguard for the live site in its `FLAGS` list
which overrule `.env`. You can see the flags for the build in `dist/VERSION`.

## Hosting

`npm run build` renders every page in `src/routes.jsx` to static HTML so crawlers and
first paint get real content, and the browser then hydrates it. Unknown paths
get `dist/404.html`. Pages render in Node first, so anything that touches
`window`, `document` or `localStorage` must stay inside an effect or event
handler.

- **innovationgrowthlab.org (Apache):** `./deploy.sh` builds for `BASE`, copies
  `dist/` to the server over ssh (`igl-website` alias in `~/.ssh/config`), and
  tags the release. It deploys only a clean, pushed, untagged commit, and
  suggests the next `v*` tag. `--dry-run` builds and lists what would change,
  without deploying or keeping the tag. `--force` skips the checks and the tag.

  To check the live version,

  ```sh
  curl https://www.innovationgrowthlab.org/tools/<path>/VERSION`.
  ```

- **Vercel (prototype):** works as is with `vercel --prod`.
- **Any other static host:** serve `dist/`, point its 404 page at `404.html`,
  and for a sub-path build with `VITE_BASE=/sub/path/ npm run build`.

The deployed build has no fallback to `index.html`, so every valid URL must be
a prerendered file. If a project adds pages made from a visitor's own data
(like user-named projects), those can't be prerendered. They need
`dist/index.html` as an SPA fallback, which Vercel can do with a `rewrites` rule
in `vercel.json` but the WordPress server can't. You can instead keep those
pages behind a flag that `deploy.sh` turns off.

## Analytics and cookies

Page views go to the same GA4 property as the WordPress site (`src/lib/ga.js`).
gtag.js loads only after the visitor accepts the `CookieBanner`; rejecting
removes GA's cookies. The answer is kept in `localStorage` under
`SJ_IS_COOKIE_CONSENT`, the same key the WordPress cookie banner uses, so they
stay in sync.

Nothing is sent from `npm run dev` unless it is run as
`VITE_FLAG_GA_DEBUG=on npm run dev`. That flag also marks every hit
`debug_mode` so it shows in DebugView; `deploy.sh` forces it off. Later page
views come from GA's "page changes based on browser history events" setting
(keep it on).

`VITE_FLAG_ANALYTICS=off` removes GA, the banner and the footer link.
