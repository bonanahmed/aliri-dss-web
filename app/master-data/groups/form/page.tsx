"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import {
  createData,
  getDataId,
  getPlantPatternTemplates,
  updateData,
} from "@/services/master-data/group";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
const GolonganFormPage: React.FC<any> = ({ id }: { id?: string }) => {
  const [plantPatternTemplates, setPlantPatternTemplates] = useState([]);

  useEffect(() => {
    getPlantPatternTemplates(setPlantPatternTemplates);
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
      <Breadcrumb pageName="Form Golongan" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="w-full xl:w-full">
                <TextInput
                  required
                  data={data}
                  name="name"
                  label="Nama Golongan"
                  placeholder="Nama Golongan"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  required
                  data={data}
                  name="period"
                  label="Periode"
                  placeholder="Periode"
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  data={data}
                  name="plant_pattern_template_name_id"
                  label="Template Golongan"
                  options={plantPatternTemplates}
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

export default GolonganFormPage;
