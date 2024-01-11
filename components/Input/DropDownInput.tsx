"use client";
import { ArrowDownIcon } from "@/public/images/icon/icon";
import { SelectHTMLAttributes, useEffect, useState } from "react";

type DropDownInputProps = {
  label?: string;
  icon?: React.ReactNode;
  data?: any;
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
  data,
  options,
  onChange,
  ...rest
}: DropDownInputProps) => {
  const [optionFinal, setOptionFinal] = useState<any>([]);
  const [value, setValue] = useState<any>("");

  useEffect(() => {
    setOptionFinal([...options]);
  }, [options, label]);
  useEffect(() => {
    if (data) {
      if (data instanceof Object) setValue(data[rest.name ?? ""] ?? "");
      else setValue(data);
    }
  }, [data, rest.name, rest.value]);
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
          value={
            Object.keys(data ?? {}).length !== 0
              ? value
              : rest.value
              ? rest.value
              : undefined
          }
          onChange={
            onChange
              ? onChange
              : (e) => {
                  setValue(e.target.value);
                }
          }
          className={`relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 ${
            icon ? "px-12" : "pl-3 pr-12"
          } font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input`}
        >
          {optionFinal.map((option: any, optionIndex: number) => (
            <option
              key={`${rest.name ?? ""}${option.value}${optionIndex}`}
              value={option.value}
            >
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
