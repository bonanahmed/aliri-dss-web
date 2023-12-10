"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import PickImages from "@/components/PickImage/PickImage";
import { createData, getData, updateData } from "@/services/baseService";
import { getLineDatas, getAreaDatas } from "@/services/master-data/area";
import { getGroups } from "@/services/master-data/group";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
const AreaFormPage: React.FC<any> = ({ id }: { id?: string }) => {
  const [nodeDatas, setNodeDatas] = useState([]);
  const [lineDatas, setLineDatas] = useState([]);
  const [groupDatas, setGroupDatas] = useState([]);
  const [typeData, setTypeData] = useState<string>("daerah irigasi");

  useEffect(() => {
    getAreaDatas(setNodeDatas);
    getLineDatas(setLineDatas);
    getGroups(setGroupDatas);
  }, []);
  const url = "/areas";

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
    if (formData.images) formData.images = JSON.parse(formData.images);
    if (formData.type === "petak tersier") {
      formData.detail = {
        juru: formData.juru,
        kemantren: formData.kemantren,
        standard_area: formData.standard_area,
        group: formData.group,
      };
    }

    delete formData.juru;
    delete formData.kemantren;
    delete formData.standard_area;
    delete formData.group;
    if (id) {
      await updateData(url, id, formData);
    } else {
      await createData(url, formData);
      navigation.back();
    }
  };
  return (
    <>
      <Breadcrumb pageName="Form Area Lahan" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="my-5 flex justify-start">
              <PickImages name="images" images={data.images} path="areas" />
            </div>
            <div className="border-t text-stroke" />
            <div className="my-5 grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  data={data}
                  name="type"
                  label="Jenis Area Lahan"
                  onChange={(e) => {
                    setTypeData(e.target.value);
                  }}
                  options={[
                    {
                      label: "Petak Tersier",
                      value: "petak tersier",
                    },
                    {
                      label: "Daerah Irigasi",
                      value: "daerah irigasi",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  // required
                  data={data}
                  label="Area Lahan"
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
                <TextInput
                  required
                  data={data}
                  name="name"
                  label="Nama Area"
                  placeholder="Nama Area"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  required
                  data={data}
                  name="code"
                  label="Nama Kode Area"
                  placeholder="Nama Kode Area"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  data={data}
                  name="link_google_map"
                  label="Link Google Map"
                  placeholder="Link Google Map"
                />
              </div>
            </div>
            {typeData === "petak tersier" && (
              <Fragment>
                <div className="border-t border-stroke py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Detail Area Lahan
                  </h3>
                </div>
                <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <div className="w-full xl:w-full">
                    <TextInput
                      defaultValue={data?.detail?.standard_area}
                      name="standard_area"
                      label="Luas Area Irigasi"
                      placeholder="Luas Area Irigasi"
                    />
                  </div>
                  <div className="w-full xl:w-full">
                    <DropDownInput
                      data={data.detail?.group.id}
                      name="group"
                      label={"Golongan"}
                      options={groupDatas}
                    />
                  </div>
                  <div className="w-full xl:w-full">
                    <DropDownInput
                      name="kemantren"
                      label="Kemantren"
                      defaultValue={data?.detail?.kemantren}
                      options={[
                        {
                          label: "Purworejo II",
                          value: "Purworejo II",
                        },
                        {
                          label: "Purworejo I",
                          value: "Purworejo I",
                        },
                        {
                          label: "Bayan",
                          value: "Bayan",
                        },
                        {
                          label: "Banyuurip",
                          value: "Banyuurip",
                        },
                      ]}
                    />
                  </div>
                  <div className="w-full xl:w-full">
                    <DropDownInput
                      defaultValue={data?.detail?.juru}
                      name="juru"
                      label="Nama Juru"
                      options={[
                        {
                          label: "Juru-01",
                          value: "Juru-01",
                        },
                        {
                          label: "Juru-02",
                          value: "Juru-02",
                        },
                        {
                          label: "Juru-03",
                          value: "Juru-03",
                        },
                        {
                          label: "Juru-04",
                          value: "Juru-04",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Fragment>
            )}
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

export default AreaFormPage;
