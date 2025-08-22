import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoChevronBack } from "react-icons/io5";

const SignUpPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-white">
            <div className="w-full max-w-sm px-6">
                <div className="w-full pt-4 pb-2">
                    <IoChevronBack className="text-2xl" />
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">Create account</h2>
                    <p className="mb-10 text-center text-sm text-gray-500">
                        eget Morbi lacus vel placerat fringilla varius quis risus enim
                    </p>
                </div>

                <form>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Password, 6 characters</label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 pr-10 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Confirm password</label>
                        <div className="relative">
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                placeholder="Confirm password"
                                className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 pr-10 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                            >
                                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-6 text-center text-gray-400">
                        <hr className="absolute top-1/2 w-full -translate-y-1/2 border-gray-200" />
                        <span className="relative z-10 bg-white px-2 text-sm">or</span>
                    </div>

                    <button
                        type="button"
                        className="mb-6 flex w-full items-center justify-center rounded-lg border border-gray-300 p-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <FcGoogle className="mr-2 h-5 w-5" /> Continue with Google
                    </button>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-800 p-3 font-medium text-white transition-colors hover:bg-gray-900"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="#" className="font-semibold text-gray-800 underline">
                        Terms
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-semibold text-gray-800 underline">
                        Privacy Policy
                    </a>
                </p>

                <div className="mt-6 mb-10 text-center text-sm">
                    <span className="text-gray-500">Already have an account?</span>{' '}
                    <a href="/sign-in" className="font-bold text-gray-800">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    );
};

export { SignUpPage };
