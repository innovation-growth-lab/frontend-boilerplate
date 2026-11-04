import {useEffect, useState} from 'react';
import {Link, Outlet, useLocation, useNavigationType} from 'react-router';
import {Container} from '@/components/ui/container';
import logoHorizontal from '../assets/logos/igl-logo-horizontal.svg';
import logoPrimaryReversed from '../assets/logos/igl-logo-primary-reversed.svg';
import logoSecondaryReversed from '../assets/logos/igl-logo-secondary-reversed.svg';
import logoMark from '../assets/logos/igl-mark.svg';
import {FOOTER, NAV_LINKS, NESTA_ENDORSED, SITE_NAME} from '../config.js';
import {flags} from '../flags.js';
import {getConsent} from '../lib/ga.js';
import CookieBanner from './CookieBanner.jsx';

// Wraps every page: nav, the page itself, then the footer, and the cookie
// banner over them.
export default function Layout() {
  // null (closed), 'first' (they haven't answered) or 'reopened' (from the
  // footer). Read after hydration, as the prerendered HTML can't know.
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    if (flags.analytics && getConsent() === null) setBanner('first');
  }, []);
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer
        onCookieSettings={flags.analytics && (() => setBanner('reopened'))}
      />
      {banner && (
        <CookieBanner
          reopened={banner === 'reopened'}
          onClose={() => setBanner(null)}
        />
      )}
    </div>
  );
}

// A link to /#about scrolls to that element; a new page starts at the top.
// Going back or forward is left to the browser, which restores the scroll
// position it remembers for that history entry.
function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (location.hash) {
      document
        .getElementById(decodeURIComponent(location.hash.slice(1)))
        ?.scrollIntoView();
    } else if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [location, navigationType]);
  return null;
}

function Nav() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-grey-200 px-6 py-5 md:px-16 print:hidden">
      <Link
        to="/"
        className="flex min-w-0 items-center gap-5 text-dark-blue no-underline"
      >
        <img
          src={NESTA_ENDORSED ? logoHorizontal : logoMark}
          alt="Innovation Growth Lab"
          className={NESTA_ENDORSED ? 'h-10' : 'h-7'}
        />
        <span className="hidden whitespace-nowrap border-l border-grey-200 pl-5 font-display text-xl sm:block">
          {SITE_NAME}
        </span>
      </Link>
      <div className="flex items-center gap-x-8">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            className="border-b-[3px] border-transparent pb-1.5 font-semibold whitespace-nowrap text-dark-blue no-underline hover:border-red"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// `onCookieSettings` reopens the cookie banner; without it (analytics off)
// there's no banner, so no link either.
function Footer({onCookieSettings}) {
  return (
    <footer className="bg-dark-blue text-white print:hidden">
      <Container className="py-14">
        <div className="flex flex-wrap justify-between gap-14 border-b border-white/30 pb-10">
          <div className="flex max-w-[620px] flex-col items-start gap-6">
            <img
              src={NESTA_ENDORSED ? logoPrimaryReversed : logoSecondaryReversed}
              alt="Innovation Growth Lab"
              className="h-[52px]"
            />
            <p className="max-w-[24ch] font-display text-[22px] leading-[1.27]">
              {FOOTER.tagline}
            </p>
          </div>
          <nav className="flex flex-col gap-3.5 font-semibold">
            {FOOTER.links.map((l) =>
              l.href ? (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-white no-underline hover:underline"
                >
                  {l.label}
                </a>
              ) : (
                <span key={l.label}>{l.label}</span>
              ),
            )}
            {onCookieSettings && (
              <button
                type="button"
                onClick={onCookieSettings}
                className="text-left font-semibold hover:underline"
              >
                Cookie settings
              </button>
            )}
          </nav>
        </div>
        <p className="mt-6 max-w-[68ch] text-white/90">{FOOTER.description}</p>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-white/70">
          {FOOTER.legal}
        </p>
      </Container>
    </footer>
  );
}
