/* eslint-disable @next/next/no-img-element */
"use client";
import Button from "@/components/Buttons/Buttons";
import Loader from "@/components/common/Loader";
import axiosClient from "@/services";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
require("moment/locale/id");
import Select from "react-select";
import { getNodeDatas } from "@/services/master-data/node";
import QRCodePapanEksploitasi from "@/components/QRCodePapanEksploitasi/QRCodePapanEksploitasi";
import Table from "@/components/Tables/Table";
import getFieldNameFromArray from "@/utils/getFieldNameFromArray";

const PapanEksploitasi = () => {
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
    let plantDetail: any = {};
    let waterFlowPlan = 0;
    let kemantren = "";
    let juru = "";
    let totalAreaPlan = 0;
    let pasten: any = {};
    areas.forEach((area: any) => {
      totalArea += area.detail?.standard_area ?? 0;
      kemantren = kemantren ? kemantren : area.detail?.kemantren?.name;
      juru = juru ? juru : area.detail?.juru?.name;
      if (area.detail?.areaDetail) {
        const areaEntries: any = Object.entries(area.detail?.areaDetail);
        for (const [key, value] of areaEntries) {
          if (typeof value !== "number") {
            totalAreaPlan += value.total_area;
            plantDetail[key] =
              (plantDetail[key] ?? 0) +
              (parseFloat(value.total_area?.toFixed(2)) ?? 0);
            waterFlowPlan +=
              parseFloat(value.total_area?.toFixed(2)) * value.pasten;
            pasten[key] = value.pasten;
            // console.log(
            //   area.name,
            //   parseFloat(value.total_area?.toFixed(2)),
            //   value.pasten
            // );
            // totalAreaPlan += value.total_area;
            // plantDetail[key] =
            //   (plantDetail[key] ?? 0) +
            //   (parseFloat(value.total_area?.toFixed(2)) ?? 0);
            // waterFlowPlan +=
            //   parseFloat(value.total_area?.toFixed(2)) * value.pasten;
            // console.log(
            //   area.name,
            //   parseFloat(value.total_area?.toFixed(2)),
            //   value.pasten
            // );
          }
          // else {
          //   waterFlowPlan += value;
          // }
        }
      }
    });

    return {
      titikBangunan,
      totalArea,
      areas,
      arahSaluran,
      plantDetail,
      waterFlowPlan,
      totalAreaPlan,
      pasten,
      detail: {
        kemantren: kemantren,
        juru: juru,
      },
    };
  };

  const countingKFactor = (qTersedia: number, qKebutuhan: number) => {
    let k = qTersedia / qKebutuhan;
    let qAlir: any = "gilir";
    if (k >= 1) {
      qAlir = qKebutuhan.toFixed(2);
      k = 1;
    } else if (k > 0.8 && k < 1) qAlir = (qKebutuhan * k).toFixed(2);
    if (k == Infinity) k = 0;
    return {
      k,
      qAlir,
    };
  };

  const [data, setData] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<any>({});
  const [debitKetersediaan, setDebitKetersediaan] = useState<number>(0);
  const [ratingCurveTable, setRatingCurveTable] = useState<any[]>([]);
  const [tinggiDebitKenyataan, setTinggiDebitKenyataan] = useState<number>(0);
  const [debitKenyataan, setDebitKenyataan] = useState<number>(0);
  const getData = useCallback(async () => {
    setIsLoading(true);
    if (nodeId) {
      const response: any = await axiosClient.get(
        "/nodes/generate-papan-eksploitasi/" + nodeId
      );
      const detail = getDetail(response.papan_digital[0]);
      // console.log("INI RESPONSE", response);
      setSelectedData(detail);
      setData(response.papan_digital);
      setDebitKetersediaan(response.debit_ketersediaan);
      setRatingCurveTable(response.rating_curve_table);
      setTinggiDebitKenyataan(response.realtime["B_KP.6.1_LEVEL"]);
      setDebitKenyataan(response.realtime["B_KP.6.1_DEBIT"]);
    }
    setIsLoading(false);
  }, [nodeId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const [nodeDatas, setNodeDatas] = useState([]);
  useEffect(() => {
    getNodeDatas(setNodeDatas);
  }, []);

  const handleSaluranChange = (dataDetail: any) => {
    const detail = getDetail(dataDetail);
    setSelectedData(detail);
  };

  const [currentMenu, setCurrentMenu] = useState<string>(
    "Papan Eksploitasi Tersier"
  );
  const dateNow = moment(Date.now()).locale("id").format("DD MMMM YYYY");

  const [selectedOption, setSelectedOption] = useState<any>(null);

  const handleChange = (selectedOption: any) => {
    navigation.push("/papan-eksploitasi?nodeId=" + selectedOption.value);
    setSelectedOption(selectedOption);
  };

  if (isLoading)
    return (
      <div className="h-screen w-screen">
        <Loader />
      </div>
    );
  return (
    // <Modal
    //   isOpen={isModalMonitoringOpen}
    //   onClose={closeModalMonitoring}
    //   title="Data Monitoring"
    // >
    <div
      className={`${
        ratingCurveTable && ratingCurveTable.length > 0 ? "h-full" : "h-screen"
      } w-screen bg-[#F9F9F9]`}
    >
      <div className="p-10 flex flex-col justify-center items-center overflow-auto  rounded-xl">
        <div className="flex justify-between w-full pb-5">
          <div className="flex items-center">
            <div className="flex gap-3">
              <div className="w-67 z-1">
                <Select
                  value={selectedOption}
                  onChange={handleChange}
                  options={nodeDatas}
                  isSearchable={true}
                  placeholder="Pilih Titik Bangunan"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedData?.areas?.length === 1 && (
              <Button
                label={
                  currentMenu === "Papan Eksploitasi Tersier"
                    ? "Ke Lembar Evaluasi"
                    : "Ke Papan Eksploitasi Tersier"
                }
                className="mr-3 pr-3"
                onClick={() => {
                  if (currentMenu === "Papan Eksploitasi Tersier")
                    setCurrentMenu("Lembar Evaluasi Pengaliran");
                  else setCurrentMenu("Papan Eksploitasi Tersier");
                }}
                color="bg-[#D7F9EF] text-[#0BB783]"
              />
            )}

            {currentMenu !== "Cetak QR Code" ? (
              <Button
                label={"Cetak QR Code"}
                className="mr-3 pr-3"
                onClick={() => {
                  setCurrentMenu("Cetak QR Code");
                }}
                color="bg-[#EEE5FF] text-[#8950FC]"
              />
            ) : (
              <ReactToPrint
                //   pageStyle="@page { size: A4; margin: 0; } @media print { body { transform: scale(0.8); transform-origin: 0 0; } }"
                trigger={() => (
                  <Button label="Print" color="bg-[#EEE5FF] text-[#8950FC]" />
                )}
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
            )}
            {/* <Button
              label={"Tabel Kurva Debit"}
              className="mr-3 pr-3"
              onClick={() => {
                setCurrentMenu("Tabel Kurva Debit");
              }}
              color="bg-[#EEE5FF] text-[#8950FC]"
            /> */}
            <Button
              color="bg-[#3E97FF] text-white"
              label="Kembali"
              className="mr-3 pr-3"
              onClick={() => {
                navigation.replace("/");
              }}
            />
          </div>
        </div>
        <div className="border-b-[1px] w-full border-graydark"></div>

        {nodeId ? (
          <Fragment>
            {currentMenu === "Papan Eksploitasi Tersier" ? (
              <>
                <div className="flex justify-center items-start pt-5 w-full overflow-x-scroll no-scrollbar mb-10">
                  <div className="flex gap-2 w-full">
                    {data.map((item: any, index: number) => (
                      <Button
                        color={
                          Object.entries(selectedData)[3][1] !==
                          Object.entries(item)[0][0]
                            ? "text-[#7E8299]"
                            : ""
                        }
                        key={`button` + index}
                        label={Object.entries(item)[0][0]}
                        // label={
                        //   `${Object.entries(selectedData)[3][1]}` +
                        //   `${Object.entries(item)[0][0]}`
                        // }
                        onClick={() => {
                          handleSaluranChange(item);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div
                  id="papan-eksploitasi"
                  // style={{ transform: "scale(0.8)" }}
                  // ref={componentRef}
                  className="justify-center border pb-3 w-full rounded-xl"
                >
                  <div className="flex flex-col items-center rounded-xl font-bold">
                    <div className="relative grid grid-cols-3 bg-primary h-full w-full py-3 rounded-t-xl items-center">
                      <div className="absolute -z-0 w-full h-full">
                        <img
                          className="h-full w-full object-cover opacity-10"
                          src={"/images/background/bg-batik-pu.png"}
                          alt="Logo"
                        />
                      </div>
                      <div />
                      <span className="text-[1.5rem] text-white text-center  z-1">
                        Papan Eksploitasi Digital
                      </span>
                      <div className="flex justify-end items-center mr-5  z-1">
                        <Image
                          width={75}
                          height={75}
                          src={"/images/logo/logopupr.png"}
                          alt="pupr"
                          className="mb-3"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col mt-5 mb-5 px-5 w-full text-black-2 text-[0.75rem] font-semibold">
                      <div className="grid grid-cols-2 ">
                        <div className="flex flex-row justify-start">
                          <div className="w-36">Daerah Irigasi</div>
                          <div>:</div>
                          <div className="ml-3">Kedung Putri</div>
                        </div>
                        <div className="flex flex-row justify-end">
                          <div className="mr-3">Unit Pelaksanaan Daerah</div>
                          <div>:</div>
                          <div className="ml-3 w-36">UPTD PJI PURWOREJO</div>
                        </div>
                        <div className="flex flex-row justify-start">
                          {selectedData?.areas?.length > 1 ? (
                            <Fragment>
                              <div className="w-36">
                                {"Nama Titik Bangunan"}
                              </div>
                              <div>:</div>
                              <div className="ml-3">
                                {selectedData.titikBangunan}
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div className="w-36">{"Nama Petak Tersier"}</div>
                              <div>:</div>
                              <div className="ml-3">
                                {selectedData.areas?.length > 0
                                  ? selectedData.areas[0]?.name
                                  : ""}
                              </div>
                            </Fragment>
                          )}
                        </div>
                        <div className="flex flex-row justify-end">
                          <div className="mr-3">Luas Sawah Irigasi (ha)</div>
                          <div>:</div>
                          <div className="ml-3 w-36">
                            {selectedData.totalArea?.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex flex-row justify-start">
                          {selectedData?.areas?.length > 1 && (
                            <Fragment>
                              <div className="w-36">{"Arah Saluran"}</div>
                              <div>:</div>
                              <div className="ml-3">
                                {selectedData.arahSaluran}
                              </div>
                            </Fragment>
                          )}
                        </div>
                      </div>
                      {/* <table className="w-full table-auto border-collapse border border-gray-300">
                  <tbody>
                    <tr className="w-full border">
                      <td className="w-1/2 border">
                        <td className="pr-5">Daerah Irigasi</td>
                        <td>:</td>
                        <td className="pl-3">Kedung Putri</td>
                      </td>
                      <td className="w-1/2 border text-right">
                        <td className="pr-5 ">Unit Pelaksanaan Daerah</td>
                        <td className="">:</td>
                        <td className="pl-3 ">UPTD PJI PURWOREJO</td>
                      </td>
                    </tr>

                    {selectedData?.areas?.length > 1 ? (
                      <Fragment>
                        <tr>
                          <td className="pr-5 ">Nama Titik Bangunan</td>
                          <td className="">:</td>
                          <td className="pl-3 ">
                            {selectedData.titikBangunan}
                          </td>
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
                </table> */}
                    </div>
                    <div className="flex justify-center mt-2 text-[0.75rem] font-semibold w-full px-5 rounded-xl">
                      <table className="table-auto w-full rounded-xl">
                        <thead>
                          <tr className="text-white">
                            <th className="border-r-2 border-white p-2 rounded-tl-xl bg-primary">
                              Periode Pemberian Air
                            </th>
                            <th className="border-l-2 border-white p-2 rounded-tr-xl bg-[#1F3368CC]">
                              Usulan Luas Tanam (Ha)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(selectedData?.plantDetail ?? {}).map(
                            (item: any, index: number) => (
                              <tr
                                key={`areaDetail${item[0] ?? ""}`}
                                className=""
                              >
                                <td
                                  className={`border-x-2 border-b-2 border-white p-1 ${
                                    index % 2 === 0
                                      ? "bg-[#E5EAEE]"
                                      : "bg-[#F3F6F9]"
                                  }`}
                                >
                                  - {item[0] ?? ""}
                                </td>
                                <td
                                  className={`border-x-2 border-b-2 border-white p-1 ${
                                    index % 2 === 0
                                      ? "bg-[#E5EAEE]"
                                      : "bg-[#F3F6F9]"
                                  }`}
                                >
                                  {item[1].toFixed(2)}
                                </td>
                              </tr>
                            )
                          )}
                          <tr className="border-2 h-5 border-white bg-white">
                            <td className="border-x-2 p-1 border-white"></td>
                            <td className="border-x-2 p-1 border-white"></td>
                          </tr>
                          <tr className="border-2 border-white">
                            <td className="border-x-2 p-1 border-white bg-[#E5EAEE]">
                              Jumlah
                            </td>
                            <td className="border-x-2 p-1 border-white bg-[#E5EAEE]">
                              {selectedData.totalAreaPlan?.toFixed(2)}
                            </td>
                          </tr>

                          <tr className="border-2 border-white">
                            <td className="border-x-2 p-1 border-white bg-[#F3F6F9]">
                              Jumlah Kebutuhan Air
                            </td>
                            <td className="border-x-2 p-1 border-white bg-[#F3F6F9]">
                              {selectedData.waterFlowPlan?.toFixed(2)}{" "}
                              liter/detik
                            </td>
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
                            <td className="pl-3 pr-10">
                              {countingKFactor(
                                debitKetersediaan,
                                selectedData?.waterFlowPlan ?? 1
                              ).k.toFixed(2)}
                            </td>
                            <td className=" pr-5 ">
                              Debit Harus Dialirkan (liter/detik)
                            </td>
                            <td>:</td>
                            <td className="pl-3 ">
                              {
                                countingKFactor(
                                  debitKetersediaan,
                                  selectedData?.waterFlowPlan
                                ).qAlir
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Debit Kenyataan H (cm)</td>
                            <td>:</td>
                            <td className="pl-3  pr-10">
                              {tinggiDebitKenyataan}
                            </td>
                            <td className="pl-3 ">Q (liter/detik)</td>
                            <td>:</td>
                            <td className="pl-3">{debitKenyataan}</td>
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
                              <td className="pr-5 py-1">Kemantren</td>
                              <td className="py-1">:</td>
                              <td className="pl-3 py-1">
                                {selectedData.detail?.kemantren}
                              </td>
                            </tr>
                            <tr>
                              <td className="pr-5 py-1">Mantri Pengairan</td>
                              <td className="py-1">:</td>
                              <td className="pl-3 py-1">
                                {" "}
                                {selectedData.detail?.juru}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {ratingCurveTable && ratingCurveTable.length > 0 && (
                  <div className="flex flex-col mt-10 ">
                    <span className="text-[1.5rem] font-bold text-black text-center  z-1">
                      Tabel Kurva Debit
                    </span>
                    <div className="w-full mt-5 flex justify-center">
                      <Table
                        values={ratingCurveTable ?? []}
                        scopedSlots={{}}
                        fields={getFieldNameFromArray(ratingCurveTable ?? [])}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : currentMenu === "Cetak QR Code" ? (
              <div
                className="flex justify-center text-center"
                id="qr-code"
                ref={componentRef}
              >
                <QRCodePapanEksploitasi
                  nodeId={nodeId}
                  nodeName={selectedData.titikBangunan}
                />
              </div>
            ) : (
              <>
                <div
                  id="lembar-evaluasi-pengairan"
                  // ref={componentRef}
                  className="flex justify-start bg-white p-5 w-fit mt-5"
                >
                  <div className="flex flex-col">
                    <div className="flex justify-start mt-5 w-full h-[75vh] text-black-2 text-[0.75rem] font-semibold">
                      <table className="table-auto">
                        <tbody>
                          <tr>
                            <td className="py-5">
                              <span className="text-[1.5rem] text-black-2 text-start">
                                Lembar Evaluasi Pengairan
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Nama Petak Tersier</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {selectedData.areas[0].name}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Nama Juru</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {selectedData.detail.juru}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Luas Sawah Irigasi (ha)</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {selectedData.totalArea?.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Jenis Tanaman</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {Object.entries(
                                selectedData?.plantDetail ?? {}
                              ).map((item: any) => (
                                <span key={`areaDetail${item[0] ?? ""}`}>
                                  {item[0]},
                                </span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Luas Tanam</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {Object.entries(
                                selectedData?.plantDetail ?? {}
                              ).map((item: any) => (
                                <span key={`areaDetail${item[0] ?? ""}`}>
                                  {item[1].toFixed(2)},{" "}
                                </span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Jumlah Kebutuhan Air</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {selectedData.waterFlowPlan?.toFixed(2)}{" "}
                              liter/detik
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Faktor K</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {countingKFactor(
                                debitKetersediaan,
                                selectedData?.waterFlowPlan ?? 1
                              ).k.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Debit Rekomendasi</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {selectedData.waterFlowPlan?.toFixed(2)}{" "}
                              liter/detik
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Debit Kenyataan</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {debitKetersediaan} liter/detik
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Rasio Pengaliran Debit</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {(
                                debitKetersediaan / selectedData.waterFlowPlan
                              ).toFixed(2)}{" "}
                              %
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Evaluasi Terhadap Banjir</td>
                            <td className="">:</td>
                            <td className="pl-3 ">Aman</td>
                          </tr>
                          <tr>
                            <td className="py-5">
                              <span className="text-[1.5rem] text-black-2 text-start">
                                Pengisian Blanko oleh Juru
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Luas Tanam</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              Juru Tidak Mengisi Luas Tanam
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Jenis Tanaman</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              Juru Tidak Mengisi Jenis Tanaman
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Fragment>
        ) : (
          <div className="w-full h-[75vh]">
            {currentMenu === "Cetak QR Code" && (
              <div
                className="flex justify-center text-center"
                id="qr-code"
                ref={componentRef}
              >
                <div className="flex flex-col">
                  {nodeDatas.map((node: any, indexNode: number) => (
                    <div key={indexNode} className="mt-3">
                      <QRCodePapanEksploitasi
                        nodeId={node.value}
                        nodeName={node.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    // </Modal>
  );
};

export default PapanEksploitasi;
