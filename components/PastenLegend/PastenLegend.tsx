import { getOptions } from "@/services/base.service";
import { PastenData } from "@/types/plant-pattern";
import { useEffect, useState } from "react";

export const PastenLegend = () => {
  const [listPasten, setListPasten] = useState<Array<PastenData>>([]);
  const choosePastenColor = (color: string) => {
    if (color)
      return {
        backgroundColor: color,
        color: "white",
      };
    return {};
  };

  useEffect(() => {
    getOptions("/pastens", setListPasten);
  }, []);
  return (
    <div className="flex flex-col mb-10">
      <div>Keterangan Pasten:</div>
      <div className="grid grid-cols-5 gap-3 mt-2">
        {listPasten.map((pattern, indexPattern) => (
          <div
            key={"indexPattern" + indexPattern}
            className="flex flex-row items-center"
          >
            <div
              className={`cursor-pointer rounded bg-[${pattern.color}] text-white p-3 text-md`}
              style={choosePastenColor(pattern.color)}
            >
              {/* {pattern.code} */}
            </div>
            <span className="px-3">
              {pattern.plant_type} {pattern.growth_time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
