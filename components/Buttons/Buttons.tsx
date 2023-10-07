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
      className="inline-flex items-center justify-between gap-1 text-sm p-2 rounded-md bg-primary text-center font-medium text-white hover:bg-opacity-90"
    >
      {icon}
      {label}
    </button>
  );
};

export default Button;
