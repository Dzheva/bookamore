import React from "react";
import { FiPlusCircle, FiBell } from "react-icons/fi";
import {GoHomeFill} from "react-icons/go"
import { LuCircleUserRound, LuHeart } from "react-icons/lu";

interface NavIconProps {
  icon: React.ReactNode;
}

function NavIcon({ icon }: NavIconProps) {
  return (
    <li className="text-gray-700 hover:text-black cursor-pointer transition-colors duration-200"  >
      {icon}
    </li>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-around items-center h-14">
          <NavIcon icon={<GoHomeFill size={32} />} />
          <NavIcon icon={<LuHeart size={32} />} />
          <NavIcon icon={<FiPlusCircle size={32} />} />
          <NavIcon icon={<FiBell size={32} />} />
          <NavIcon icon={<LuCircleUserRound size={32} />} />
        </ul>
      </div>
    </nav>
  );
}
