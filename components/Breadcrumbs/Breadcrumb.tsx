import {
  IconArrowBack,
  IconArrowBackUp,
  IconArrowLeft,
} from "@tabler/icons-react";
import { ReactNode } from "react";

// import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  children?: ReactNode;
  onBack?: () => void;
}
const Breadcrumb = ({ pageName, children, onBack }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-20 md:mt-0">
      <div className="flex items-center cursor-pointer">
        {onBack && (
          <div
            className="text-title-md2 font-semibold text-white dark:text-white mr-3"
            onClick={() => {
              onBack();
            }}
          >
            <IconArrowLeft />
          </div>
        )}
        <h2 className="text-title-md2 font-semibold text-white dark:text-white">
          {pageName}
        </h2>
      </div>
      {children}
      {/* <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav> */}
    </div>
  );
};

export default Breadcrumb;
