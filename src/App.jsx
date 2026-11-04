import {Route, Routes} from 'react-router';
import Layout from './components/Layout.jsx';
import NotFound from './components/NotFound.jsx';
import Home from './pages/Home.jsx';

// Every page and its URL. Real paths, so the back button and bookmarks work.
// Add each new page to `routes` in entry-server.jsx too, so it's prerendered:
// the deployed host serves only files. A page behind a feature flag is best
// left out when the flag is off, so its URL falls through to NotFound:
//
//   {flags.beta && <Route path="beta" element={<Beta />} />}
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
