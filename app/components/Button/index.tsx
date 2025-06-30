import { ReactNode } from "react";

type Props = {
  id?: string;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  label: ReactNode | string;
  onClick?: () => void;
  disabled?: boolean;
};
const Button = ({ id, className, type, label, onClick, disabled }: Props) => {
  return (
    <button
      id={id}
      className={`${className} cursor-pointer flex items-center justify-center font-semibold w-full h-11 px-5 py-2.5 gap-2 rounded-lg mb-6 text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-800 mt-6`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
