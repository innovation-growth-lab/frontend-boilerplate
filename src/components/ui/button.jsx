import {Button as ButtonPrimitive} from '@base-ui/react/button';
import {cva} from 'class-variance-authority';
import {cn} from 'cn';
import {Link} from 'react-router';

// shadcn's Button, styled as the IGL design system's. A rectangular block;
// only the primary (default) variant has a background at rest, and only it
// takes the quarter round on the bottom-right corner (a third of its height),
// the signal of the one thing to do on the page. Everything else is square
// and earns its fill on hover. Icons go in as children, after the label:
// <Button>Next <ArrowRight data-icon="inline-end" /></Button>.
//
//   default      The one main action: IGL red.
//   secondary    A quiet alternative beside it.
//   ghost        A quiet in-page action.
//   link         An underlined text link (the design system's "low").
//   outline      A bordered control, for toolbars and filters.
//   destructive  Deleting or discarding something.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 border-2 border-transparent font-semibold leading-tight whitespace-nowrap no-underline transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed aria-invalid:ring-2 aria-invalid:ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.125em]",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground not-disabled:hover:bg-red-80 disabled:bg-grey-200 disabled:text-grey-500',
        secondary:
          'text-grey-700 not-disabled:hover:bg-grey aria-expanded:bg-grey disabled:text-grey-300',
        ghost:
          'text-dark-blue not-disabled:hover:bg-blue-60 aria-expanded:bg-blue-60 disabled:text-grey-300',
        link: 'h-auto! border-0 p-0! text-blue underline underline-offset-3 not-disabled:hover:text-dark-blue disabled:text-grey-300',
        outline:
          'border-input bg-background text-dark-blue not-disabled:hover:bg-grey aria-expanded:bg-grey disabled:text-grey-300',
        destructive:
          'bg-red-40 text-dark-blue not-disabled:hover:bg-red-60 disabled:bg-grey-200 disabled:text-grey-500',
      },
      size: {
        xs: 'gap-1.5 px-2.5 py-1 text-xs',
        sm: 'px-[18px] py-2.5 text-sm',
        default: 'px-6 py-3.5 text-base',
        lg: 'px-8 py-[17px] text-lg',
        'icon-xs': 'size-6 text-xs',
        'icon-sm': 'size-8 text-sm',
        icon: 'size-10 text-base',
        'icon-lg': 'size-14 text-lg',
      },
    },
    compoundVariants: [
      {variant: 'default', size: 'xs', class: 'rounded-br-[8px]'},
      {variant: 'default', size: 'sm', class: 'rounded-br-[12px]'},
      {variant: 'default', size: 'default', class: 'rounded-br-[16px]'},
      {variant: 'default', size: 'lg', class: 'rounded-br-[18px]'},
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// A <button>, or with `to` a link in the app and with `href` a link elsewhere,
// styled the same. (Base UI's `render` prop also works, for other elements.)
function Button({className, variant, size, to, href, ...props}) {
  const classes = cn(buttonVariants({variant, size, className}));
  if (to) return <Link to={to} className={classes} {...props} />;
  if (href) return <a href={href} className={classes} {...props} />;
  return <ButtonPrimitive data-slot="button" className={classes} {...props} />;
}

export {Button, buttonVariants};
