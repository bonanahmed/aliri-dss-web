"use client";

import { useState, useEffect, Fragment } from "react";
import Loader from "@/components/common/Loader";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  const { errorPage } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const [withLayout, setWithLayout] = useState(true);

  useEffect(() => {
    const whitelistPath = ["/auth", "/cetak-papan-eksploitasi"];
    for (let i = 0; i < whitelistPath.length; i++) {
      const path = whitelistPath[i];
      if (pathname.indexOf(path) === 0) {
        setWithLayout(false);
        break;
      } else {
        setWithLayout(true);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (withLayout && errorPage !== null) {
      setWithLayout(false);
    }
  }, [errorPage, withLayout]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? (
            <Loader />
          ) : withLayout ? (
            <div className="flex h-screen overflow-hidden">
              {/* <!-- ===== Sidebar Start ===== --> */}
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              {/* <!-- ===== Sidebar End ===== --> */}

              {/* <!-- ===== Content Area Start ===== --> */}
              <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* <!-- ===== Header Start ===== --> */}
                <Header
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                {/* <!-- ===== Header End ===== --> */}

                {/* <!-- ===== Main Content Start ===== --> */}
                <main>
                  <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    {children}
                  </div>
                </main>
                {/* <!-- ===== Main Content End ===== --> */}
              </div>
              {/* <!-- ===== Content Area End ===== --> */}
            </div>
          ) : (
            <Fragment>
              <main>
                <div className="min-w-screen min-h-screen">{children}</div>
              </main>
            </Fragment>
          )}
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
