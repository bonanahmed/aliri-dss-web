"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import {
  createData,
  getDataId,
  updateData,
} from "@/services/master-data/pasten";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
const PastenFormPage: React.FC<any> = ({ id }: { id?: string }) => {
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
      formDataObject[key] = value;
    });

    formDataObject["pasten"] = parseFloat(formDataObject["pasten"]);
    if (id) {
      await updateData(id, formDataObject);
    } else {
      await createData(formDataObject);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Form Pasten" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="w-full xl:w-full">
                <TextInput
                  data={data}
                  required
                  name="code"
                  label="Kode"
                  placeholder="Kode"
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  data={data}
                  required
                  name="plant_type"
                  label="Jenis Tanaman"
                  options={[
                    {
                      label: "-",
                      value: "Tidak Ada",
                    },
                    {
                      label: "Padi",
                      value: "Padi",
                    },
                    {
                      label: "Tebu",
                      value: "Tebu",
                    },
                    {
                      label: "Palawija",
                      value: "Palawija",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  data={data}
                  name="growth_time"
                  label="Periode Pertumbuhan"
                  placeholder="Periode Pertumbuhan"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  data={data}
                  name="pasten"
                  label="Pasten"
                  placeholder="Pasten"
                  type="text"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  data={data}
                  name="color"
                  label="Pasten"
                  placeholder="Pasten"
                  type="color"
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

export default PastenFormPage;
