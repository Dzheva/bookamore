import React, { useState } from "react";
import { FiPlusCircle, FiBell } from "react-icons/fi";
import {GoHomeFill} from "react-icons/go"
import { LuCircleUserRound, LuHeart } from "react-icons/lu";
import { AuthPrompt } from "./AuthPrompt";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@app/store/slices/authSlice';
import { useNavigate } from 'react-router';

interface NavIconProps {
  icon: React.ReactNode;
  onClick?: () => void;
}

function NavIcon({ icon, onClick }: NavIconProps) {
  return (
    <li 
      className="text-gray-700 hover:text-black cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      {icon}
    </li>
  );
}

export function BottomNav() {
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const navigate = useNavigate();
  
  
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
    } else {
      // Якщо користувач увійшов - можна перейти на профіль або інші дії
      // Поки що просто показуємо в консолі
      console.log('User is logged in - navigate to profile');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleNewOfferClick = () => {
    navigate('/offers/new');
  };

  const handleNotificationsClick = () => {
    navigate('/chats');
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-around items-center h-14">
            <NavIcon 
              icon={<GoHomeFill size={32} />}
              onClick={handleHomeClick}
            />
            <NavIcon 
              icon={<LuHeart size={32} />}
              onClick={handleFavoritesClick}
            />
            <NavIcon 
              icon={<FiPlusCircle size={32} />}
              onClick={handleNewOfferClick}
            />
            <NavIcon 
              icon={<FiBell size={32} />}
              onClick={handleNotificationsClick}
            />
            <NavIcon 
              icon={<LuCircleUserRound size={32} />}
              onClick={handleUserIconClick}
            />
          </ul>
        </div>
      </nav>

      {/* Auth Prompt Modal */}
      <AuthPrompt 
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
      />
    </>
  );
}
