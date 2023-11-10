import React, { TextareaHTMLAttributes } from "react";

type TextAreaInputProps = {
  label?: string;
  data?: any;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaInput = ({ label, data, ...rest }: TextAreaInputProps) => {
  return (
    <div>
      {label && (
        <label className="mb-3 block text-black dark:text-white">
          {label}
          {rest.required && <span className="text-meta-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          defaultValue={
            data
              ? data instanceof Object
                ? data[rest.name ?? ""]
                : data
              : undefined
          }
          {...rest}
          className="bg-white custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
      </div>
    </div>
  );
};

export default TextAreaInput;
