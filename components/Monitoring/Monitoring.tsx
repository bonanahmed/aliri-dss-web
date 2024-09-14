import { useEffect, useState } from "react";
import { Gauge } from "../Gauge/Gauge";

const Monitoring = ({ code, value }: any) => {
  const [variableData, setVariableData] = useState<any>([]);
  useEffect(() => {
    if (code === "B_KP.93.72")
      setVariableData([
        {
          label: "Level Air Arah Pangen Mangunan",
          TagName: "B_KP.93.72_PM_LEVEL",
          max: 1,
          min: 0.1,
          intervalMajor: 0.1,
          intervalMinor: 0.05,
        },
        {
          label: "Level Air Arah Bloro Buduk",
          TagName: "B_KP.93.72_BB_LEVEL",
          max: 1,
          min: 0.1,
          intervalMajor: 0.1,
          intervalMinor: 0.05,
        },
      ]);
    if (code === "B_KD.00.83")
      setVariableData([
        {
          label: "Level Air Arah Kenteng Grantung",
          TagName: "B_KD.00.83_KG_LEVEL",
          max: 1,
          min: 0.1,
          intervalMajor: 0.1,
          intervalMinor: 0.05,
        },
        {
          label: "Level Air Arah Kenteng Dewi",
          TagName: "B_KD.00.83_KD_LEVEL",
          max: 1,
          min: 0.1,
          intervalMajor: 0.1,
          intervalMinor: 0.05,
        },
        {
          label: "Debit Air Arah Kenteng Grantung",
          TagName: "B_KD.00.83_KG_DEBIT",
          max: 500,
          min: 50,
          intervalMajor: 50,
          intervalMinor: 25,
        },
        {
          label: "Debit Air Arah Kenteng Dewi",
          TagName: "B_KD.00.83_KD_DEBIT",
          max: 1000,
          min: 100,
          intervalMajor: 100,
          intervalMinor: 50,
        },
      ]);
  }, [code]);

  const findValue = (tagName: string) => {
    const findData = value.filter((item: any) => item.Formula === tagName);
    return findData[0]?.Value;
  };
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {variableData.map((item: any, index: number) => (
        <div key={index}>
          <Gauge
            max={item.max}
            min={item.min}
            intervalMajor={item.intervalMajor}
            intervalMinor={item.intervalMinor}
            title={item.label}
            value={findValue(item.TagName)}
          />
        </div>
      ))}
    </div>
  );
};

export default Monitoring;
