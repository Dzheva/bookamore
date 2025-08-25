import { useNavigate } from 'react-router';
import { useEffect } from 'react';

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthPrompt({ isOpen, onClose }: AuthPromptProps) {
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLoginClick = () => {
    navigate('/sign-in');
    onClose();
  };

  const handleSignUpClick = () => {
    navigate('/sign-up');
    onClose();
  };

  const handleCreateAccountLater = () => {
    // Just close the prompt for now
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full screen modal */}
      <div 
        className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 min-h-screen">
          <div className="flex flex-col items-center w-full max-w-xs mx-auto space-y-24 sm:space-y-28">
            {/* Avatar placeholder */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gray-300 rounded-full flex-shrink-0 mt-16 sm:mt-20"></div>
            
            {/* Buttons */}
            <div className="w-full space-y-4 px-2 sm:px-4">
              <button
                onClick={handleLoginClick}
                className="w-full bg-gray-200 text-black py-3 sm:py-4 rounded-2xl font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Log In
              </button>
              
              <button
                onClick={handleSignUpClick}
                className="w-full bg-gray-200 text-black py-3 sm:py-4 rounded-2xl font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Sign Up
              </button>
            </div>
            
            {/* Create account later link */}
            <button
              onClick={handleCreateAccountLater}
              className="text-base sm:text-lg text-gray-800 underline hover:text-gray-600 transition-colors mt-36 sm:mt-12"
              style={{ textUnderlineOffset: '6px' }}
            >
              Create an account later
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
