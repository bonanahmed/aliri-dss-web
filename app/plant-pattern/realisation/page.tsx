"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import Modal from "@/components/Modals/Modals";
import { AirWaveIcon, InputIcon, SaveIcon } from "@/public/images/icon/icon";
import { getList } from "@/services/baseService";
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
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";

const PlantPatternPage: React.FC<any> = () => {
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

  const [primerLineOptions, setPrimerLineOptions] = useState<any[]>([]);
  const [sekunderLineOptions, setSekunderLineOptions] = useState<any[]>([]);

  // Load Data
  useEffect(() => {
    getList("/pastens", {}, {}, setListPasten);
    getList(
      "/lines",
      {
        type: {
          $ne: "tersier",
        },
      },
      { isDropDown: true },
      setSekunderLineOptions
    );
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
    e: ChangeEvent<HTMLInputElement>,
    pattern: PlantPattern
  ) => {
    let dataRawArea: number = parseFloat(e.target.value ?? "0");
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
    e: ChangeEvent<HTMLInputElement>,
    pattern: PlantPattern
  ) => {
    let dataActualWaterNeeded: number = parseFloat(e.target.value);
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

  const getData = useCallback(async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/plant-pattern?page=1&limit=10&type=tersier&date=${selectedMonth}`
    );
    console.log("response get /api/v1/plant-pattern => ", response);
    setAreaDataList(response.data.data.docs);
  }, [selectedMonth]);
  useEffect(() => {
    getData();
  }, [getData]);

  const handleSave = async () => {
    setSelectedPasten(null);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/plant-pattern?date=${selectedMonth}`,
      areaDataList
    );
    console.log("response post /api/v1/page/plant-pattern => ", response);
  };

  const handleSavePlantPatternDetail = () => {
    let water_flow = totalActualWaterNeeded(selectedListPattern) * 1.25;
    let totalingWaterFlow = selectedListPattern?.map((dataPattern) => {
      return {
        ...dataPattern,
        water_flow: water_flow,
      };
    });
    areaDataList[selectedListPatternIndex].plant_patterns = [
      ...totalingWaterFlow!,
    ];
    setAreaDataList([...areaDataList]);
    closeModalPastenDetailOpen();
  };

  return (
    <Fragment>
      <Breadcrumb pageName="Pola Tanam" />
      <div className="p-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
          <div className="w-full">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-2 gap-3">
              {/* <div className="w-full">
                <DropDownInput
                  label="Pilih Daerah Irigasi (DI)"
                  icon={<AirWaveIcon />}
                  options={primerLineOptions}
                  onChange={(e) => {
                    getDataSaluranSekunder(e.target.value);
                  }}
                />
              </div> */}
              <div className="w-full">
                <DropDownInput
                  label="Pilih Saluran Sekunder"
                  icon={<AirWaveIcon />}
                  options={sekunderLineOptions}
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
                <th className="border p-5 w-13">Kode Lokasi</th>
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
              {areaDataList.map((area, indexLocation) => (
                <Fragment key={`areaDataList${indexLocation}`}>
                  <tr>
                    <td className="border px-1" rowSpan={2}>
                      {area.code}
                    </td>
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
                              {dataOntheDate.code}
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
                              {dataOntheDate.code}
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
        </div>
      </div>
      <Modal
        title="Pilih Pasten"
        isOpen={isModalPastenOpen}
        onClose={closeModalPasten}
      >
        <div className="flex flex-row gap-2 mt-2">
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
              {pattern.code}
            </div>
          ))}
        </div>
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
                  <span>{pattern.code}</span>
                  <div className="mb-3">
                    <label className="mb-3 block text-black dark:text-white">
                      Luas Lahan Aktual (Dalam Hektar)
                    </label>
                    <input
                      value={Math.round(
                        totalingData(
                          selectedListPattern!,
                          "raw_material_area_planted",
                          "code",
                          pattern.code
                        )
                      )}
                      onChange={(e) => {
                        changeRawAreaData(e, pattern);
                      }}
                      type="number"
                      placeholder="Luas Lahan Aktual"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-3 block text-black dark:text-white">
                      Kebutuhan Air Aktual (liter/detik)
                    </label>
                    <input
                      onChange={(e) => {
                        changeActualWaterNeeded(e, pattern);
                      }}
                      value={totalingData(
                        selectedListPattern!,
                        "actual_water_needed",
                        "code",
                        pattern.code
                      )}
                      type="number"
                      placeholder="Luas Lahan Aktual"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              )
            )}
            <div>
              <span>
                Debit Perintah:{" "}
                {/* {totalActualWaterNeeded(selectedListPattern) * 1.25}{" "} */}
                {selectedListPattern ? selectedListPattern[0].water_flow : 0}{" "}
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
    </Fragment>
  );
};

export default PlantPatternPage;
