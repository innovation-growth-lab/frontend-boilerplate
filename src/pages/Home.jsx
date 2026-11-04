import {ArrowDown} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Container} from '@/components/ui/container';
import {Eyebrow} from '@/components/ui/eyebrow';
import {pageTitle, SITE_NAME} from '../config.js';
import {flags} from '../flags.js';

// A placeholder to replace with the project's own home page. It shows the
// shared pieces in use: a <title>, the type scale and the button variants.
export default function Home() {
  return (
    <>
      <title>{pageTitle()}</title>
      <Container className="flex flex-col items-start gap-7 pt-14 pb-20">
        <Eyebrow className="text-blue">Innovation Growth Lab</Eyebrow>
        <h1 className="text-5xl">{SITE_NAME}</h1>
        <p className="max-w-[40ch] font-display text-xl">
          A starting point for IGL tools: prerendered React pages in the IGL
          brand.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button to="/#about">
            Primary <ArrowDown data-icon="inline-end" />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          {flags.componentsPage && (
            <Button variant="link" to="/components">
              All components
            </Button>
          )}
        </div>
      </Container>
      <section id="about" className="scroll-mt-6 bg-blue-10">
        <Container className="flex flex-col gap-4 py-16">
          <h2 className="text-3xl">About</h2>
          <p className="max-w-prose">
            Replace this page with the project's own, set the name and footer in{' '}
            <code>src/config.js</code>, and add each new page to{' '}
            <code>src/routes.jsx</code>.
          </p>
        </Container>
      </section>
    </>
  );
}
