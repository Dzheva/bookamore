import { BottomNav } from "@/shared/ui/BottomNav";
import NavBackBtn from "@/shared/ui/NavBackBtn";

const ProfilePage = () => {
  return (
    <>
      <NavBackBtn />
      <div>
        <h1 className=" text-lg sm:text-xl lg:text-2xl flex justify-center p-[10px]  font-medium text-[20px] leading-[1.25] font-sans  ">
          Profile
        </h1>
      </div>

      <h1 className="text-2xl text-center text-slate-600 mt-10 animate-pulse">
        This page is under development.
      </h1>

      <BottomNav isProfilePage={true} />
    </>
  );
};

export default ProfilePage;
