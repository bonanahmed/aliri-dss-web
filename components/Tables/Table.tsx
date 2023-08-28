"use client";
import { ChangeEventHandler, Fragment } from "react";
import DropDownInput from "../Input/DropDownInput";
import TextInput from "../Input/TextInput";
import Pagination from "../Pagination/Pagination";
import { PaginationProps } from "@/types/pagination";
import { AirWaveIcon, SearchIcon } from "@/public/images/icon/icon";

const Table = ({
  fields,
  values,
  scopedSlots,
  pagination,
  onItemsPerPageChange,
  onPaginationNumberClick,
}: {
  fields?: any[] | undefined;
  values: Array<any>;
  onItemsPerPageChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  pagination?: PaginationProps;
  scopedSlots?: any;
  onPaginationNumberClick?: (currentNumber: number) => void;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-3 justify-between items-center">
        {/* Component */}
        <div className="flex flex-row items-center">
          <span className="mr-3">Tampilkan</span>
          <div>
            <DropDownInput
              options={[
                {
                  label: "10",
                  value: 10,
                },
                {
                  label: "20",
                  value: 20,
                },
                {
                  label: "50",
                  value: 50,
                },
                {
                  label: "100",
                  value: 100,
                },
              ]}
              onChange={onItemsPerPageChange}
            />
          </div>
          <span className="ml-3">Data</span>
        </div>

        <TextInput placeholder="Pencarian" prefixIcon={<SearchIcon />} />
      </div>
      <div className="overflow-hidden rounded">
        <table className="min-w-full table-auto bg-white dark:bg-boxdark dark:text-white">
          <thead>
            <tr className="text-white bg-boxdark dark:bg-body">
              {fields?.map((field, indexField) => (
                <th key={`field${indexField}`} className="py-2">
                  <div className={indexField === 0 ? "" : "border-l-2"}>
                    <div className="py-2">{field.label}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map((value, indexValue) => (
              <tr key={indexValue}>
                {fields?.map((field, indexField) => (
                  <td key={`fieldValue${indexField}`} className="py-2">
                    <div
                      className={
                        indexField === 0
                          ? "px-4"
                          : "border-l-2 px-4 border-[#CACACA]"
                      }
                    >
                      <div className="py-2">
                        {scopedSlots && scopedSlots[field.key] ? (
                          <Fragment>
                            {scopedSlots[field.key](
                              value[field.key],
                              indexValue
                            )}
                          </Fragment>
                        ) : (
                          value[field.key]
                        )}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="mt-3">
          <Pagination {...pagination} onNumberClick={onPaginationNumberClick} />
        </div>
      )}
    </div>
  );
};

export default Table;
