/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Buttons/Buttons";
import CardImage from "@/components/CardImage/CardImage";
import Modal from "@/components/Modals/Modals";
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
    name: "AIRSO (Aplikasi Irigasi SerayuOpak)",
    description:
      "AIRSO (Aplikasi Irigasi SerayuOpak) adalah aplikasi yang membantu para petani dalam mengambil keputusan kebutuhan air untuk petak sawahnya.",
    image: "/images/cover/landing.jpg",
  };
  const [listIrigasi, setListIrigasi] = useState<IrigasiDataT[]>([]);
  const [selected, setSelected] = useState<IrigasiDataT>(dataDefault);

  useEffect(() => {
    if (selected.id !== "default") {
      getOptions(
        "/areas/public/list",
        setSubArea,
        { isDropDown: false },
        { type: "daerah irigasi", parent_id: selected.id }
      );
    }
  }, [selected]);

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
  const [whichModal, setWhichModal] = useState<string>("");
  useEffect(() => {
    if (whichModal) setModalSubArea(true);
  }, [whichModal]);

  const goToApplication = () => {
    if (selected.id !== "default") {
      if (subArea.length !== 0) {
        setWhichModal("maps");
      } else {
        setAreaId(selected.id);
        navigation.push("maps");
      }
    } else {
      navigation.push("maps");
    }
  };

  const goToDownload = () => {
    if (selected.id !== "default") {
      if (subArea.length !== 0) {
        setWhichModal("download");
      } else {
        navigation.push("detail/" + selected.id + "#download");
      }
    } else {
      navigation.push("detail/" + selected.id + "#download");
    }
  };
  const goToDetail = () => {
    if (selected.id !== "default") {
      if (subArea.length !== 0) {
        setWhichModal("detail");
      } else {
        navigation.push("detail/" + selected.id);
      }
    } else {
      navigation.push("detail/" + selected.id);
    }
  };

  const goToFromModal = (path: string, subAreaId: string) => {
    console.log(path, subAreaId);
    if (path === "maps") {
      setAreaId(subAreaId);
      navigation.push("maps");
    } else if (path === "download") {
      navigation.push("detail/" + subAreaId + "#download");
    } else if (path === "detail") {
      navigation.push("detail/" + subAreaId);
    }
  };

  useEffect(() => {
    setAreaId("");
    getOptions(
      "/areas/public/list",
      convertToListArea,
      { isDropDown: false },
      { type: "daerah irigasi", parent_id: "null" }
    );
  }, []);
  const [subArea, setSubArea] = useState<any[]>([]);
  const [modalSubArea, setModalSubArea] = useState<boolean>(false);
  return (
    <div
      className="background-main"
      style={{ backgroundImage: `url("${selected.image + "?q=80&w=2048"}")` }}
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
                  <img alt="logo" src={item.image + "?q=80&w=200"} />
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
                    goToDownload();
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
                    goToDetail();
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
      <Modal
        isOpen={modalSubArea}
        onClose={() => {
          setSubArea([]);
          setWhichModal("");
          setModalSubArea(false);
        }}
        title="SUB DAERAH IRIGASI"
      >
        <div className="md:w-[50vw] h-[100%] grid grid-cols-3">
          {subArea.map((subAreaData, index) => (
            <div key={index} className="shadow-3 rounded-xl w-full p-5">
              <div className="flex flex-col">
                <CardImage images={subAreaData?.images} />
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    goToFromModal(whichModal, subAreaData.id);
                  }}
                >
                  <div className="text-center text-title-md font-bold text-black mb-5 ">
                    {subAreaData.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
