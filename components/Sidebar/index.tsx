/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SidebarHeader from "./SidebarHeader";
import CreateElement from "./CreateElement";
import SidebarNavItem from "./SidebarNavItem";
import SidebarNavDropdown from "./SidebarNavDropdown";
import SidebarNavTitle from "./SidebarNavTitle";
import { getNav } from "./config";
import SidebarNavDivider from "./SidebarNavDivider";
import { useSelector } from "react-redux";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const { authenticated } = useSelector((state: any) => state.global);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute lg:left-0 left-0 top-0 z-9999 flex justify-center items-center h-screen lg:w-52.5 w-50 flex-col overflow-y-hidden bg-transparent duration-300 ease-linear dark:bg-boxdark lg:static ${
        sidebarOpen
          ? "lg:translate-x-0 translate-x-0"
          : "lg:-translate-x-full -translate-x-full"
      }`}
    >
      <div className="relative no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear bg-primary lg:w-[6.5vw] w-[60.5vw] mb-20 mt-28 rounded-xl text-xs">
        <div className="absolute h-full">
          <img
            className="h-full object-cover opacity-10"
            src={"/images/background/bg-batik-pu.png"}
            alt="Logo"
          />
        </div>
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-5 lg:px-6 overflow-y-auto no-scrollbar">
          <CreateElement
            items={getNav(authenticated?.user)}
            components={{
              SidebarNavItem,
              SidebarNavDropdown,
              SidebarNavTitle,
              SidebarNavDivider,
            }}
          />
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
