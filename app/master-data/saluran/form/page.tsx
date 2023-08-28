import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
const PastenPage = () => {
  return (
    <>
      <Breadcrumb pageName="Form Saluran" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="w-full xl:w-full">
                <DropDownInput
                  label="Jenis Saluran"
                  options={[
                    {
                      label: "Primer",
                      value: "Primer",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  label="Parent Saluran"
                  options={[
                    {
                      label: "Tidak ada",
                      value: "-",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput label="Nama Saluran" placeholder="Nama Saluran" />
              </div>
            </div>
            <div className="border-t border-stroke py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Detail Saluran (Optional)
              </h3>
            </div>
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="w-full xl:w-full">
                <TextInput
                  label="Luas Area Irigasi"
                  placeholder="Luas Area Irigasi"
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  label="Golongan"
                  options={[
                    {
                      label: "1",
                      value: "1",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  label="Kemantren"
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
              <Button label="Back" />
              <Button label="Submit" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PastenPage;
