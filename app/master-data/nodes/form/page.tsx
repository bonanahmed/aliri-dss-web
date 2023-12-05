"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import PickImages from "@/components/PickImage/PickImage";
import { createData, getData, updateData } from "@/services/baseService";
import {
  getLineDatas,
  getNodeDatas,
  getAreasData,
} from "@/services/master-data/node";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
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

  const navigation = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = formDataToObject(new FormData(formRef.current));
    formData.images = JSON.parse(formData.images);
    if (id) {
      await updateData(url, id, formData);
    } else {
      await createData(url, formData);
      navigation.back();
    }
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
                      label: "Bangunan",
                      value: "bangunan",
                    },
                    {
                      label: "Bendungan",
                      value: "bendungan",
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
                Detail Titik Bangunan
              </h3>
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

export default TitikFormPage;
