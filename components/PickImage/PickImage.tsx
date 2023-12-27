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
import { uploadFileDrop, uploadFileInput } from "@/utils/uploadDocument";
type PickImagesProps = {
  images?: Array<any>;
  name?: string;
  path?: string;
  // color?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const PickImages = ({ images, name, path }: PickImagesProps) => {
  const fileInputRef = useRef<any>(null);
  const [isLoading, setisLoading] = useState(false);
  const [image, setImage] = useState<any>([]);
  const [isHovered, setIsHovered] = useState<any>([]);
  useEffect(() => {
    setImage(images);
  }, [images]);

  const uploadFile: any = async (files: any, event: any) => {
    try {
      let e = event;
      let dataUpload: any = [];
      setisLoading(true);
      if (event) {
        dataUpload = await uploadFileDrop(files, e, {
          pathData: path,
        });
      } else {
        e = files;
        dataUpload = await uploadFileInput(e, {
          pathData: path,
        });
      }
      if (image !== undefined) {
        dataUpload = dataUpload.concat(image);
      }
      setImage(dataUpload);
      isHovered.push(false);
      setIsHovered([...isHovered]);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
    }
  };
  const handleDelete = (index: number) => {
    image.splice(index, 1);
    isHovered.splice(index, 1);
    setImage([...image]);
    setIsHovered([...isHovered]);
  };
  return (
    <div className="grid grid-cols-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        style={{
          display: "none",
        }}
        onChange={uploadFile}
      />
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
                  {/* <div
                    className="bg-white p-2 rounded-xl shadow-3 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      fileInputRef?.current?.click();
                    }}
                  >
                    <EditIcon />
                  </div> */}
                </div>
              </div>
            )}
            <div className="z-1  mb-10">
              <img
                className="w-48 h-48 rounded-xl object-contain"
                src={item?.content ?? "/images/add_more.png"}
                alt="Images"
              />
            </div>
          </div>
        </div>
      ))}
      {/* Upload New */}
      <div className="flex flex-col justify-center items-start">
        {isLoading ? (
          <div className="h-48">
            <Loader />
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              fileInputRef?.current?.click();
            }}
            className="relative"
          >
            <div className="z-1 w-48 h-48">
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
        )}

        <span className="text-sm text-center mt-5">
          PNG/JPG/JPEG/PDF. Maksimal ukuran 1 MB.
        </span>
      </div>
    </div>
  );
};

export default PickImages;
