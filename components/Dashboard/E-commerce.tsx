"use client";
import React, { useCallback, useEffect } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import { DatabaseIcon } from "@/public/images/icon/icon";
import ChartOneB from "../Charts/ChartOneB";
import axiosClient from "@/services";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  const getData = useCallback(async () => {
    await axiosClient.get("/dashboard");
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Golongan 1"
          data1="Debit di Sawah"
          rate="0.43 l/s"
          levelUp
        />
        <CardDataStats
          title="Golongan 2"
          data1="Debit di Sawah"
          rate="0.43 l/s"
          levelUp
        />
        <CardDataStats
          title="Golongan 3"
          data1="Debit di Sawah"
          rate="0.43 l/s"
          levelUp
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartTwo />
        <ChartOne />
        {/* <ChartOneB /> */}
        {/* <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;
