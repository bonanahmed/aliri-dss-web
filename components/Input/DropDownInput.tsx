import { ArrowDownIcon } from "@/public/images/icon/icon";
import { SelectHTMLAttributes } from "react";

type DropDownInputProps = {
  label?: string;
  icon?: React.ReactNode;
  options: Array<OptionsProps>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined;
} & SelectHTMLAttributes<HTMLSelectElement>;
type OptionsProps = {
  value?: any;
  label: string;
};
const DropDownInput = ({
  icon,
  label,
  options,
  onChange,
  ...rest
}: DropDownInputProps) => {
  return (
    <div>
      {label && (
        <label className="mb-3 block text-black dark:text-white">
          {label}
          {rest.required && <span className="text-meta-1">*</span>}
        </label>
      )}

      <div className="relative z-20 bg-white dark:bg-form-input">
        {icon && (
          <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
            {icon}
          </span>
        )}
        <select
          {...rest}
          onChange={onChange}
          className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 ${
            icon ? "px-12" : "pl-3 pr-12"
          } font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <ArrowDownIcon />
        </span>
      </div>
    </div>
  );
};

export default DropDownInput;
