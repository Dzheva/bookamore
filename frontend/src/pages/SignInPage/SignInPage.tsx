import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router";
import { useLoginMutation } from "@app/store/api/AuthApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  setLoading,
  selectIsLoading,
} from "@app/store/slices/authSlice";
import BackButton from "@/shared/ui/BackButton";

const SignInPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Використовуємо RTK Query для API викликів
  const [login, { isLoading: isApiLoading, error }] = useLoginMutation();

  // Отримуємо стан завантаження з Redux
  const isGlobalLoading = useSelector(selectIsLoading);
  const isLoading = isApiLoading || isGlobalLoading;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      // Встановлюємо стан завантаження
      dispatch(setLoading(true));

      const result = await login({ email, password }).unwrap();

      if (result.status && result.token) {
        // Зберігаємо креденшели в Redux (і автоматично в localStorage)
        dispatch(
          setCredentials({
            user: { email },
            token: result.token,
          })
        );

        // Перенаправляємо на сторінку, з якої прийшов користувач, або на головну
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <div className="w-full max-w-sm">
        {/* <div className="w-full pt-4 pb-2 px-4">
                    <button onClick={handleBackClick} className="p-1">
                        <IoChevronBack className="text-2xl" />
                    </button>
                </div> */}
        <BackButton />

        <div className="px-6">
          <div className="flex flex-col items-center">
            <div className="mb-6 h-40 w-40 rounded-full bg-gray-200"></div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">Login</h2>
            <p className="mb-10 text-center text-sm text-gray-500">
              {/* eget Morbi lacus vel placerat fringilla varius quis risus enim */}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 pr-10 focus:border-blue-500 focus:outline-none"
                  required
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

            {error && (
              <div className="mb-4 text-red-500 text-sm">
                Login failed. Please check your credentials.
              </div>
            )}

            <div className="mb-6 text-right">
              <a href="/forgot-password" className="text-sm text-blue-500">
                Forgot Password?
              </a>
            </div>

            <div className="relative mb-6 text-center text-gray-400">
              <hr className="absolute top-1/2 w-full -translate-y-1/2 border-gray-200" />
              <span className="relative z-10 bg-white px-2 text-sm">or</span>
            </div>

            <button
              type="button"
              className="mb-4 flex w-full items-center justify-center rounded-lg border border-gray-300 p-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Continue with Google
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-800 p-3 font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="font-semibold text-gray-800 underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-gray-800 underline">
              Privacy Policy
            </a>
          </p>

          <div className="mt-6 mb-10 text-center text-sm">
            <span className="text-gray-500">Do not have an account?</span>{" "}
            <a href="/sign-up" className="font-bold text-blue-500">
              Sign Up now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignInPage };
