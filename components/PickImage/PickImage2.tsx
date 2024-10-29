/* eslint-disable @next/next/no-img-element */
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { XIcon } from "@/public/images/icon/icon";
import Loader from "../common/Loader";
import Modal from "../Modals/Modals";
import PickFilePage from "../PickFile/PickFile";
type PickImages2Props = {
  images?: Array<any>;
  name?: string;
  path?: string;
  // color?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const PickImages2 = ({ images, name, path }: PickImages2Props) => {
  const fileInputRef = useRef<any>(null);
  const [image, setImage] = useState<any>([]);
  const [isHovered, setIsHovered] = useState<any>([]);
  const [modalFileManager, setModalFileManager] = useState<boolean>(false);
  useEffect(() => {
    setImage(images);
  }, [images]);

  const chooseFile: any = async (data: any) => {
    image.push(convertFormat(data));
    setImage([...image]);
    isHovered.push(false);
    setIsHovered([...isHovered]);
    setModalFileManager(false);
  };
  const handleDelete = (index: number) => {
    image.splice(index, 1);
    isHovered.splice(index, 1);
    setImage([...image]);
    setIsHovered([...isHovered]);
  };
  const convertFormat = (data: any) => {
    return {
      content: data.url,
      name: data.name,
      size: data.size,
      type: data.format,
    };
  };
  return (
    <div className="grid grid-cols-6">
      <input
        name={name}
        className="hidden"
        style={{
          display: "none",
        }}
        value={JSON.stringify(image) ?? ""}
        onChange={(e) => {}}
      />
      {image?.map((item: any, index: number) => (
        <div
          key={"image" + index}
          className="flex flex-col justify-center items-start mr-10"
        >
          <div
            onMouseEnter={() => {
              isHovered[index] = true;
              setIsHovered([...isHovered]);
            }}
            onMouseLeave={() => {
              isHovered[index] = false;
              setIsHovered([...isHovered]);
            }}
            className="relative"
          >
            {isHovered[index] && (
              <div className="z-9 bottom-0 right-3 absolute rounded-xl flex justify-center items-center text-white">
                <div className="flex gap-3">
                  <div
                    className="bg-white p-2 rounded-xl shadow-3 text-graydark cursor-pointer"
                    onClick={() => {
                      handleDelete(index);
                    }}
                  >
                    <XIcon />
                  </div>
                </div>
              </div>
            )}
            <div className="z-1  mb-10">
              <img
                className="w-48 h-48 rounded-xl object-contain"
                src={
                  item?.content
                    ? item?.content + "?q=80&w=480"
                    : "/images/add_more.png"
                }
                alt="Images"
              />
            </div>
          </div>
        </div>
      ))}
      {/* Upload New */}
      <div className="flex flex-col justify-center items-start">
        <button
          onClick={(e) => {
            e.preventDefault();
            fileInputRef?.current?.click();
          }}
          className="relative"
        >
          <div
            className="z-1 w-48 h-48"
            onClick={() => {
              setModalFileManager(true);
            }}
          >
            <Image
              className="rounded-xl"
              src={"/images/add_more.png"}
              width={200}
              height={200}
              objectFit="cover"
              alt="Images"
            />
          </div>
        </button>

        <span className="text-sm text-center mt-5">
          PNG/JPG/JPEG/PDF. Maksimal ukuran 10 MB.
        </span>
      </div>
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

export default PickImages2;
