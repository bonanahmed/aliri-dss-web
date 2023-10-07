"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import {
  createData,
  getDataId,
  getLineDatas,
  getAreaDatas,
  updateData,
} from "@/services/master-data/area";
import { getGroups } from "@/services/master-data/group";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
const AreaFormPage = ({ id }: { id: string }) => {
  const [nodeDatas, setNodeDatas] = useState([]);
  const [lineDatas, setLineDatas] = useState([]);
  const [groupDatas, setGroupDatas] = useState([]);

  useEffect(() => {
    getAreaDatas(setNodeDatas);
    getLineDatas(setLineDatas);
    getGroups(setGroupDatas);
  }, []);
  const [data, setData] = useState<any>({});
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

    formDataObject.detail = {
      juru: formDataObject.juru,
      kemantren: formDataObject.kemantren,
      standard_area: formDataObject.standard_area,
      group: formDataObject.group,
    };
    delete formDataObject.juru;
    delete formDataObject.kemantren;
    delete formDataObject.standard_area;
    delete formDataObject.group;

    if (id) {
      await updateData(id, formDataObject);
    } else {
      await createData(formDataObject);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Form Area Lahan" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  data={data}
                  name="type"
                  label="Jenis Area Lahan"
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
                  required
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
                  required
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
                  label="Nama Kode Area"
                  placeholder="Nama Kode Area"
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
            </div>
            <div className="border-t border-stroke py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Detail Area Lahan
              </h3>
            </div>
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
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
                  name="group"
                  label="Golongan"
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
                      label: "Juru 01",
                      value: "Juru 01",
                    },
                  ]}
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

export default AreaFormPage;
