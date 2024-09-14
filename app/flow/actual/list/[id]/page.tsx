/* eslint-disable @next/next/no-img-element */
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import Modal from "@/components/Modals/Modals";
import { DateRange } from "react-date-range";
import Table from "@/components/Tables/Table";
import { VerticalThreeDotsIcon } from "@/public/images/icon/icon";
import {
  createData,
  deleteData,
  getDatas,
  getOptions,
  updateData,
} from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import formDataToObject from "@/utils/formDataToObject";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import DateRangePickerInput from "@/components/Input/DateRangePicker";
import moment from "moment";

interface FilterType {
  startDate?: Date;
  endDate?: Date;
  withDate?: boolean;
}

const ActualFlowHistoryPage = () => {
  const { id } = useParams();

  const url = "/nodes/actual-flow/" + id;
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

  const handlesGetDatas = useCallback(async () => {
    getDatas(
      url,
      { limit: paginationData.limit, page: paginationData.page },
      { search: delayedSearch },
      setDatas,
      setPaginationData
    );
  }, [delayedSearch, paginationData.limit, paginationData.page, url]);
  useEffect(() => {
    handlesGetDatas();
    if (id)
      getOptions(
        "/nodes/lines-in-node/" + id,
        setLinesByNode,
        { isDropDown: true },
        {}
      );
  }, [handlesGetDatas, id]);

  const [linesByNode, setLinesByNode] = useState([]);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteData("/nodes/actual-flow/delete", id);
      handlesGetDatas();
    }
  };

  // Modal
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (data) {
      setModalAdd(true);
    }
  }, [data]);

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = formDataToObject(new FormData(formRef.current));
    formData.dataFilter = dataFilter;
    formData.node_id = id;
    formData.actual_flow_value = formData.actual_flow_value.replace(",", ".");
    await createData("/nodes/" + "/actual-flow", formData);
    setModalAdd(false);
    handlesGetDatas();
    // if (id) {
    //   // await updateData(url, id, formData);
    // } else {
    //   navigation.back();
    // }
  };

  const [dataFilter, setFilter] = useState<FilterType>({});

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    if (key === "withDate") {
      setFilter((prev) => ({ ...prev, [key]: value === "true" }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <>
      <Breadcrumb pageName="Debit Aktual" />
      <div className="flex flex-col gap-10">
        <Table
          actionOptions={[
            {
              label: "Tambah Data",
              action: (e: any) => {
                setModalAdd(true);
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
            node_id: (item: any) => (
              <span>{item.node_id?.name ?? "Tidak Ada Titik Bangunan"}</span>
            ),
            direction_line: (item: any) => (
              <span>{item.direction_line?.name ?? "Tidak Ada Saluran"}</span>
            ),
            date: (item: any) => (
              <span>{moment(item.date).format("DD MMMM YYYY")}</span>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={[
                    // {
                    //   label: "Ubah",
                    //   action: (e: any) => {
                    //     navigation.push(pathname + "/form/" + item.id);
                    //   },
                    // },
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
              key: "node_id",
              label: "Titik Bangunan",
            },
            {
              key: "direction_line",
              label: "Arah Saluran",
            },
            {
              key: "date",
              label: "Tanggal",
            },
            {
              key: "actual_flow_value",
              label: "Debit Kenyataan (l/s)",
            },
            {
              key: "actual_level_value",
              label: "Level Air Kenyataan (m)",
            },
            {
              key: "action",
              label: "Aksi",
            },
          ]}
        />
      </div>
      <Modal
        isOpen={modalAdd}
        onClose={() => {
          setModalAdd(false);
          setData("");
        }}
        title="Data Aktual"
      >
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col">
          <div className="my-5 grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="w-full xl:w-full">
              <DropDownInput
                required
                data={data}
                label="Saluran"
                name="direction_line"
                options={[
                  {
                    label: "Tidak ada",
                    value: "",
                  },
                  ...linesByNode,
                ]}
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                required
                data={data}
                name="actual_flow_value"
                label="Debit Kenyataan"
                placeholder="Debit Kenyataan"
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                data={data}
                name="actual_level_value"
                label="Level Air Kenyataan"
                placeholder="Level Air Kenyataan"
              />
            </div>
          </div>
          <div className="w-full xl:w-full mb-5">
            <DropDownInput
              label="Tanggal Pengisian"
              onChange={(e) => handleFilterChange("withDate", e.target.value)}
              value={dataFilter.withDate ? "true" : "false"}
              options={[
                { value: "false", label: "HARI INI" },
                { value: "true", label: "PILIH RENTANG TANGGAL" },
              ]}
            />
          </div>
          {dataFilter.withDate && (
            <div className="flex w-full xl:w-full">
              <DateRangePickerInput
                value={[
                  dataFilter.startDate || new Date(),
                  dataFilter.endDate || new Date(),
                ]}
                onChange={(start, end) => {
                  handleFilterChange(
                    "startDate",
                    moment(start).format("YYYY-MM-DD")
                  );
                  handleFilterChange(
                    "endDate",
                    moment(end).format("YYYY-MM-DD")
                  );
                }}
              />
            </div>
          )}
          <div className="border-t text-stroke" />
          <div className="flex justify-end gap-3 mt-5">
            <Button
              label="Back"
              onClick={(e) => {
                e.preventDefault();
                setModalAdd(false);
                setData(null);
              }}
            />
            <Button label="Submit" />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ActualFlowHistoryPage;
