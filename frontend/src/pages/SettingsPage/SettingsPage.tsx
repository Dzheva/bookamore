import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { BottomNav } from '@/shared/ui/BottomNav';
import HeaderTitle from '@/shared/ui/HeaderTitle';
import LogOut from '@/shared/components/LogOut/LogOut';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [currentLng, setCurrentLng] = useState(i18n.language);
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentLng(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    setCurrentLng(lng);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <HeaderTitle title={t('settings.title')} />

      <div className="px-6 py-8 space-y-6">
        {/* Секція Language */}
        <div className="border-2 border-[#A1D9D6] rounded-3xl p-5">
          <h3 className="text-lg font-medium text-slate-700 mb-4">
            {t('settings.lng')}
          </h3>
          <div className="space-y-4">
            {/* English */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="language"
                  checked={currentLng === 'en'}
                  onChange={() => changeLanguage('en')}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    currentLng === 'en' ? 'border-[#004261]' : 'border-gray-300'
                  }`}
                />
                {currentLng === 'en' && (
                  <div className="absolute w-2.5 h-2.5 bg-[#004261] rounded-full" />
                )}
              </div>
              <span className="text-slate-600 font-medium">
                {t('settings.en')}
              </span>
            </label>

            {/* Ukrainian */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="language"
                  checked={currentLng === 'ua'}
                  onChange={() => changeLanguage('ua')}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    currentLng === 'ua' ? 'border-[#004261]' : 'border-gray-300'
                  }`}
                />
                {currentLng === 'ua' && (
                  <div className="absolute w-2.5 h-2.5 bg-[#004261] rounded-full" />
                )}
              </div>
              <span className="text-slate-600 font-medium">
                {t('settings.ua')}
              </span>
            </label>
          </div>
        </div>

        {/* Секція Notifications */}
        <div className="border-2 border-[#A1D9D6] rounded-3xl p-5 flex items-center justify-between">
          <span className="text-lg font-medium text-slate-700">
            {t('settings.notifications')}
          </span>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              notifications ? 'bg-[#004261]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                notifications ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Кнопка My Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="w-full border-2 border-[#A1D9D6] rounded-3xl p-5 flex items-center justify-between hover:bg-teal-50 transition-colors"
        >
          <span className="text-lg font-medium text-slate-700">
            {t('settings.myProfile')}
          </span>
          <FaChevronRight className="text-[#004261] opacity-50" />
        </button>

        {/* Кнопка Privacy & Policy */}
        <button className="w-full border-2 border-[#A1D9D6] rounded-3xl p-5 flex items-center justify-between hover:bg-teal-50 transition-colors">
          <span className="text-lg font-medium text-slate-700">
            {t('settings.privacyPolicy')}
          </span>
          <FaChevronRight className="text-[#004261] opacity-50" />
        </button>

        <div>
          <LogOut />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
