import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoChevronBack } from 'react-icons/io5';

const RestorePasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        console.log(email);
        navigate('/verification-code');
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
                        <h2 className='mb-2 text-3xl font-bold text-gray-800'>Forgot Password</h2>
                        <p className='mb-10 text-center text-sm text-gray-500'>
                            {/* eget Morbi lacus vel placerat fringilla varius quis risus enim */}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>Email</label>
                            <input
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 focus:border-blue-500 focus:outline-none'
                                required
                            />
                        </div>

                        {/* {error && (
                            <div className='mb-4 text-red-500 text-sm'>
                                Email failed. Please check your credentials.
                            </div>
                        )} */}

                        <button
                            type='submit'
                            // disabled={isLoading}
                            className='w-full rounded-lg bg-gray-800 p-3 font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50 cursor-pointer'
                        >
                            {/* {isLoading ? 'Loading...' : 'Send code'} */}
                            Send code
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { RestorePasswordPage };
