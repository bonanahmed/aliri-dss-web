import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type ButtonProps = {
  label?: ReactNode;
  icon?: any;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
const Button = ({ icon, label, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={clsx(
        `inline-flex items-center justify-between gap-1 p-2 rounded-md ${
          rest.color ? rest.color : "bg-primary text-white"
        } text-center font-medium  hover:bg-opacity-90`,
        rest.className
      )}
    >
      {icon}
      {label}
    </button>
  );
};

export default Button;
