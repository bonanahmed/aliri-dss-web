/* eslint-disable @next/next/no-img-element */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardImage from "@/components/CardImage/CardImage";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import DropDownInput from "@/components/Input/DropDownInput";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Tables/Table";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  AddIcon,
  DeleteIcon,
  Edit2Icon,
  FilterIcon,
  SearchIcon,
  VerticalThreeDotsIcon,
} from "@/public/images/icon/icon";
import { deleteData, getDatas } from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const SaluranPage = () => {
  const url = "/lines";
  const navigation = useRouter();
  const pathname = usePathname();

  const [datas, setDatas] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 12),
    limit: 12,
  });

  const [layoutView, setLayoutView] = useLocalStorage<string>(
    "line_view_type",
    "grid"
  );

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
      <Breadcrumb pageName="Saluran" />
      {layoutView === "grid" ? (
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
                  {
                    label: "Ubah Tampilan",
                    action: (e: any) => {
                      setLayoutView("table");
                    },
                  },
                ]}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
            {datas?.map((item: any, index: number) => (
              <div
                key={"lines" + index}
                className="shadow-3 rounded-xl w-full p-5"
              >
                <div className="flex flex-col">
                  <CardImage images={item?.images} />
                  <div className="text-center text-title-md font-bold text-black mb-5">
                    {item.name}
                  </div>
                  <div className="text-center mb-5">
                    {item.node_id?.line_id?.name ?? "Tidak ada parent"}
                  </div>
                  <div className="text-center text-success text-lg mb-5">
                    {item.type}
                  </div>
                  <div className="flex justify-center">
                    <div className="grid grid-cols-3 gap-10">
                      <button
                        className="flex justify-center items-center w-16 h-12 rounded-xl bg-[#FFE2E5]"
                        onClick={(e: any) => {
                          handleDelete(item.id);
                        }}
                      >
                        <DeleteIcon />
                      </button>
                      <button
                        className="flex justify-center items-center w-16 h-12 rounded-xl bg-[#E1F0FF]"
                        onClick={(e: any) => {
                          navigation.push(pathname + "/form/" + item.id);
                        }}
                      >
                        <Edit2Icon />
                      </button>
                      <div className="flex justify-center items-center w-16 h-12 rounded-xl bg-[#F3F6F9]">
                        <DropdownButton
                          className="bg-transparent text-black"
                          icon={<VerticalThreeDotsIcon size="24" />}
                          options={
                            [
                              // {
                              //   label: "Cetak Papan Eksploitasi",
                              //   action: (e: any) => {
                              //     navigation.push(
                              //       "/papan-eksploitasi?nodeId=" + item.id
                              //     );
                              //   },
                              // },
                              // {
                              //   label: "Ubah",
                              //   action: (e: any) => {
                              //     navigation.push(pathname + "/form/" + item.id);
                              //   },
                              // },
                              // {
                              //   label: "Hapus",
                              //   action: (e: any) => {
                              //     handleDelete(item.id);
                              //   },
                              // },
                            ]
                          }
                        />
                      </div>
                    </div>
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
      ) : (
        <Table
          actionOptions={[
            {
              label: "Tambah Data",
              action: (e: any) => {
                navigation.push(pathname + "/form");
              },
            },
            {
              label: "Ubah Tampilan",
              action: (e: any) => {
                setLayoutView("grid");
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
            parent: (item: any) => (
              <span>
                {item.node_id?.line_id?.name ?? "Tidak Ada Saluran Hulu"}
              </span>
            ),
            node_id: (item: any) => (
              <span>{item.node_id?.name ?? "Tidak Ada Titik"}</span>
            ),
            juru: (item: any) => (
              <span>{item.detail?.juru?.name ?? "Tidak Ada Juru"}</span>
            ),
            kemantren: (item: any) => (
              <span>
                {item.detail?.kemantren?.name ?? "Tidak Ada Kemantren"}
              </span>
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
          values={datas}
          fields={[
            {
              key: "name",
              label: "Nama Saluran",
            },
            {
              key: "type",
              label: "Jenis Saluran",
            },
            {
              key: "parent",
              label: "Saluran Hulu",
            },
            {
              key: "node_id",
              label: "Titik",
            },
            {
              key: "juru",
              label: "Juru",
            },
            {
              key: "kemantren",
              label: "Kemantren",
            },
            {
              key: "action",
              label: "Aksi",
            },
          ]}
        />
      )}
    </>
  );
};

export default SaluranPage;
