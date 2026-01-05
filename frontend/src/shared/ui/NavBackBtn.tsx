import { useNavigate } from "react-router-dom";
import { NavBackSvg } from "../ui/NavBackImg/NavBackSvg";

const NavBackBtn = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleBack}
        className="absolute flex top-[10px] left-[14px]   "
      >
        <NavBackSvg />
      </button>
    </>
  );
};

export default NavBackBtn;
