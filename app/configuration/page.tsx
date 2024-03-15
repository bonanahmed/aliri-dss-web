/* eslint-disable @next/next/no-img-element */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardImage from "@/components/CardImage/CardImage";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import DropDownInput from "@/components/Input/DropDownInput";
import Pagination from "@/components/Pagination/Pagination";
import useLocalStorage from "@/hooks/useLocalStorage";
import { FilterIcon, SearchIcon } from "@/public/images/icon/icon";
import { getDatas } from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const SettingPage = () => {
  const url = "/areas";
  const navigation = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useLocalStorage<any>("user", {});

  const [datas, setDatas] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 12),
    limit: 12,
  });

  const handlesGetDatas = useCallback(async () => {
    getDatas(
      url,
      { limit: paginationData.limit, page: paginationData.page },
      { search: delayedSearch, type: "daerah irigasi" },
      setDatas,
      setPaginationData
    );
  }, [delayedSearch, paginationData.limit, paginationData.page]);
  useEffect(() => {
    handlesGetDatas();
  }, [handlesGetDatas]);

  return (
    <>
      <Breadcrumb pageName="Pengaturan Data Daerah Irigasi" />
      <div className="bg-white rounded-2xl w-full p-5">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-row items-center">
            <span className="mr-3">Tampilkan</span>
            <div>
              <DropDownInput
                options={[
                  {
                    label: "12",
                    value: 12,
                  },
                  {
                    label: "24",
                    value: 24,
                  },
                  {
                    label: "56",
                    value: 56,
                  },
                  {
                    label: "120",
                    value: 120,
                  },
                ]}
                onChange={(e) => {
                  setPaginationData({
                    ...paginationData,
                    page: 1,
                    totalPages: Math.ceil(
                      paginationData.totalDocs / parseInt(e.target.value)
                    ),
                    limit: parseInt(e.target.value),
                  });
                }}
              />
            </div>
            <span className="ml-3">Data</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-5 ">
            <div className="flex gap-3 bg-[#F9F9F9] rounded-xl p-3">
              <SearchIcon />
              <input
                className="bg-[#F9F9F9] focus:outline-none"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
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
              options={[
                {
                  label: "Tambah Data",
                  action: (e: any) => {
                    navigation.push(pathname + "/form");
                  },
                },
              ]}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
          {datas?.map((item: any, index: number) => (
            <div
              key={index}
              className="shadow-3 rounded-xl w-full p-5 cursor-pointer"
              onClick={() => {
                navigation.push(pathname + "/form/" + item.id);
              }}
            >
              <div className="flex flex-col">
                <CardImage iconType="gear" images={item?.images} />
                <div className="text-center text-title-md font-bold text-black mb-5">
                  {item.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        {paginationData && (
          <div className="mt-3">
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
        )}
      </div>
    </>
  );
};

export default SettingPage;
