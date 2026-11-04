import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
} from 'lucide-react';
import {Link} from 'react-router';

// The building blocks every page shares, following the IGL design system.
// Icons are Lucide's: add a glyph to GLYPHS to use it by name, or import from
// lucide-react directly where a page needs one once.

export const cx = (...classes) => classes.filter(Boolean).join(' ');

// The IGL icon set is square-cut and 2px.
const GLYPHS = {
  'arrow-right': ArrowRight,
  'arrow-down': ArrowDown,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  download: Download,
  external: ExternalLink,
};

export function Icon({name, size = 20, className}) {
  const Glyph = GLYPHS[name];
  return (
    <Glyph
      size={size}
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
    />
  );
}

// Page width, with the side gutters.
export function Container({className, ...props}) {
  return (
    <div
      className={cx('mx-auto w-full max-w-page px-6 md:px-16', className)}
      {...props}
    />
  );
}

// Small uppercase label.
export function Eyebrow({className, ...props}) {
  return (
    <div
      className={cx(
        'text-xs font-semibold uppercase tracking-label',
        className,
      )}
      {...props}
    />
  );
}

// ---- Button ----------------------------------------------------------------
// primary is the one action on a page: solid red, with the brand's quarter
// round on the bottom right. secondary is a quiet alternative, ghost a quiet
// in-page action, and low an underlined text link. (Hover is not-disabled:
// rather than enabled:, which a link never is.)

const VARIANTS = {
  primary:
    'bg-red text-white not-disabled:hover:bg-red-80 disabled:bg-grey-200 disabled:text-grey-500',
  secondary: 'text-grey-700 not-disabled:hover:bg-grey disabled:text-grey-300',
  ghost: 'text-dark-blue not-disabled:hover:bg-blue-60 disabled:text-grey-300',
  low: 'text-blue underline underline-offset-3 not-disabled:hover:text-dark-blue disabled:text-grey-300',
};

const SIZES = {
  sm: {text: 'text-sm', pad: 'px-[18px] py-2.5', corner: 'rounded-br-[12px]'},
  md: {text: 'text-base', pad: 'px-6 py-3.5', corner: 'rounded-br-[16px]'},
};

// A <button>, or a link when given `to` (in the app) or `href` (elsewhere).
// `icon` is a GLYPHS name, shown after the label.
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  to,
  href,
  className,
  children,
  ...props
}) {
  const s = SIZES[size];
  const classes = cx(
    'inline-flex items-center gap-2.5 font-semibold leading-tight no-underline transition-colors duration-150 disabled:cursor-not-allowed',
    s.text,
    variant !== 'low' && s.pad,
    variant === 'primary' && s.corner,
    VARIANTS[variant],
    className,
  );
  const content = (
    <>
      {children}
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
    </>
  );
  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
