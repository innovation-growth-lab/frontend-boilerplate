import {Route, Routes} from 'react-router';
import Layout from './components/Layout.jsx';
import NotFound from './components/NotFound.jsx';
import {pages} from './routes.jsx';

// The pages come from src/routes.jsx; add new ones there, not here.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {pages.map((page) => (
          <Route key={page.path} path={page.path} element={page.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
