import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaBoxOpen,
  FaRegHeart,
  FaRegComments,
  FaCog,
  FaBook,
} from 'react-icons/fa';
import { BottomNav } from '@/shared/ui/BottomNav';
import HeaderTitle from '@/shared/ui/HeaderTitle';
import { SettingLinkSvg } from '@/shared/ui/icons/SettingLinkSvg';
import { ArrowRight } from '@/shared/ui/icons/Arrows';
import LogOut from '@/shared/components/LogOut/LogOut';
import { useGetCurrentUserQuery } from '@/app/store/api/UsersApi';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { data: user } = useGetCurrentUserQuery();
  const userInitials = user?.name
    ?.split(' ')
    .map((namePart) => namePart[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const menuItems = [
    {
      title: t('profileItems.announcements'),
      path: '/my-announcements',
      icon: <FaBook className="w-5 h-5" />,
    },
    {
      title: t('profileItems.orders'),
      path: '/orders',
      icon: <FaBoxOpen className="w-5 h-5" />,
    },
    {
      title: t('profileItems.favorites'),
      path: '/favorites',
      icon: <FaRegHeart className="w-5 h-5" />,
    },
    {
      title: t('profileItems.chats'),
      path: '/chats/:chatId',
      icon: <FaRegComments className="w-5 h-5" />,
    },
    {
      title: t('profileItems.settings'),
      path: '/settings',
      icon: <FaCog className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <HeaderTitle title={t('titles.profile')} />

      <div className="px-6 ">
        <div className="flex items-center justify-between mb-10">
          <div
            className="flex items-center  flex-row gap-[10px] 
            
           "
          >
            <div
              aria-label={user?.name}
              className="w-[86px] h-[86px] rounded-[50px] bg-[#A1D9D6] flex items-center justify-center text-h3m text-[#004261]"
            >
              {userInitials}
            </div>
            <div className="min-w-[215px]">
              <h2 className="text-h3m ">{user?.name}</h2>
              <p className="text-em">{user?.email}</p>
            </div>
            <NavLink to="/settings">
              <SettingLinkSvg />
            </NavLink>
          </div>
        </div>

        <nav className="flex flex-col gap-5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="
              flex justify-between items-center
              px-[16px] py-[13px]
              bg-[#F5F8F5]
              border-[1px] border-solid border-[#577561] rounded-[20px] 
             "
            >
              <div className="flex justify-start gap-4">
                <span className="text-[#577561] ">{item.icon}</span>
                <h2 className="text-h4m"> {item.title}</h2>
              </div>

              <ArrowRight />
            </Link>
          ))}
        </nav>
        <div className="mt-4 ml-4">
          <LogOut />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
