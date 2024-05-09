import { Fragment, createElement, useEffect, useState } from "react";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Link from "next/link";
import { SidebarArrowIcon } from "@/public/images/icon/icon";

const SidebarNavDropdown = ({
  pathname,
  icon,
  name,
  _children,
  components,
  route,
}: any) => {
  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );
  const chooseComponent = (item: any) => {
    const element = createElement(components[item._tag], {
      ...item,
      ...{ components },
      isChildren: true,
      pathname,
    });
    return element;
  };

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);
  return (
    <SidebarLinkGroup
      activeCondition={
        pathname === route ||
        pathname.includes(route === "/" ? "dashboard" : route)
      }
    >
      {(handleClick, open) => {
        return (
          <div
            onMouseEnter={(e) => {
              e.preventDefault();
              // console.log("INI LOH", open, route);
              if (!pathname.includes(route === "/" ? "dashboard" : route))
                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
            }}
            onMouseLeave={(e) => {
              e.preventDefault();
              if (!pathname.includes(route === "/" ? "dashboard" : route))
                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
            }}
          >
            <Link
              href="#"
              className={`group relative flex justify-center items-center gap-2.5 rounded-sm py-2 px-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-[#4F829FCC] dark:hover:bg-meta-4 ${
                (pathname === route ||
                  pathname.includes(route === "/" ? "dashboard" : route)) &&
                "bg-[#4F829FCC] dark:bg-meta-4"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {icon}
                {name}
              </div>
              {/* <SidebarArrowIcon open={open} /> */}
            </Link>
            {/* <!-- Dropdown Menu Start --> */}
            <div
              className={`translate transform overflow-hidden ${
                !open && "hidden"
              }`}
            >
              <ul className="mt-4 mb-5.5 text-xs flex flex-col gap-2.5">
                {_children.map((child: any, indexChild: number) => (
                  <Fragment
                    key={`child${child._tage}${child.name}${indexChild}`}
                  >
                    {chooseComponent(child)}
                  </Fragment>
                ))}
                {/* <li>
                  <Link
                    href="/"
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === "/" && "text-white"
                    } `}
                  >
                    eCommerce
                  </Link>
                </li> */}
              </ul>
            </div>
            {/* <!-- Dropdown Menu End --> */}
          </div>
        );
      }}
    </SidebarLinkGroup>
  );
};

export default SidebarNavDropdown;
