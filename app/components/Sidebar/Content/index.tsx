"use client";
import { useUser } from "@/app/context/UserContext";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { getSidebarItems } from "../getSidebarItems";
const Content = () => {
  const router = useRouter();

  const handleLogoutUser = (e: MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const pathname = usePathname();

  const { userData } = useUser();

  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
      <h1 className="text-lg p-2 font-bold text-gray-900 capitalize">
        Hello {userData?.name}
      </h1>
      <ul className="space-y-2 font-medium">
        {getSidebarItems &&
          getSidebarItems?.map(({ id, label, path }) => (
            <li key={id}>
              <a
                href={path}
                className={classNames(
                  "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group",
                  {
                    "bg-gray-100": pathname === path,
                  }
                )}
              >
                <span className="ms-3">{label}</span>
              </a>
            </li>
          ))}
        <li>
          <Link
            href="/"
            onClick={handleLogoutUser}
            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
          >
            <span className="ms-3">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Content;
