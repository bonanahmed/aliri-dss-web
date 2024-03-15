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
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Modal from "@/components/Modals/Modals";
import ReactPlayer from "react-player";
import axios from "axios";
import https from "https";
import axiosClient from "@/services";

const CCTVPage = () => {
  const url = "/cctv";
  const navigation = useRouter();
  const pathname = usePathname();

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

  const handlesGetDatas = useCallback(async () => {
    getDatas(
      url,
      { limit: paginationData.limit, page: paginationData.page },
      { search: delayedSearch },
      setDatas,
      setPaginationData
    );
  }, [delayedSearch, paginationData.limit, paginationData.page]);
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

  // const checkCCTVLink = async (cctv: any) => {
  //   try {
  //     if (cctv.type === "hikvision") {
  //       const link = cctv.link.split("?")[0];
  //       const query = cctv.link.split("?")[1];
  //       const header = query.split("&")[0].split("header=")[1];
  //       const data = query.split("&")[1].split("body=")[1];
  //       let headers: any = {
  //         "x-ca-signature-headers": "x-ca-key,x-ca-nonce,x-ca-timestamp",
  //         Accept: "application/json",
  //         ContentType: "application/json;charset=UTF-8",
  //       };
  //       header.split(",").forEach((item: any) => {
  //         let key = item.split(":")[0];
  //         let value = item.split(":")[1];
  //         headers[key] = value;
  //       });
  //       let body: any = {
  //         streamType: 0,
  //         protocol: "hls",
  //         transmode: 1,
  //         requestWebsocketProtocol: 0,
  //       };
  //       data.split(",").forEach((item: any) => {
  //         let key = item.split(":")[0];
  //         let value = item.split(":")[1];
  //         body[key] = value;
  //       });
  //       const agent = new https.Agent({
  //         rejectUnauthorized: false, // Ignore SSL certificate errors
  //       });
  //       const response = await axios.post(`${link}`, body, {
  //         headers: headers,
  //         httpsAgent: agent,
  //       });
  //       if (response.status === 200) {
  //         if (response.data.code === "0") return response.data.data.url;
  //       }
  //     }
  //     return cctv.link;
  //   } catch (error) {
  //     console.log(error);
  //     alert("CCTV Tidak Ditemukan");
  //     setDetail(null);
  //     return "";
  //   }
  // };
  const checkCCTVLink = async (cctv: any) => {
    try {
      const response = await axiosClient.post(
        `/cctv/generate-link-hikvision`,
        cctv
      );
      if (response) return response;
      return cctv.link;
    } catch (error) {
      console.log(error);
      return "";
    }
  };
  const [cctvLink, setCCTVLink] = useState<string>("");
  // useEffect(() => {
  //   if (cctvLink) {
  //     openModalCCTV();
  //   } else {
  //     closeModalCCTV();
  //   }
  // }, [cctvLink, closeModalCCTV, openModalCCTV]);
  useEffect(() => {
    if (cctvLink) {
      window.open("http://202.169.239.21/cctv/?s=" + cctvLink, "_blank");
    }
  }, [cctvLink]);
  useEffect(() => {
    async function getCCTVLink() {
      setCCTVLink(await checkCCTVLink(detail));
    }
    if (detail) {
      getCCTVLink();
    } else {
      setCCTVLink("");
    }
  }, [detail]);

  return (
    <>
      <Breadcrumb pageName="Daftar Lokasi Terpantau CCTV" />
      <div className="bg-white rounded-2xl w-full p-5">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-row items-center">
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
                    <Carousel showThumbs={false}>
                      {item.detail?.cctv_list.map((cctv: any) => (
                        <div
                          key={cctv.link}
                          className="justify-center flex items-center"
                          onClick={() => {
                            setDetail(cctv);
                          }}
                        >
                          <div className="flex-col">
                            <img
                              className="object-contain rounded-xl h-[23vh]"
                              src={"/images/icon/play.png"}
                              alt={cctv.name}
                            />
                            <div className="mt-3 mb-10">{cctv.name}</div>
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
        {paginationData && (
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

      {/* <div className="flex flex-col gap-10">
        <Table
          actionOptions={[
            {
              label: "Tambah Data",
              action: (e: any) => {
                navigation.push(pathname + "/form");
              },
            },
          ]}
          onSearch={(e) => {
            setSearch(e.target.value);
          }}
          onPaginationNumberClick={(currentNumber) => {
            setPaginationData({
              ...paginationData,
              page: currentNumber,
            });
          }}
          pagination={paginationData}
          onItemsPerPageChange={(e) => {
            setPaginationData({
              ...paginationData,
              page: 1,
              totalPages: Math.ceil(
                paginationData.totalDocs / parseInt(e.target.value)
              ),
              limit: parseInt(e.target.value),
            });
          }}
          scopedSlots={{
            parent: (item: any) => (
              <span>{item.parent_id?.name ?? "Tidak Ada Parent"}</span>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={[
                    {
                      label: "Cetak Papan Eksploitasi",
                      action: (e: any) => {
                        navigation.push(
                          "/papan-eksploitasi?nodeId=" + item.id
                        );
                      },
                    },
                    {
                      label: "Ubah",
                      action: (e: any) => {
                        navigation.push(pathname + "/form/" + item.id);
                      },
                    },
                    {
                      label: "Hapus",
                      action: (e: any) => {
                        handleDelete(item.id);
                      },
                    },
                  ]}
                />
              </div>
            ),
          }}
          values={datas}
          fields={[
            {
              key: "name",
              label: "Nama Titik",
            },
            {
              key: "type",
              label: "Jenis Titik",
            },
            {
              key: "parent",
              label: "Parent",
            },

            {
              key: "action",
              label: "Aksi",
            },
          ]}
        />
      </div> */}
      <Modal
        isOpen={isModalCCTVOpen}
        onClose={() => {
          setDetail(null);
        }}
        title="Data Monitoring"
      >
        <div className="w-[50vw] h-[100%]">
          {/* <Carousel showThumbs={false}>
            {detail?.detail?.cctv_list?.map(
              (video: any, indexVideo: number) => (
                <div key={video} className="flex justify-center">
                  <video ref={videoRef} controls>
                    <source src={video.link} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            )}
          </Carousel> */}
          {/* <Carousel showThumbs={false}>
            {detail?.detail?.cctv_list?.map(
              async (video: any, indexVideo: number) => (
                <div key={video} className="flex justify-center">
                  <ReactPlayer
                    url={
                      await checkCCTVLink(video)
                      // "http://202.169.239.21:83/sms/HCPEurl/commonvideobiz_mzrkP%2BoeBWoe4KjNOWQ9ze4lPa4Tz23VyoPfixPKcNS%2BDTa9dSKgaiivoHIG7LGd1MvPIeo8x5JWz4Z7qmS5Ondm0RXOHc9S6K82uVwmyJc1AoLxSW9ktOwLgT3aMmw90eDDw92ZQlgnW%2BvjuUvB07ZLEBeGjODqDnMVvihr%2BkHyKJ1mtrg4jqKEWCvycCIQWMlub%2F4OWxYZzFCohRm4EEqg7Vu%2FdgxDEuw5sgXxIm4%3D/live.m3u8"
                    }
                    controls
                    width="100%"
                    height="auto"
                    playing
                  />
                </div>
              )
            )}
          </Carousel> */}
          {cctvLink && (
            <div className="flex justify-center">
              <ReactPlayer
                url={
                  cctvLink
                  // "http://202.169.239.21:83/sms/HCPEurl/commonvideobiz_mzrkP%2BoeBWoe4KjNOWQ9ze4lPa4Tz23VyoPfixPKcNS%2BDTa9dSKgaiivoHIG7LGd1MvPIeo8x5JWz4Z7qmS5Ondm0RXOHc9S6K82uVwmyJc1AoLxSW9ktOwLgT3aMmw90eDDw92ZQlgnW%2BvjuUvB07ZLEBeGjODqDnMVvihr%2BkHyKJ1mtrg4jqKEWCvycCIQWMlub%2F4OWxYZzFCohRm4EEqg7Vu%2FdgxDEuw5sgXxIm4%3D/live.m3u8"
                }
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
