import { ReactNode } from "react";
import Sidebar from "../Sidebar";

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

export default HomeLayout;
