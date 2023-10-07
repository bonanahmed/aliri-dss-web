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
          <Fragment>
            <Link
              href="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === route ||
                  pathname.includes(route === "/" ? "dashboard" : route)) &&
                "bg-graydark dark:bg-meta-4"
              }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
              }}
            >
              {icon}
              {name}
              <SidebarArrowIcon open={open} />
            </Link>
            {/* <!-- Dropdown Menu Start --> */}
            <div
              className={`translate transform overflow-hidden ${
                !open && "hidden"
              }`}
            >
              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
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
          </Fragment>
        );
      }}
    </SidebarLinkGroup>
  );
};

export default SidebarNavDropdown;
