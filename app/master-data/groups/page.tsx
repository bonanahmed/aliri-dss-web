"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import Table from "@/components/Tables/Table";
import { AddIcon } from "@/public/images/icon/icon";
import { deleteData, getDatas } from "@/services/master-data/group";
import { PaginationProps } from "@/types/pagination";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const GolonganPage = () => {
  const navigation = useRouter();
  const pathname = usePathname();
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 10),
    limit: 10,
  });

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
      <Breadcrumb pageName="Golongan">
        <Link href={"/master-data/groups/form"}>
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
          values={datas}
          scopedSlots={{
            template: (item: any) => (
              <div>{item.plant_pattern_template_name_id?.name}</div>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                <Button
                  label="Ubah"
                  onClick={() => {
                    navigation.push(pathname + "/form/" + item.id);
                  }}
                />
                <Button
                  label="Hapus"
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                />
              </div>
            ),
          }}
          fields={[
            {
              key: "name",
              label: "Nama Golongan",
            },
            {
              key: "period",
              label: "Periode",
            },
            {
              key: "template",
              label: "Template Golongan",
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

export default GolonganPage;
