import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  className,
  type = 'button',
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'w-full px-4 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer',
        {
          // primary
          'bg-deep-blue text-white hover:bg-deep-blue-950 active:bg-deep-blue-950':
            variant === 'primary',

          // secondary
          'border border-deep-blue text-text-black bg-white hover:bg-[#DDF3FF] active:bg-[#DDF3FF] hover:text-deep-blue':
            variant === 'secondary',
        },
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};
