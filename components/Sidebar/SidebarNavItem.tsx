import Link from "next/link";

const SidebarNavItem = ({
  to,
  icon,
  name,
  pathname,
  isChildren,
}: {
  to: any;
  icon?: any;
  name: string;
  pathname: string;
  isChildren?: boolean;
}) => {
  const className = isChildren
    ? `group relative flex justify-center items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
        pathname === to && "text-white"
      } ${to === "/" && "py-2"}`
    : `group relative flex justify-center items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-[#4F829FCC] dark:hover:bg-meta-4 ${
        pathname.includes(to) && to !== "/"
          ? "bg-[#4F829FCC] dark:bg-meta-4"
          : pathname === to && to === "/" && "bg-[#4F829FCC] dark:bg-meta-4"
      }`;
  return (
    <li>
      <Link href={to} className={className}>
        <div className="flex flex-col items-center text-center">
          {icon}
          {name}
        </div>
      </Link>
    </li>
  );
};

export default SidebarNavItem;
