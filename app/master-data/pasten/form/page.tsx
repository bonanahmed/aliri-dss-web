import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import DropDownInput from "@/components/Input/DropDownInput";
import TextInput from "@/components/Input/TextInput";
const PastenPage = () => {
  return (
    <>
      <Breadcrumb pageName="Form Pasten" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
              <div className="w-full xl:w-full">
                <TextInput label="Kode" placeholder="Kode" />
              </div>
              <div className="w-full xl:w-full">
                <DropDownInput
                  label="Jenis Tanaman"
                  options={[
                    {
                      label: "Padi",
                      value: "Padi",
                    },
                  ]}
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  label="Periode Pertumbuhan"
                  placeholder="Periode Pertumbuhan"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput label="Pasten" placeholder="Pasten" type="number" />
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
