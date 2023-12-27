"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import PickImages from "@/components/PickImage/PickImage";
import { createData, getData, updateData } from "@/services/base.service";
import { getAreaDatas, getNodeDatas } from "@/services/master-data/line";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
const SaluranFormPage: React.FC<any> = ({ id }: { id?: string }) => {
  const [nodeDatas, setNodeDatas] = useState([]);
  const [areaDatas, setAreaDatas] = useState([]);
  useEffect(() => {
    getNodeDatas(setNodeDatas);
    getAreaDatas(setAreaDatas);
  }, []);

  const url = "/lines";

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
    if (id) {
      await updateData(url, id, formData);
    } else {
      await createData(url, formData);
      navigation.back();
    }
  };
  return (
    <>
      <Breadcrumb pageName="Form Saluran" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="my-5 flex justify-start">
              <PickImages name="images" images={data.images} path="lines" />
            </div>
            <div className="border-t text-stroke" />
            <div className="my-5 grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  data={data}
                  name="type"
                  label="Jenis Saluran"
                  options={[
                    {
                      label: "Primer",
                      value: "primer",
                    },
                    {
                      label: "Sekunder",
                      value: "sekunder",
                    },
                    {
                      label: "Tersier",
                      value: "tersier",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  data={data}
                  label="Titik Bangunan"
                  name="node_id"
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
                  required
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
                  label="Nama Saluran"
                  placeholder="Nama Saluran"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  required
                  data={data}
                  name="code"
                  label="Nama Kode Saluran"
                  placeholder="Nama Kode Saluran"
                />
              </div>
            </div>
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

export default SaluranFormPage;
