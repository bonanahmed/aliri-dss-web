import Table from "../Tables/Table";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from "react";
import * as XLSX from "xlsx";
import Button from "../Buttons/Buttons";
import getFieldNameFromArray from "@/utils/getFieldNameFromArray";

type RatingCurveProps = {
  data?: Array<any>;
  name?: string;
  // color?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const RatingCurveExcel = ({ data, name }: RatingCurveProps) => {
  const [ratingCurveTable, setRatingCurveTable] = useState<any[] | undefined>(
    []
  );
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    setRatingCurveTable(data);
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const data = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const convertedData = XLSX.utils.sheet_to_json(sheet);
        setRatingCurveTable(convertedData);
      };
      fileReader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <div className="border-t border-stroke py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">
        Tabel Rating Curve
      </h3>

      <div className="flex flex-row justify-end">
        <Button
          label="Upload Excel"
          onClick={(e) => {
            e.preventDefault();
            fileInputRef?.current?.click();
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx, .xls"
          className="hidden"
          style={{
            display: "none",
          }}
          onChange={handleFileChange}
        />
        <input
          name={name}
          className="hidden"
          style={{
            display: "none",
          }}
          value={JSON.stringify(ratingCurveTable) ?? ""}
          onChange={(e) => {}}
        />
      </div>
      <Table
        values={ratingCurveTable ?? []}
        scopedSlots={{}}
        fields={getFieldNameFromArray(ratingCurveTable ?? [])}
      />
    </div>
  );
};

export default RatingCurveExcel;
