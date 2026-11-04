// Site-wide settings and copy that isn't part of a page. Most of a new
// project's set-up happens here, plus <title> in index.html and BASE in
// deploy.sh.

// The tool's name: nav, page titles and the not-found page.
export const SITE_NAME = 'Frontend Boilerplate';

// Show the "by Nesta" logo lockups. Off: IGL on its own.
export const NESTA_ENDORSED = true;

// `to` is a path in the app; a hash (/#about) scrolls to that element's id.
export const NAV_LINKS = [{label: 'About', to: '/#about'}];

export const FOOTER = {
  tagline: 'Creating strong foundations for policy change',
  description:
    'IGL brings together researchers, policymakers and practitioners to test what works in innovation, entrepreneurship and growth policy, and to make the results usable.',
  // Add an `href` to make a link live.
  links: [
    {label: 'About'},
    {label: 'Privacy notice'},
    {label: 'Terms of use'},
    {label: 'Contact us'},
  ],
  legal:
    'Innovation Growth Lab is a global initiative led by Nesta, a registered charity in England and Wales (1144091) and Scotland (SC042833).',
};

export const COOKIE_POLICY_URL =
  'https://www.innovationgrowthlab.org/cookie-policy';

// A page's <title>: pageTitle('Results') is "Results | <SITE_NAME>", and
// pageTitle() is the home page's. React wants <title> to hold one string.
export const pageTitle = (page) =>
  page ? `${page} | ${SITE_NAME}` : `${SITE_NAME} | Innovation Growth Lab`;
