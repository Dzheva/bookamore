import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import BackButton from "@/shared/ui/BackButton";
import { BottomNav } from "@/shared/ui/BottomNav";

const SettingsPage = () => {
  const navigate = useNavigate();
  
  // Стани для налаштувань
  const [language, setLanguage] = useState<"English" | "Ukrainian">("English");
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    // Тут буде логіка виходу (очищення токенів тощо)
    console.log("Logout clicked");
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10">
        <BackButton />
        <h1 className="text-xl font-semibold flex-1 text-center text-[#004261]">
          Settings
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="px-6 py-8 space-y-6">
        
        {/* Секція Language */}
        <div className="border-2 border-[#A1D9D6] rounded-3xl p-5">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Language</h3>
          <div className="space-y-4">
            {/* English */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="language"
                  checked={language === "English"}
                  onChange={() => setLanguage("English")}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                  language === "English" ? "border-[#004261]" : "border-gray-300"
                }`} />
                {language === "English" && (
                  <div className="absolute w-2.5 h-2.5 bg-[#004261] rounded-full" />
                )}
              </div>
              <span className="text-slate-600 font-medium">English</span>
            </label>

            {/* Ukrainian */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="language"
                  checked={language === "Ukrainian"}
                  onChange={() => setLanguage("Ukrainian")}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                  language === "Ukrainian" ? "border-[#004261]" : "border-gray-300"
                }`} />
                {language === "Ukrainian" && (
                  <div className="absolute w-2.5 h-2.5 bg-[#004261] rounded-full" />
                )}
              </div>
              <span className="text-slate-600 font-medium">Ukrainian</span>
            </label>
          </div>
        </div>

        {/* Секція Notifications */}
        <div className="border-2 border-[#A1D9D6] rounded-3xl p-5 flex items-center justify-between">
          <span className="text-lg font-medium text-slate-700">Notifications</span>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              notifications ? "bg-[#004261]" : "bg-slate-200"
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
              notifications ? "left-7" : "left-1"
            }`} />
          </button>
        </div>

        {/* Кнопка My Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="w-full border-2 border-[#A1D9D6] rounded-3xl p-5 flex items-center justify-between hover:bg-teal-50 transition-colors"
        >
          <span className="text-lg font-medium text-slate-700">My Profile</span>
          <FaChevronRight className="text-[#004261] opacity-50" />
        </button>

        {/* Кнопка Privacy & Policy */}
        <button
          className="w-full border-2 border-[#A1D9D6] rounded-3xl p-5 flex items-center justify-between hover:bg-teal-50 transition-colors"
        >
          <span className="text-lg font-medium text-slate-700">Privacy & Policy</span>
          <FaChevronRight className="text-[#004261] opacity-50" />
        </button>

        {/* Посилання Log out */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="text-[#004261] font-bold text-lg underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Log out
          </button>
        </div>

      </div>

      <BottomNav isProfilePage={false} />
    </div>
  );
};

export default SettingsPage;
