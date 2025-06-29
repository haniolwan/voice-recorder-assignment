"use client";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

const Sidebar = () => {
  const router = useRouter();

  const handleLogoutUser = (e: MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const { userData } = useUser();

  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
        <h1 className="p-2">Hello {userData?.user?.name}</h1>

        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="/"
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group"
            >
              <span className="ms-3">Home</span>
            </a>
          </li>
          <li>
            <a
              href="/recordings"
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group"
            >
              <span className="ms-3">Recordings</span>
            </a>
          </li>
          <li>
            <a
              href="/"
              onClick={handleLogoutUser}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <span className="ms-3">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
