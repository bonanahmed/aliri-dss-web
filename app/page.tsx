/* eslint-disable @next/next/no-img-element */
"use client";
import axiosClient from "@/services";
import { setSideBarIsOpen } from "@/store/globalSlice";
import {
  GoogleMap,
  InfoWindow,
  KmlLayer,
  useLoadScript,
} from "@react-google-maps/api";
import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const Map = () => {
  const dispatch = useDispatch();

  const [detail, setDetail] = useState<any>(null);
  useEffect(() => {
    console.log(detail);
    dispatch(setSideBarIsOpen(detail ? false : true));
  }, [detail, dispatch]);

  const getDetail = async (fromMap: any) => {
    const data = await axiosClient.get("/nodes/map/" + fromMap.name);
    setDetail({
      data,
      fromMap,
    });
  };

  const kmzUrl =
    // "https://www.google.com/maps/d/u/0/kml?mid=1BC7tLwQVjwVIdxb_8bsUxd6JwI51V2o";
    "https://www.google.com/maps/d/u/0/kml?mid=1BC7tLwQVjwVIdxb_8bsUxd6JwI51V2o";
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

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative">
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
          <KmlLayer
            url={kmzUrl}
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
        </GoogleMap>
      </div>
      <div
        className={clsx(
          "absolute  z-999999 duration-300 ease-linear overflow-y-hidden",
          detail
            ? "lg:translate-x-0 top-[8%] left-[5%]"
            : "lg:-translate-x-full left-0 top-[8%]"
        )}
      >
        <div className="bg-primary w-[20vw] rounded-xl px-5 py-5 text-white">
          <div className="flex relative justify-between">
            {detail?.fromMap?.name.toUpperCase() ?? "Data tidak ditemukan"}
            <span
              className="absolute -right-2 -top-7 text-2xl hover:cursor-pointer"
              onClick={() => {
                setDetail(null);
              }}
            >
              x
            </span>
          </div>
          <div className="bg-white my-5 w-full h-[17.5vh] rounded-xl">
            <img
              className="object-cover h-full w-full rounded-xl"
              src={
                detail?.data?.detail?.cover
                  ? detail?.data?.detail?.cover
                  : "/images/webcolours-unknown.png"
              }
              alt="map"
            />
          </div>
          <div className="w-full bg-white rounded-xl text-black p-5">
            <span className="text-title-sm font-bold">Informasi Detail</span>
            <div className="grid grid-cols-2 mt-5 gap-3">
              <div className="flex flex-col">
                <span className="font-semibold">Nomenklatur</span>
                <span className="text-bodydark2">
                  {detail?.data?.name ?? "Data tidak ditemukan"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold">Tipe</span>
                <span className="text-bodydark2 text-end">
                  {detail?.data?.type?.toUpperCase() ?? "Data tidak ditemukan"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Hulu</span>
                <span className="text-bodydark2">
                  {detail?.data?.parent_id?.name ?? "Data tidak ditemukan"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold">Saluran</span>
                <span className="text-bodydark2 text-end">
                  {detail?.data?.line_id?.name ?? "Data tidak ditemukan"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
