# Frontend Boilerplate: notes for agents

A starting point for IGL's interactive web tools: Vite, React Router and
Tailwind in the IGL brand, prerendered to static HTML at build time, with
Google Analytics behind a cookie banner, feature flags, and a deploy script for
the IGL WordPress server. There is no backend. `README.md` covers set-up for
people; this file is what you need to work on the code.

Many people working in these repos aren't frontend developers. Explain changes
in terms of what a visitor sees, show screenshots rather than code, and don't
ask them to review JSX.

## Commands

```sh
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
npm run lint       # Biome
```

With `npm run preview`, open pages with a trailing slash (`/components/`).
Without one, the preview server sends the home page's HTML and React reports a
hydration mismatch that isn't real; Apache redirects to the slash.

lefthook formats staged files with Biome on commit and lints on push. If a hook
fails, fix the code or add an ignore rule; don't skip the hooks with `--no-verify`.

## Rules the checks won't catch

- **Pages live in `src/routes.jsx`.** One line there gives a page its URL,
  prerenders it, and adds it to the screenshots. Never add a `<Route>` to
  `App.jsx` by hand: it would work in dev and 404 on the live site, which
  serves only prerendered files. A path with a parameter (`/guides/:slug`)
  needs `paths` listing every real URL, or `[]` for pages built from a
  visitor's own data (see Hosting).
- **Only the IGL palette exists.** Tailwind's own colours are switched off in
  `src/index.css`, so `bg-gray-100` or `text-slate-600` silently do nothing.
  Use the IGL names: `dark-blue`, `blue`, `blue-60`/`30`/`10`, `red`,
  `red-80`/`60`/`40`, `yellow` (`-80`/`60`/`30`), `green` (`-40`/`20`),
  `grey`, `grey-50`/`150`/`200`/`300`/`500`/`700`, `white`, `black`. shadcn's
  role names (`primary`, `muted-foreground`, `border`, `input`, `ring` …) also
  work, set to IGL colours in `src/index.css`. The type scale is Tailwind's
  sizes (plus `text-2xs`) with tighter line heights. Corners are square:
  `rounded-*` gives 0.
- **Pages render in Node first.** Prerendering runs every page with no
  browser, so anything that reads `window`, `document` or `localStorage` must
  be inside a `useEffect` or an event handler, never in the render itself.
  Content that depends on them renders after hydration.
- **Every page sets its title** with `<title>{pageTitle('Name')}</title>`
  (`src/config.js`). React needs `<title>` to hold one string.
- **Build from `src/components/ui/`** (see Components) before writing a
  control of your own. If one's missing, `npx shadcn add <name>` it and restyle
  it to IGL.
- **Never commit the Brown font files.** Brown is a commercial Lineto typeface
  and this repo is public; `.gitignore` excludes them. If they're missing,
  headings fall back to Century Gothic. That's expected, not a bug to fix.
- **Ask before anything that publishes.** `./deploy.sh`, `git push` and
  `vercel` all change things other people see. Use the `deploy` skill.

## Where things are

- `src/routes.jsx`: every page, its URL, flag and prerendered paths.
- `src/pages/`: one file per page.
- `src/config.js`: site name, nav links, footer, `pageTitle()`.
- `src/components/ui/`: the UI components, shadcn/ui restyled to IGL, plus
  `Container` and `Eyebrow`. `/components` shows them all.
- `src/components/`: `Layout` (nav, footer, scroll handling, cookie banner),
  `CookieBanner`, `NotFound`.
- `src/flags.js`: feature flags.
- `src/lib/ga.js`: Google Analytics and cookie consent.
- `src/index.css`: the IGL brand as a Tailwind theme.
- `src/entry-server.jsx`, `scripts/prerender.js`: prerendering; rarely need
  changing.
- `scripts/screenshots.js`, `scripts/compare.js`: visual checks.
- `deploy.sh`, `deploy/.htaccess`: deploying to innovationgrowthlab.org.

## Feature flags

Each flag is `VITE_FLAG_<NAME>=on|off`, with its default in `src/flags.js` and
a line in `.env.example`. Set them in `.env.local` or for one command
(`VITE_FLAG_ANALYTICS=off npm run dev`). Any other value fails the build.

Vite fixes flags into the bundle at build time, so changing one means
rebuilding (on Vercel, set it per environment and redeploy). A feature that's
off is hidden, but its code still ships, so a flag is no place for secrets.

For a whole page, give it `flag: '<name>'` in `src/routes.jsx`: when it's off
the page isn't registered or prerendered, and its URL is the not-found page.
Give a flagged page `load: () => import('./pages/X.jsx')` rather than
`element`: its code is then split into its own file, which visitors don't
download while the flag is off (it's still built and deployed, so still no
place for secrets). For part of a page, use `flags.<name> && ...`.

`deploy.sh` forces flags for the live site in its `FLAGS` list, whatever the
`.env` files say, and writes them to `dist/VERSION`. Use that for anything that
must never be shown on the live site. The `add-flag` skill walks through it.

## Components

`src/components/ui/` holds shadcn/ui components (`components.json`), on
**Base UI** rather than Radix, restyled to the IGL design system. `/components`
shows each one; it's behind the `componentsPage` flag, which `deploy.sh` turns
off for the live site.

- **Base UI, not Radix.** To make a trigger render as another component, use
  `render`, not `asChild`: `<DialogTrigger render={<Button variant="outline" />}>`.
  Base UI's docs (https://base-ui.com) cover each primitive.
