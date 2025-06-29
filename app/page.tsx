"use client";

import { useRouter } from "next/navigation";
import withAuth from "./components/AuthorizeUser/withAuth";

const Home = () => {
  const router = useRouter();

  const handleLogoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div>
      <button
        onClick={handleLogoutUser}
        className="flex items-center justify-center font-semibold w-20 h-[44px] px-[18px] py-[10px] gap-2 rounded-lg mb-6 text-white bg-red-400 hover:bg-red-600 focus:bg-gray-800"
        type="submit"
      >
        Logout
      </button>
    </div>
  );
};
export default withAuth(Home);
