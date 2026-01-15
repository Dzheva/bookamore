import React from "react";
import { Link } from "react-router-dom";
// Використовуємо лише react-icons/fa, щоб уникнути помилок імпорту
import { 
  FaChevronRight, 
  FaPencilAlt, 
  FaBoxOpen, 
  FaRegHeart, 
  FaRegComments, 
  FaCog, 
  FaBook 
} from "react-icons/fa"; 
import BackButton from "@/shared/ui/BackButton";
import { BottomNav } from "@/shared/ui/BottomNav";

// Масив пунктів меню з іконками Font Awesome
const menuItems = [
  { 
    title: "My Announcements", 
    path: "/my-announcements", 
    icon: <FaBook className="w-5 h-5" /> 
  },
  { 
    title: "My Orders", 
    path: "/orders", 
    icon: <FaBoxOpen className="w-5 h-5" /> 
  },
  { 
    title: "My Favorites", 
    path: "/favorites", 
    icon: <FaRegHeart className="w-5 h-5" /> 
  },
  { 
    title: "My Chats", 
    path: "/chats/:chatId", 
    icon: <FaRegComments className="w-5 h-5" /> 
  },
  { 
    title: "Settings", 
    path: "/settings", 
    icon: <FaCog className="w-5 h-5" /> 
  },
];

const ProfilePage = () => {
  // Тимчасові дані користувача
  const user = {
    name: "Jane Walker",
    email: "janewalker@gmail.com",
    avatar: "https://v0.dev/placeholder.svg", // Сюди підставиться реальне фото пізніше
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10">
        <BackButton />
        <h1 className="text-xl font-semibold flex-1 text-center text-slate-800">
          Profile
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="px-6 py-8">
        {/* Секція профілю користувача */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-500/20 shadow-sm"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 text-sm">{user.email}</p>
            </div>
          </div>
          <Link 
            to="/settings" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-400 hover:text-teal-600"
          >
            <FaPencilAlt className="w-5 h-5" />
          </Link>
        </div>

        {/* Навігаційне меню */}
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-between p-4 rounded-2xl border border-teal-600/10 bg-white text-slate-700 shadow-sm hover:shadow-md hover:bg-teal-50 hover:border-teal-600/30 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <span className="text-teal-600 opacity-80">{item.icon}</span>
                <span className="font-medium text-lg text-slate-700">{item.title}</span>
              </div>
              <FaChevronRight className="w-4 h-4 text-teal-600/50" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Нижня навігація */}
      <BottomNav isProfilePage={true} />
    </div>
  );
};

export default ProfilePage;
