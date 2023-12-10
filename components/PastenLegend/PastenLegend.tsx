import { PastenData } from "@/types/plant-pattern";
import { useState } from "react";

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
  return (
    <div className="flex flex-row gap-2 mt-2">
      {listPasten.map((pattern, indexPattern) => (
        <div
          key={"indexPatter" + indexPattern}
          className={`cursor-pointer rounded bg-[${pattern.color}] text-white p-8`}
          style={choosePastenColor(pattern.color)}
        >
          {pattern.code}
        </div>
      ))}
    </div>
  );
};
