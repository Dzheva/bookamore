import { logout } from '@/app/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

const LogOut = () => {
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
        Log Out
      </button>
    </>
  );
};

export default LogOut;
