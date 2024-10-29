/* eslint-disable @next/next/no-img-element */
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { StateEditIcon } from "@/public/images/icon/icon";
import Loader from "../common/Loader";
import { uploadFileDrop, uploadFileInput } from "@/utils/uploadDocument";
import Modal from "../Modals/Modals";
import PickFilePage from "../PickFile/PickFile";
type ChangeProfileButton2Props = {
  images?: string;
  name?: string;
  // color?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const ChangeProfileButton2 = ({ images, name }: ChangeProfileButton2Props) => {
  const [image, setImage] = useState<any>("");
  const [isHovered, setIsHovered] = useState(false);
  const [modalFileManager, setModalFileManager] = useState<boolean>(false);

  useEffect(() => {
    setImage(images);
  }, [images]);

  const convertFormat = (data: any) => {
    return data.url;
    // return {
    //   content: data.url,
    //   name: data.name,
    //   size: data.size,
    //   type: data.format,
    // };
  };
  const chooseFile: any = async (data: any) => {
    setImage(convertFormat(data));
    setModalFileManager(false);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <input
        name={name}
        className="hidden"
        style={{
          display: "none",
        }}
        value={image ?? ""}
        onChange={() => {}}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          setModalFileManager(true);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="bg-black bg-opacity-50 z-2 w-48 h-48 absolute rounded-xl flex justify-center items-center text-white">
            <StateEditIcon />
          </div>
        )}
        <div className="z-1 w-48 h-48">
          <img
            className="rounded-xl"
            src={image ? image + "?q=80&w=480" : "/images/person.png"}
            width={200}
            height={200}
            alt="Picture of the author"
          />
        </div>
      </button>

      <span className="text-sm text-center mt-3">
        PNG/JPG/JPEG/PDF. Maksimal ukuran 1 MB.
      </span>
      <Modal
        isOpen={modalFileManager}
        onClose={() => setModalFileManager(false)}
        title="File Manager"
      >
        <div className="md:w-[75vw] h-[100%]">
          <PickFilePage
            pickType="image"
            callBack={(data) => {
              chooseFile(data);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChangeProfileButton2;
