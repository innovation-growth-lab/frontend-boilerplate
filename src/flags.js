// Feature flags. Each one is set by VITE_FLAG_<NAME>=on|off (see .env.example)
// and falls back to the default below. Vite fixes the values at build time, so
// changing a flag means rebuilding. A feature that's off is hidden, not
// removed: its code still ships in the bundle. deploy.sh forces some flags for
// the live site.
//
// To add one: a line here, a line in .env.example, and `flags.<name> &&` where
// it's used. For a whole page, give it `flag: '<name>'` in src/routes.jsx
// instead: when it's off, its URL is the not-found page.

function flag(name, fallback) {
  const value = import.meta.env[`VITE_FLAG_${name}`];
  if (!value) return fallback;
  if (value === 'on' || value === 'true') return true;
  if (value === 'off' || value === 'false') return false;
  // Fails the build (prerendering imports this) rather than guessing.
  throw new Error(`VITE_FLAG_${name} is "${value}", not on or off`);
}

export const flags = {
  // Google Analytics and its cookie banner. Switch it off for any site whose
  // URLs or titles carry what visitors type in (irm's projects, say): GA reads
  // both, and none of that may reach it.
  analytics: flag('ANALYTICS', true),
  // Send analytics from `npm run dev` too, and mark every hit debug_mode so it
  // shows in GA's DebugView. deploy.sh forces it off.
  gaDebug: flag('GA_DEBUG', false),
};
