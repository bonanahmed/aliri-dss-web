import {
  Fragment,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DropDownInput from "../Input/DropDownInput";
import TextInput from "../Input/TextInput";
import {
  createData,
  deleteData,
  getData,
  getDatas,
  getOptions,
} from "@/services/base.service";
import Button from "../Buttons/Buttons";
import Table from "../Tables/Table";
import { VerticalThreeDotsIcon } from "@/public/images/icon/icon";
import DropdownButton from "../DropdownButtons/DropdownButton";
import Modal from "../Modals/Modals";
import formDataToObject from "@/utils/formDataToObject";

interface AreaSensorProps {
  areaId: string;
}
const AreaSensors: React.FC<AreaSensorProps> = ({
  areaId,
}: AreaSensorProps) => {
  const [sensorList, setSensorList] = useState<any[]>([]);

  const [data, setData] = useState<any>({});

  const handlesGetDatas = useCallback(async () => {
    getOptions(
      "/areas/data-sensor/" + areaId + "/list",
      setSensorList,
      { isDropDown: false },
      {}
    );
  }, [areaId]);

  useEffect(() => {
    if (areaId) {
      handlesGetDatas();
    }
  }, [areaId, handlesGetDatas]);

  const [modalInput, setModalInput] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    let formData = formDataToObject(new FormData(formRef.current));
    formData.area_id = areaId;
    setModalInput(false);
    await createData("/areas/data-sensor", formData);
    handlesGetDatas();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteData("/nodes/data-sensor", id);
      handlesGetDatas();
    }
  };

  const handleDetail = async (id: string) => {
    await getData("/areas/data-sensor", id + "/detail", setData);
    setModalInput(true);
  };

  return (
    <Fragment>
      <div className="max-h-[75vh] overflow-y-scroll">
        <Table
          values={sensorList}
          scopedSlots={{
            action: (item: any, index: number) => (
              <div className="flex flex-row gap-2 justify-center">
                <DropdownButton
                  icon={<VerticalThreeDotsIcon size="18" />}
                  options={[
                    {
                      label: "Ubah",
                      action: (e: any) => {
                        handleDetail(item.id);
                      },
                    },
                    {
                      label: "Hapus",
                      action: (e: any) => {
                        handleDelete(item.id);
                      },
                    },
                  ]}
                />
              </div>
            ),
          }}
          fields={[
            {
              key: "sensor_name",
              label: "Nama Sensor",
            },
            {
              key: "sensor_type",
              label: "Jenis Sensor",
            },
            {
              key: "operation_type",
              label: "Tipe Operasi Sensor",
            },

            {
              key: "sensor_code",
              label: "Kode Sensor",
            },
            {
              key: "sensor_value",
              label: "Nilai Sensor",
            },
            {
              key: "action",
              label: "Aksi",
            },
          ]}
        />
      </div>
      <hr className="mt-3" />
      <div className="flex flex-row gap-3 justify-end mt-3">
        <Button
          label="Update Sensor"
          onClick={(e) => {
            e.preventDefault();
            setModalInput(true);
          }}
        />
      </div>
      <Modal
        isOpen={modalInput}
        onClose={() => {
          setModalInput(false);
        }}
        title="Masukkan Data Sensor"
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-scroll"
        >
          <div className="my-5 grid grid-cols-1 xl:grid-cols-2 gap-3">
            <div className="w-full xl:w-full">
              <TextInput
                data={data}
                name="sensor_name"
                label="Nama Sensor"
                placeholder="Nama Sensor"
              />
            </div>
            <div className="w-full xl:w-full">
              <DropDownInput
                data={data}
                name="sensor_type"
                label="Jenis Sensor"
                options={[
                  {
                    label: "Debit",
                    value: "debit",
                  },
                  {
                    label: "Level",
                    value: "level",
                  },
                ]}
              />
            </div>
            <div className="w-full xl:w-full">
              <DropDownInput
                data={data}
                name="operation_type"
                label="Tipe Operasi Sensor"
                options={[
                  {
                    label: "Read",
                    value: "read",
                  },
                  {
                    label: "Write",
                    value: "write",
                  },
                ]}
              />
            </div>

            <div className="w-full xl:w-full">
              <TextInput
                data={data}
                name="sensor_code"
                label="Kode Sensor"
                placeholder="Kode Sensor"
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                data={data}
                name="sensor_value"
                label="Nilai Sensor"
                placeholder="Nilai Sensor"
              />
            </div>
          </div>
          <hr />
          <div className="flex justify-end gap-3 mt-5">
            <Button label="Submit" />
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};

export default AreaSensors;
