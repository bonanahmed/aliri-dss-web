"use client";
import AreaListPage from "@/components/AreaList/AreaList";
import { useState } from "react";
import { useSelector } from "react-redux";
import PlantPatternRealisationData from "./PlantPatternRealisastionData";

const PlantPatterRealisationPage = () => {
  const [areaId, setAreaId] = useState<string>("");
  const { authenticated } = useSelector((state: any) => state.global);

  return (
    <>
      {areaId || authenticated.user.area_id ? (
        <PlantPatternRealisationData
          area_id={authenticated.user.area_id ?? areaId}
          callBack={() => {
            setAreaId("");
          }}
        />
      ) : (
        <AreaListPage
          title="Realisasi Tata Tanam"
          callBack={(data) => {
            setAreaId(data);
          }}
        />
      )}
    </>
  );
};

export default PlantPatterRealisationPage;
