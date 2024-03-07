"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Table from "@/components/Tables/Table";
import { VerticalThreeDotsIcon } from "@/public/images/icon/icon";
import { PaginationProps } from "@/types/pagination";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import { deleteData, getDatas } from "@/services/base.service";
import { convertPhoneNumberFormat } from "@/utils/convertPhoneNumberFormat";

const AccountManagementPage = () => {
  const url = "/accounts";
  const navigation = useRouter();
  const pathname = usePathname();
  const [data, setDatas] = useState();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);

  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: 1,
    limit: 10,
  });

  const fetchAllData = useCallback(async () => {
    getDatas(
      url,
      { limit: paginationData.limit, page: paginationData.page },
      { search: delayedSearch },
      setDatas,
      setPaginationData
    );
  }, [delayedSearch, paginationData.limit, paginationData.page]);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteData(url, id);
      fetchAllData();
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <>
      <Breadcrumb pageName="Manajemen Akun" />

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
          actionOptions={[
            {
              label: "Tambah Data",
              action: (e: any) => {
                navigation.push(pathname + "/form");
              },
            },
          ]}
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
            username: (item: any, index: number) => (
              <div>{item.account.username}</div>
            ),
            name: (item: any, index: number) => <div>{item.account.name}</div>,
            email: (item: any, index: number) => (
              <div>{item.account.email}</div>
            ),
            mobile_phone_number: (item: any, index: number) => (
              <a
                href={`https://wa.me/${convertPhoneNumberFormat(
                  item.account.mobile_phone_number
                )}`}
                target="_blank"
              >
                {item.account.mobile_phone_number}
              </a>
            ),
            role: (item: any, index: number) => <div>{item.account.role}</div>,
            action: (item: any, index: number) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={[
                    {
                      label: "Ubah",
                      action: (e: any) => {
                        navigation.push(pathname + "/form/" + item.account.id);
                      },
                    },
                    {
                      label: "Hapus",
                      action: (e: any) => {
                        handleDelete(item.account.id);
                      },
                    },
                  ]}
                />
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
              label: "Nomor HP/WA",
            },
            {
              key: "role",
              label: "Role",
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
