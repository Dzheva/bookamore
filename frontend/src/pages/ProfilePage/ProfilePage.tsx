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

const ProfilePage = () => {
  const { t } = useTranslation();
  // Тимчасові дані користувача
  const user = {
    name: 'Jane Walker',
    email: 'janewalker@gmail.com',
    avatar: 'https://v0.dev/placeholder.svg', // Сюди підставиться реальне фото пізніше
  };

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
            <img
              src={user.avatar}
              alt={user.name}
              className="w-[86px] h-[86px] 
              rounded-[50px]
              "
            />
            <div className="min-w-[215px]">
              <h2 className="text-h3m ">{user.name}</h2>
              <p className="text-em">{user.email}</p>
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
