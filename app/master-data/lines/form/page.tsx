"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import {
  createData,
  getDataId,
  getNodeDatas,
  updateData,
} from "@/services/master-data/line";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
const SaluranFormPage: React.FC<any> = ({ id }: { id?: string }) => {
  const [nodeDatas, setNodeDatas] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    getNodeDatas(setNodeDatas);
  }, []);

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
      formDataObject[key] = value;
    });
    if (id) {
      await updateData(id, formDataObject);
    } else {
      await createData(formDataObject);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Form Saluran" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
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
                <TextInput
                  required
                  data={data}
                  name="code"
                  label="Nama Kode Saluran"
                  placeholder="Nama Kode Saluran"
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

export default SaluranFormPage;
