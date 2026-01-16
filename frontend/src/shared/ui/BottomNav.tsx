import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import clsx from 'clsx';
import { AuthPrompt } from './AuthPrompt';
import { HomeSvg } from './bottomNavImg/HomeSvg';
import { FavoritesSvg } from './bottomNavImg/FavoritesSvg';
import { SellSvg } from './bottomNavImg/SellSvg';
import { ChatsSvg } from './bottomNavImg/ChatsSvg';
import { FaceSvg } from './bottomNavImg/FaceSvg';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/app/store/slices/authSlice';

interface BottomNavProps {
  isProfilePage?: boolean;
}

export function BottomNav({ isProfilePage = false }: BottomNavProps) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
    } else {
      navigate('/profile');
    }
  };

  const containerStyle = () => clsx('pt-[6px] pr-[9.5px] pb-[4px] pl-[9.5px]');
  const textStyle = () => clsx('text-[#E9EADB] font-[KyivType Sans]');
  const isActiveStyle = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex flex-wrap items-center justify-center rounded-[16px] w-[56px] h-[32px]',
      isActive ? 'bg-[#E9EADB] text-[#28666E]' : 'bg-[#28666E] text-[#E9EADB]'
    );

  return (
    <>
      <nav
        className="
          fixed bottom-0 left-0 right-0
          bg-[#28666E]
          min-w-[375px] h-[65px]
          pt-[6px]
          flex justify-around
        "
      >
        <NavLink className={isActiveStyle} to="/">
          <div className={containerStyle()}>
            <HomeSvg />
          </div>
          <p className={textStyle()}>Home</p>
        </NavLink>

        <NavLink className={isActiveStyle} to="/favorites">
          <div className={containerStyle()}>
            <FavoritesSvg />
          </div>
          <p className={textStyle()}>Favorites</p>
        </NavLink>

        <NavLink className={isActiveStyle} to="/offers/new">
          <div className={containerStyle()}>
            <SellSvg />
          </div>
          <p className={textStyle()}>Sell</p>
        </NavLink>

        <NavLink className={isActiveStyle} to="/chats">
          <div className={containerStyle()}>
            <ChatsSvg />
          </div>
          <p className={textStyle()}>Chats</p>
        </NavLink>

        <div className={isActiveStyle({ isActive: isProfilePage })}>
          <div
            className={`${containerStyle()} cursor-pointer`}
            onClick={handleUserIconClick}
          >
            <FaceSvg />
          </div>
          <p className={`${textStyle()}`}>Profile</p>
        </div>
      </nav>

      <AuthPrompt
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
      />
    </>
  );
}
