import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router';
import App from './App.jsx';
import './index.css';
import {loadAnalytics} from './lib/ga.js';

// Starts Google Analytics if the visitor has already accepted cookies.
loadAnalytics();

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages, 404.html included, already have markup to hydrate; the dev
// server's empty shell, and any page left out of prerendering, render from
// scratch. Pages render in Node first, so anything that reads window,
// document or localStorage must wait for an effect or event handler.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
