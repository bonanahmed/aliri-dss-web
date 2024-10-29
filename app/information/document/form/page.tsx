"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DocumentUpload from "@/components/DocumentUpload/DocumentUpload";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import Modal from "@/components/Modals/Modals";
import PickFilePage from "@/components/PickFile/PickFile";
import Table from "@/components/Tables/Table";
import { VerticalThreeDotsIcon } from "@/public/images/icon/icon";
import {
  createData,
  deleteData,
  getData,
  getDatas,
} from "@/services/base.service";
import { PaginationProps } from "@/types/pagination";
import { handleDownload } from "@/utils/downloadFile";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
const ListDocumentPage: React.FC<any> = ({ id }: { id?: string }) => {
  const url = "/areas";

  const { authenticated } = useSelector((state: any) => state.global);

  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (id) getData(url, id, setData);
  }, [id]);

  const navigation = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = formDataToObject(new FormData(formRef.current));
    if (formData.url) formData.url = JSON.parse(formData.url);

    formData.name = formData.url.name;
    formData.type = formData.url.type;
    formData.size = formData.url.size;
    formData.content = formData.url.content;
    formData.area_id = id;
    await createData(url + "/documents/create", formData);
    setModalUploadDocument(false);
    handlesGetDatas();
  };
  const chooseFile = async (data: any) => {
    const body = convertFormat(data);
    await createData(url + "/documents/create", body);
    setModalUploadDocument(false);
    handlesGetDatas();
  };
  const convertFormat = (data: any) => {
    return {
      content: data.url,
      name: data.name,
      size: data.size,
      type: data.format,
      area_id: id,
    };
  };
  // const url = "/areas";

  const [modalUploadDocument, setModalUploadDocument] =
    useState<boolean>(false);

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
      url + "/documents/list",
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
      await deleteData(url + "/documents", id);
      handlesGetDatas();
    }
  };

  return (
    <>
      <Breadcrumb pageName="Dokumen Daerah Irigasi" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table
          actionOptions={
            authenticated?.user?.role === "superadmin" ||
            authenticated?.user?.role === "admin"
              ? [
                  {
                    label: "Tambah Data",
                    action: (e: any) => {
                      setModalUploadDocument(true);
                    },
                  },
                ]
              : undefined
          }
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
            size: (item: any) => (
              <span>{(item.size / (1024 * 1024)).toFixed(2)} mb</span>
            ),
            action: (item: any) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={
                    authenticated?.user?.role === "superadmin" ||
                    authenticated?.user?.role === "admin"
                      ? [
                          {
                            label: "Hapus",
                            action: (e: any) => {
                              handleDelete(item.id);
                            },
                          },
                          {
                            label: "Download File",
                            action: (e: any) => {
                              handleDownload(item.name, item.content);
                            },
                          },
                        ]
                      : [
                          {
                            label: "Download File",
                            action: (e: any) => {
                              handleDownload(item.name, item.content);
                            },
                          },
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
              label: "Nama Dokumen",
            },
            {
              key: "type",
              label: "Jenis Dokumen",
            },
            {
              key: "size",
              label: "Ukuran File",
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
        <Modal
          isOpen={modalUploadDocument}
          onClose={() => setModalUploadDocument(false)}
          title="File Manager"
        >
          <div className="md:w-[75vw] h-[100%]">
            <PickFilePage
              // pickType="image"
              callBack={(data) => {
                chooseFile(data);
              }}
            />
          </div>
        </Modal>
        {/* <Modal
          title="Upload Dokumen"
          isOpen={modalUploadDocument}
          onClose={() => {
            setModalUploadDocument(false);
          }}
        >
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="overflow-auto max-w-[50vw] max-h-[75vh]">
              <div className="my-5 flex justify-center">
                <DocumentUpload
                  name="url"
                  dataDocument={data?.files}
                  path={"areas/documents/" + id}
                />
              </div>
              <Modal.Footer className="flex justify-end gap-3">
                <Button
                  label="Back"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalUploadDocument(false);
                  }}
                />
                <Button label="Submit" />
              </Modal.Footer>
            </div>
          </form>
        </Modal> */}
      </div>
    </>
  );
};

export default ListDocumentPage;
