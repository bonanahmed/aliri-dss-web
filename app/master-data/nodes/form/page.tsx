"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import RatingCurveExcel from "@/components/Excel/RatingCurveExcel";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import PickImages from "@/components/PickImage/PickImage";
import Table from "@/components/Tables/Table";
import { VerticalThreeDotsIcon } from "@/public/images/icon/icon";
import { createData, getData, updateData } from "@/services/base.service";
import {
  getLineDatas,
  getNodeDatas,
  getAreasData,
} from "@/services/master-data/node";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const TitikFormPage: React.FC<any> = ({ id }: { id: string }) => {
  const [nodeDatas, setNodeDatas] = useState([]);
  const [lineDatas, setLineDatas] = useState([]);
  const [areaDatas, setAreaDatas] = useState([]);

  useEffect(() => {
    getNodeDatas(setNodeDatas);
    getLineDatas(setLineDatas);
    getAreasData(setAreaDatas);
  }, []);
  const url = "/nodes";

  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (id) getData(url, id, setData);
  }, [id]);
  useEffect(() => {
    setCCTVList(data?.detail?.cctv_list);
    setAdditionalInformations(data?.detail?.additional_informations);
  }, [data]);

  const navigation = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    let formData = formDataToObject(new FormData(formRef.current));
    if (formData.images) formData.images = JSON.parse(formData.images);
    if (formData.rating_curve_table)
      formData.rating_curve_table = JSON.parse(formData.rating_curve_table);
    if (cctvList?.length !== 0)
      formData = {
        ...formData,
        detail: {
          ...formData?.detail,
          cctv_list: cctvList,
        },
      };
    if (additionalInformations?.length !== 0)
      formData = {
        ...formData,
        detail: {
          ...formData?.detail,
          additional_informations: additionalInformations,
        },
      };
    console.log(formData);
    if (id) {
      await updateData(url, id, formData);
    } else {
      await createData(url, formData);
      navigation.back();
    }
  };

  const [cctvName, setCCTVName] = useState<string>("");
  const [cctvLink, setCCTVLink] = useState<string>("");
  const [cctvTypeStreaming, setCCTVTypeStreaming] =
    useState<string>("video/mp4");
  const [cctvList, setCCTVList] = useState<Array<any>>([]);
  const addCCTV = (e: any) => {
    e.preventDefault();
    let cctvDataList = cctvList ?? [];
    if (cctvName && cctvLink) {
      cctvDataList.push({
        name: cctvName,
        link: cctvLink,
        type: cctvTypeStreaming,
      });
      setCCTVName("");
      setCCTVLink("");
      setCCTVList([...cctvDataList]);
    } else {
      toast.error("Error: " + "Harap isi semua data CCTV");
    }
  };
  const handleDeleteCCTV = (index: number) => {
    cctvList.splice(index, 1);
    setCCTVList([...cctvList]);
  };
  // Additional Information
  const [additionalKey, setAdditionalKey] = useState<string>("");
  const [additionalValue, setAdditionalValue] = useState<string>("");
  const [additionalInformations, setAdditionalInformations] = useState<
    Array<any>
  >([]);
  const addAdditionalInformation = (e: any) => {
    e.preventDefault();
    let additionalDatas = additionalInformations ?? [];
    if (additionalKey && additionalValue) {
      additionalDatas.push({
        key: additionalKey,
        value: additionalValue,
      });
      setAdditionalKey("");
      setAdditionalValue("");
      setAdditionalInformations([...additionalDatas]);
    } else {
      toast.error(
        "Error: " + "Nama Keterangan dan Keterangan tidak boleh kosong"
      );
    }
  };
  const handleDeleteAdditionalInformation = (index: number) => {
    additionalInformations.splice(index, 1);
    setAdditionalInformations([...additionalInformations]);
  };

  return (
    <>
      <Breadcrumb pageName="Form Titik Bangunan" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="my-5 flex justify-start">
              <PickImages name="images" images={data.images} path="nodes" />
            </div>
            <div className="border-t text-stroke" />
            <div className="my-5 grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  data={data}
                  name="type"
                  label="Jenis Titik Bangunan"
                  options={[
                    {
                      label: "Bangunan Sadap",
                      value: "bangunan sadap",
                    },
                    {
                      label: "Bangunan Bagi",
                      value: "bangunan bagi",
                    },
                    {
                      label: "Bangunan Bagi Sadap",
                      value: "bangunan bagi sadap",
                    },
                    {
                      label: "Bangunan Corong",
                      value: "bangunan corong",
                    },
                    {
                      label: "Bangunan Ukur",
                      value: "bangunan ukur",
                    },
                    {
                      label: "Bendung",
                      value: "bendung",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  // required
                  data={data}
                  label="Titik Bangunan Hulu"
                  name="parent_id"
                  options={[
                    {
                      label: "Tidak ada",
                      value: "",
                    },
                    ...nodeDatas,
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  // required
                  data={data}
                  label="Titik Bangunan Sebelumnya"
                  name="prev_id"
                  options={[
                    {
                      label: "Tidak ada",
                      value: "",
                    },
                    ...nodeDatas,
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  // required
                  data={data}
                  label="Saluran"
                  name="line_id"
                  options={[
                    {
                      label: "Tidak ada",
                      value: "",
                    },
                    ...lineDatas,
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  // required
                  data={data}
                  label="Daerah Irigasi"
                  name="area_id"
                  options={[
                    {
                      label: "Tidak ada",
                      value: "",
                    },
                    ...areaDatas,
                  ]}
                />
              </div>

              <div className="w-full xl:w-full">
                <TextInput
                  required
                  data={data}
                  name="name"
                  label="Nama Titik"
                  placeholder="Nama Titik"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  required
                  data={data}
                  name="code"
                  label="Nama Kode Titik"
                  placeholder="Nama Kode Titik"
                />
              </div>
            </div>
            <div className="border-t border-stroke py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informasi CCTV
              </h3>
              <div className="my-5 grid grid-cols-1 xl:grid-cols-3 gap-3">
                <div className="w-full xl:w-full">
                  <TextInput
                    value={cctvName}
                    label="Nama CCTV"
                    placeholder="Nama CCTV"
                    onChange={(e) => {
                      setCCTVName(e.target.value);
                    }}
                  />
                </div>
                <div className="w-full xl:w-full">
                  <TextInput
                    value={cctvLink}
                    label="Link CCTV"
                    placeholder="Link CCTV"
                    onChange={(e) => {
                      setCCTVLink(e.target.value);
                    }}
                  />
                </div>
                <div className="w-full xl:w-full">
                  <DropDownInput
                    value={cctvTypeStreaming}
                    label="Tipe Streaming Video"
                    options={[
                      {
                        label: "Video/Mp4",
                        value: "video/mp4",
                      },
                    ]}
                    onChange={(e) => {
                      setCCTVTypeStreaming(e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-end">
                <Button label="Tambah CCTV" onClick={addCCTV} />
              </div>
              <Table
                values={cctvList}
                scopedSlots={{
                  action: (item: any, index: number) => (
                    <div className="flex flex-row gap-2 justify-center">
                      <DropdownButton
                        icon={<VerticalThreeDotsIcon size="18" />}
                        options={[
                          {
                            label: "Hapus",
                            action: (e: any) => {
                              handleDeleteCCTV(index);
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
                    label: "Nama CCTV",
                  },
                  {
                    key: "link",
                    label: "Link CCTV",
                  },
                  {
                    key: "type",
                    label: "Tipe Streaming",
                  },
                  {
                    key: "action",
                    label: "Aksi",
                  },
                ]}
              />
            </div>
            {/* <div className="border-t border-stroke py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Data Sensor
              </h3>
              <div className="my-5 grid grid-cols-1 xl:grid-cols-3 gap-3">
                <div className="w-full xl:w-full">
                  <TextInput
                    value={cctvName}
                    label="Nama Sensor"
                    placeholder="Nama CCTV"
                    onChange={(e) => {
                      setCCTVName(e.target.value);
                    }}
                  />
                </div>
                <div className="w-full xl:w-full">
                  <TextInput
                    value={cctvLink}
                    label="Kode Sensor"
                    placeholder="Link CCTV"
                    onChange={(e) => {
                      setCCTVLink(e.target.value);
                    }}
                  />
                </div>
                <div className="w-full xl:w-full">
                  <DropDownInput
                    value={cctvTypeStreaming}
                    label="Tipe Streaming Video"
                    options={[
                      {
                        label: "Video/Mp4",
                        value: "video/mp4",
                      },
                    ]}
                    onChange={(e) => {
                      setCCTVTypeStreaming(e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-end">
                <Button label="Tambah CCTV" onClick={addCCTV} />
              </div>
              <Table
                values={cctvList}
                scopedSlots={{
                  action: (item: any, index: number) => (
                    <div className="flex flex-row gap-2 justify-center">
                      <DropdownButton
                        icon={<VerticalThreeDotsIcon size="18" />}
                        options={[
                          {
                            label: "Hapus",
                            action: (e: any) => {
                              handleDeleteCCTV(index);
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
                    label: "Nama CCTV",
                  },
                  {
                    key: "link",
                    label: "Link CCTV",
                  },
                  {
                    key: "type",
                    label: "Tipe Streaming",
                  },
                  {
                    key: "action",
                    label: "Aksi",
                  },
                ]}
              />
            </div> */}
            <div className="border-t border-stroke py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informasi Tambahan
              </h3>
              <div className="my-5 grid grid-cols-1 xl:grid-cols-2 gap-3">
                <div className="w-full xl:w-full">
                  <TextInput
                    value={additionalKey}
                    label="Nama Keterangan"
                    placeholder="Nama Keterangan"
                    onChange={(e) => {
                      setAdditionalKey(e.target.value);
                    }}
                  />
                </div>
                <div className="w-full xl:w-full">
                  <TextInput
                    value={additionalValue}
                    label="Keterangan"
                    placeholder="Keterangan"
                    onChange={(e) => {
                      setAdditionalValue(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-end">
                <Button
                  label="Tambah Informasi Tambahan"
                  onClick={addAdditionalInformation}
                />
              </div>
              <Table
                values={additionalInformations}
                scopedSlots={{
                  action: (item: any, index: number) => (
                    <div className="flex flex-row gap-2 justify-center">
                      <DropdownButton
                        icon={<VerticalThreeDotsIcon size="18" />}
                        options={[
                          {
                            label: "Hapus",
                            action: (e: any) => {
                              handleDeleteAdditionalInformation(index);
                            },
                          },
                        ]}
                      />
                    </div>
                  ),
                }}
                fields={[
                  {
                    key: "key",
                    label: "Nama Keterangan",
                  },
                  {
                    key: "value",
                    label: "Keterangan",
                  },

                  {
                    key: "action",
                    label: "Aksi",
                  },
                ]}
              />
            </div>
            {/* Rating Curve */}
            <RatingCurveExcel
              name="rating_curve_table"
              data={data.rating_curve_table}
            />
            <div className="border-t text-stroke" />
            <div className="flex justify-end gap-3 mt-5">
              <Button
                label="Back"
                onClick={(e) => {
                  e.preventDefault();
                  navigation.back();
                }}
              />
              <Button label="Submit" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default TitikFormPage;
