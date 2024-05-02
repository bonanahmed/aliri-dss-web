"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import TextInput from "@/components/Input/TextInput";
import Modal from "@/components/Modals/Modals";
import Table from "@/components/Tables/Table";
import { VerticalThreeDotsIcon } from "@/public/images/icon/icon";
import {
  createData,
  deleteData,
  getData,
  getDatas,
  updateData,
} from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
const ListSettingPage: React.FC<any> = ({ id }: { id?: string }) => {
  const url = "/areas";

  const [data, setData] = useState<any>();

  const [dataLabel, setDataLabel] = useState<string>("");
  const [dataKey, setDataKey] = useState<string>("");
  const [dataValue, setDataValue] = useState<string>("");
  const [dataId, setDataId] = useState<string>("");

  useEffect(() => {
    if (data) {
      setDataLabel(data.label);
      setDataKey(data.key);
      setDataValue(data.value);
    }
  }, [data]);
  useEffect(() => {
    if (dataId) {
      getData(url + "/configuration", dataId, setData);
      setModalForm(true);
    }
  }, [dataId]);

  const navigation = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = formDataToObject(new FormData(formRef.current));
    formData.area_id = id;
    if (dataId) await updateData(url + "/configuration", dataId, formData);
    else await createData(url + "/configuration/create", formData);
    setModalForm(false);
    handlesGetDatas();
    setDataLabel("");
    setDataKey("");
    setDataValue("");
    setDataId("");
  };

  // const url = "/areas";

  const [modalForm, setModalForm] = useState<boolean>(false);

  const [datas, setDatas] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 12),
    limit: 100,
  });

  const handlesGetDatas = useCallback(async () => {
    getDatas(
      url + "/flow/summary/list",
      { limit: paginationData.limit, page: paginationData.page },
      { search: delayedSearch, area_id: id },
      setDatas,
      setPaginationData
    );
  }, [id, delayedSearch, paginationData.limit, paginationData.page]);
  useEffect(() => {
    handlesGetDatas();
  }, [handlesGetDatas]);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteData(url + "/configuration", id);
      handlesGetDatas();
    }
  };

  return (
    <>
      <Breadcrumb pageName="Rekapitulasi Debit Per Saluran" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table
          // actionOptions={[
          //   {
          //     label: "Tambah Data",
          //     action: (e: any) => {
          //       setModalForm(true);
          //     },
          //   },
          // ]}
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
            name: (item: any) => (
              <a href={item.content} target="_blank">
                {item.name}
              </a>
            ),
            area_id: (item: any) => (
              <span>{item.area_id?.name ?? "Tidak Ada Wilayah"}</span>
            ),
            debit_aktual: (item: any) => (
              <span>{item.debit_aktual ?? "-"}</span>
            ),
            selisih_debit: (item: any) => (
              <span>{item.selisih_debit ?? "-"}</span>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={
                    [
                      // {
                      //   label: "Ubah",
                      //   action: (e: any) => {
                      //     setDataId(item.id);
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
              label: "Tipe Saluran",
            },
            {
              key: "area_id",
              label: "Daerah Irigasi",
            },
            {
              key: "debit_rekomendasi",
              label: "Debit Rekomendasi",
            },
            {
              key: "debit_aktual",
              label: "Debit Aktual",
            },
            {
              key: "selisih_debit",
              label: "Selisih Debit",
            },
            // {
            //   key: "action",
            //   label: "Aksi",
            // },
          ]}
        />

        <Modal
          title="Masukkan Data"
          isOpen={modalForm}
          onClose={() => {
            setModalForm(false);
          }}
        >
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="overflow-auto max-w-[50vw] max-h-[75vh]">
              <div className="grid grid-cols-3 gap-3">
                <TextInput
                  label="Label"
                  name="label"
                  value={dataLabel}
                  onChange={(e) => {
                    setDataLabel(e.target.value);
                  }}
                />
                <TextInput
                  label="Key"
                  name="key"
                  value={dataKey}
                  onChange={(e) => {
                    setDataKey(e.target.value);
                  }}
                />
                <TextInput
                  label="Value"
                  name="value"
                  value={dataValue}
                  onChange={(e) => {
                    setDataValue(e.target.value);
                  }}
                />
              </div>
              <Modal.Footer className="flex justify-end gap-3">
                <Button
                  label="Back"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalForm(false);
                  }}
                />
                <Button label="Submit" />
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ListSettingPage;
