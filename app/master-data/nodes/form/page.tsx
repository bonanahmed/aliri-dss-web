"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import {
  createData,
  getDataId,
  getLineDatas,
  getNodeDatas,
  updateData,
} from "@/services/master-data/node";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
const TitikFormPage = ({ id }: { id: string }) => {
  const [nodeDatas, setNodeDatas] = useState([]);
  const [lineDatas, setLineDatas] = useState([]);

  useEffect(() => {
    getNodeDatas(setNodeDatas);
    getLineDatas(setLineDatas);
  }, []);
  const [data, setData] = useState({});
  useEffect(() => {
    if (id) getDataId(id, setData);
  }, [id]);

  const navigation = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const formDataObject: any = {};
    formData.forEach((value, key) => {
      if (value) formDataObject[key] = value;
    });

    if (id) {
      await updateData(id, formDataObject);
    } else {
      await createData(formDataObject);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Form Titik Bangunan" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  data={data}
                  name="type"
                  label="Jenis Titik Bangunan"
                  options={[
                    {
                      label: "Bendungan",
                      value: "bendungan",
                    },
                    {
                      label: "Bangunan",
                      value: "bangunan",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  // required
                  data={data}
                  label="Titik Bangunan"
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
                  name="code"
                  label="Nama Kode Titik"
                  placeholder="Nama Kode Titik"
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
            </div>

            <div className="flex justify-end gap-3">
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
