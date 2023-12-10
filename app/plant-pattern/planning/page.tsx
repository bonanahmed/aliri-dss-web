"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import Modal from "@/components/Modals/Modals";
import { PastenLegend } from "@/components/PastenLegend/PastenLegend";
import Tempe from "@/components/Tempe/Tempe";
import { getPlantPatterns } from "@/services/plant-pattern/plant-pattern-planning";
import { PlantPattern, PastenData, TimeSeries } from "@/types/plant-pattern";
import convertToTwoDigitNumber from "@/utils/convertToTwoDigitNumber";
import { getDaysInSelectedMonth } from "@/utils/dateUtilities";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
const PlantPatternPlanningPage: React.FC<any> = () => {
  const [dateListinYear, setDateListinYear] = useState<any[]>([]);
  const [plantPatterns, setPlantPatterns] = useState<PlantPattern[]>([]);
  const [selectedPasten, setSelectedPasten] = useState<PastenData | null>(null);

  const [groups, setGroups] = useState<any>([]);

  useEffect(() => {
    getPlantPatterns(setGroups);
  }, []);

  const choosePastenColor = (color: string) => {
    if (color)
      return {
        backgroundColor: color,
        color: "white",
      };
    else return {};
  };

  const plantPatternOntheDate = (
    plantPatterns: Array<PlantPattern>,
    listDate: string[]
  ) => {
    return plantPatterns?.filter((plantPattern) =>
      listDate?.includes(plantPattern.date)
    );
  };
  function getAllDaysInYear() {
    const nowData = new Date();
    const year = nowData.getFullYear();
    // const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const months = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let timeSeriesData: Array<TimeSeries> = [];
    months.forEach((month, index) => {
      const yearData = index < 3 ? year : year + 1;

      const selectedMonthData = new Date(yearData, month, 0);
      let daysInSelectedMonth = getDaysInSelectedMonth(selectedMonthData);

      let totalTimeSeries = 2;

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
          label: monthString,
        });
      }
    });
    console.log(timeSeriesData);

    return timeSeriesData;
  }

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

  const onTableChange = (listDate: string[]) => {
    console.log(selectedPasten, plantPatterns);
    if (selectedPasten) {
      if (plantPatternOntheDate(plantPatterns, listDate)?.length !== 0) {
        const tempPlantPatterns = plantPatterns?.filter((date_plant) => {
          return (
            listDate.includes(date_plant.date) &&
            selectedPasten.code === date_plant.code
          );
        });
        if (tempPlantPatterns?.length !== 0) {
          const filteredTempPlantPatterns = plantPatterns?.filter(
            (date_plant) => {
              return (
                date_plant.code !== tempPlantPatterns![0].code ||
                !listDate.includes(date_plant.date)
              );
            }
          );
          setPlantPatterns([...filteredTempPlantPatterns]);
        } else {
          listDate.forEach((date) => {
            plantPatterns?.push({
              date: date,
              ...selectedPasten,
            });
          });
          setPlantPatterns([...plantPatterns]);
        }
      } else {
        listDate.forEach((date) => {
          plantPatterns?.push({
            date: date,

            ...selectedPasten,
          });
        });
        setPlantPatterns([...plantPatterns]);
      }
    }
  };

  // MODAL
  const [isModalPastenOpen, setIsModalPastenOpen] = useState(false);

  const openModalPasten = () => {
    setIsModalPastenOpen(true);
  };

  const closeModalPasten = () => {
    setIsModalPastenOpen(false);
  };

  useEffect(() => {
    setDateListinYear(getAllDaysInYear());
  }, []);
  return (
    <div className="w-[80vw]">
      <Breadcrumb pageName="PERATURAN BUPATI PURWOREJO POLA TATA TANAM DI KEDUNG PUTRI TAHUN 2021/2025" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* <div className="flex justify-end mt-5 mr-5">
        <Button
          label="Pilih Pasten"
          onClick={(e) => {
            openModalPasten();
          }}
        />
      </div> */}
        <div className="p-6.5">
          <div className="my-5 pb-4 overflow-x-auto">
            <table
            // className="table-auto min-w-full"
            // style={{
            //   width: "100%",
            //   border: "1px solid #999",
            //   borderRight: "none",
            //   borderBottom: "none",
            //   // background: " #8bc34a",
            // }}
            >
              <tbody>
                <tr>
                  <td className="sticky left-0 bg-primary text-white px-6 py-3 border w-[50vw]">
                    Bulan dan Tahun
                  </td>
                  {[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23].map(
                    (timeSeries, indexDate) => (
                      <td
                        colSpan={2}
                        className="border px-5 py-2 bg-primary text-white"
                        key={timeSeries}
                      >
                        {moment(dateListinYear[timeSeries]?.label).format(
                          "MMMM yyyy"
                        )}
                      </td>
                    )
                  )}
                </tr>
                <tr>
                  <td className="sticky left-0 bg-primary text-white px-6 py-3 border w-[50vw]">
                    Periode
                  </td>
                  {dateListinYear.map((timeSeries, indexDate) => (
                    <td
                      className="border px-5 py-2 text-center bg-primary text-white"
                      key={timeSeries.label + indexDate}
                    >
                      {(indexDate + 1) % 2 === 0 ? 2 : 1}
                    </td>
                  ))}
                </tr>
                {groups.map((group: any, index: number) => (
                  <Fragment key={`group${index}`}>
                    <tr>
                      <td className="sticky left-0 bg-primary text-white px-6 py-3 border w-[50vw]">
                        {`Pola Tanam ${group.name}`}
                      </td>
                      {dateListinYear.map((timeSeries, indexDate) => (
                        <td
                          className="border text-white p-0 cursor-pointer text-center"
                          key={`planning${timeSeries.label}${indexDate}`}
                          onClick={() => {
                            onTableChange(timeSeries.dateList);
                          }}
                        >
                          <Tempe
                            pastenList={showOnlyDifferentValueFromArray(
                              "code",
                              plantPatternOntheDate(
                                group.plantPattern,
                                timeSeries.dateList
                              )
                            )}
                          />
                          {/* <div className="flex flex-col h-full">
                            {showOnlyDifferentValueFromArray(
                              "code",
                              plantPatternOntheDate(
                                group.plantPattern,
                                timeSeries.dateList
                              )
                            ).length !== 0 ? (
                              showOnlyDifferentValueFromArray(
                                "code",
                                plantPatternOntheDate(
                                  group.plantPattern,
                                  timeSeries.dateList
                                )
                              )?.map((dataOntheDate: any) => (
                                <span
                                  className="divide-x divide-gray h-full"
                                  key={dataOntheDate.date + dataOntheDate.code}
                                  style={chooseBackgroundForTable(
                                    dataOntheDate.color
                                  )}
                                >
                                  {dataOntheDate.code}
                                </span>
                              ))
                            ) : (
                              <div className="h-6" />
                            )}
                          </div> */}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="sticky left-0 bg-primary text-white px-6 py-3 border w-[50vw]">
                        Debit Air
                      </td>
                      {dateListinYear.map((timeSeries, indexDate) => (
                        <td
                          className="border border-white p-1 text-center bg-[#D6D6E0]"
                          key={timeSeries.label + indexDate}
                        >
                          {/* Debit Air di Sawah:
                          <TextInput defaultValue={0} onChange={undefined} /> */}
                          0.00
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                ))}
                <tr className="border-t-8 border-white">
                  <td className="sticky left-0 bg-primary text-white px-6 py-3 border w-[50vw]">
                    Kebutuhan Air di Sawah
                  </td>
                  {dateListinYear.map((timeSeries, indexDate) => (
                    <td
                      className="border border-white p-1 text-center bg-[#D6D6E0]"
                      key={timeSeries.label + indexDate}
                    >
                      {/* Debit Air di Sawah:
                          <TextInput defaultValue={0} onChange={undefined} /> */}
                      0.00
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <PastenLegend />
          <div className="flex justify-end gap-3">
            <Button label="Back" />
            <Button label="Submit" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantPatternPlanningPage;
