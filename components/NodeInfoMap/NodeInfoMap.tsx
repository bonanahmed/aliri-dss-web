import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {
  CCTVIcon,
  IconMap,
  PapanDigitalIcon,
  PrinterIcon,
  VerticalThreeDotsIcon,
} from "@/public/images/icon/icon";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";

import { useRouter } from "next/navigation";
import Modal from "../Modals/Modals";
import { useState } from "react";
import Button from "../Buttons/Buttons";
/* eslint-disable @next/next/no-img-element */
const NodeInfoMap = ({
  detail,
  onCloseClick,
  onOpenMonitoring,
  onCCTVClick,
}: any) => {
  const navigation = useRouter();

  return (
    <div className="bg-primary w-[20vw] rounded-xl px-5 py-5 text-white">
      <div className="flex relative justify-between">
        {detail?.fromMap?.name.toUpperCase() ?? "Data tidak ditemukan"}
        <span
          className="absolute -right-2 -top-7 text-2xl hover:cursor-pointer"
          onClick={onCloseClick}
        >
          x
        </span>
      </div>
      <div className="bg-white my-5 w-full h-[17.5vh] rounded-xl">
        {detail?.data?.images?.length !== 0 ? (
          <Carousel showThumbs={false}>
            {detail?.data?.images?.map((image: any, indexImage: number) => (
              <div key={image.content}>
                <img
                  className="object-cover rounded-xl w-full h-[17.5vh]"
                  src={
                    image?.content
                      ? image?.content
                      : "/images/webcolours-unknown.png"
                  }
                  alt={image.content}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div>
            <img
              className="object-cover h-[17.5vh] w-full rounded-xl"
              src={"/images/webcolours-unknown.png"}
              alt={"unknown"}
            />
          </div>
        )}
      </div>
      {/* <div className="flex justify-between mb-5">
        <div className="flex justify-around gap-3">
          {detail?.data?.detail?.cctv_list && (
            <div
              className="w-12 h-12 bg-white rounded-xl flex justify-center items-center cursor-pointer"
              onClick={onCCTVClick}
            >
              <CCTVIcon size="40" />
            </div>
          )}
          <div
            className="w-12 h-12 bg-white text-black rounded-xl flex justify-center items-center cursor-pointer"
            onClick={() => {
              navigation.push("/papan-eksploitasi?nodeId=" + detail.data?.id);
            }}
          >
            <PapanDigitalIcon size="40" />
          </div>
        </div>
        <div className="w-12 h-12 bg-white text-primary rounded-xl flex justify-center items-center cursor-pointer">
          <DropdownButton
            className="bg-transparent text-black"
            icon={<VerticalThreeDotsIcon size="40" />}
            options={[
              {
                label: "Lihat Data Monitoring",
                action: onOpenMonitoring,
              },
            ]}
          />
        </div>
      </div> */}
      <div className="w-full bg-white rounded-xl text-black p-5">
        <div className="flex flex-col">
          <div className="text-title-sm font-bold mb-2">Informasi Detail</div>
          <div className="grid grid-cols-2">
            <div className="text-white">
              <Button
                label={"Menuju Lokasi"}
                icon={<IconMap />}
                onClick={() => {
                  // console.log(detail.fromMap);
                  navigation.push(
                    `https://www.google.com/maps?q=${detail.fromMap.position.lat},${detail.fromMap.position.lng}`
                  );
                }}
              />
            </div>
            <div className="text-white">
              <Button
                className="text-xs"
                label={"Papan Eksploitasi"}
                icon={<PapanDigitalIcon />}
                onClick={() => {
                  navigation.push(
                    "/papan-eksploitasi?nodeId=" + detail.data?.id
                  );
                }}
              />
            </div>
          </div>
        </div>
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
            <span className="font-semibold">Menuju Lokasi</span>

            <span className="text-bodydark2">
              {detail?.data?.parent_id?.name ?? "Data tidak ditemukan"}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold">Saluran</span>
            <span className="text-bodydark2 text-start">
              {detail?.data?.line_id?.name ?? "Data tidak ditemukan"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInfoMap;
