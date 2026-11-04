---
name: add-flag
description: Add a feature flag, to switch a page or feature on or off per build or keep something off the live site. Use when someone wants to hide, preview, trial or stage a feature, or keep work in progress off the live site.
---

# Add a feature flag

1. **Name it and pick a default.** A short camelCase key (`caseStudies`) and
   its env name in capitals with underscores (`VITE_FLAG_CASE_STUDIES`). Ask
   whether it should be on or off by default, and whether the live site
   (innovationgrowthlab.org) must always have it off, or on.

2. **`src/flags.js`:** add it to `flags` with a one-line comment on what it
   covers:
   ```js
   // The case studies page and its nav link.
   caseStudies: flag('CASE_STUDIES', false),
   ```
   A flag that only makes sense alongside another can depend on it:
   `flag('CASE_STUDIES', false) && flag('CASE_STUDY_FILTERS', true)`.

3. **`.env.example`:** add a commented line in the same style, with its default.

4. **Use it.**
   - A whole page: `flag: 'caseStudies'` on its entry in `src/routes.jsx`,
     with `load: () => import('./pages/CaseStudies.jsx')` in place of
     `element`, so its code isn't downloaded when the flag is off. Don't wrap
     routes in `App.jsx`.
   - Part of a page, a nav link, a component: `flags.caseStudies && ...`
     (import `flags` from `src/flags.js`). For a nav link, filter
     `NAV_LINKS` in `src/config.js`.

5. **The live site.** If it must be forced there, add
   `VITE_FLAG_CASE_STUDIES=off` (or `on`) to `FLAGS` in `deploy.sh`, with a
   comment saying why.

6. **Check both ways.** Build and screenshot with the flag on and off
   (`VITE_FLAG_CASE_STUDIES=on npm run build`, and the same for
   `npm run dev` and `npm run screenshots`), and confirm the feature appears
   and disappears. With a flagged page off, its URL should show the not-found
   page and the build shouldn't prerender it.
