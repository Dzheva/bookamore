import BackButton from "@/shared/ui/BackButton";
import { BottomNav } from "@/shared/ui/BottomNav";

const ProfilePage = () => {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center border-b border-gray-100">
        <BackButton />

        <h1 className="text-base sm:text-lg lg:text-xl font-semibold flex-1 text-center">
          Book Details
        </h1>
        <div className="w-6 sm:w-8"></div>
      </div>
      {/* <NavBackBtn />
      <div>
        <h1 className=" text-lg sm:text-xl lg:text-2xl flex justify-center p-[10px]  font-medium text-[20px] leading-[1.25] font-sans  ">
          Profile
        </h1>
      </div>*/}

      <h1 className="text-2xl text-center text-slate-600 mt-10 animate-pulse">
        This page is under development.
      </h1>

      <BottomNav isProfilePage={true} />
    </>
  );
};

export default ProfilePage;
