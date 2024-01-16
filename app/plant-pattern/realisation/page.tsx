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

const PlantPatternPage: React.FC<any> = () => {
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
  const [selectedPasten, setSelectedPasten] = useState<PastenData | null>(null);
  const [selectedListPattern, setSelectedListPattern] = useState<
    PlantPattern[] | null
  >(null);
  const [selectedListPatternIndex, setSelectedListPatternIndex] =
    useState<number>(0);
  const [listPasten, setListPasten] = useState<Array<PastenData>>([]);
  const [areaDataList, setAreaDataList] = useState<Array<AreaData>>([]);

  const [sekunderLineOptions, setSekunderLineOptions] = useState<any[]>([]);
  const [groupOptions, setGroupOptions] = useState<any[]>([]);
  const findDataPlantType = (code: string) => {
    return listPasten.find((pasten) => pasten.code === code);
  };

  // Load Data
  useEffect(() => {
    getOptions("/pastens", setListPasten);
    getOptions(
      "/lines",
      setSekunderLineOptions,
      { isDropDown: true },
      {
        type: JSON.stringify({
          $ne: "tersier",
        }),
      }
    );
    getOptions("/groups", setGroupOptions, { isDropDown: true }, {});
  }, []);

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
        setSelectedListPattern(foundData!);
        setSelectedListPatternIndex(index);
        openModalPastenDetailOpen();
      }
    }
  };

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
  const totalingData = (
    listData: Array<any>,
    whichData: string,
    whicCondition: any,
    condition: any
  ) => {
    let countTotal = 0;
    listData.forEach((dataUnit) => {
      if (dataUnit[whicCondition] === condition)
        countTotal += dataUnit[whichData];
    });
    return isNaN(countTotal) ? 0 : countTotal;
  };
  const totalActualWaterNeeded = (listData: Array<PlantPattern> | null) => {
    let countTotal = 0;
    listData?.forEach((dataUnit) => {
      countTotal += dataUnit.actual_water_needed ?? 0;
    });
    return isNaN(countTotal) ? 0 : countTotal;
  };

  const changeRawAreaData = (
    // e: ChangeEvent<HTMLInputElement>,
    value: number,
    pattern: PlantPattern
  ) => {
    // let dataRawArea: number = parseFloat(e.target.value ?? "0");
    let dataRawArea: number = value;
    let listPatternLength =
      selectedListPattern?.filter(
        (listPattern) => listPattern.code === pattern.code
      ).length ?? 1;
    dataRawArea = dataRawArea / listPatternLength;

    let newSelectedListPattern = selectedListPattern?.map((listPattern) => {
      if (listPattern.code === pattern.code) {
        return {
          ...listPattern,
          actual_water_needed: dataRawArea * pattern.pasten,
          raw_material_area_planted: dataRawArea,
        };
      } else {
        return listPattern;
      }
    });
    setSelectedListPattern([...newSelectedListPattern!]);
  };

  const changeActualWaterNeeded = (
    // e: ChangeEvent<HTMLInputElement>,
    value: number,
    pattern: PlantPattern
  ) => {
    // let dataActualWaterNeeded: number = parseFloat(e.target.value);
    let dataActualWaterNeeded: number = value;
    let listPatternLength =
      selectedListPattern?.filter(
        (listPattern) => listPattern.code === pattern.code
      ).length ?? 1;
    dataActualWaterNeeded = dataActualWaterNeeded / listPatternLength;

    let newSelectedListPattern = selectedListPattern?.map((listPattern) => {
      if (listPattern.code === pattern.code) {
        return {
          ...listPattern,
          actual_water_needed: dataActualWaterNeeded,
        };
      } else {
        return listPattern;
      }
    });
    setSelectedListPattern([...newSelectedListPattern!]);
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/plant-pattern?page=${paginationData.page}&limit=20&date=${selectedMonth}${query}`,
      {
        withCredentials: true,
      }
    );
    // let totalData = 0;
    // response.data.data.docs.forEach((item: any) => {
    //   console.log(item.name, item.detail.standard_area);
    //   totalData += item.detail.standard_area ?? 0;
    // });

    setAreaDataList(response.data.data.docs);
    setPaginationData(response.data.data as PaginationProps);
  }, [selectedMonth, selectedSekunderLine, selectedGroup, paginationData.page]);
  useEffect(() => {
    getData();
  }, [getData]);

  const handleSavePlantPatternDetail = () => {
    let water_flow = totalActualWaterNeeded(selectedListPattern) * 1.25;
    let totalingWaterFlow = selectedListPattern?.map((dataPattern) => {
      return {
        ...dataPattern,
        water_flow: water_flow,
      };
    });
    // console.log(
    //   "sebelum",
    //   areaDataList[selectedListPatternIndex].plant_patterns
    // );
    const plantPatternBefore: any =
      areaDataList[selectedListPatternIndex].plant_patterns;
    areaDataList[selectedListPatternIndex].plant_patterns = [
      ...totalingWaterFlow!,
      ...plantPatternBefore,
    ];

    areaDataList[selectedListPatternIndex].plant_patterns = removeDuplicates(
      areaDataList[selectedListPatternIndex].plant_patterns,
      ["code", "date"]
    );
    // console.log(
    //   "sesudah",
    //   areaDataList[selectedListPatternIndex].plant_patterns
    // );

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

  const [inputDataDetail, setInputDataDetail] = useState<any>(null);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);

  useEffect(() => {
    if (inputDataDetail) setShowInputModal(true);
    else setShowInputModal(false);
  }, [inputDataDetail]);

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
                {/* <th className="border p-5 w-13">Kode Lokasi</th> */}
                <th className="border p-5">Nama Lokasi</th>
                <th className="border p-5">Luas Baku</th>
                <th className="border p-5">Golongan</th>
                <th className="border p-5">Tipe</th>
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
                    <td className="border px-1" rowSpan={2}>
                      {area.name}
                    </td>
                    <td className="border px-1" rowSpan={2}>
                      {area.detail?.standard_area} Ha
                    </td>
                    <td className="border px-1" rowSpan={2}>
                      {area.detail?.group?.name}
                    </td>
                    <td className="border px-1">Perencanaan</td>
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
                  </tr>
                  <tr key={`areaDataList${indexLocation}`}>
                    <td className="border px-1">Pelaksanaan</td>
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
        <div className="grid grid-cols-5 gap-2 mt-2 mb-5 text-center">
          {listPasten.map((pattern, indexPattern) => (
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
            {showOnlyDifferentValueFromArray("code", selectedListPattern!)?.map(
              (pattern, indexPattern) => (
                <div key={`pasten${indexPattern}`}>
                  <span>
                    {pattern.code} {"=>"} pasten: {pattern.pasten}
                  </span>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="mb-10">
                      <label className="mb-3 block text-black dark:text-white">
                        Luas Lahan Aktual (Dalam Hektar)
                      </label>
                      <div className="flex flex-row items-center justify-between">
                        {/* <input
                          onChange={(e) => {
                            changeRawAreaData(e, pattern);
                          }}
                          type="number"
                          placeholder="Luas Lahan Aktual"
                          className="w-3/4 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        /> */}
                        <input
                          disabled
                          className="mr-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          value={totalingData(
                            selectedListPattern!,
                            "raw_material_area_planted",
                            "code",
                            pattern.code
                          ).toFixed(2)}
                        />
                        <Button
                          icon={<InputIcon />}
                          onClick={() => {
                            setInputDataDetail({
                              label: "Luas Lahan Aktual",
                              code: "raw_material_area_planted",
                              pattern: pattern,
                              value: totalingData(
                                selectedListPattern!,
                                "raw_material_area_planted",
                                "code",
                                pattern.code
                              ).toFixed(2),
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="mb-3 block text-black dark:text-white">
                        Kebutuhan Air Aktual (liter/detik)
                      </label>
                      <div className="flex flex-row items-center justify-between">
                        <input
                          disabled
                          className="mr-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          value={totalingData(
                            selectedListPattern!,
                            "actual_water_needed",
                            "code",
                            pattern.code
                          ).toFixed(2)}
                        />
                        <Button
                          icon={<InputIcon />}
                          onClick={() => {
                            setInputDataDetail({
                              label: "Kebutuhan Air Aktual",
                              code: "actual_water_needed",
                              pattern: pattern,
                              value: totalingData(
                                selectedListPattern!,
                                "actual_water_needed",
                                "code",
                                pattern.code
                              ).toFixed(2),
                            });
                          }}
                        />
                        {/* <input
                        onChange={(e) => {
                          changeActualWaterNeeded(e, pattern);
                        }}
                        value={totalingData(
                          selectedListPattern!,
                          "actual_water_needed",
                          "code",
                          pattern.code
                        ).toFixed(2)}
                        type="number"
                        placeholder="Kebutuhan Air Aktual (liter/detik)"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      /> */}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            <div>
              <span>
                Debit Perintah:{" "}
                {/* {totalActualWaterNeeded(selectedListPattern) * 1.25}{" "} */}
                {selectedListPattern
                  ? selectedListPattern[0].water_flow?.toFixed(2)
                  : 0}{" "}
                {"liter/detik"}
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
      <Modal
        isOpen={showInputModal}
        onClose={() => {
          setInputDataDetail(null);
        }}
        title={`Input ${inputDataDetail?.label}`}
      >
        <input
          value={inputDataDetail?.value ?? ""}
          onChange={(e) => {
            setInputDataDetail({
              ...inputDataDetail,
              value: parseFloat(e.target.value),
            });
          }}
          type="number"
          placeholder={inputDataDetail?.label}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        <Modal.Footer className="flex justify-end">
          <Button
            label="Simpan"
            onClick={() => {
              if (inputDataDetail?.code === "raw_material_area_planted")
                changeRawAreaData(
                  inputDataDetail?.value,
                  inputDataDetail?.pattern
                );
              else
                changeActualWaterNeeded(
                  inputDataDetail?.value,
                  inputDataDetail?.pattern
                );

              setInputDataDetail(null);
            }}
          />
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default PlantPatternPage;
