"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import Table from "@/components/Tables/Table";
import { AddIcon } from "@/public/images/icon/icon";
import { PaginationProps } from "@/types/pagination";
import Link from "next/link";
import { useState } from "react";

const PastenPage = () => {
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    currentPage: 1,
    totalData: 49,
    totalPage: Math.ceil(49 / 10),
    perPage: 10,
  });

  return (
    <>
      <Breadcrumb pageName="Pasten">
        <Link href={"/master-data/pasten/form"}>
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
              color: "#aa6116",
              code: "1a",
              plant_type: "Padi",
              growth_time: "Pengolahan tanah",
              pasten: "1.25",
            },
            {
              color: "#e9edee",
              code: "1b",
              plant_type: "Padi",
              growth_time: "Pertumbuhan 1",
              pasten: "0.73",
            },
            {
              color: "#1481c1",
              code: "1c",
              plant_type: "Padi",
              growth_time: "Pertumbuhan 2",
              pasten: "0.73",
            },
            {
              color: "#2aa5a5",
              code: "1d",
              plant_type: "Padi",
              growth_time: "Panen",
              pasten: "0",
            },
            {
              color: "#7bc241",
              code: "2a",
              plant_type: "Tebu",
              growth_time: "Pengolahan Tanah",
              pasten: "0.85",
            },
            {
              color: "#d31245",
              code: "2b",
              plant_type: "Tebu",
              growth_time: "Tebu Muda",
              pasten: "0.36",
            },
            {
              color: "#eb6201",
              code: "2c",
              plant_type: "Tebu",
              growth_time: "Tebu Tua",
              pasten: "1.25",
            },
            {
              color: "#4cad31",
              code: "3a",
              plant_type: "Palawija",
              growth_time: "Yang Perlu Banyak Air",
              pasten: "1.25",
            },
            {
              color: "#0000FF",
              code: "3b",
              plant_type: "Palawija",
              growth_time: "Yang Perlu Sedikit Air",
              pasten: "1.25",
            },
          ]}
          fields={[
            {
              key: "code",
              label: "Kode",
            },
            {
              key: "plant_type",
              label: "Jenis Tanaman",
            },
            {
              key: "growth_time",
              label: "Periode Pertumbuhan",
            },
            {
              key: "pasten",
              label: "Pasten (l/dt/ha)",
            },
          ]}
        />
      </div>
    </>
  );
};

export default PastenPage;
