import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex justify-center min-w-full h-full bg-white">
      <div className="max-sm:pt-7 max-sm:px-4 max-sm:pb-32 px-10 py-8 max-w-[440px] rounded-xl flex-1 min-md:bg-white min-md:my-16 border-solid min-md:border border-gray-200">
        {children}
      </div>
    </div>
  );
};
export default AuthLayout;
