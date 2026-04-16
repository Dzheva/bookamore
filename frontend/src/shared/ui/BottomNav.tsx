import { useState } from 'react';
import { NavLink } from 'react-router';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import { AuthPrompt } from './AuthPrompt';
import { HomeSvg } from './bottomNavImg/HomeSvg';
import { FavoritesSvg } from './bottomNavImg/FavoritesSvg';
import { SellSvg } from './bottomNavImg/SellSvg';
import { ChatsSvg } from './bottomNavImg/ChatsSvg';
import { FaceSvg } from './bottomNavImg/FaceSvg';
import { selectIsAuthenticated } from '@/app/store/slices/authSlice';

export function BottomNav() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  const navItems = [
    {
      to: '/',
      label: 'Home',
      Icon: HomeSvg,
    },
    {
      to: '/favorites',
      label: 'Favorites',
      Icon: FavoritesSvg,
    },
    {
      to: '/offers/new',
      label: 'Sell',
      Icon: SellSvg,
      protected: true,
    },
    {
      to: '/chats',
      label: 'Chats',
      Icon: ChatsSvg,
    },
    {
      to: '/profile',
      label: 'Profile',
      Icon: FaceSvg,
      protected: true,
    },
  ];

  const linkStyle = (isActive: boolean) =>
    clsx(
      'flex flex-wrap items-center justify-center rounded-[16px] w-[56px] h-[32px]',
      isActive && !isAuthPromptOpen
        ? 'bg-[#E9EADB] text-[#28666E]'
        : 'bg-[#28666E] text-[#E9EADB]'
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
          z-51
        "
      >
        {navItems.map(({ to, label, Icon, protected: isProtected }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) => linkStyle(isActive)}
            onClick={(e) => {
              if (isProtected && !isAuthenticated) {
                e.preventDefault();
                setIsAuthPromptOpen(true);
              } else {
                setIsAuthPromptOpen(false);
              }
            }}
          >
            <div className="pt-[6px] pr-[9.5px] pb-[4px] pl-[9.5px]">
              <Icon />
            </div>
            <p className="text-[#E9EADB] font-kyiv">{label}</p>
          </NavLink>
        ))}
      </nav>

      <AuthPrompt
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
      />
    </>
  );
}
