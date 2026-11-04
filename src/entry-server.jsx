import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router';
import App from './App.jsx';

// The URLs scripts/prerender.js renders to HTML, and scripts/screenshots.js
// screenshots: every page in src/routes.jsx.
export {paths as routes} from './routes.jsx';

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
