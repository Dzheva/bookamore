import { Link } from 'react-router-dom';
import { LogoSvg } from '../LogoSvg/LogoSvg';

export const AuthHeader = () => {
  return (
    <header className="flex justify-center w-full max-w-md mx-auto py-5 px-4">
      <Link to="/">
        <LogoSvg className="text-deep-blue" />
      </Link>
    </header>
  );
};
