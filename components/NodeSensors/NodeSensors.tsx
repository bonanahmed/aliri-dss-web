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

const NodeSensors: React.FC<any> = ({ nodeId }: { nodeId: string }) => {
  const [sensorType, setSensorType] = useState<string>("debit");
  const [operationType, setOperationType] = useState<string>("read");
  const [lineDirection, setLineDirection] = useState<string>("");
  const [sensorCode, setSensorCode] = useState<string>("");
  const [sensorValue, setSensorValue] = useState<string>("");
  const [sensorList, setSensorList] = useState<any[]>([]);

  const [linesByNode, setLinesByNode] = useState([]);

  const [data, setData] = useState<any>({});

  const handlesGetDatas = useCallback(async () => {
    getOptions(
      "/nodes/data-sensor/" + nodeId,
      setSensorList,
      { isDropDown: false },
      {}
    );
  }, [nodeId]);

  useEffect(() => {
    if (nodeId) {
      getOptions(
        "/nodes/lines-in-node/" + nodeId,
        setLinesByNode,
        { isDropDown: true },
        {}
      );
      handlesGetDatas();
    }
  }, [nodeId, handlesGetDatas]);

  const [modalInput, setModalInput] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    let formData = formDataToObject(new FormData(formRef.current));
    formData.node_id = nodeId;
    setModalInput(false);
    await createData("/nodes/data-sensor", formData);
    handlesGetDatas();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteData("/nodes/data-sensor", id);
      handlesGetDatas();
    }
  };

  const handleDetail = async (id: string) => {
    await getData("/nodes/data-sensor-detail", id, setData);
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
            direction_line: (item: any, index: number) => (
              <div>{item.direction_line.name}</div>
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
              key: "direction_line",
              label: "Arah Saluran",
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
                onChange={(e) => {
                  setSensorType(e.target.value);
                }}
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
                onChange={(e) => {
                  setOperationType(e.target.value);
                }}
              />
            </div>
            <div className="w-full xl:w-full">
              <DropDownInput
                data={data}
                name="direction_line"
                label="Arah Saluran"
                options={[
                  {
                    label: "Pilih Saluran",
                    value: "",
                  },
                  ...linesByNode,
                ]}
                onChange={(e) => {
                  setLineDirection(e.target.value);
                }}
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                data={data}
                name="sensor_code"
                label="Kode Sensor"
                placeholder="Kode Sensor"
                onChange={(e) => {
                  setSensorCode(e.target.value);
                }}
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                data={data}
                name="sensor_value"
                label="Nilai Sensor"
                placeholder="Nilai Sensor"
                onChange={(e) => {
                  setSensorValue(e.target.value);
                }}
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

export default NodeSensors;
