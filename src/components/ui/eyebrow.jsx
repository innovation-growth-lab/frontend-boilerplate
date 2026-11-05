import {cn} from 'cn';

// A small uppercase label above a heading.
function Eyebrow({className, ...props}) {
  return (
    <div
      className={cn(
        'text-xs font-semibold uppercase tracking-label',
        className,
      )}
      {...props}
    />
  );
}

export {Eyebrow};
