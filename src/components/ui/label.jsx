import {cn} from 'cn';

// A field label, in Brown as the IGL design system sets them. Beside a
// checkbox, pass className="font-sans text-lg" for body text instead.
function Label({className, ...props}) {
  return (
    <label
      data-slot="label"
      className={cn(
        'flex items-center gap-2 font-heading text-xl leading-tight font-normal select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export {Label};
