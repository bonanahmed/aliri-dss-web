"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
import GoogleMaps from "@/components/Maps/GoogleMaps";
import PickImages2 from "@/components/PickImage/PickImage2";
import CKeditorRTE from "@/components/RTE/CKeditorRTE";
import TinymceRTE from "@/components/RTE/TinymceRTE";
import {
  createData,
  getData,
  getOptions,
  updateData,
} from "@/services/base.service";
import formDataToObject from "@/utils/formDataToObject";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
const AreaFormPage: React.FC<any> = ({ id }: { id?: string }) => {
  const [kemantrenDatas, setKemantrenDatas] = useState([]);
  const [areaDatas, setAreaDatas] = useState([]);
  const [lineDatas, setLineDatas] = useState([]);
  const [groupDatas, setGroupDatas] = useState([]);
  const [accountDatas, setAccountDatas] = useState([]);
  const [typeData, setTypeData] = useState<string>("petak tersier");
  const [informationIrigation, setInformationIrigation] = useState<string>("");

  useEffect(() => {
    getOptions("/kemantrens", setKemantrenDatas, { isDropDown: true }, {});
    getOptions("/areas", setAreaDatas, { isDropDown: true }, {});
    getOptions("/lines", setLineDatas, { isDropDown: true }, {});
    getOptions("/groups", setGroupDatas, { isDropDown: true }, {});
    getOptions(
      "/accounts",
      setAccountDatas,
      { isDropDown: true, label: "account.name", key: "account.id" },
      { role: "mantri" }
    );
  }, []);
  const url = "/areas";

  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (id) getData(url, id, setData);
  }, [id]);

  useEffect(() => {
    if (data) {
      setTypeData(data.type);
      if (data.information) {
        setInformationIrigation(data.information.description);
      }
    }
  }, [data]);

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
    formData.location = JSON.parse(formData.location);
    if (informationIrigation) formData.area_information = informationIrigation;

    if (
      formData.location?.data === undefined ||
      formData.location?.data === null
    )
      formData.location = null;
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
              <PickImages2 name="images" images={data.images} path="areas" />
            </div>
            <div className="border-t text-stroke" />
            <div className="my-5 grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="w-full xl:w-full">
                <DropDownInput
                  required
                  value={typeData}
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
                    ...areaDatas,
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
                      data={data.detail?.group}
                      name="group"
                      label={"Golongan"}
                      options={groupDatas}
                    />
                  </div>
                  <div className="w-full xl:w-full">
                    <DropDownInput
                      name="kemantren"
                      label="Kemantren"
                      data={data?.detail?.kemantren}
                      options={[
                        {
                          label: "Tidak Ada",
                          value: "",
                        },
                        ...kemantrenDatas,
                      ]}
                    />
                  </div>
                  <div className="w-full xl:w-full">
                    <DropDownInput
                      data={data?.detail?.juru}
                      name="juru"
                      label="Nama Juru"
                      options={[
                        {
                          label: "Tidak Ada",
                          value: "",
                        },
                        ...accountDatas,
                        // {
                        //   label: "Juru-01",
                        //   value: "Juru-01",
                        // },
                        // {
                        //   label: "Juru-02",
                        //   value: "Juru-02",
                        // },
                        // {
                        //   label: "Juru-03",
                        //   value: "Juru-03",
                        // },
                        // {
                        //   label: "Juru-04",
                        //   value: "Juru-04",
                        // },
                      ]}
                    />
                  </div>
                </div>
              </Fragment>
            )}
            <div className="border-t text-stroke" />
            <div className="my-5">
              <TinymceRTE
                value={informationIrigation}
                onChange={(value) => {
                  setInformationIrigation(value);
                }}
              />
            </div>
            <div className="border-t text-stroke mb-5" />
            <div className="relative w-[100%] h-[50vh]">
              <GoogleMaps
                mapType="polygon"
                name="location"
                data={data.location}
              />
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

export default AreaFormPage;
