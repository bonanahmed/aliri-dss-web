"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import Table from "@/components/Tables/Table";
import { AddIcon, VerticalThreeDotsIcon } from "@/public/images/icon/icon";
import { deleteData, getDatas } from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const PlantPatternTemplatePage = () => {
  const url = "/plant-pattern-templates";
  const navigation = useRouter();
  const pathname = usePathname();

  const [datas, setDatas] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 10),
    limit: 10,
  });

  const handlesGetDatas = useCallback(async () => {
    getDatas(
      url,
      { limit: paginationData.limit, page: paginationData.page },
      { search: delayedSearch },
      setDatas,
      setPaginationData
    );
  }, [delayedSearch, paginationData.limit, paginationData.page]);
  useEffect(() => {
    handlesGetDatas();
  }, [handlesGetDatas]);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteData(url, id);
      handlesGetDatas();
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

  return (
    <>
      <Breadcrumb pageName="Template Pola Tanam" />
      <div className="flex flex-col gap-10">
        <Table
          actionOptions={[
            {
              label: "Tambah Data",
              action: (e: any) => {
                navigation.push(pathname + "/form");
              },
            },
          ]}
          onSearch={(e) => {
            setSearch(e.target.value);
          }}
          onPaginationNumberClick={(currentNumber) => {
            setPaginationData({
              ...paginationData,
              page: currentNumber,
            });
          }}
          pagination={paginationData}
          onItemsPerPageChange={(e) => {
            setPaginationData({
              ...paginationData,
              page: 1,
              totalPages: Math.ceil(
                paginationData.totalDocs / parseInt(e.target.value)
              ),
              limit: parseInt(e.target.value),
            });
          }}
          scopedSlots={{
            area_id: (item: any) => (
              <div className="flex gap-3">
                {item.area_id?.name ?? "Tidak Ada Daerah Irigasi"}
              </div>
            ),
            pastens: (item: any) => (
              <div className="flex gap-3">
                {showOnlyDifferentValueFromArray(
                  "code",
                  item.plant_patterns
                ).map((pattern: any, index: number) => (
                  <div
                    key={`${pattern.code}${index}`}
                    className="rounded-full p-5 text-white"
                    style={{
                      backgroundColor: pattern.color,
                    }}
                  >
                    {pattern.code}
                  </div>
                ))}
              </div>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={[
                    {
                      label: "Ubah",
                      action: (e: any) => {
                        navigation.push(pathname + "/form/" + item._id);
                      },
                    },
                    {
                      label: "Hapus",
                      action: (e: any) => {
                        handleDelete(item._id);
                      },
                    },
                  ]}
                />
              </div>
            ),
          }}
          values={datas}
          fields={[
            {
              key: "name",
              label: "Nama Template Pola Tanam",
            },
            {
              key: "area_id",
              label: "Daerah Irigasi",
            },
            {
              key: "pastens",
              label: "List Pasten",
            },
            {
              key: "action",
              label: "Aksi",
            },
          ]}
        />
      </div>
    </>
  );
};

export default PlantPatternTemplatePage;
