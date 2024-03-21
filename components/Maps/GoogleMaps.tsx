/* eslint-disable @next/next/no-img-element */
"use client";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  Polygon,
} from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    () =>
      data?.data
        ? Array.isArray(data?.data)
          ? data?.data.length !== 0
            ? data?.data[0]
            : { lat: -7.731128758051177, lng: 110.00145360478984 }
          : data?.data
        : { lat: -7.731128758051177, lng: 110.00145360478984 },
    [data]
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
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [fillColor, setFillColor] = useState<string>("#000000");
  useEffect(() => {
    if (data) {
      if (mapType === "marker") {
        setPosition(data?.data);
      } else {
        setPoints(data?.data);
        setStrokeColor(data?.strokeColor);
        setFillColor(data?.fillColor);
      }
    }
  }, [data, name, mapType]);

  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [showSettingModal, setShowSettingModal] = useState<boolean>(false);

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

  const convertProperties = useCallback(() => {
    let dataReturn: any = {};
    if (mapType === "marker") {
      dataReturn = {
        type: mapType,
        data: position,
      };
    } else if (mapType === "polyline") {
      dataReturn = {
        type: mapType,
        strokeColor: strokeColor,
        data: points,
      };
    } else if (mapType === "polygon") {
      dataReturn = {
        type: mapType,
        strokeColor: strokeColor,
        fillColor: fillColor,
        data: points,
      };
    }
    return dataReturn;
  }, [fillColor, mapType, points, position, strokeColor]);

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
    if (callBack && convertProperties().data) callBack(convertProperties());
  }, [callBack, convertProperties]);
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute z-0 w-full h-full">
        <input
          className="hidden"
          name={name ?? undefined}
          value={JSON.stringify(convertProperties())}
          onChange={() => {}}
        />
        <GoogleMap
          options={mapOptions}
          zoom={6}
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
                      scaledSize: new window.google.maps.Size(20, 20),
                      // size: new google.maps.Size(32, 32), // Size of your icon
                      anchor: new google.maps.Point(10, 10), // Adjusts the anchor to the bottom center of the icon
                    }
                  : undefined
              }
              position={position}
            />
          )}
          {mapType === "polyline" && (
            <Polyline
              path={points}
              options={{
                strokeColor: strokeColor,
                // strokeWeight: 1
              }}
            />
          )}
          {mapType === "polygon" && (
            <Polygon
              path={points}
              options={{
                strokeColor: strokeColor,
                fillColor: fillColor,
                // strokeWeight: 1,
              }}
            />
          )}
        </GoogleMap>
      </div>
      <div className="absolute z-1 right-5 p-4">
        <div className="flex gap-3">
          {mapType !== "marker" && (
            <Button
              type="button"
              label="Undo"
              onClick={(e) => {
                e.preventDefault();
                if (points.length === 2) {
                  points.pop();
                }
                points.pop();

                setPoints([...points]);
              }}
            />
          )}
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
          {mapType !== "marker" && (
            <Button
              type="button"
              label="Pengaturan"
              onClick={(e) => {
                e.preventDefault();
                setShowSettingModal(true);
              }}
            />
          )}
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
      <Modal
        title="Pengaturan"
        isOpen={showSettingModal}
        onClose={() => {
          setShowSettingModal(false);
        }}
      >
        <div className="flex mt-5 gap-3">
          <div className="w-1/2">
            <TextInput
              type="color"
              label="Warna Garis"
              value={strokeColor}
              onChange={(e) => {
                setStrokeColor(e.target.value);
              }}
            />
          </div>
          {mapType === "polygon" && (
            <div className="w-1/2">
              <TextInput
                type="color"
                label="Warna Area"
                value={fillColor}
                onChange={(e) => {
                  setFillColor(e.target.value);
                }}
              />
            </div>
          )}
        </div>
        <Modal.Footer className="flex justify-end">
          <Button
            label="Kembali"
            onClick={(e) => {
              e.preventDefault();
              setShowSettingModal(false);
            }}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GoogleMaps;
