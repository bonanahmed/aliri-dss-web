/* eslint-disable @next/next/no-img-element */
"use client";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  Polygon,
} from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface GoogleMapsProps {
  mapType: "marker" | "polyline" | "polygon";
}
const GoogleMaps: React.FC<GoogleMapsProps> = ({ mapType }) => {
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
  const [position, setPosition] = useState<any>();
  const [points, setPoints] = useState<any[]>([]);
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <GoogleMap
      options={mapOptions}
      zoom={14}
      center={mapCenter}
      // mapTypeId={google.maps.MapTypeId.TERRAIN}
      mapTypeId={"terrain"}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      onLoad={() => console.log("Map Component Loaded...")}
      onClick={(e) => {
        if (mapType === "marker") {
          setPosition({
            lat: e.latLng?.lat(),
            lng: e.latLng?.lng(),
          });
        } else {
          points.push({
            lat: e.latLng?.lat(),
            lng: e.latLng?.lng(),
          });
          setPoints([...points]);
        }
      }}
    >
      {mapType === "marker" && <Marker position={position} />}
      {mapType === "polyline" && (
        <Polyline path={points} options={{ strokeColor: "red" }} />
      )}
      {mapType === "polygon" && (
        <Polygon
          path={points}
          options={{ strokeColor: "black", strokeWeight: 1 }}
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMaps;
