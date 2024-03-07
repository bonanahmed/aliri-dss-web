/* eslint-disable @next/next/no-img-element */
"use client";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  Polygon,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import Button from "../Buttons/Buttons";
import Modal from "../Modals/Modals";
import TextInput from "../Input/TextInput";
import { toast } from "react-toastify";

interface GoogleMapsProps {
  mapType: "marker" | "polyline" | "polygon";
  name?: string;
  data?: any;
  icon?: string;
  callBack?: (data: any) => void;
}
const GoogleMaps: React.FC<GoogleMapsProps> = ({
  mapType,
  name,
  data,
  icon,
  callBack,
}) => {
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
  const [latLong, setLatLong] = useState<string>("");
  useEffect(() => {
    if (data && name) {
      if (mapType === "marker") {
        setPosition(data[name]);
      } else {
        setPoints(data[name]);
      }
    }
  }, [data, name, mapType]);

  const [showInputModal, setShowInputModal] = useState<boolean>(false);

  const saveInputText = (e: any) => {
    e.preventDefault();
    if (latLong && validateLatLong(latLong)) {
      const [lat, lng] = latLong.split(",");
      addLatLong(parseFloat(lat), parseFloat(lng));
      setLatLong("");
      setShowInputModal(false);
    } else {
      toast.error("Data Koordinat Tidak Sesuai", {
        autoClose: 1500,
      });
    }
  };

  const validateLatLong = (input: string) => {
    const regex =
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    return regex.test(input);
  };

  const addLatLong = (lat?: number, lng?: number) => {
    if (mapType === "marker") {
      setPosition({
        lat: lat,
        lng: lng,
      });
    } else {
      points.push({
        lat: lat,
        lng: lng,
      });
      setPoints([...points]);
    }
  };

  useEffect(() => {
    let data: any;
    if (position) {
      data = position;
    } else {
      data = points;
    }
    if (callBack) callBack(data);
  }, [callBack, points, position]);
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute z-0 w-full h-full">
        <input
          className="hidden"
          name={name ?? undefined}
          value={JSON.stringify(
            mapType === "marker" ? position ?? {} : points ?? []
          )}
          onChange={() => {}}
        />
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          // mapTypeId={google.maps.MapTypeId.TERRAIN}
          mapTypeId={"terrain"}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={() => console.log("Map Component Loaded...")}
          onClick={(e) => {
            addLatLong(e.latLng?.lat(), e.latLng?.lng());
          }}
        >
          {mapType === "marker" && position && (
            <Marker
              icon={
                icon
                  ? {
                      url: `/images/maps/markers/${icon}`,
                      scaledSize: new window.google.maps.Size(15, 15),
                    }
                  : undefined
              }
              position={position}
            />
          )}
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
      </div>
      <div className="absolute z-1 right-5 p-4">
        <div className="flex gap-3">
          <Button
            type="button"
            label="Reset"
            onClick={(e) => {
              e.preventDefault();
              setPoints([]);
              setPosition(null);
            }}
          />
          <Button
            label="Input dengan Text"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowInputModal(true);
            }}
          />
        </div>
      </div>
      <Modal
        title="Input Data"
        isOpen={showInputModal}
        onClose={() => {
          setShowInputModal(false);
        }}
      >
        <div className="flex mt-5 gap-3">
          <div className="w-full">
            <TextInput
              type="text"
              label="Latitude Longitude"
              value={latLong}
              onChange={(e) => {
                setLatLong(e.target.value);
              }}
            />
          </div>
        </div>
        <Modal.Footer className="flex justify-end">
          <Button label="Simpan" onClick={saveInputText} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GoogleMaps;
