/* eslint-disable @next/next/no-img-element */
"use client";
import Modal from "@/components/Modals/Modals";
import Monitoring from "@/components/Monitoring/Monitoring";
import NodeInfoMap from "@/components/NodeInfoMap/NodeInfoMap";
import axiosClient from "@/services";
import { getDataTOPKAPI, resetData } from "@/services/topkapi.service";
import { setSideBarIsOpen } from "@/store/globalSlice";
import {
  GoogleMap,
  InfoWindow,
  KmlLayer,
  Marker,
  Polygon,
  Polyline,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import clsx from "clsx";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import TextInput from "@/components/Input/TextInput";
import { useDebounce } from "use-debounce";
import Button from "@/components/Buttons/Buttons";
import { SearchIcon } from "@/public/images/icon/icon";
import useLocalStorage from "@/hooks/useLocalStorage";
import ReactPlayer from "react-player";

const Map = () => {
  const dispatch = useDispatch();

  const [detail, setDetail] = useState<any>(null);
  const [upperClass, setUpperClass] = useState<string>("relative");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(true);

  const [areaId, setAreaId] = useLocalStorage("area_id", "");

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
      dispatch(setSideBarIsOpen(detail ? false : true));
      setShowSearchBar(true);
    } else {
      dispatch(setSideBarIsOpen(false));
      setShowSearchBar(false);
    }
  }, [detail, windowWidth, dispatch]);

  const getDetail = async (fromMap: any) => {
    const data = await axiosClient.get("/nodes/" + fromMap.id);
    setDetail({
      data,
      fromMap,
    });
  };
  // const [areas, setAreas] = useState<any>(null);
  // const getAreas = useCallback(async () => {
  //   let query = "";
  //   if (areaId) query += "?id=" + areaId;
  //   const data = await axiosClient.get("/areas/maps/list" + query);
  //   setAreas(data);
  // }, [areaId]);
  // useEffect(() => {
  //   getAreas();
  // }, [getAreas]);

  const [maps, setMaps] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);

  const getMaps = useCallback(async () => {
    let query = "?";
    if (delayedSearch) query += "&search=" + delayedSearch;
    if (areaId) query += "&area_id=" + areaId;

    const data = await axiosClient.get("/dashboard/maps" + query);
    setMaps(data);
  }, [areaId, delayedSearch]);
  useEffect(() => {
    getMaps();
  }, [getMaps]);

  const libraries = useMemo(() => ["places"], []);
  const convertStringLatLong = (latLng: string) => {
    const returnLatLng = {
      lat: parseFloat(latLng.split(",")[0]),
      lng: parseFloat(latLng.split(",")[1]),
    };
    console.log(returnLatLng);
    return returnLatLng;
  };
  const mapCenter = useMemo(() => {
    // Check if map.area_config exists and has lat/lng values
    if (maps?.area_config?.value) {
      return convertStringLatLong(maps?.area_config?.value);
    }
    // Fallback to default lat/lng if area_config is not present
    return { lat: -1.2074060577669294, lng: 119.94395130061615 };
  }, [maps]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      mapTypeId: "terrain",
      disableDefaultUI: false,

      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
      ],
      clickableIcons: true,
      scrollwheel: true,
      mapTypeControl: false,
      fullscreenControl: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAB0beP_U6tXEqOsATEV8mvCjzERHfxmNM",
    libraries: libraries as any,
  });
  // MODAL
  const [value, setValue] = useState<any>([]);
  const [isModalMonitoringOpen, setIsModalMonitoringOpen] = useState(false);
  const openModalMonitoring = () => {
    if (detail) getDataTOPKAPI(setValue, detail?.data?.code);
    setIsModalMonitoringOpen(true);
  };

  const closeModalMonitoring = () => {
    resetData();
    setIsModalMonitoringOpen(false);
  };

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

  const [isModalCCTVListOpen, setIsModalCCTVListOpen] = useState(false);
  const openModalCCTVList = () => {
    setIsModalCCTVListOpen(true);
  };

  const closeModalCCTVList = () => {
    setIsModalCCTVListOpen(false);
  };

  const checkCCTVLink = async (cctv: any) => {
    try {
      // setWhichLoading([...whichLoading, detail.link]);
      const response = await axiosClient.post(
        `/cctv/generate-link-hikvision`,
        cctv
      );
      // setWhichLoading(whichLoading.filter((which) => which !== cctv.link));
      if (response) return response;
      return cctv.link;
    } catch (error) {
      console.log(error);
      // setWhichLoading(whichLoading.filter((which) => which !== cctv.link));
      return "";
    }
  };
  const [detailCCTV, setDetailCCTV] = useState<any>();
  const [cctvLink, setCCTVLink] = useState<string>("");
  const [isModalCCTVOpen, setIsModalCCTVOpen] = useState(false);
  const openModalCCTV = useCallback(() => {
    playVideo();
    setIsModalCCTVOpen(true);
  }, []);

  const closeModalCCTV = useCallback(() => {
    pauseVideo();
    setIsModalCCTVOpen(false);
  }, []);
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
      const linkData = (await checkCCTVLink(detailCCTV)).replace(
        "http://202.169.239.21:83",
        "https://cctv.airso.digibay.id"
      );
      setCCTVLink(linkData);
    }
    if (detailCCTV) {
      getCCTVLink();
    } else {
      setCCTVLink("");
    }
  }, [detailCCTV]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className={upperClass}>
      <div>
        <GoogleMap
          options={mapOptions}
          zoom={13}
          center={mapCenter}
          // mapTypeId={google.maps.MapTypeId.TERRAIN}
          mapTypeId={"terrain"}
          mapContainerStyle={{ width: "100vw", height: "100vh" }}
          onLoad={() => console.log("Map Component Loaded...")}
        >
          {maps?.nodes?.map((node: any) => (
            <Marker
              key={node.id}
              clickable
              onClick={() => {
                getDetail({
                  id: node.id,
                  name: node.name,
                  position: {
                    lat: node.location?.data?.lat,
                    lng: node.location?.data?.lng,
                  },
                });
              }}
              options={{
                // label: node.name,
                optimized: true,
                anchorPoint: new google.maps.Point(0, 0),
              }}
              icon={
                node.type
                  ? {
                      url: `/images/maps/markers/${node.type}.png`,
                      scaledSize: new window.google.maps.Size(20, 20),
                      // size: new google.maps.Size(32, 32), // Size of your icon
                      anchor: new google.maps.Point(10, 10), // Adjusts the anchor to the bottom center of the icon
                    }
                  : undefined
              }
              position={node?.location?.data}
            />
          ))}
          {maps?.lines?.map((line: any) => (
            <Polyline
              key={line.id}
              path={line.location?.data ?? []}
              options={{
                strokeColor: line.location?.strokeColor ?? "",
                // strokeWeight: 1
              }}
            />
          ))}
          {maps?.areas?.map((area: any) => (
            <Polygon
              key={area.id}
              path={area.location?.data ?? []}
              options={{
                strokeColor: area.location?.strokeColor ?? "",
                fillColor: area.location?.fillColor ?? "",
                // strokeWeight: 1
              }}
            />
          ))}
          {maps?.areas?.map((map: any, indexMap: number) => (
            <Fragment key={map.link_google_map}>
              {map.link_google_map && (
                <KmlLayer
                  key={map.link_google_map}
                  url={map.link_google_map}
                  options={{
                    preserveViewport: true,
                    suppressInfoWindows: true,
                    clickable: true,
                  }}
                  // onLoad={handleKmlLayerLoad}
                  onLoad={(e) => {
                    // console.log(e);
                  }}
                  onClick={(e: any) => {
                    // console.log(e);
                    getDetail({
                      name: e.featureData.name,
                      position: {
                        lat: e.latLng?.lat(),
                        lng: e.latLng?.lng(),
                      },
                    });
                  }}
                />
              )}
            </Fragment>
          ))}
          {detail && (
            <InfoWindow
              position={detail.fromMap.position}
              onCloseClick={() => {
                setDetail(null);
              }}
            >
              <div>
                <h1>{detail?.fromMap?.name ?? ""}</h1>
              </div>
            </InfoWindow>
          )}
          <StreetViewPanorama
            onVisibleChanged={() => {
              if (upperClass === "relative") setUpperClass("relative z-9999");
              if (upperClass === "relative z-9999") setUpperClass("relative");
            }}
          />
        </GoogleMap>
      </div>
      <div
        className={clsx(
          "absolute z-999999 duration-300 ease-linear overflow-y-hidden",
          // "absolute  z-999999 duration-300 ease-linear overflow-y-hidden invisible lg:visible",
          detail && detail.data
            ? "lg:translate-x-0 translate-x-0  top-[13%] left-[5%]"
            : "lg:-translate-x-full -translate-x-full left-0 top-[13%]"
        )}
      >
        <NodeInfoMap
          detail={detail}
          onCloseClick={() => {
            setDetail(null);
          }}
          onOpenMonitoring={() => {
            openModalMonitoring();
          }}
          onCCTVClick={() => {
            openModalCCTVList();
          }}
        />
      </div>
      {showSearchBar && (
        <div className="absolute z-999999 top-[10%] lg:top-[3.5%] right-0 lg:right-[15%]">
          <TextInput
            placeholder="Pencarian Titik"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      )}
      <div className="absolute z-999999 top-[2.3%] lg:hidden right-[10%]">
        <Button
          icon={<SearchIcon />}
          placeholder="Pencarian Titik"
          onClick={() => {
            setShowSearchBar(!showSearchBar);
          }}
        />
      </div>
      <Modal
        isOpen={isModalMonitoringOpen}
        onClose={closeModalMonitoring}
        title="Data Monitoring"
      >
        <div className="overflow-y-scroll h-[75vh]">
          <Monitoring code={detail?.data?.code} value={value} />
        </div>
      </Modal>
      <Modal
        isOpen={isModalCCTVListOpen}
        onClose={closeModalCCTVList}
        title="CCTV"
        className="flex justify-center"
      >
        <div className="md:w-[25vw] h-[100%]">
          <Carousel showThumbs={false} showStatus={false} swipeable>
            {detail?.data?.detail?.cctv_list?.map(
              (cctv: any, indexCCTV: number) => (
                <div
                  key={cctv.link}
                  className="justify-center flex items-center w-full"
                  onClick={() => {
                    setDetailCCTV(cctv);
                  }}
                >
                  <div className="flex-col w-full">
                    {detail?.data?.images[0]?.content ? (
                      <img
                        className="object-cover w-full rounded-xl h-[23vh]"
                        src={detail?.data?.images[0]?.content}
                        alt={cctv.name}
                      />
                    ) : (
                      <img
                        className="object-contain w-full rounded-xl h-[23vh]"
                        src={"/images/icon/play.png"}
                        alt={cctv.name}
                      />
                    )}
                    <div className="mt-3 mb-10">{cctv.name}</div>
                  </div>
                </div>
              )
            )}
          </Carousel>
        </div>
      </Modal>
      <Modal
        isOpen={isModalCCTVOpen}
        onClose={() => {
          setDetailCCTV(null);
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
    </div>
  );
};

export default Map;
