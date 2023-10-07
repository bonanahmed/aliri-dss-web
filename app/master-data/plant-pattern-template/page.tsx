"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import Table from "@/components/Tables/Table";
import { AddIcon } from "@/public/images/icon/icon";
import {
  deleteData,
  getDatas,
} from "@/services/master-data/plant-pattern-template";
import { PaginationProps } from "@/types/pagination";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const PlantPatternTemplatePage = () => {
  const navigation = useRouter();
  const pathname = usePathname();
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 10),
    limit: 10,
  });

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

  const [datas, setDatas] = useState<any>();
  const handleDelete = async (id: string) => {
    await deleteData(id);
  };
  const handlesGetDatas = useCallback(async () => {
    getDatas(
      paginationData.limit,
      paginationData.page,
      setDatas,
      setPaginationData
    );
  }, [paginationData.limit, paginationData.page]);
  useEffect(() => {
    handlesGetDatas();
  }, [handlesGetDatas]);

  return (
    <>
      <Breadcrumb pageName="Template Pola Tanam">
        <Link href={"/master-data/plant-pattern-template/form"}>
          <Button label="Tambah Data" icon={<AddIcon />} />
        </Link>
      </Breadcrumb>

      <div className="flex flex-col gap-10">
        <Table
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
            pastens: (item: any) => (
              <div>
                {showOnlyDifferentValueFromArray(
                  "code",
                  item.plant_patterns
                ).map((pattern: any, index: number) => (
                  <div key={`${pattern.code}${index}`}>{pattern.code}</div>
                ))}
              </div>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                {/* <Button
                  label="Ubah"
                  onClick={() => {
                    navigation.push(pathname + "/form/" + item.id);
                  }}
                /> */}
                <Button
                  label="Hapus"
                  onClick={() => {
                    handleDelete(item._id);
                  }}
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
