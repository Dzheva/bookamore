import { logout } from '@/app/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const LogOut = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <>
      <button
        onClick={handleLogOut}
        className="cursor-pointer
underline underline-offset-[5px] decoration-[2px]
text-[#153037] text-h4m

     "
        type="button"
      >
        {t('auth.logOut')}
      </button>
    </>
  );
};

export default LogOut;
