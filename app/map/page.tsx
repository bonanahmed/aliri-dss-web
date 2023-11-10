"use client";
import {
  GoogleMap,
  InfoWindow,
  KmlLayer,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

const Map = () => {
  const [detail, setDetail] = useState<any>(null);
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
      fullscreenControl: true,
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
              setDetail({
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
              position={detail.position}
              onCloseClick={() => {
                setDetail(null);
              }}
            >
              <div>
                <h1>{detail?.name ?? ""}</h1>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      {detail && (
        <div className="absolute top-[7.5%] left-[1%] z-10">
          <div className="bg-meta-4 rounded p-2 text-white  ">
            {detail?.name ?? ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
