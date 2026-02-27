import { Link, NavLink } from 'react-router-dom';
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

// Масив пунктів меню з іконками Font Awesome
const menuItems = [
  {
    title: 'My Announcements',
    path: '/my-announcements',
    icon: <FaBook className="w-5 h-5" />,
  },
  {
    title: 'My Orders',
    path: '/orders',
    icon: <FaBoxOpen className="w-5 h-5" />,
  },
  {
    title: 'My Favorites',
    path: '/favorites',
    icon: <FaRegHeart className="w-5 h-5" />,
  },
  {
    title: 'My Chats',
    path: '/chats/:chatId',
    icon: <FaRegComments className="w-5 h-5" />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <FaCog className="w-5 h-5" />,
  },
];

const ProfilePage = () => {
  // Тимчасові дані користувача
  const user = {
    name: 'Jane Walker',
    email: 'janewalker@gmail.com',
    avatar: 'https://v0.dev/placeholder.svg', // Сюди підставиться реальне фото пізніше
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <HeaderTitle title="Profile" />

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
      </div>

      <BottomNav isProfilePage={true} />
    </div>
  );
};

export default ProfilePage;
