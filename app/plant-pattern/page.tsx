"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import Modal from "@/components/Modals/Modals";
import {
  AirWaveIcon,
  DateRangeIcon,
  InputIcon,
  SaveIcon,
} from "@/public/images/icon/icon";
import {
  LocationData,
  DatePlant,
  PastenData,
  TimeList,
} from "@/types/plant-pattern";
import convertToTwoDigitNumber from "@/utils/convertToTwoDigitNumber";
import moment from "moment";
import { ChangeEvent, Fragment, useEffect, useState } from "react";

const PlantPatternPage = () => {
  const [timeRange, setTimeRange] = useState<string>("period");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment(new Date()).format("yyyy-MM")
  );
  const [timeListInCurrentMonth, setTimeListInCurrentMonth] = useState<
    Array<TimeList>
  >([]);
  const [selectedPasten, setSelectedPasten] = useState<PastenData | null>(null);
  const [selectedListPattern, setSelectedListPattern] = useState<
    DatePlant[] | null
  >(null);
  const [listPasten, setListPasten] = useState<Array<PastenData>>([
    {
      color: "#aa6116",
      code: "1a",
      plant_type: "Padi",
      growth_time: "Pengolahan tanah",
      pasten: "1.25",
    },
    {
      color: "#e9edee",
      code: "1b",
      plant_type: "Padi",
      growth_time: "Pertumbuhan 1",
      pasten: "0.73",
    },
    {
      color: "#1481c1",
      code: "1c",
      plant_type: "Padi",
      growth_time: "Pertumbuhan 2",
      pasten: "0.73",
    },
    {
      color: "#2aa5a5",
      code: "1d",
      plant_type: "Padi",
      growth_time: "Panen",
      pasten: "0",
    },
    {
      color: "#7bc241",
      code: "2a",
      plant_type: "Tebu",
      growth_time: "Pengolahan Tanah",
      pasten: "0.85",
    },
    {
      color: "#d31245",
      code: "2b",
      plant_type: "Tebu",
      growth_time: "Tebu Muda",
      pasten: "0.36",
    },
    {
      color: "#eb6201",
      code: "2c",
      plant_type: "Tebu",
      growth_time: "Tebu Tua",
      pasten: "1.25",
    },
    {
      color: "#4cad31",
      code: "3a",
      plant_type: "Palawija",
      growth_time: "Yang Perlu Banyak Air",
      pasten: "0.30",
    },
    {
      color: "#0000FF",
      code: "3b",
      plant_type: "Palawija",
      growth_time: "Yang Perlu Sedikit Air",
      pasten: "1.25",
    },
  ]);
  const [locationDataList, setLocationDataList] = useState<Array<LocationData>>(
    [
      {
        code: "BPL 1 Ki",
        name: "BPL 1 Ki",
        golongan: "3",
        luas_baku: "5",
        date_plants: [],
      },
      {
        code: "BPL 2 Ka",
        name: "BPL 2 Ka",
        golongan: "3",
        luas_baku: "17",
        date_plants: [],
      },
    ]
  );

  const findSelectedDatePlant = (
    date_plants?: Array<DatePlant>,
    list_date?: string[]
  ) => {
    return date_plants?.filter((date_plant) =>
      list_date?.includes(date_plant.date)
    );
  };
  const chooseBackgroundForTable = (color?: string) => {
    if (color)
      return {
        backgroundColor: color,
        color: "white",
      };
    else return {};
  };
  const choosePastenColor = (color: string) => {
    if (color)
      return {
        backgroundColor: color,
        color: "white",
      };
    else return {};
  };
  const onTableChange = (
    location: LocationData,
    list_date: string[],
    index: number
  ) => {
    if (selectedPasten) {
      if (
        findSelectedDatePlant(location?.date_plants, list_date)?.length !== 0
      ) {
        const date_plants = location?.date_plants?.filter((date_plant) => {
          return !list_date.includes(date_plant.date);
        });
        locationDataList[index].date_plants = date_plants;
        setLocationDataList([...locationDataList]);
      } else {
        list_date.forEach((date) => {
          location?.date_plants?.push({
            date: date,
            ...selectedPasten,
          });
        });
        locationDataList[index].date_plants = location?.date_plants;
        setLocationDataList([...locationDataList]);
      }
    } else {
      const foundData =
        findSelectedDatePlant(location?.date_plants, list_date) ?? [];
      if (foundData?.length !== 0) {
        setSelectedListPattern(foundData);
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

  function getDaysInSelectedMonth(now: Date) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Adding 1 because months are zero-based

    return new Date(year, month, 0).getDate();
  }
  const changeMonthToDate = (dateString: string) => {
    const year = parseInt(dateString.split("-")[0]);
    const month = parseInt(dateString.split("-")[1]) - 1; // Months are zero-based
    const day = 1; // You can set the day to any value, as long as it's a valid day of the month

    const dateObject = new Date(year, month, day);
    return dateObject;
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
    return countTotal;
  };
  const totalActualWaterNeeded = (listData: Array<DatePlant> | null) => {
    let countTotal = 0;
    listData?.forEach((dataUnit) => {
      countTotal += dataUnit.actual_water_needed ?? 0;
    });
    return countTotal;
  };

  const changeRawAreaData = (
    e: ChangeEvent<HTMLInputElement>,
    pattern: DatePlant
  ) => {
    // setActualWaterNeeded(
    //   parseFloat(e.target.value ?? 0) *
    //     parseFloat(selectedListPattern?.pasten ?? "0")
    // );
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
          actual_water_needed: dataRawArea * parseFloat(pattern.pasten),
          raw_material_area_planted: dataRawArea,
        };
      } else {
        return listPattern;
      }
    });
    setSelectedListPattern([...(newSelectedListPattern ?? [])]);
  };

  const changeActualWaterNeeded = (
    e: ChangeEvent<HTMLInputElement>,
    pattern: DatePlant
  ) => {
    // setActualWaterNeeded(parseFloat(e.target.value));
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
    setSelectedListPattern([...(newSelectedListPattern ?? [])]);
  };

  // MODAL
  const [isModalPastenOpen, setIsModalPastenOpen] = useState(false);

  const openModalPasten = () => {
    setIsModalPastenOpen(true);
  };

  const closeModalPasten = () => {
    setIsModalPastenOpen(false);
  };

  const [isModalDatePlantDetailOpen, setIsModalDatePlantDetailOpen] =
    useState(false);
  const openModalPastenDetailOpen = () => {
    setIsModalDatePlantDetailOpen(true);
  };
  const closeModalPastenDetailOpen = () => {
    setIsModalDatePlantDetailOpen(false);
  };

  // Selected Month Update
  useEffect(() => {
    const selectedMonthData = changeMonthToDate(selectedMonth);
    let daysInSelectedMonth = getDaysInSelectedMonth(selectedMonthData);
    let dateData: Array<TimeList> = [];
    let totalTimeList = 0;
    if (timeRange === "daily") totalTimeList = daysInSelectedMonth;
    else if (timeRange === "period") totalTimeList = 2;
    else if (timeRange === "panca") totalTimeList = 6;

    let dividedResult = Math.floor(daysInSelectedMonth / totalTimeList);
    for (let i = 1; i <= totalTimeList; i++) {
      const monthString = moment(selectedMonthData).format("yyyy-MM");
      const lastTimeData =
        dividedResult === 1 ? i : dividedResult * (i - 1) + 1;
      const timeDivided =
        i === totalTimeList ? daysInSelectedMonth : dividedResult * i;
      let timeListData: Array<string> = [];
      for (let j = lastTimeData; j <= timeDivided; j++) {
        timeListData.push(monthString + "-" + convertToTwoDigitNumber(j));
      }
      dateData.push({
        time_list: timeListData,
        label: convertToTwoDigitNumber(i),
      });
    }
    setTimeListInCurrentMonth([...dateData]);
  }, [selectedMonth, timeRange]);

  return (
    <Fragment>
      <Breadcrumb pageName="Pola Tanam" />
      <div className="p-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
          <div className="w-full">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="w-full">
                <DropDownInput
                  label="Pilih Daerah Irigasi (DI)"
                  icon={<AirWaveIcon />}
                  options={[
                    {
                      value: "Kedung Putri",
                      label: "Kedung Putri",
                    },
                  ]}
                />
              </div>
              <div className="w-full">
                <DropDownInput
                  label="Pilih Saluran Sekunder"
                  icon={<AirWaveIcon />}
                  options={[
                    {
                      value: "Plaosan",
                      label: "Plaosan",
                    },
                  ]}
                />
              </div>
              <div className="w-full">
                <DropDownInput
                  label="Pilih Rentang Waktu"
                  icon={<DateRangeIcon />}
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
              </div>
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
                    setSelectedPasten(null);
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
              {locationDataList.map((location, indexLocation) => (
                <tr key={`locationDataList${indexLocation}`}>
                  <td className="border px-1">{location.code}</td>
                  <td className="border px-1">{location.name}</td>
                  <td className="border px-1">{location.luas_baku}</td>
                  <td className="border px-1">{location.golongan}</td>
                  {timeListInCurrentMonth.map((timeData, indexTimeData) => (
                    <td
                      className="border p-0 cursor-pointer text-center"
                      key={`timeData${indexTimeData}`}
                      onClick={() => {
                        onTableChange(
                          location,
                          timeData.time_list,
                          indexLocation
                        );
                      }}
                    >
                      <div className="flex flex-col">
                        {showOnlyDifferentValueFromArray(
                          "code",
                          findSelectedDatePlant(
                            location?.date_plants,
                            timeData.time_list
                          )
                        )?.map((selectedDatePlant) => (
                          <span
                            className="divide-x divide-gray"
                            key={selectedDatePlant.date}
                            style={chooseBackgroundForTable(
                              selectedDatePlant.color
                            )}
                          >
                            {selectedDatePlant.code}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isModalPastenOpen} onClose={closeModalPasten}>
        <h2>Pilih Pasten</h2>
        <hr />
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
        isOpen={isModalDatePlantDetailOpen}
        onClose={closeModalPastenDetailOpen}
      >
        <h2>Detail</h2>
        <hr />
        <div className="flex flex-row gap-2 mt-2">
          <div className="flex flex-col w-full">
            {showOnlyDifferentValueFromArray(
              "code",
              selectedListPattern ?? []
            )?.map((pattern, indexPattern) => (
              <>
                <span>{pattern.code}</span>
                <div className="mb-3">
                  <label className="mb-3 block text-black dark:text-white">
                    Luas Lahan Aktual
                  </label>
                  <input
                    onChange={(e) => {
                      changeRawAreaData(e, pattern);
                    }}
                    type="number"
                    placeholder="Luas Lahan Aktual"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                {/* {selectedListPattern?.map((asd, indsa) => (
                  <div key={"ss" + indsa}>
                    {asd.actual_water_needed} {asd.raw_material_area_planted}
                  </div>
                ))} */}
                <div className="mb-3">
                  <label className="mb-3 block text-black dark:text-white">
                    Kebutuhan Air Aktual
                  </label>
                  <input
                    onChange={(e) => {
                      changeActualWaterNeeded(e, pattern);
                    }}
                    value={totalingData(
                      selectedListPattern ?? [],
                      "actual_water_needed",
                      "code",
                      pattern.code
                    )}
                    type="number"
                    placeholder="Luas Lahan Aktual"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </>
            ))}
            <div>
              <span>
                Debit Perintah:{" "}
                {isNaN(totalActualWaterNeeded(selectedListPattern) * 1.25)
                  ? 0
                  : totalActualWaterNeeded(selectedListPattern) * 1.25}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default PlantPatternPage;
