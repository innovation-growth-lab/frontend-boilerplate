import {cn} from 'cn';

// Page width (1280px) with the side gutters: 24px on phones, 64px from md up.
function Container({className, ...props}) {
  return (
    <div
      className={cn('mx-auto w-full max-w-page px-6 md:px-16', className)}
      {...props}
    />
  );
}

export {Container};
