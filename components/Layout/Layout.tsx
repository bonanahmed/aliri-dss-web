"use client";

import { useState, useEffect, Fragment, useCallback } from "react";
import Loader from "@/components/common/Loader";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { setAuthenticated, setSideBarIsOpen } from "@/store/globalSlice";
import { getUserAuth } from "@/services/auth/checkAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { authenticated } = useSelector((state: any) => state.global);

  const dispatch = useDispatch();

  // const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loading, setLoading] = useState<boolean>(true);

  const getUser = useCallback(async () => {
    const userData = await getUserAuth();
    setLoading(false);
    dispatch(setAuthenticated(userData));
    // if (!userData) navigation.replace("/auth/signin");
  }, [dispatch]);
  useEffect(() => {
    getUser();
  }, [getUser]);

  const { errorPage, sideBarIsOpen } = useSelector(
    (state: RootState) => state.global
  );

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const [withLayout, setWithLayout] = useState(true);

  useEffect(() => {
    const whitelistPath = ["/auth", "/papan-eksploitasi", "/map"];
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    // Add event listener to update width on resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (windowWidth > 1024) {
      dispatch(setSideBarIsOpen(true));
    } else {
      dispatch(setSideBarIsOpen(false));
    }
  }, [windowWidth, dispatch]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark ">
          {withLayout && (
            <div
              className="absolute bg-primary h-[35vh] w-full"
              style={{
                borderEndEndRadius: "70%",
                borderEndStartRadius: "70%",
              }}
            >
              <div
                className="overflow-hidden h-[35vh] w-full opacity-10"
                style={{
                  borderEndEndRadius: "70%",
                  borderEndStartRadius: "70%",
                }}
              >
                <Image
                  className="object-cover"
                  width={100000}
                  height={100000}
                  quality={100}
                  src={"/images/background/bg-batik-pu.png"}
                  alt="Logo"
                />
              </div>
            </div>
          )}
          {loading ? (
            <div className="w-screen h-screen">
              <Loader />
            </div>
          ) : withLayout ? (
            <div className="relative">
              {/* <!-- ===== Sidebar Start ===== --> */}
              {authenticated && (
                <div className="fixed z-999">
                  <Sidebar
                    sidebarOpen={sideBarIsOpen}
                    // setSidebarOpen={setSidebarOpen}
                    setSidebarOpen={(args) => {
                      dispatch(setSideBarIsOpen(args));
                    }}
                  />
                </div>
              )}
              <div className="flex h-screen overflow-hidden">
                <div className="relative w-full flex flex-col overflow-y-auto overflow-x-hidden">
                  <Header
                    sidebarOpen={sideBarIsOpen}
                    // setSidebarOpen={setSidebarOpen}
                    setSidebarOpen={(args) => {
                      dispatch(setSideBarIsOpen(args));
                    }}
                  />
                </div>
              </div>
              <div>
                {pathname === "/" ? (
                  <main>
                    <div className="absolute top-0 w-full mx-auto">
                      <div className="flex w-full">
                        <div className="w-52.5 h-screen" />
                        <div className="w-full pr-10 max-h-full">
                          {children}
                        </div>
                      </div>
                    </div>
                  </main>
                ) : (
                  <main>
                    <div className="absolute top-0 w-full mx-auto py-4 md:py-8 2xl:pt-28 2xl:pb-20">
                      <div className="flex w-full">
                        <div className="w-72.5 h-screen hidden md:block" />
                        <div className="w-full max-w-full pr-10 max-h-full pl-10 md:pl-0">
                          {children}
                        </div>
                      </div>
                    </div>
                  </main>
                )}
              </div>
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
