"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import Button from "@/components/Buttons/Button";
import Table from "@/components/Tables/Table";
import {
  AddIcon,
  // StateDeleteIcon,
  // StateEditIcon,
} from "@/public/images/icon/icon";
import { PaginationProps } from "@/types/pagination";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
// import { deleteData, getAllData } from "@/services/account-management";
import { useDebounce } from "use-debounce";
import Button from "@/components/Buttons/Buttons";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";

const AccountManagementPage = () => {
  const url = "/account";
  const navigation = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);

  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: 1,
    limit: 10,
  });

  const fetchAllData = useCallback(async () => {
    // await getAllData(
    //   { limit: paginationData.limit, page: paginationData.page },
    //   { search: delayedSearch },
    //   setData,
    //   setPaginationData
    // );
  }, [delayedSearch, paginationData.limit, paginationData.page]);

  const handleDelete = async (id: string) => {
    // if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
    //   await deleteData(id);
    //   fetchAllData();
    // }
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <>
      <Breadcrumb pageName="Manajemen Akun">
        <DropdownButton
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
      </Breadcrumb>

      <div className="flex flex-col gap-10">
        <Table
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
            action: (item: any, index: number) => (
              <div className="inline-flex justify-between ">
                {/* <Button
                  onClick={() => {
                    route.push(`/account-management/form/${item.id}`);
                  }}
                  icon={<StateEditIcon />}
                  color="bg-transparent"
                  className="text-aktiorange-50"
                />
                <Button
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                  icon={<StateDeleteIcon />}
                  color="bg-transparent"
                  className="text-aktired-30"
                /> */}
              </div>
            ),
          }}
          values={data ?? []}
          fields={[
            {
              key: "username",
              label: "Username",
            },
            {
              key: "name",
              label: "Nama",
            },
            {
              key: "email",
              label: "E-mail",
            },
            {
              key: "mobile_phone_number",
              label: "Nomor HP",
            },
            {
              key: "KTP",
              label: "Nomor KTP",
            },
            {
              key: "action",
              label: "Action",
            },
          ]}
        />
      </div>
    </>
  );
};

export default AccountManagementPage;
