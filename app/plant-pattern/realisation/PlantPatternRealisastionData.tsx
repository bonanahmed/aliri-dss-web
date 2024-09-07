"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import Modal from "@/components/Modals/Modals";
import Pagination from "@/components/Pagination/Pagination";
import { AirWaveIcon, InputIcon, SaveIcon } from "@/public/images/icon/icon";
import { getOptions } from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import {
  AreaData,
  PlantPattern,
  PastenData,
  TimeSeries,
} from "@/types/plant-pattern";
import convertToTwoDigitNumber from "@/utils/convertToTwoDigitNumber";
import {
  changeMonthToDate,
  getDaysInSelectedMonth,
} from "@/utils/dateUtilities";
import axios from "axios";
import moment from "moment";
import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PlantPatterRealisationProps {
  area_id: string;
  callBack?: () => void;
}

const PlantPatternRealisationData: React.FC<PlantPatterRealisationProps> = ({
  area_id,
  callBack,
}) => {
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 10),
    limit: 10,
  });
  const [timeRange, setTimeRange] = useState<string>("period");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment(new Date()).format("yyyy-MM")
  );
  const [timeListInCurrentMonth, setTimeSeriesInCurrentMonth] = useState<
    Array<TimeSeries>
  >([]);
  const [selectedPatternList, setSelectedPatternList] = useState<
    PlantPattern[] | null
  >(null);
  const [selectedPatternListIndex, setSelectedPatternListIndex] =
    useState<number>(0);

  const [selectedPasten, setSelectedPasten] = useState<PastenData | null>(null);
  const [pastenList, setPastenList] = useState<Array<PastenData>>([]);

  const [areaDataList, setAreaDataList] = useState<Array<AreaData>>([]);

  const [sekunderLineOptions, setSekunderLineOptions] = useState<any[]>([]);
  const [groupOptions, setGroupOptions] = useState<any[]>([]);

  const findDataPlantType = (code: string) => {
    return pastenList.find((pasten) => pasten.code === code);
  };

  // Load Data
  useEffect(() => {
    getOptions("/pastens", setPastenList, { isDropDown: false }, { area_id });
    getOptions(
      "/lines",
      setSekunderLineOptions,
      { isDropDown: true },
      {
        area_id,
        type: JSON.stringify({
          $ne: "tersier",
        }),
      }
    );
    getOptions("/groups", setGroupOptions, { isDropDown: true }, { area_id });
  }, [area_id]);

  const plantPatternOntheDate = (
    plant_patterns?: Array<PlantPattern>,
    list_date?: string[]
  ) => {
    return plant_patterns?.filter((plant_pattern) =>
      list_date?.includes(plant_pattern.date)
    );
  };
  const chooseBackgroundForTable = (color?: string) => {
    if (color)
      return {
        backgroundColor: color,
        color: "white",
      };
    return {};
  };
  const choosePastenColor = (color: string) => {
    if (color)
      return {
        backgroundColor: color,
        color: "white",
      };
    return {};
  };
  const onTableChange = (
    area: AreaData,
    list_date: string[],
    index: number
  ) => {
    if (selectedPasten) {
      if (
        plantPatternOntheDate(area?.plant_patterns, list_date)?.length !== 0
      ) {
        const plant_patterns = area?.plant_patterns?.filter((date_plant) => {
          return (
            list_date.includes(date_plant.date) &&
            selectedPasten.code === date_plant.code
          );
        });
        if (plant_patterns?.length !== 0) {
          const filter_plant_patterns = area?.plant_patterns?.filter(
            (date_plant) => {
              return (
                date_plant.code !== plant_patterns![0].code ||
                !list_date.includes(date_plant.date)
              );
            }
          );
          areaDataList[index].plant_patterns = filter_plant_patterns;
        } else {
          list_date.forEach((date) => {
            area?.plant_patterns?.push({
              date: date,
              ...selectedPasten,
            });
          });
          areaDataList[index].plant_patterns = area?.plant_patterns;
        }
      } else {
        list_date.forEach((date) => {
          area?.plant_patterns?.push({
            date: date,

            ...selectedPasten,
          });
        });
        areaDataList[index].plant_patterns = area?.plant_patterns;
      }
      setAreaDataList([...areaDataList]);
    } else {
      const foundData = plantPatternOntheDate(area?.plant_patterns, list_date);
      if (foundData?.length !== 0) {
        setSelectedPatternList(foundData!);
        setSelectedPatternListIndex(index);
        openModalPastenDetailOpen();
      }
    }
  };
  useEffect(() => {
    if (selectedPatternList) {
      let patternListDetailTemp = {};
      showOnlyDifferentValueFromArray("code", selectedPatternList!).forEach(
        (patternList: any) => {
          patternListDetailTemp = {
            ...patternListDetailTemp,
            [patternList.code]: {
              raw_area_planted: patternList.raw_material_area_planted ?? null,
              water_needed: patternList.raw_material_area_planted
                ? patternList.raw_material_area_planted * patternList.pasten
                : null,
            },
          };
        }
      );
      setPatternListDetail(patternListDetailTemp);
    } else {
      setPatternListDetail({});
    }
  }, [selectedPatternList]);

  const showOnlyDifferentValueFromArray = (
    keyName: string,
    data?: Array<any>
  ) => {
    const uniqueObjects = [];
    const seenValues = new Set();

    for (const obj of data ?? []) {
      if (!seenValues.has(obj[keyName])) {
        seenValues.add(obj[keyName]);
        uniqueObjects.push(obj);
      }
    }

    return uniqueObjects;
  };

  const totalActualWaterNeeded = (listData: Array<PlantPattern> | null) => {
    let countTotal = 0;
    listData?.forEach((dataUnit) => {
      countTotal += dataUnit.actual_water_needed ?? 0;
    });
    return isNaN(countTotal) ? 0 : countTotal;
  };

  // MODAL
  const [isModalPastenOpen, setIsModalPastenOpen] = useState(false);

  const openModalPasten = () => {
    setIsModalPastenOpen(true);
  };

  const closeModalPasten = () => {
    setIsModalPastenOpen(false);
  };

  const [isModalPlantPatternDetailOpen, setIsModalPlantPatternDetailOpen] =
    useState(false);
  const openModalPastenDetailOpen = () => {
    setIsModalPlantPatternDetailOpen(true);
  };
  const closeModalPastenDetailOpen = () => {
    setIsModalPlantPatternDetailOpen(false);
  };

  // Selected Month Update
  useEffect(() => {
    const selectedMonthData = changeMonthToDate(selectedMonth);
    let daysInSelectedMonth = getDaysInSelectedMonth(selectedMonthData);
    let timeSeriesData: Array<TimeSeries> = [];
    let totalTimeSeries = 0;
    if (timeRange === "daily") totalTimeSeries = daysInSelectedMonth;
    else if (timeRange === "period") totalTimeSeries = 2;
    else if (timeRange === "panca") totalTimeSeries = 6;

    let dividedResult = Math.floor(daysInSelectedMonth / totalTimeSeries);
    for (let i = 1; i <= totalTimeSeries; i++) {
      const monthString = moment(selectedMonthData).format("yyyy-MM");
      const lastTimeData =
        dividedResult === 1 ? i : dividedResult * (i - 1) + 1;
      const timeDivided =
        i === totalTimeSeries ? daysInSelectedMonth : dividedResult * i;
      let dateList: Array<string> = [];
      for (let j = lastTimeData; j <= timeDivided; j++) {
        dateList.push(monthString + "-" + convertToTwoDigitNumber(j));
      }
      timeSeriesData.push({
        dateList: dateList,
        label: convertToTwoDigitNumber(i),
      });
    }
    setTimeSeriesInCurrentMonth([...timeSeriesData]);
  }, [selectedMonth, timeRange]);

  const [selectedSekunderLine, setSelectedSekunderLine] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const getData = useCallback(async () => {
    let query = "";
    if (selectedSekunderLine) query += `&line_id=${selectedSekunderLine}`;
    if (selectedGroup) query += `&group_id=${selectedGroup}`;
    if (area_id) query += `&parent_id=${area_id}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/plant-pattern?page=${paginationData.page}&limit=20&date=${selectedMonth}${query}`,
      {
        withCredentials: true,
      }
    );

    setAreaDataList(response.data.data.docs);
    setPaginationData(response.data.data as PaginationProps);
  }, [
    selectedMonth,
    selectedSekunderLine,
    selectedGroup,
    paginationData.page,
    area_id,
  ]);
  useEffect(() => {
    getData();
  }, [getData]);

  const [patternListDetail, setPatternListDetail] = useState<any>({});
  const calculateWaterFlow = () => {
    let total = 0;
    Object.values(patternListDetail).forEach((data: any) => {
      total += data.water_needed;
    });
    return total * 1.25;
  };
  const handleSavePlantPatternDetail = () => {
    // let water_flow = calculateWaterFlow();
    let setRawAreaData = selectedPatternList?.map((dataPattern) => {
      return {
        ...dataPattern,
        // water_flow: water_flow,
        raw_material_area_planted:
          patternListDetail[dataPattern.code]?.raw_area_planted,
      };
    });
    const plantPatternBefore: any =
      areaDataList[selectedPatternListIndex].plant_patterns;
    areaDataList[selectedPatternListIndex].plant_patterns = [
      ...setRawAreaData!,
      ...plantPatternBefore,
    ];

    areaDataList[selectedPatternListIndex].plant_patterns = removeDuplicates(
      areaDataList[selectedPatternListIndex].plant_patterns,
      ["code", "date"]
    );
    setAreaDataList([...areaDataList]);
    closeModalPastenDetailOpen();
  };
  function removeDuplicates(array: any, key: any) {
    let seen: any = {};
    return array.filter((item: any) => {
      let combinedKey: string = item[key[0]] + "|" + item[key[1]];
      return seen.hasOwnProperty(combinedKey)
        ? false
        : (seen[combinedKey] = true);
    });
  }
  const handleSave = async () => {
    setSelectedPasten(null);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/plant-pattern?date=${selectedMonth}`,
      areaDataList,
      {
        withCredentials: true,
      }
    );
    getData();
    toast.success(response.data.message);
  };

  return (
    <Fragment>
      <Breadcrumb pageName="Realisasi Tata Tanam" />
      <div className="p-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
          <div className="w-full">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="w-full">
                <DropDownInput
                  label="Pilih Saluran"
                  icon={<AirWaveIcon />}
                  options={[
                    {
                      label: "Pilih Saluran",
                      value: "",
                    },
                    ...sekunderLineOptions,
                  ]}
                  onChange={(e) => {
                    setSelectedSekunderLine(e.target.value);
                  }}
                />
              </div>
              <div className="w-full">
                <DropDownInput
                  label="Pilih Golongan"
                  icon={<AirWaveIcon />}
                  options={[
                    {
                      label: "Pilih Golongan",
                      value: "",
                    },
                    ...groupOptions,
                  ]}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                  }}
                />
              </div>
              {/* <div className="w-full">
                <DropDownInput
                  label="Pilih Rentang Waktu"
                  icon={<DateRangeIcon />}
                  defaultValue={timeRange}
                  options={[
                    {
                      value: "period",
                      label: "Periode",
                    },
                    {
                      value: "panca",
                      label: "Panca",
                    },
                    {
                      value: "daily",
                      label: "Harian",
                    },
                  ]}
                  onChange={(e) => {
                    setTimeRange(e.target.value);
                  }}
                />
              </div> */}
              <div className="w-full">
                <TextInput
                  label="Pilih Rentang Waktu"
                  value={selectedMonth}
                  type="month"
                  onChange={(e) => {
                    setSelectedMonth(e?.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-row items-center align-middle justify-center  xl:justify-end gap-8 text-white text-xs">
              <div className="flex flex-col w-1/2 xl:w-1/5">
                <button
                  className="rounded-lg bg-primary w-full p-3"
                  onClick={openModalPasten}
                >
                  <div className="flex flex-row justify-center mb-2">
                    <InputIcon />
                  </div>
                  <div className="flex flex-row justify-center">
                    Input Pola Tanam
                  </div>
                </button>
              </div>
              <div className="flex-col w-1/2 xl:w-1/5">
                <button
                  className="rounded-lg bg-success w-full p-3"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  <div className="flex flex-row justify-center mb-2">
                    <SaveIcon />
                  </div>
                  <div className="flex flex-row justify-center">Simpan</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-4 overflow-x-auto">
          <table className="table-auto min-w-full">
            <thead>
              <tr>
                <th className="border p-5" rowSpan={2}>
                  Nama Lokasi
                </th>
                <th className="border p-5" rowSpan={2}>
                  Luas Baku
                </th>
                <th className="border p-5" rowSpan={2}>
                  Golongan
                </th>
                <th
                  className="border p-5"
                  colSpan={timeListInCurrentMonth.length}
                >
                  Perencanaan
                </th>
                <th
                  className="border p-5"
                  colSpan={timeListInCurrentMonth.length}
                >
                  Pelaksanaan
                </th>
              </tr>
              <tr>
                {timeListInCurrentMonth.map((timeData, indexTimeData) => (
                  <th
                    className="border p-5"
                    key={`timeDataHeader${indexTimeData}`}
                  >
                    {/* {moment(day).format("DD")} */}
                    {timeData.label}
                  </th>
                ))}
                {timeListInCurrentMonth.map((timeData, indexTimeData) => (
                  <th
                    className="border p-5"
                    key={`timeDataHeader${indexTimeData}`}
                  >
                    {/* {moment(day).format("DD")} */}
                    {timeData.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areaDataList?.map((area, indexLocation) => (
                <Fragment key={`areaDataList${indexLocation}`}>
                  <tr>
                    {/* <td className="border px-1" rowSpan={2}>
                      {area.code}
                    </td> */}
                    <td className="border px-1">{area.name}</td>
                    <td className="border px-1">
                      {area.detail?.standard_area} Ha
                    </td>
                    <td className="border px-1">{area.detail?.group?.name}</td>
                    {timeListInCurrentMonth.map((timeData, indexTimeData) => (
                      <td
                        className="border p-0 text-center"
                        key={`timeData${indexTimeData}`}
                      >
                        <div className="flex flex-col">
                          {showOnlyDifferentValueFromArray(
                            "code",
                            plantPatternOntheDate(
                              area?.plant_pattern_plannings,
                              timeData.dateList
                            )
                          )?.map((dataOntheDate) => (
                            <span
                              className="divide-x divide-gray"
                              key={dataOntheDate.date + dataOntheDate.code}
                              style={chooseBackgroundForTable(
                                dataOntheDate.color
                              )}
                            >
                              {/* {dataOntheDate.code} */}
                              {findDataPlantType(dataOntheDate.code)
                                ?.plant_type +
                                " " +
                                findDataPlantType(dataOntheDate.code)
                                  ?.growth_time}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                    {timeListInCurrentMonth.map((timeData, indexTimeData) => (
                      <td
                        className="border p-0 cursor-pointer text-center"
                        key={`timeData${indexTimeData}`}
                        onClick={() => {
                          onTableChange(area, timeData.dateList, indexLocation);
                        }}
                      >
                        <div className="flex flex-col">
                          {showOnlyDifferentValueFromArray(
                            "code",
                            plantPatternOntheDate(
                              area?.plant_patterns,
                              timeData.dateList
                            )
                          )?.map((dataOntheDate) => (
                            <span
                              className="divide-x divide-gray"
                              key={dataOntheDate.date + dataOntheDate.code}
                              style={chooseBackgroundForTable(
                                dataOntheDate.color
                              )}
                            >
                              {/* {dataOntheDate.code} */}
                              {findDataPlantType(dataOntheDate.code)
                                ?.plant_type +
                                " " +
                                findDataPlantType(dataOntheDate.code)
                                  ?.growth_time}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          <Pagination
            {...paginationData}
            onNumberClick={(currentNumber) => {
              setPaginationData({
                ...paginationData,
                page: currentNumber,
              });
            }}
          />
        </div>
      </div>
      <Modal
        title="Pilih Pasten"
        isOpen={isModalPastenOpen}
        onClose={closeModalPasten}
      >
        <div className="grid lg:grid-cols-5 grid-cols-2 gap-2 mt-2 mb-5 text-center">
          {pastenList.map((pattern, indexPattern) => (
            <div
              key={"indexPatter" + indexPattern}
              className={`cursor-pointer rounded bg-[${pattern.color}] text-white p-8`}
              style={choosePastenColor(pattern.color)}
              onClick={() => {
                setSelectedPasten(pattern);
                setIsModalPastenOpen(false);
              }}
            >
              {/* {pattern.code} */}
              {findDataPlantType(pattern.code)?.plant_type +
                " " +
                findDataPlantType(pattern.code)?.growth_time}
            </div>
          ))}
        </div>
        {/* <PastenLegend /> */}
      </Modal>
      <Modal
        isOpen={isModalPlantPatternDetailOpen}
        onClose={closeModalPastenDetailOpen}
        title="Detail"
      >
        <div className="flex flex-row gap-2 mt-2">
          <div className="flex flex-col w-full">
            {showOnlyDifferentValueFromArray("code", selectedPatternList!)?.map(
              (pattern, indexPattern) => (
                <div key={`pasten${indexPattern}`}>
                  <span>
                    {pattern.plant_type + " " + pattern.growth_time} {"=>"}{" "}
                    pasten: {pattern.pasten}
                  </span>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="mb-10">
                      <label className="mb-3 block text-black dark:text-white">
                        Luas Lahan Ditanami (Dalam Hektar)
                      </label>
                      <input
                        type="number"
                        className="mr-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={
                          patternListDetail[pattern.code]?.raw_area_planted ??
                          ""
                        }
                        onFocus={() => {
                          setPatternListDetail({
                            ...patternListDetail,
                            [pattern.code]: {
                              raw_area_planted: null,
                              water_needed: null,
                            },
                          });
                        }}
                        onChange={(e) => {
                          const valueNumber = e.target.value
                            ? e.target.value
                            : "0";
                          setPatternListDetail({
                            ...patternListDetail,
                            [pattern.code]: {
                              raw_area_planted: parseFloat(e.target.value),
                              water_needed:
                                parseFloat(valueNumber) * pattern.pasten,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="mb-3 block text-black dark:text-white">
                        Kebutuhan Air (liter/detik)
                      </label>
                      <input
                        disabled
                        className="mr-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={
                          patternListDetail[pattern.code]?.water_needed ?? "0"
                        }
                      />
                    </div>
                  </div>
                </div>
              )
            )}
            <div>
              <span>
                Debit Perintah:{" "}
                {/* {totalActualWaterNeeded(selectedPatternList) * 1.25}{" "} */}
                {calculateWaterFlow()} {"liter/detik"}
              </span>
            </div>
            <hr />
            <div className="mt-5 flex justify-end">
              <Button
                label="Simpan"
                onClick={() => {
                  handleSavePlantPatternDetail();
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default PlantPatternRealisationData;
