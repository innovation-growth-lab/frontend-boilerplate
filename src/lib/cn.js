import {createCn} from 'cn/config';

// `cn` taught the IGL theme's own names (src/index.css), so a className can
// override them like Tailwind's: cn('max-w-page', 'max-w-prose') keeps only
// max-w-prose. vite.config.js points every `import {cn} from 'cn'` here,
// including the components shadcn adds. Add a name here when you add a
// non-colour, non-size token to the theme; colours and text sizes already work.
export const cn = createCn({
  extend: {
    theme: {
      tracking: ['label'],
      shadow: ['menu'],
      container: ['page'],
    },
  },
});
