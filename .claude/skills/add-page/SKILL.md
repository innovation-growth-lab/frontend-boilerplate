---
name: add-page
description: Add a new page (a new URL) to this site. Use when someone asks for a new page, screen, section with its own address, or a set of pages generated from content such as one page per guide.
---

# Add a page

1. **Agree what it is.** Get the page's name, its URL (lowercase, hyphens:
   `/case-studies`), and whether it should appear in the top nav. If it should
   only exist on some builds, it needs a flag: follow the `add-flag` skill
   first. If it's one page per item of some content (one per guide, say), the
   URL has a parameter (`/guides/:slug`).

2. **Write the page** in `src/pages/<Name>.jsx`, following `src/pages/Home.jsx`:
   - a `<title>{pageTitle('<Name>')}</title>` first;
   - content inside `<Container>`, built from `src/components/ui.jsx`;
   - IGL colours only (see AGENTS.md); nothing that reads `window`, `document`
     or `localStorage` outside `useEffect` or an event handler.
     For a parameter, read it with `useParams()` from `react-router`, and render
     `<NotFound />` (`src/components/NotFound.jsx`) when it matches nothing.

3. **Register it** with one line in `PAGES` in `src/routes.jsx`:
   - plain: `{path: '/case-studies', element: <CaseStudies />}`
   - flagged: add `flag: '<name>'`
   - with a parameter: add `paths` listing every real URL, built from the same
     content the page reads, e.g. `paths: guides.map((g) => \`/guides/${g.slug}\`)`.
Use `paths: []` only for pages built from a visitor's own data, and read
     the Hosting section of AGENTS.md first: those pages 404 on the live site.

4. **Add it to the nav** if wanted: `NAV_LINKS` in `src/config.js`.

5. **Check it.** After `npm run build`, `dist/<path>/index.html` must exist
   for each new path. With `npm run dev` running, screenshot it:
   `ONLY='<screen-name>' npm run screenshots -- http://localhost:5173/ screens/new`
   (the screen name is the URL without the leading slash, `/` becoming `-`).
   Look at the screenshot yourself, fix what's off, then show it to the person.
