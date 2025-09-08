import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoChevronBack } from 'react-icons/io5';
import { PinInput } from '@/shared/ui/PinInput';

const VerificationCodePage: React.FC = () => {
    const [currentPin, setCurrentPin] = useState('');
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const handlePinComplete = (pin: string) => setCurrentPin(pin);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPin) return;

        console.log(currentPin);
        navigate('/update-password');
    };

    return (
        <div className='flex min-h-screen flex-col items-center bg-white'>
            <div className='w-full max-w-sm'>
                <div className='w-full pt-4 pb-2 px-4'>
                    <button onClick={handleBackClick} className='p-1 cursor-pointer'>
                        <IoChevronBack className='text-2xl' />
                    </button>
                </div>

                <div className='px-6'>
                    <div className='flex flex-col items-center'>
                        <div className='mb-6 h-40 w-40 rounded-full bg-gray-200'></div>
                        <h2 className='mb-2 text-3xl font-bold text-gray-800'>Verification Code</h2>
                        <p className='mb-10 text-center text-sm text-gray-500'>
                            {/* eget Morbi lacus vel placerat fringilla varius quis risus enim */}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <PinInput onComplete={handlePinComplete} className='mb-4' />

                        {/* {error && (
							<div className='mb-4 text-red-500 text-sm'>
								Pin failed.
							</div>
						)} */}

                        <button
                            type='submit'
                            // disabled={isLoading}
                            className='w-full rounded-lg bg-gray-800 p-3 font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50 cursor-pointer'
                        >
                            {/* {isLoading ? 'Loading...' : 'Confirm'} */}
                            Confirm
                        </button>
                    </form>

                    <p className='mt-8 text-center text-xs text-gray-500'>
                        Did not receive the code?{' '}
                        <a href='#' className='font-semibold text-gray-800 underline'>
                            Send again
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export { VerificationCodePage };
