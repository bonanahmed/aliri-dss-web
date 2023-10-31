"use client";
import Button from "@/components/Buttons/Buttons";
import Loader from "@/components/common/Loader";
import axiosClient from "@/services";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import ReactToPrint from "react-to-print";
require("moment/locale/id");

const CetakPapanEksploitasi = () => {
  const searchParams = useSearchParams();
  const nodeId = searchParams.get("nodeId");
  const componentRef = useRef<any>();
  const navigation = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDetail = (dataDetail: any) => {
    const detail = Object.entries(dataDetail);
    const areas: any = detail[0][1];
    const arahSaluran = detail[0][0];
    const titikBangunan = detail[1][1];
    let totalArea = 0;
    areas.forEach((area: any) => {
      totalArea += area.detail?.standard_area ?? 0;
    });

    return {
      titikBangunan,
      totalArea,
      areas,
      arahSaluran,
    };
  };

  const [data, setData] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<any>({});
  const getData = useCallback(async () => {
    setIsLoading(true);
    const response: any = await axiosClient.get(
      "/nodes/generate-papan-eksploitasi/" + nodeId
    );
    setIsLoading(false);
    const detail = getDetail(response[0]);
    setSelectedData(detail);
    setData(response);
  }, [nodeId]);

  useEffect(() => {
    getData();
  }, [getData]);
  useEffect(() => {
    // const scaleFactor = 0.5; // Adjust the scale factor as needed
    // const element = document.getElementById("thisone");
    // if (element) {
    //   element.style.transform = `scale(${scaleFactor})`;
    // }
  }, []);
  useEffect(() => {
    console.log(selectedData);
  }, [selectedData]);

  const handleSaluranChange = (dataDetail: any) => {
    const detail = getDetail(dataDetail);
    setSelectedData(detail);
  };

  const dateNow = moment(Date.now()).locale("id").format("DD MMMM YYYY");
  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  return (
    <div className="p-10 flex flex-col justify-center items-center overflow-auto">
      <div className="flex justify-end w-full">
        <div className="flex gap-2">
          <Button
            label="Kembali"
            className="mr-3 pr-3"
            onClick={() => {
              navigation.back();
            }}
          />
          <ReactToPrint
            //   pageStyle="@page { size: A4; margin: 0; } @media print { body { transform: scale(0.8); transform-origin: 0 0; } }"
            trigger={() => <Button label="Cetak" />}
            content={() => componentRef.current}
            // print={async (printIframe: HTMLIFrameElement) => {
            //   const document = printIframe.contentDocument;
            //   if (document) {
            //     const html = document.getElementsByTagName("html")[0];
            //     console.log(html);
            //     //   await html2pdf().from(html).save();
            //   }
            // }}
          />
        </div>
      </div>
      <div className="flex justify-center items-start pt-5 w-1/2 overflow-x-scroll mb-10">
        <div className="flex gap-2 w-full">
          {data.map((item: any, index: number) => (
            <Button
              key={`button` + index}
              label={Object.entries(item)[0][0]}
              onClick={() => {
                handleSaluranChange(item);
              }}
            />
          ))}
        </div>
      </div>
      <div
        id="thisone"
        // style={{ transform: "scale(0.8)" }}
        ref={componentRef}
        className="justify-center bg-white pb-3 w-[50%]"
      >
        <div className="relative">
          <div className="absolute pl-5 pt-5 flex flex-col justify-center items-center">
            <Image
              width={75}
              height={75}
              src={"/images/logo/logo_pupr.png"}
              alt="pupr"
              className="mb-3"
            />
            <Image
              width={75}
              height={75}
              src={"/images/logo/logo_bbws.png"}
              alt="pupr"
            />
          </div>
        </div>
        <div className="flex flex-col items-center h-full w-full pt-3 font-bold">
          <span className="text-[1.5rem] text-black-2">
            Papan Eksploitasi Tersier
          </span>
          <div className="flex justify-start mt-5 w-3/5 text-black-2 text-[0.75rem] font-semibold">
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="pr-5 ">Daerah Irigasi</td>
                  <td className="">:</td>
                  <td className="pl-3 ">Kedung Putri</td>
                </tr>
                <tr>
                  <td className="pr-5 ">Unit Pelaksanaan Daerah</td>
                  <td className="">:</td>
                  <td className="pl-3 ">UPTD PJI PURWOREJO</td>
                </tr>
                {selectedData?.areas?.length > 1 ? (
                  <Fragment>
                    <tr>
                      <td className="pr-5 ">Nama Titik Bangunan</td>
                      <td className="">:</td>
                      <td className="pl-3 ">{selectedData.titikBangunan}</td>
                    </tr>
                    <tr>
                      <td className="pr-5 ">Arah Saluran</td>
                      <td className="">:</td>
                      <td className="pl-3 ">{selectedData.arahSaluran}</td>
                    </tr>
                  </Fragment>
                ) : (
                  <tr>
                    <td className="pr-5 ">Nama Petak Tersier</td>
                    <td className="">:</td>
                    <td className="pl-3 ">
                      {selectedData.areas?.length > 0
                        ? selectedData.areas[0]?.name
                        : ""}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="pr-5 ">Luas Sawah Irigasi (ha)</td>
                  <td className="">:</td>
                  <td className="pl-3 ">
                    {selectedData.totalArea?.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-2 text-black-2 text-[0.75rem] font-semibold w-full">
            <table className="table-auto w-3/5">
              <thead>
                <tr>
                  <th className="border-2 p-1">Periode Pemberian Air</th>
                  <th className="border-2 p-1">Usulan Luas Tanam (Ha)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td className="border-x-2 p-1">- Padi</td>
                  <td className="border-x-2 p-1"></td>
                </tr>
                <tr className="">
                  <td className="border-x-2 p-1">- Palawija</td>
                  <td className="border-x-2 p-1"></td>
                </tr>
                <tr className="">
                  <td className="border-x-2 p-1">- Tebu</td>
                  <td className="border-x-2 p-1"></td>
                </tr>
                <tr className="">
                  <td className="border-x-2 p-1">- Bero</td>
                  <td className="border-x-2 p-1"></td>
                </tr>
                <tr className="border-2">
                  <td className="border-x-2 p-1">Jumlah</td>
                  <td className="border-x-2 p-1"></td>
                </tr>
                <tr className="border-2 h-5">
                  <td className="border-x-2 p-1"></td>
                  <td className="border-x-2 p-1"></td>
                </tr>
                <tr className="border-2">
                  <td className="border-x-2 p-1">Jumlah Kebutuhan Air</td>
                  <td className="border-x-2 p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-2 w-9/12 text-black-2 text-[0.75rem] font-semibold">
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className=" pr-5">Faktor K ditetapkan</td>
                  <td>:</td>
                  <td className="pl-3 pr-10">1,00</td>
                  <td className=" pr-5 ">Debit Harus Dialirkan (m3/det)</td>
                  <td>:</td>
                  <td className="pl-3 ">0,00</td>
                </tr>
                <tr>
                  <td className="pr-5 ">Debit Kenyataan H (cm)</td>
                  <td>:</td>
                  <td className="pl-3  pr-10">60</td>
                  <td className="pl-3 ">Q (m3/det)</td>
                  <td>:</td>
                  <td className="pl-3">40,71</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 mt-3 text-black-2 text-[0.75rem] font-semibold w-full">
            <div className="flex justify-end w-20">
              {/* <QRCode value={"qrValue"} /> */}
            </div>
            <div>
              <table className="table-auto">
                <tbody>
                  <tr>
                    <td className="pr-5 py-1">Tanggal</td>
                    <td className="py-1">:</td>
                    <td className="pl-3 py-1">{dateNow}</td>
                  </tr>
                  <tr>
                    <td className="pr-5 py-1">Mantri Pengairan</td>
                    <td className="py-1">:</td>
                    <td className="pl-3 py-1">Doni</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CetakPapanEksploitasi;
