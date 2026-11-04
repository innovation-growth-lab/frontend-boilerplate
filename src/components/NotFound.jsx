import {pageTitle, SITE_NAME} from '../config.js';
import {Button, Container, Eyebrow} from './ui.jsx';

// An unknown path. The host serves 404.html (this page, prerendered) for it
// with a 404 status, and the app shows this at the same URL, so GA's page view
// carries the real path and this page's title.
export default function NotFound() {
  return (
    <>
      <title>{pageTitle('Page not found')}</title>
      <Container className="flex flex-col items-start gap-7 pt-14 pb-30">
        <Eyebrow className="text-blue">404</Eyebrow>
        <h1 className="text-5xl">Page not found</h1>
        <p className="max-w-[40ch] font-display text-xl">
          That page doesn't exist or has moved.
        </p>
        <Button to="/" icon="arrow-right">
          Back to {SITE_NAME}
        </Button>
      </Container>
    </>
  );
}
