import React, { useState } from "react";
import { FiPlusCircle, FiBell } from "react-icons/fi";
import {GoHomeFill} from "react-icons/go"
import { LuCircleUserRound, LuHeart } from "react-icons/lu";
import { AuthPrompt } from "./AuthPrompt";

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
  
  // For now, assume user is not logged in
  const isLoggedIn = false;

  const handleUserIconClick = () => {
    if (!isLoggedIn) {
      setIsAuthPromptOpen(true);
    } else {
      // Handle logged in user action (profile page, etc.)
      console.log('User is logged in - navigate to profile');
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-around items-center h-14">
            <NavIcon icon={<GoHomeFill size={32} />} />
            <NavIcon icon={<LuHeart size={32} />} />
            <NavIcon icon={<FiPlusCircle size={32} />} />
            <NavIcon icon={<FiBell size={32} />} />
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
