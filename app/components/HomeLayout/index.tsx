"use client";
import { ReactNode } from "react";
import Sidebar from "../Sidebar";
import withAuth from "../AuthorizeUser/withAuth";

type Props = {
  children: ReactNode;
};
const HomeLayout = ({ children }: Props) => {
  return (
    <div className="p-10">
      <div>
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default withAuth(HomeLayout);
