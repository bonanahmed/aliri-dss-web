"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import Table from "@/components/Tables/Table";
import { AddIcon } from "@/public/images/icon/icon";
import { PaginationProps } from "@/types/pagination";
import Link from "next/link";
import { useState } from "react";

const SaluranPage = () => {
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    currentPage: 1,
    totalData: 200,
    totalPage: Math.ceil(200 / 10),
    perPage: 10,
  });

  return (
    <>
      <Breadcrumb pageName="Saluran">
        <Link href={"/master-data/saluran/form"}>
          <Button label="Tambah Data" icon={<AddIcon />} />
        </Link>
      </Breadcrumb>

      <div className="flex flex-col gap-10">
        <Table
          onPaginationNumberClick={(currentNumber) => {
            setPaginationData({
              ...paginationData,
              currentPage: currentNumber,
            });
          }}
          pagination={paginationData}
          onItemsPerPageChange={(e) => {
            setPaginationData({
              ...paginationData,
              currentPage: 1,
              totalPage: Math.ceil(
                paginationData.totalData / parseInt(e.target.value)
              ),
              perPage: parseInt(e.target.value),
            });
          }}
          values={[
            {
              parent_id: "Kedung Putri",
              name: "Salosan",
              type: "Sekunder",
            },
          ]}
          fields={[
            {
              key: "parent_id",
              label: "Parent",
            },
            {
              key: "name",
              label: "Nama Saluran",
            },
            {
              key: "type",
              label: "Jenis Saluran",
            },
          ]}
        />
      </div>
    </>
  );
};

export default SaluranPage;
