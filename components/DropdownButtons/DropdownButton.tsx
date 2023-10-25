// components/DropdownButton.js
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";

type DropdownButtonProps = {
  label?: string;
  icon?: any;
  options?: Array<any>;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const DropdownButton = ({
  icon,
  label,
  options,
  ...rest
}: DropdownButtonProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          {...rest}
          onClick={() => setOpen(!open)}
          type="button"
          className="inline-flex items-center justify-between gap-1 text-sm p-2 rounded-md bg-primary text-center font-medium text-white hover:bg-opacity-90"
        >
          {icon ? (
            <Fragment>{icon}</Fragment>
          ) : (
            <Fragment>
              {label}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Fragment>
          )}
        </button>
      </div>
      {open && (
        <div className="z-99 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg text-black bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options?.map((option: any, index: any) => (
              <div
                key={`optionDropDownButton${index}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                role="menuitem"
                onClick={option.action}
              >
                {option.icon ? option.icon : undefined}
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
