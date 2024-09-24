/* eslint-disable @next/next/no-img-element */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import DropDownInput from "@/components/Input/DropDownInput";
import Pagination from "@/components/Pagination/Pagination";
import { FilterIcon, SearchIcon } from "@/public/images/icon/icon";
import { deleteData, getDatas } from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Modal from "@/components/Modals/Modals";
import ReactPlayer from "react-player";
import axiosClient from "@/services";
import Loader from "@/components/common/Loader";
import useLocalStorage from "@/hooks/useLocalStorage";

const CCTVPage = () => {
  const url = "/cctv";
  const navigation = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState<boolean>(false);

  const [datas, setDatas] = useState<any>();
  const [detail, setDetail] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 12),
    limit: 12,
  });
  const [areaId, setAreaId] = useLocalStorage("area_id", "");

  const handlesGetDatas = useCallback(async () => {
    getDatas(
      url,
      // { limit: paginationData.limit, page: paginationData.page },
      {},
      { search: delayedSearch, area_id: areaId },
      setDatas,
      setPaginationData
    );
  }, [delayedSearch, areaId]);
  useEffect(() => {
    handlesGetDatas();
  }, [handlesGetDatas]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const [isModalCCTVOpen, setIsModalCCTVOpen] = useState(false);
  const openModalCCTV = useCallback(() => {
    playVideo();
    setIsModalCCTVOpen(true);
  }, []);

  const closeModalCCTV = useCallback(() => {
    pauseVideo();
    setIsModalCCTVOpen(false);
  }, []);

  const [whichLoading, setWhichLoading] = useState<string[]>([]);
  const checkCCTVLink = async (cctv: any) => {
    try {
      setWhichLoading([...whichLoading, detail.link]);
      const response = await axiosClient.post(
        `/cctv/generate-link-hikvision`,
        cctv
      );
      setWhichLoading(whichLoading.filter((which) => which !== cctv.link));
      if (response) return response;
      return cctv.link;
    } catch (error) {
      console.log(error);
      setWhichLoading(whichLoading.filter((which) => which !== cctv.link));
      return "";
    }
  };
  const [cctvLink, setCCTVLink] = useState<string>("");
  useEffect(() => {
    if (cctvLink) {
      openModalCCTV();
    } else {
      closeModalCCTV();
    }
  }, [cctvLink, closeModalCCTV, openModalCCTV]);
  // useEffect(() => {
  //   if (cctvLink) {
  //     window.open("http://202.169.239.21/cctv/?s=" + cctvLink, "_blank");
  //   }
  // }, [cctvLink]);
  useEffect(() => {
    async function getCCTVLink() {
      const linkData = (await checkCCTVLink(detail)).replace(
        "http://202.169.239.21:83",
        "https://cctv.airso.digibay.id"
      );
      setCCTVLink(linkData);
    }
    if (detail) {
      getCCTVLink();
    } else {
      setCCTVLink("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  return (
    <>
      <Breadcrumb pageName="Daftar Lokasi Terpantau CCTV" />
      <div className="bg-white rounded-2xl w-full p-5">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-row items-center">
            {show && (
              <Fragment>
                <span className="mr-3">Tampilkan</span>
                <div>
                  <DropDownInput
                    options={[
                      {
                        label: "12",
                        value: 12,
                      },
                      {
                        label: "24",
                        value: 24,
                      },
                      {
                        label: "56",
                        value: 56,
                      },
                      {
                        label: "120",
                        value: 120,
                      },
                    ]}
                    onChange={(e) => {
                      setPaginationData({
                        ...paginationData,
                        page: 1,
                        totalPages: Math.ceil(
                          paginationData.totalDocs / parseInt(e.target.value)
                        ),
                        limit: parseInt(e.target.value),
                      });
                    }}
                  />
                </div>
                <span className="ml-3">Data</span>
              </Fragment>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-5 ">
            <div className="flex gap-3 bg-[#F9F9F9] rounded-xl p-3">
              <SearchIcon />
              <input
                className="bg-[#F9F9F9] focus:outline-none"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Pencarian"
              />
            </div>
            {show && (
              <Fragment>
                {" "}
                <button className="bg-transparent flex gap-3">
                  <FilterIcon />
                  <span className="font-semibold">Filter</span>
                </button>
                <DropdownButton
                  className="p-3"
                  style={{
                    backgroundColor: "#EEF6FF",
                    color: "#1F3368",
                  }}
                  label="Aksi"
                  options={[
                    {
                      label: "Tambah Data",
                      action: (e: any) => {
                        navigation.push(pathname + "/form");
                      },
                    },
                  ]}
                />
              </Fragment>
            )}
          </div>
        </div>
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 mt-10">
          {datas?.map((item: any, index: number) => (
            <div
              key={index}
              className="shadow-3 rounded-xl w-full p-5"
              // onClick={() => {
              //   setDetail(item);
              // }}
            >
              <div className="flex flex-col">
                <div className="bg-white w-full h-[29.5vh] rounded-xl mb-5">
                  {item.detail?.cctv_list.length !== 0 && (
                    <Carousel
                      showThumbs={false}
                      showIndicators={false}
                      showStatus={false}
                    >
                      {item?.cctv_list.map((cctv: any) => (
                        <div
                          key={cctv.link}
                          className="justify-center flex items-center"
                          onClick={() => {
                            setDetail(cctv);
                          }}
                        >
                          <div className="w-full flex-col">
                            {whichLoading.includes(cctv.link) ? (
                              <div className="object-contain rounded-xl h-[23vh]">
                                <Loader />
                              </div>
                            ) : (
                              <Fragment>
                                {!cctv?.image ? (
                                  <img
                                    className="object-contain rounded-xl h-[23vh]"
                                    src={"/images/icon/play.png"}
                                    alt={cctv.name}
                                  />
                                ) : (
                                  <img
                                    className="object-cover w-full rounded-xl h-[23vh]"
                                    src={cctv.image}
                                    alt={cctv.name}
                                  />
                                )}
                                <div className="mt-3 mb-10">{cctv.name}</div>
                              </Fragment>
                            )}
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  )}
                </div>
                <div className="text-center text-title-md font-bold text-black mb-5">
                  {item.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        {paginationData && show && (
          <div className="mt-3">
            <Pagination
              {...paginationData}
              onNumberClick={(currentNumber) => {
                setPaginationData({
                  ...paginationData,
                  page: currentNumber,
                });
              }}
            />
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalCCTVOpen}
        onClose={() => {
          setDetail(null);
        }}
        title="CCTV"
      >
        <div className="md:w-[50vw] h-[100%]">
          {cctvLink && (
            <div className="flex justify-center">
              <ReactPlayer
                url={cctvLink}
                controls
                width="100%"
                height="auto"
                playing
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CCTVPage;
