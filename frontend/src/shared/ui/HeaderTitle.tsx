import { type ReactNode } from 'react';
import BackButton from './BackButton';

type HeaderProps = {
  title: string;
  icon?: ReactNode;
  className?: string;
  onIconClick?: () => void;
};

const HeaderTitle = ({ title, icon, className }: HeaderProps) => {
  return (
    <header
      className={`
        relative
        flex items-center justify-between
        w-full lg:max-w-6xl xl:max-w-7xl
        mx-auto
        p-4
        lg:py-5
        sm:px-6 lg:px-8 xl:px-12
        ${className || ''}
        `}
    >
      <BackButton />
      <h1 className="absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 text-h2m lg:text-[22px] text-text-black">
        {title}
      </h1>
      {icon && <>{icon}</>}
    </header>
  );
};

export default HeaderTitle;
