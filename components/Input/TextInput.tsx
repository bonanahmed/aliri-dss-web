import React, { InputHTMLAttributes } from "react";

type TextInputProps = {
  label?: string;
  prefixIcon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({ label, prefixIcon, ...rest }: TextInputProps) => {
  return (
    <div>
      {label && (
        <label className="mb-3 block text-black dark:text-white">
          {label}
          {rest.required && <span className="text-meta-1">*</span>}
        </label>
      )}
      <div className="relative">
        {prefixIcon && (
          <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2 ">
            {prefixIcon}
          </span>
        )}
        <input
          {...rest}
          className={`bg-white w-full rounded border-[1.5px] border-stroke bg-transparent py-3 ${
            prefixIcon ? "pl-12 pr-3" : "px-3"
          } font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
        />
      </div>
    </div>
  );
};

export default TextInput;
