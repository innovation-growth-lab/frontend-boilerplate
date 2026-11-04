import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router';
import App from './App.jsx';

// The pages to prerender (scripts/prerender.js): every page every visitor sees
// the same. With a flag, include a page only when it's on, as App does:
// ...(flags.beta ? ['/beta'] : []). A page made from a visitor's own data
// can't be prerendered; see the README for serving those.
export const routes = ['/'];

// `route` is the app's own path ('/', '/about'); the router wants it with the
// site's base on the front.
export function render(route) {
  const base = import.meta.env.BASE_URL;
  return renderToString(
    <StaticRouter location={base + route.slice(1)} basename={base}>
      <App />
    </StaticRouter>,
  );
}