- **Button.** `variant` is `default` (the red primary, one per page),
  `secondary`, `ghost`, `link`, `outline` or `destructive`; `size` is `sm`,
  `default`, `lg`, or `icon`/`icon-sm`/`icon-xs`/`icon-lg` for icon-only
  buttons (give those an `aria-label`). `to="/path"` makes it an in-app link
  and `href` an external one.
- **Icons** come from `lucide-react`, used directly. CSS squares them off to
  match the IGL set. In a button, put the icon after the label with
  `data-icon="inline-end"`: `<Button>Next <ArrowRight data-icon="inline-end" /></Button>`.
- **Labels:** `Label` is set in Brown like the design system's field labels.
  Beside a checkbox, pass `className="font-sans text-lg"`.
- **Class names** are combined with `cn`, which lets a `className` override a
  component's own classes. `vite.config.js` points `import {cn} from 'cn'` at
  `src/lib/cn.js`, a copy taught the IGL theme's custom names
  (`tracking-label`, `max-w-page`, `shadow-menu`). Add a name there when you
  add a non-colour, non-size token to the theme.
- **Dark mode:** there isn't one. The components' `dark:` classes stay inert.
- **Lint:** `.biome.json` turns off three accessibility rules for
  `src/components/ui/` only, where shadcn's own patterns trip them. Elsewhere
  they apply.

A component added with `npx shadcn add <name>` arrives in shadcn's default
style and needs restyling to match the others:

- Form controls: `h-14`, `px-4`, `text-lg`, `bg-background`, a `border-input`
  border.
- Focus: `focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring`
  (a 2px blue edge). Invalid: `aria-invalid:border-destructive
  aria-invalid:ring-2 aria-invalid:ring-destructive`.
- Menu and list items: `py-2 pl-3 text-base`.
- No fixed corners (`rounded-[4px]`) or soft rings (`ring-ring/50`,
  `ring-foreground/10`: use `ring-border`).
- Then add it to `src/pages/Components.jsx`, and if it opens something, a
  screen to `STATES` in `scripts/screenshots.js`.

## Hosting

`npm run build` prerenders every path from `src/routes.jsx` to
`dist/<path>/index.html`, plus `dist/404.html` for unknown paths; the browser
then hydrates them.

- **innovationgrowthlab.org (Apache):** `./deploy.sh` builds for `BASE` (set
  once per project), copies `dist/` to the server over ssh, and tags the
  release. It deploys only a clean, pushed, untagged commit. `--dry-run` builds
  and lists what would change without deploying or keeping the tag; `--force`
  skips the checks and the tag. Without a terminal it can't prompt for the
  tag, so pass `--tag=v1.2.3`. `deploy/.htaccess` is copied in with `BASE`
  filled in. The live version is at `<site><BASE>VERSION`.
- **Vercel (prototype):** `vercel --prod`.
- **Any other static host:** serve `dist/`, point its 404 page at `404.html`,
  and for a sub-path build with `VITE_BASE=/sub/path/ npm run build`.

The live site has no fallback to `index.html`: every valid URL must be a
prerendered file. Pages built from a visitor's own data (their projects, say)
can't be prerendered, so give them `paths: []`. They then need an SPA fallback,
which Vercel can do with a `rewrites` rule in `vercel.json` sending everything
to `/index.html`, but the WordPress server can't. Keep such pages behind a flag
that `deploy.sh` turns off for the live site.

`VITE_VERSION` (tag and build time) is set by `deploy.sh` and readable as
`import.meta.env.VITE_VERSION`; dev and Vercel builds leave it unset.

## Analytics and cookies

Page views go to the same GA4 property as the WordPress site (`src/lib/ga.js`).
gtag.js loads only after the visitor accepts the cookie banner, which they can
reopen from "Cookie settings" in the footer. Reject is as prominent as Accept,
and rejecting removes GA's cookies. The answer is kept in `localStorage` under
`SJ_IS_COOKIE_CONSENT` (1 accepted, 0 rejected), the key the WordPress cookie
banner uses, so a choice on either site holds for both. If the WordPress
consent plugin changes, update the key.

Nothing is sent from `npm run dev` unless it runs with `VITE_FLAG_GA_DEBUG=on`,
which also marks every hit `debug_mode` for GA's DebugView; `deploy.sh` forces
it off. The first page view comes from the gtag.js snippet and later ones from
GA's "page changes based on browser history events" setting, which must stay
on.

`VITE_FLAG_ANALYTICS=off` removes GA, the banner and the footer link. Turn it
off for any tool whose URLs or page titles carry what visitors type in: GA
reads both.

## Checking visual changes

For anything visual, screenshot every screen before and after the change and
compare them side by side. This uses the installed Google Chrome, and needs the
dev server running.

```sh
npm run screenshots -- http://localhost:5173/ screens/before
# make the change
npm run screenshots -- http://localhost:5173/ screens/after
npm run compare -- screens/before screens/after screens/compare
```

Every path in `src/routes.jsx` is screenshotted automatically, named after its
URL. Add states a plain page load doesn't show (an open dialog, a filled form)
to `STATES` in `scripts/screenshots.js`; those are shot at window size, since a
full-page shot resizes the window and closes some popups. `ONLY=<regex>` limits
the run. Run the script with the same `VITE_FLAG_*` values as the dev server,
since it reads the page list itself. Look at the compare images, and show the
person the relevant ones.

## Skills

`.claude/skills/` has step-by-step recipes for the common requests: `add-page`,
`add-flag` and `deploy`.
