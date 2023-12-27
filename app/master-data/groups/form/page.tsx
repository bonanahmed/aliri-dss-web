"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import { createData, getData, updateData } from "@/services/base.service";
import { getPlantPatternTemplates } from "@/services/master-data/group";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
const GolonganFormPage: React.FC<any> = ({ id }: { id?: string }) => {
  const [plantPatternTemplates, setPlantPatternTemplates] = useState([]);

  useEffect(() => {
    getPlantPatternTemplates(setPlantPatternTemplates);
  }, []);
  const url = "/groups";

  const [data, setData] = useState({});

  useEffect(() => {
    if (id) getData(url, id, setData);
  }, [id]);

  const navigation = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = formDataToObject(new FormData(formRef.current));
    if (id) {
      await updateData(url, id, formData);
    } else {
      await createData(url, formData);
      navigation.back();
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
