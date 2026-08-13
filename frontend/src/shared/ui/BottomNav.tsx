import { NavLink } from 'react-router';
import clsx from 'clsx';
import { HomeSvg } from './bottomNavImg/HomeSvg';
import { FavoritesSvg } from './bottomNavImg/FavoritesSvg';
import { SellSvg } from './bottomNavImg/SellSvg';
import { ChatsSvg } from './bottomNavImg/ChatsSvg';
import { FaceSvg } from './bottomNavImg/FaceSvg';
import { useTranslation } from 'react-i18next';

export function BottomNav() {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'bottomNav',
  });
  const navItems = [
    {
      to: '/',
      label: t('home'),
      Icon: HomeSvg,
    },
    {
      to: '/favorites',
      label: t('favorites'),
      Icon: FavoritesSvg,
    },
    {
      to: '/offers/new',
      label: t('sell'),
      Icon: SellSvg,
    },
    {
      to: '/chats',
      label: t('chats'),
      Icon: ChatsSvg,
    },
    {
      to: '/profile',
      label: t('profile'),
      Icon: FaceSvg,
    },
  ];

  const linkStyle = (isActive: boolean) =>
    clsx(
      'flex flex-wrap items-center justify-center rounded-[16px] w-[56px] h-[32px]',
      isActive
        ? 'bg-sand-100 text-aquamarine-700'
        : 'bg-aquamarine-700 text-sand-100'
    );

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-51">
      <nav
        className="
          bg-aquamarine-700
          min-w-[375px] h-[65px]
          pt-[6px]
          flex justify-around
        "
      >
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) => linkStyle(isActive)}
          >
            <div className="pt-[6px] pr-[9.5px] pb-[4px] pl-[9.5px]">
              <Icon />
            </div>
            <p className="text-sand-100 font-kyiv">{label}</p>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
}
