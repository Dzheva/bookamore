import { useNavigate } from 'react-router-dom';
import { BackButtonSvg } from './BackButtonSvg/BackButtonSvg';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <button type="button" onClick={handleBack}>
        <BackButtonSvg />
      </button>
    </>
  );
};

export default BackButton;
