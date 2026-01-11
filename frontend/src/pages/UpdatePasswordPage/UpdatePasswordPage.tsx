import { useState } from "react";
import { useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BackButton from "@/shared/ui/BackButton";

const UpdatePasswordPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <div className="w-full max-w-sm">
        {/* <div className='w-full pt-4 pb-2 px-4'>
                    <button onClick={handleBackClick} className='p-1 cursor-pointer'>
                        <IoChevronBack className='text-2xl' />
                    </button>
                </div> */}
        <BackButton />

        <div className="px-6">
          <div className="flex flex-col items-center">
            <div className="mb-6 h-40 w-40 rounded-full bg-gray-200"></div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">
              Update Password
            </h2>
            <p className="mb-10 text-center text-sm text-gray-500">
              {/* eget Morbi lacus vel placerat fringilla varius quis risus enim */}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 pr-10 focus:border-blue-500 focus:outline-none"
                  required
                  minLength={6}
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={({ target }) => setConfirmPassword(target.value)}
                  className="w-full rounded-lg border-2 border-transparent bg-gray-100 p-3 pr-10 focus:border-blue-500 focus:outline-none"
                  required
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

            {/* {error && (
							<div className='mb-4 text-red-500 text-sm'>
								Passwords do not match.
							</div>
						)} */}

            <button
              type="submit"
              // disabled={isLoading}
              className="w-full rounded-lg bg-gray-800 p-3 font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50 cursor-pointer"
            >
              {/* {isLoading ? 'Loading...' : 'Update'} */}
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { UpdatePasswordPage };
