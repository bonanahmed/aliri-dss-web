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
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Map = () => {
  const dispatch = useDispatch();

  const [detail, setDetail] = useState<any>(null);
  const [upperClass, setUpperClass] = useState<string>("relative");

  useEffect(() => {
    dispatch(setSideBarIsOpen(detail ? false : true));
  }, [detail, dispatch]);

  const getDetail = async (fromMap: any) => {
    const data = await axiosClient.get("/nodes/map/" + fromMap.name);
    setDetail({
      data,
      fromMap,
    });
  };
  const [areas, setAreas] = useState<any>(null);
  const getAreas = useCallback(async () => {
    const data = await axiosClient.get("/areas/maps/list");
    setAreas(data);
  }, []);
  useEffect(() => {
    getAreas();
  }, [getAreas]);

  // const kmzUrl =
  //   // "https://www.google.com/maps/d/u/0/kml?mid=1BC7tLwQVjwVIdxb_8bsUxd6JwI51V2o";
  //   "https://www.google.com/maps/d/u/0/kml?mid=1BC7tLwQVjwVIdxb_8bsUxd6JwI51V2o";
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(
    () => ({ lat: -7.731128758051177, lng: 110.00145360478984 }),
    []
  );

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

  const [isModalCCTVOpen, setIsModalCCTVOpen] = useState(false);
  const openModalCCTV = () => {
    playVideo();
    setIsModalCCTVOpen(true);
  };

  const closeModalCCTV = () => {
    pauseVideo();
    setIsModalCCTVOpen(false);
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className={upperClass}>
      <div>
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          // mapTypeId={google.maps.MapTypeId.TERRAIN}
          mapTypeId={"terrain"}
          mapContainerStyle={{ width: "100vw", height: "100vh" }}
          onLoad={() => console.log("Map Component Loaded...")}
        >
          {areas?.map((map: any, indexMap: number) => (
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
                console.log(e);
              }}
              onClick={(e: any) => {
                console.log(e);
                getDetail({
                  name: e.featureData.name,
                  position: {
                    lat: e.latLng?.lat(),
                    lng: e.latLng?.lng(),
                  },
                });
              }}
            />
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
          "absolute  z-999999 duration-300 ease-linear overflow-y-hidden",
          detail && detail.data
            ? "lg:translate-x-0 top-[8%] left-[5%]"
            : "lg:-translate-x-full left-0 top-[8%]"
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
            openModalCCTV();
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
        isOpen={isModalCCTVOpen}
        onClose={closeModalCCTV}
        title="Data Monitoring"
      >
        <div className="w-[50vw] h-[100%]">
          <Carousel showThumbs={false}>
            {detail?.data?.detail?.cctv_list?.map(
              (video: any, indexVideo: number) => (
                <div key={video} className="flex justify-center">
                  <video ref={videoRef} controls>
                    {/* <source src={video.link} type="video/mp4" /> */}
                    <source src={video.link} type={video.type} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            )}
          </Carousel>
        </div>
      </Modal>
    </div>
  );
};

export default Map;
