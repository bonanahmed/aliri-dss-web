"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import Table from "@/components/Tables/Table";
import { AddIcon } from "@/public/images/icon/icon";
import { getDatas, deleteData } from "@/services/master-data/node";
import { PaginationProps } from "@/types/pagination";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const NodesPage = () => {
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
      <Breadcrumb pageName="Titik Bangunan">
        <Link href={"/master-data/nodes/form"}>
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
            parent: (item: any) => (
              <span>{item.parent_id?.name ?? "Tidak Ada Parent"}</span>
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
          values={datas}
          fields={[
            {
              key: "parent",
              label: "Parent",
            },
            {
              key: "name",
              label: "Nama Titik",
            },
            {
              key: "type",
              label: "Jenis Titik",
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

export default NodesPage;
