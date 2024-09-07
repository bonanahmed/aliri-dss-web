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

const GolonganPage = () => {
  const url = "/groups";
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

  return (
    <>
      <Breadcrumb pageName="Golongan" />

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
          values={datas}
          scopedSlots={{
            template: (item: any) => (
              <div>{item.plant_pattern_template_name_id?.name}</div>
            ),
            area_id: (item: any) => (
              <div>{item.area_id?.name ?? "Tidak Ada Daerah Irigasi"}</div>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={[
                    {
                      label: "Ubah",
                      action: (e: any) => {
                        navigation.push(pathname + "/form/" + item.id);
                      },
                    },
                    {
                      label: "Hapus",
                      action: (e: any) => {
                        handleDelete(item.id);
                      },
                    },
                  ]}
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
              key: "area_id",
              label: "Daerah Irigasi",
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
