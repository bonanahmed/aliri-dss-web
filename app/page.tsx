/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Buttons/Buttons";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getOptions } from "@/services/base.service";
import {
  IconAlignJustified,
  IconChevronRight,
  IconCircleArrowRightFilled,
  IconCloudDownload,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";

type IrigasiDataT = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const LandingPage = () => {
  const navigation = useRouter();
  const [areaId, setAreaId] = useLocalStorage("area_id", "");

  const dataDefault: IrigasiDataT = {
    id: "default",
    name: "AIRSO (Aplikasi Irigasi Serayu Opak)",
    description:
      "AIRSO (Aplikasi Irigasi Serayu Opak adalah aplikasi yang membantu para petani dalam mengambil keputusan kebutuhan air untuk petak sawahnya.",
    image: "/images/sample/default.jpg",
  };
  const [listIrigasi, setListIrigasi] = useState<IrigasiDataT[]>([]);
  // const [listIrigasi, setListIrigasi] = useState<IrigasiDataT[]>(
  //   Array(10)
  //     .fill(null)
  //     .map((_, i) => ({
  //       id: `sample${i + 1}`,
  //       name: `Sample Name ${i + 1}`,
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, necessitatibus vitae quisquam expedita architecto voluptatum unde ut.   Pariatur iste, corrupti necessitatibus eveniet ex dolores, laudantium, consequatur quos minima sint voluptatum?",
  //       image: `/images/sample/sample${i + 1}.jpg`,
  //     }))
  // );
  const [selected, setSelected] = useState<IrigasiDataT>(dataDefault);
  // const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // let timeoutId: any;
  // useEffect(() => {
  //   if (selected.id === "default") {
  //     timeoutId = setTimeout(() => {
  //       setSelectedIndex(getRandomInt(0, listIrigasi.length));
  //     }, 3000);
  //   } else {
  //     clearTimeout(timeoutId);
  //   }
  // }, [selected]);
  // function getRandomInt(min: number, max: number) {
  //   min = Math.ceil(min); // Rounds up to the nearest integer
  //   max = Math.floor(max); // Rounds down to the nearest integer
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  const renderTitle = (title: string): ReactNode => {
    const words = title.split(" ");
    let least = words.slice(1);
    return (
      <>
        <span className="first-word">{words[0] + " "}</span>
        {least.join(" ")}
      </>
    );
  };

  const convertToListArea = (data: any) => {
    const returnData: IrigasiDataT[] = data.map((item: any, index: number) => {
      return {
        id: item.id,
        name: item.name,
        description: "",
        image: item.images[0]?.content,
      };
    });
    setListIrigasi(returnData);
  };

  const goToApplication = () => {
    if (selected.id !== "default") setAreaId(selected.id);
    navigation.push("maps");
  };

  useEffect(() => {
    getOptions(
      "/areas/public/list",
      convertToListArea,
      { isDropDown: false },
      { type: "daerah irigasi" }
    );
  }, []);

  return (
    <div
      className="background-main"
      style={{ backgroundImage: `url("${selected.image}")` }}
    >
      <div className="background-gradient">
        <header className="header-main px-[50px] pt-4">
          <div
            className="main-logo glassmorp"
            onClick={() => setSelected(dataDefault)}
          >
            <img alt="logo" src="/images/logo/logoairso.png" />
          </div>
          <Button
            className="btn-round glassmorp"
            color="bg-[#00000033] text-white"
            icon={<IconInfoCircleFilled size="18" />}
            label="Informasi Aplikasi"
          />
        </header>
        <aside className="sidebar-main pl-[50px] mt-10">
          {listIrigasi.map((item, i) => {
            const isActive = item.id === selected.id;

            return (
              <div
                key={i}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (selected.id === item.id) setSelected(dataDefault);
                  else setSelected(item);
                }}
              >
                <div
                  className={`sidebar-content glassmorp ${
                    isActive ? "active" : ""
                  }`}
                >
                  <img alt="logo" src={item.image} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="rounded-[50%] text-black bg-[#00000033] w-[33px] h-[33px] flex justify-center items-center">
                      <IconChevronRight size={28} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </aside>

        <footer className="footer-main">
          <div className="footer-content">
            <span className="footer-title text-right">
              {renderTitle(selected.name)}
            </span>
            <p className="footer-desc text-right">{selected.description}</p>
            <div className="flex gap-4 justify-end">
              {selected.id != "default" && (
                <Button
                  className="btn-round glassmorp"
                  color="bg-[#00000033] text-white"
                  icon={<IconCloudDownload size="18" />}
                  label="Dokumen Daerah Irigasi"
                  onClick={() => {
                    navigation.push("information/document/form/" + selected.id);
                  }}
                />
              )}
              {selected.id != "default" && (
                <Button
                  className="btn-round glassmorp"
                  color="bg-[#00000033] text-white"
                  icon={<IconAlignJustified size="18" />}
                  label="Informasi Irigasi"
                  onClick={() => {
                    navigation.push("detail/" + selected.id);
                  }}
                />
              )}
              <Button
                className="btn-round glassmorp"
                color="bg-[#FFFFFF80] text-primary"
                onClick={() => {
                  goToApplication();
                }}
                label={
                  <div className="flex items-center gap-4">
                    Masuk Aplikasi <IconCircleArrowRightFilled size="18" />
                  </div>
                }
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
