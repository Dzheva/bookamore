import { BottomNav } from "@/shared/ui/BottomNav";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router";

const ProfilePage = () => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }
    return (
        <>



            <div className="bg-white px-4 sm:px-6 lg:px-8 py-3 flex items-center border-b border-gray-200">
                <button onClick={handleBack} className="p-1 sm:p-1.5">
                    <IoChevronBack className="w-6 h-6 text-black" />
                </button>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold flex-1 text-center">Edit Profile</h1>
                <div className="w-8"></div>
            </div>



            <h1 className="text-2xl text-center text-slate-600 mt-10 animate-pulse">This page is under development.</h1>

            <BottomNav />
        </>
    );
};

export default ProfilePage;