import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  label?: string;
  icon?: any;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
const Button = ({ icon, label, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-between gap-1 text-sm p-2 rounded-md ${
        rest.color ? rest.color : "bg-primary text-white"
      } text-center font-medium  hover:bg-opacity-90`}
    >
      {icon}
      {label}
    </button>
  );
};

export default Button;
