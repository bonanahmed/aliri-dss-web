/* eslint-disable @next/next/no-img-element */
"use client";
import Button from "@/components/Buttons/Buttons";
import Loader from "@/components/common/Loader";
import axiosClient from "@/services";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactToPrint from "react-to-print";
require("moment/locale/id");
import Select from "react-select";
import QRCodePapanEksploitasi from "@/components/QRCodePapanEksploitasi/QRCodePapanEksploitasi";
import Table from "@/components/Tables/Table";
import getFieldNameFromArray from "@/utils/getFieldNameFromArray";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import Modal from "@/components/Modals/Modals";
import TextInput from "@/components/Input/TextInput";
import { createData, getData, getOptions } from "@/services/base.service";
import { FilterIcon } from "@/public/images/icon/icon";
import formDataToObject from "@/utils/formDataToObject";
import { convertPhoneNumberFormat } from "@/utils/convertPhoneNumberFormat";
import { useSelector } from "react-redux";
import DateRangePickerInput from "@/components/Input/DateRangePicker";
import DropDownInput from "@/components/Input/DropDownInput";

interface FilterType {
  startDate?: Date;
  endDate?: Date;
  withDate?: boolean;
}

const PapanEksploitasi = () => {
  const searchParams = useSearchParams();
  const nodeId = searchParams.get("nodeId");
  const componentRef = useRef<any>();
  const navigation = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [arahSaluran, setArahSaluran] = useState<any>([]);
  const [dataDetail, setDataDetail] = useState<any>({});
  const [selectedSaluran, setSelectedSaluran] = useState<string>("");
  const [ratingCurveTable, setRatingCurveTable] = useState<any[]>([]);

  const [debitKetersediaan, setDebitKetersediaan] = useState<any>();

  const { authenticated } = useSelector((state: any) => state.global);

  const countingKFactor = (qTersedia: number, qKebutuhan: number) => {
    let k = qTersedia / qKebutuhan;
    let qAlir: any = "gilir";
    if (k >= 1) {
      qAlir = qKebutuhan?.toFixed(2) ?? 0;
      k = 1;
    } else if (k > 0.8 && k < 1) qAlir = (qKebutuhan * k).toFixed(2);
    if (k == Infinity) k = 0;
    return {
      k: isNaN(k) ? 0 : k,
      qAlir,
    };
  };

  const classifiedPolaTanamArea = (polaTanam: any[]) => {
    let returnData: any = {};
    let total_luas_lahan = 0;
    for (const pola of polaTanam) {
      const plantName = pola.plant_type + " " + `(${pola.growth_time})`;
      total_luas_lahan += pola.raw_material_area_planted;
      returnData[plantName] = {
        luas_area:
          (returnData[plantName]?.luas_area ?? 0) +
          pola.raw_material_area_planted,
      };
    }
    return returnData;
  };

  // useEffect(() => {
  //   console.log("Debit ketersediaan", debitKetersediaan);
  // }, [debitKetersediaan]);

  const calculatePolaTanamAreaTotal = (polaTanam: any[]) => {
    let total_luas_lahan = 0;
    let total_debit = 0;
    for (const pola of polaTanam) {
      total_luas_lahan += pola.raw_material_area_planted;
      total_debit += pola.water_flow;
    }
    return {
      total_luas_lahan: isNaN(total_luas_lahan) ? 0 : total_luas_lahan,
      total_debit: isNaN(total_debit) ? 0 : total_debit,
    };
  };

  const checkIsFormFilledByJuru = (polaTanam: any[], type: string) => {
    let dataFilled = [];
    for (const pola of polaTanam) {
      dataFilled.push(pola.type);
    }
    if (dataFilled.includes("actual")) return "Juru Telah Mengisi " + type;
    else return "Juru Tidak Mengisi " + type;
  };

  const [dateData, setDateData] = useState<string>("");
  const [modalFilter, setModalFilter] = useState(false);
  const filterFormRef = useRef<HTMLFormElement>(null);
  const handleFilter = async (e: FormEvent) => {
    e.preventDefault();
    if (!filterFormRef.current) return;
    const formData = formDataToObject(new FormData(filterFormRef.current));
    setDateData(formData.dateData);
    setModalFilter(false);
  };

  const handleGetData = useCallback(async () => {
    setIsLoading(true);
    if (nodeId) {
      let query = "";
      if (dateData) query += "?date=" + dateData;

      const response: any = await axiosClient.get(
        "/nodes/calculate-flow/" + nodeId + query
      );
      setDataDetail(response);
      setArahSaluran(Object.keys(response.direction));
      setSelectedSaluran(Object.keys(response.direction)[0]);
      setRatingCurveTable(response.rating_curve_table);
    }
    setIsLoading(false);
  }, [nodeId, dateData]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const [nodeDatas, setNodeDatas] = useState([]);
  useEffect(() => {
    getOptions("/nodes/public/list", setNodeDatas, { isDropDown: true }, {});
  }, []);

  const handleSaluranChange = (dataDetail: any) => {
    setSelectedSaluran(dataDetail);
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

  // MODAL
  const [modaInputAktual, setModalInputAktual] = useState(false);
  const [inputDebitAktual, setInputDebitAktual] = useState<string>("");
  const [inputLevelAktual, setInputLevelAktual] = useState<string>("");
  // const [sensorType, setSensorType] = useState<string>("");
  // useEffect(() => {
  //   if (sensorType) {
  //     setModalInputAktual(true);
  //   } else {
  //     setModalInputAktual(false);
  //   }
  // }, [sensorType]);
  const updateDataAktual = async () => {
    const body = {
      // sensor_name:
      //   capitalizeFirstLetter(sensorType) + " Arah " + selectedSaluran,
      // sensor_type: sensorType,
      // sensor_value: inputDebitAktual ?? "0",
      // operation_type: "read",
      direction_line: dataDetail.direction?.[selectedSaluran]?.line_id,
      node_id: nodeId,

      actual_flow_value: inputDebitAktual ?? "0",
      actual_level_value: inputLevelAktual ?? "0",
      dataFilter: dataFilter,
    };

    // setSensorType("");
    // await createData("/nodes/data-sensor", body);
    await createData("/nodes/actual-flow", body);
    setModalInputAktual(false);
    setInputDebitAktual("");
    setInputLevelAktual("");
    handleGetDataAktual();
  };

  const [dataAktual, setDataAktual] = useState<any>();
  const [levelKenyataanSensor, setLevelAirKenyataanSensor] = useState<any>();
  const [debitKenyataanSensor, setDebitKenyataanSensor] = useState<any>();

  // useEffect(() => {
  //   if (dataAktual) {
  //     setDebitKenyataanSensor(dataAktual.actual_flow_value);
  //     setLevelAirKenyataanSensor(dataAktual.actual_level_value);
  //   }
  // }, [dataAktual]);

  const handleGetDataAktual = useCallback(async () => {
    if (nodeId && selectedSaluran) {
      await getData(
        "/nodes/actual-flow",
        `${nodeId}/${dataDetail?.direction?.[selectedSaluran]?.line_id}`,
        setDataAktual,
        {
          date: dateData,
        }
      );
      await getData(
        "/nodes/data-sensor",
        `${nodeId}/${dataDetail?.direction?.[selectedSaluran]?.line_id}`,
        setDebitKenyataanSensor,
        {
          sensor_type: "debit",
        }
      );
      await getData(
        "/nodes/data-sensor",
        `${nodeId}/${dataDetail?.direction?.[selectedSaluran]?.line_id}`,
        setLevelAirKenyataanSensor,
        {
          sensor_type: "level",
        }
      );
      await getData(
        "/areas/data-sensor",
        `${dataDetail.area_id}`,
        setDebitKetersediaan,
        {
          sensor_type: "debit",
        }
      );
    }
  }, [nodeId, selectedSaluran, dataDetail, dateData]);

  useEffect(() => {
    handleGetDataAktual();
  }, [handleGetDataAktual]);

  const [dataFilter, setFilter] = useState<FilterType>({});

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    if (key === "withDate") {
      setFilter((prev) => ({ ...prev, [key]: value === "true" }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-screen">
        <Loader />
      </div>
    );
  return (
    <div
      className={`${
        ratingCurveTable && ratingCurveTable.length > 0 ? "h-full" : "h-screen"
      } w-screen bg-[#F9F9F9]`}
    >
      <div className="p-10 flex flex-col justify-center items-center overflow-auto  rounded-xl">
        <div className="flex justify-between w-full pb-5">
          <div className="flex items-center gap-3">
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
            <button
              className="bg-transparent flex gap-3"
              onClick={() => {
                setModalFilter(true);
              }}
            >
              <FilterIcon />
              <span className="font-semibold">Pilih Tanggal</span>
            </button>
          </div>
          <div className="flex gap-2">
            {dataDetail.direction?.[selectedSaluran].nama_area && (
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
            {authenticated !== "null" && authenticated && nodeId && (
              <DropdownButton
                className="p-3"
                style={{
                  backgroundColor: "#1F3368",
                  color: "white",
                }}
                label="Aksi Lainnya"
                options={[
                  // {
                  //   label: "Update Debit Aktual Saluran",
                  //   action: (e: any) => {
                  //     setSensorType("debit");
                  //   },
                  // },
                  // {
                  //   label: "Update Level Aktual Saluran",
                  //   action: (e: any) => {
                  //     setSensorType("level");
                  //   },
                  // },
                  {
                    label: "Update Data Kenyataan",
                    action: (e: any) => {
                      // setModalInputAktual(true);
                      setModalInputAktual(true);
                    },
                  },
                ]}
              />
            )}
          </div>
        </div>
        <div className="border-b-[1px] w-full border-graydark"></div>
        {nodeId ? (
          <Fragment>
            {currentMenu === "Papan Eksploitasi Tersier" ? (
              <>
                <div className="flex justify-center items-start pt-5 w-full overflow-x-scroll no-scrollbar mb-10">
                  <div className="flex gap-2 w-full">
                    {arahSaluran.map((item: any, index: number) => (
                      <Button
                        color={selectedSaluran !== item ? "text-[#7E8299]" : ""}
                        key={`button` + item + index}
                        label={item}
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
                          {!dataDetail?.direction?.[selectedSaluran]
                            ?.nama_area ? (
                            <Fragment>
                              <div className="w-36">
                                {"Nama Titik Bangunan"}
                              </div>
                              <div>:</div>
                              <div className="ml-3">{dataDetail.name}</div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div className="w-36">{"Nama Petak Tersier"}</div>
                              <div>:</div>
                              <div className="ml-3">
                                {
                                  dataDetail?.direction?.[selectedSaluran]
                                    ?.nama_area
                                }
                              </div>
                            </Fragment>
                          )}
                        </div>
                        <div className="flex flex-row justify-end">
                          <div className="mr-3">Luas Sawah Irigasi (ha)</div>
                          <div>:</div>
                          <div className="ml-3 w-36">
                            {dataDetail?.direction?.[
                              selectedSaluran
                            ]?.luas_area?.toFixed(2)}
                          </div>
                        </div>
                        {/* <div className="flex flex-row justify-start">
                          <div className="mr-3">
                            Debit Perintah ke Bendung (liter/detik)
                          </div>
                          <div>:</div>
                          <div className="ml-3 w-36">
                            {dataDetail?.total_debit_kebutuhan?.toFixed(2)}
                          </div>
                        </div> */}
                        <div className="flex flex-row justify-start">
                          {!dataDetail?.direction?.[selectedSaluran]
                            ?.nama_area && (
                            <Fragment>
                              <div className="w-36">{"Arah Saluran"}</div>
                              <div>:</div>
                              <div className="ml-3">{selectedSaluran}</div>
                            </Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-2 text-[0.75rem] font-semibold w-full px-5 rounded-xl">
                      <table className="table-auto w-full rounded-xl">
                        <thead>
                          <tr className="text-white">
                            <th className="border-r-2 border-white p-2 rounded-tl-xl bg-primary">
                              {/* Periode Pemberian Air */}
                              Jenis Tanaman
                            </th>
                            <th className="border-l-2 border-white p-2 rounded-tr-xl bg-[#1F3368CC]">
                              Usulan Luas Tanam (Ha)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(
                            classifiedPolaTanamArea(
                              dataDetail.direction?.[selectedSaluran]
                                .pola_tanam ?? []
                            ) ?? {}
                          ).map(([key, value]: any, index: number) => (
                            <tr key={`areaDetail${key ?? ""}`} className="">
                              <td
                                className={`border-x-2 border-b-2 border-white p-1 ${
                                  index % 2 === 0
                                    ? "bg-[#E5EAEE]"
                                    : "bg-[#F3F6F9]"
                                }`}
                              >
                                - {key ?? ""}
                              </td>
                              <td
                                className={`border-x-2 border-b-2 border-white p-1 ${
                                  index % 2 === 0
                                    ? "bg-[#E5EAEE]"
                                    : "bg-[#F3F6F9]"
                                }`}
                              >
                                {isNaN(value?.luas_area)
                                  ? "Luas Lahan Ditanami Belum Diinput"
                                  : value?.luas_area?.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-2 h-5 border-white bg-white">
                            <td className="border-x-2 p-1 border-white"></td>
                            <td className="border-x-2 p-1 border-white"></td>
                          </tr>
                          <tr className="border-2 border-white">
                            <td className="border-x-2 p-1 border-white bg-[#E5EAEE]">
                              Jumlah
                            </td>
                            <td className="border-x-2 p-1 border-white bg-[#E5EAEE]">
                              {calculatePolaTanamAreaTotal(
                                dataDetail.direction?.[selectedSaluran]
                                  ?.pola_tanam ?? []
                              ).total_luas_lahan.toFixed(2)}
                            </td>
                          </tr>

                          <tr className="border-2 border-white">
                            <td className="border-x-2 p-1 border-white bg-[#F3F6F9]">
                              Jumlah Kebutuhan Air
                            </td>
                            <td className="border-x-2 p-1 border-white bg-[#F3F6F9]">
                              {dataDetail.direction?.[
                                selectedSaluran
                              ]?.debit_kebutuhan?.toFixed(2)}{" "}
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
                              {debitKetersediaan
                                ? countingKFactor(
                                    parseFloat(debitKetersediaan.sensor_value),
                                    dataDetail.direction?.[selectedSaluran]
                                      ?.debit_kebutuhan
                                  ).k.toFixed(2)
                                : "-"}
                            </td>
                            <td className=" pr-5 ">
                              Debit Harus Dialirkan (liter/detik)
                            </td>
                            <td>:</td>
                            <td className="pl-3 ">
                              {debitKetersediaan
                                ? countingKFactor(
                                    parseFloat(debitKetersediaan.sensor_value),
                                    dataDetail.direction?.[selectedSaluran]
                                      ?.debit_kebutuhan
                                  ).qAlir
                                : "-"}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Level Air Aktual H (m)</td>
                            <td></td>
                            <td className="pl-3  pr-10"></td>
                            <td className="pl-3 ">
                              Debit Air Kenyataan Q (liter/detik)
                            </td>
                            <td>:</td>
                            <td className="pl-3"></td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">- Pengamatan Visual</td>
                            <td>:</td>
                            <td className="pl-3  pr-10">
                              {dataAktual?.actual_level_value ?? "-"}
                            </td>
                            <td className="pl-3 ">- Pengamatan Visual</td>
                            <td>:</td>
                            <td className="pl-3">
                              {/* {debitKenyataanSensor??0 ?? "-"} */}
                              {dataAktual?.actual_flow_value ?? "-"}
                            </td>
                          </tr>
                          {levelKenyataanSensor && debitKenyataanSensor && (
                            <tr>
                              <td className="pr-5 ">- SCADA</td>
                              <td>:</td>
                              <td className="pl-3  pr-10">
                                {levelKenyataanSensor?.sensor_value ?? "-"}
                              </td>
                              <td className="pl-3 ">- SCADA</td>
                              <td>:</td>
                              <td className="pl-3">
                                {/* {debitKenyataanSensor??0 ?? "-"} */}
                                {debitKenyataanSensor?.sensor_value ?? "-"}
                              </td>
                            </tr>
                          )}
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
                              <td className="pl-3 py-1">
                                {dateData
                                  ? moment(dateData)
                                      .locale("id")
                                      .format("DD MMMM YYYY")
                                  : dateNow}
                              </td>
                            </tr>
                            <tr>
                              <td className="pr-5 py-1">Kemantren</td>
                              <td className="py-1">:</td>
                              <td className="pl-3 py-1">
                                {
                                  dataDetail?.direction?.[selectedSaluran]
                                    ?.kemantren
                                }
                              </td>
                            </tr>
                            <tr>
                              <td className="pr-5 py-1">Mantri Pengairan</td>
                              <td className="py-1">:</td>
                              <td className="pl-3 py-1">
                                {dataDetail?.direction?.[selectedSaluran]?.juru}
                              </td>
                            </tr>
                            <tr>
                              <td className="pr-5 py-1">Nomor HP Juru</td>
                              <td className="py-1">:</td>
                              <td className="pl-3 py-1">
                                <a
                                  href={`https://wa.me/${convertPhoneNumberFormat(
                                    dataDetail?.direction?.[selectedSaluran]
                                      ?.juru_phone ?? ""
                                  )}`}
                                  target="_blank"
                                >
                                  {
                                    dataDetail?.direction?.[selectedSaluran]
                                      ?.juru_phone
                                  }
                                </a>
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
                  nodeName={dataDetail.name}
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
                              {
                                dataDetail?.direction?.[selectedSaluran]
                                  ?.nama_area
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Nama Juru</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {dataDetail?.direction?.[selectedSaluran]?.juru}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Luas Sawah Irigasi (ha)</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {
                                dataDetail?.direction?.[selectedSaluran]
                                  ?.luas_area
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Jenis Tanaman</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {Object.entries(
                                classifiedPolaTanamArea(
                                  dataDetail.direction?.[selectedSaluran]
                                    .pola_tanam ?? []
                                ) ?? {}
                              ).map(([key, value]: any) => (
                                <span key={`areaDetail${key ?? ""}`}>
                                  {key},
                                </span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Luas Tanam</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {Object.entries(
                                classifiedPolaTanamArea(
                                  dataDetail.direction?.[selectedSaluran]
                                    .pola_tanam ?? []
                                ) ?? {}
                              ).map(([key, value]: any) => (
                                <span key={`areaDetail${key ?? ""}`}>
                                  {value?.luas_area?.toFixed(2)},{" "}
                                </span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Jumlah Kebutuhan Air</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {calculatePolaTanamAreaTotal(
                                dataDetail.direction?.[selectedSaluran]
                                  ?.pola_tanam ?? []
                              ).total_debit.toFixed(2)}{" "}
                              liter/detik
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Faktor K</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {countingKFactor(
                                dataDetail.direction?.[selectedSaluran]
                                  ?.debit_kebutuhan,
                                dataDetail.direction?.[selectedSaluran]
                                  ?.debit_kebutuhan
                              ).k.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Debit Rekomendasi</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {dataDetail.direction?.[
                                selectedSaluran
                              ]?.debit_kebutuhan?.toFixed(2)}{" "}
                              liter/detik
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Debit Kenyataan</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {debitKenyataanSensor ?? 0} liter/detik
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Rasio Pengaliran Debit</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {(
                                debitKenyataanSensor ??
                                0 /
                                  dataDetail.direction?.[selectedSaluran]
                                    ?.debit_kebutuhan
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
                              {/* Juru Tidak Mengisi Luas Tanam */}
                              {checkIsFormFilledByJuru(
                                dataDetail?.direction?.[selectedSaluran]
                                  ?.pola_tanam,
                                "Luas Tanam"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="pr-5 ">Jenis Tanaman</td>
                            <td className="">:</td>
                            <td className="pl-3 ">
                              {/* Juru Tidak Mengisi Jenis Tanaman */}
                              {checkIsFormFilledByJuru(
                                dataDetail?.direction?.[selectedSaluran]
                                  ?.pola_tanam,
                                "Jenis Tanam"
                              )}
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
      <Modal
        isOpen={modaInputAktual}
        onClose={() => {
          // setSensorType("");
          setModalInputAktual(false);
        }}
        // title={`Masukkan ${capitalizeFirstLetter(sensorType)} Aktual`}
        title={`Masukkan Data Arah ${selectedSaluran}`}
      >
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <TextInput
              label={"Debit Kenyataan"}
              type="number"
              value={inputDebitAktual}
              onChange={(e) => {
                setInputDebitAktual(e.target.value);
              }}
            />
            <TextInput
              label={"Level Air Kenyataan"}
              type="number"
              value={inputLevelAktual}
              onChange={(e) => {
                setInputLevelAktual(e.target.value);
              }}
            />
          </div>
          <div className="w-full xl:w-full mb-5">
            <DropDownInput
              label="Tanggal Pengisian"
              onChange={(e) => handleFilterChange("withDate", e.target.value)}
              value={dataFilter.withDate ? "true" : "false"}
              options={[
                { value: "false", label: "HARI INI" },
                { value: "true", label: "PILIH RENTANG TANGGAL" },
              ]}
            />
          </div>
          {dataFilter.withDate && (
            <div className="flex w-full xl:w-full">
              <DateRangePickerInput
                value={[
                  dataFilter.startDate || new Date(),
                  dataFilter.endDate || new Date(),
                ]}
                onChange={(start, end) => {
                  console.log(start, end);
                  handleFilterChange(
                    "startDate",
                    moment(start).format("YYYY-MM-DD")
                  );
                  handleFilterChange(
                    "endDate",
                    moment(end).format("YYYY-MM-DD")
                  );
                }}
              />
            </div>
          )}
          <hr />
          <div className="mt-5 flex justify-end">
            <Button
              label="Simpan"
              onClick={() => {
                updateDataAktual();
              }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalFilter}
        onClose={() => {
          setModalFilter(false);
        }}
        title={`Pilih Tanggal`}
      >
        <form ref={filterFormRef} onSubmit={handleFilter}>
          <div className="grid grid-cols-1 gap-3 mb-3">
            <TextInput name="dateData" type="date" />
          </div>
          <hr />
          <div className="mt-5 flex justify-end">
            <Button type="submit" label="Terapkan" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PapanEksploitasi;
