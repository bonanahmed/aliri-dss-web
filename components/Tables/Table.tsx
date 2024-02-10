"use client";
import { Fragment } from "react";
import DropDownInput from "../Input/DropDownInput";
import TextInput from "../Input/TextInput";
import Pagination from "../Pagination/Pagination";
import { FilterIcon, SearchIcon } from "@/public/images/icon/icon";
import { TableProps } from "./types";
import clsx from "clsx";
import DropdownButton from "../DropdownButtons/DropdownButton";
import Button from "../Buttons/Buttons";

const Table = ({
  fields,
  values,
  scopedSlots,
  pagination,
  actionOptions,
  onItemsPerPageChange,
  onPaginationNumberClick,
  onSearch,
}: TableProps) => {
  return (
    <div className="flex flex-col bg-white px-10 py-10 rounded-xl">
      {pagination && (
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
          <div className="flex items-center gap-5 ">
            <div className="flex gap-3 bg-[#F9F9F9] rounded-xl p-3">
              <SearchIcon />
              <input
                className="bg-[#F9F9F9] focus:outline-none"
                onChange={onSearch}
                placeholder="Pencarian"
              />
            </div>
            <button className="bg-transparent flex gap-3">
              <FilterIcon />
              <span className="font-semibold">Filter</span>
            </button>
            <DropdownButton
              className="p-3"
              style={{
                backgroundColor: "#EEF6FF",
                color: "#1F3368",
              }}
              label="Aksi"
              options={actionOptions}
            />
          </div>
        </div>
      )}
      <div className="overflow-visible rounded-xl">
        <table className="min-w-full table-auto dark:bg-boxdark dark:text-white">
          <thead>
            <tr className="text-[#A1A5B7] bg-[#F1F1F2] dark:bg-body">
              {fields?.map((field, indexField) => (
                <th
                  key={`field${indexField}`}
                  className={clsx(
                    `px-2 py-2 ${
                      indexField === 0
                        ? "rounded-l-xl"
                        : indexField === fields.length - 1
                        ? "rounded-r-xl"
                        : ""
                    }`,
                    field.className ?? ""
                  )}
                >
                  <div className="py-2">{field.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values && values.length !== 0 ? (
              values.map((value, indexValue) => (
                <tr
                  key={indexValue}
                  className="border-b-2 border-dashed border-[#E1E3EA] "
                >
                  {fields?.map((field, indexField) => (
                    <td
                      key={`fieldValue${indexField}`}
                      className={clsx("py-4", field.className ?? "")}
                    >
                      <div className={"px-4"}>
                        <div className={"px-2"}>
                          {scopedSlots && scopedSlots[field.key] ? (
                            <Fragment>
                              {scopedSlots[field.key](value, indexValue)}
                            </Fragment>
                          ) : (
                            value[field.key]
                          )}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan={fields?.length} className="p-5">
                  Data Kosong
                </td>
              </tr>
            )}
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
