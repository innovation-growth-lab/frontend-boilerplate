import {useEffect, useRef} from 'react';
import {Container} from '@/components/ui/container';
import {COOKIE_POLICY_URL} from '../config.js';
import {setConsent} from '../lib/ga.js';

// Accept and Reject share this, so neither is easier to choose than the other.
const BUTTON =
  'rounded bg-white px-9 py-3 text-lg font-semibold text-dark-blue hover:bg-grey';

// Asks whether Google Analytics may set cookies, laid out like the banner on
// the WordPress pages, except that Reject is as prominent as Accept. `reopened`
// is when it was opened again from the footer, which moves focus here and adds
// a Close button that keeps the earlier answer.
export default function CookieBanner({reopened, onClose}) {
  const ref = useRef(null);
  useEffect(() => {
    if (reopened) ref.current.focus();
  }, [reopened]);

  const choose = (accepted) => {
    setConsent(accepted);
    onClose();
  };

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-50 bg-dark-blue text-white outline-none print:hidden"
    >
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="max-w-[68ch]">
          <p id="cookie-banner-title" className="font-display text-2xl">
            We value your privacy
          </p>
          <p className="mt-3">
            We use Google Analytics cookies to see how this site is used and to
            improve your experience. Nothing is set unless you accept.{' '}
            <a
              href={COOKIE_POLICY_URL}
              target="_blank"
              rel="noreferrer"
              className="text-white underline underline-offset-3"
            >
              Find out more
            </a>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <button type="button" onClick={() => choose(true)} className={BUTTON}>
            Accept
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className={BUTTON}
          >
            Reject
          </button>
          {/* The first time they have to answer; reopened, closing keeps theirs. */}
          {reopened && (
            <button
              type="button"
              onClick={onClose}
              className="text-white underline underline-offset-3"
            >
              Close
            </button>
          )}
        </div>
      </Container>
    </div>
  );
}
