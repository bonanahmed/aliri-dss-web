"use client";
import AreaListPage from "@/components/AreaList/AreaList";
import { useState } from "react";
import PlantPatternPlanningData from "./PlantPatternPlanningData";
import { useSelector } from "react-redux";

const PlantPatternPlanningPage = () => {
  const [areaId, setAreaId] = useState<string>("");
  const { authenticated } = useSelector((state: any) => state.global);

  return (
    <>
      {areaId || authenticated.user.area_id ? (
        <PlantPatternPlanningData
          area_id={authenticated.user.area_id ?? areaId}
          callBack={() => {
            setAreaId("");
          }}
        />
      ) : (
        <AreaListPage
          title="Pola Tanam Berdasarkan SK Bupati"
          callBack={(data) => {
            setAreaId(data);
          }}
        />
      )}
    </>
  );
};

export default PlantPatternPlanningPage;
