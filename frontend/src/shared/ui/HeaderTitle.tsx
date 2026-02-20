import { useState, type ReactNode } from 'react';
import BackButton from './BackButton';

type HeaderProps = {
  title: string;
  icon?: ReactNode;
  onIconClick?: () => void;
};

const HeaderTitle = ({ title, icon, onIconClick }: HeaderProps) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
    onIconClick?.();
  };
  return (
    <>
      <div
        className=" px-[16px] py-[20px] sm:px-6 lg:px-8 
        flex items-center justify-between "
      >
        <BackButton />
        <h1
          className="absolute left-1/2 transform -translate-x-1/2
        text-[#153037] text-[20px] font-kyiv   font-medium
          sm:text-lg lg:text-xl "
        >
          {title}
        </h1>
        {icon && (
          <span
            onClick={handleClick}
            className="cursor-pointer"
            style={{ color: active ? '#FDBD4C' : '#000000' }}
          >
            {icon}
          </span>
        )}
      </div>
    </>
  );
};

export default HeaderTitle;
