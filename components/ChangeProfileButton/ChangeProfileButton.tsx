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
type ChangeProfileButtonProps = {
  images?: string;
  name?: string;
  // color?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const ChangeProfileButton = ({ images, name }: ChangeProfileButtonProps) => {
  const fileInputRef = useRef<any>(null);
  const [isLoading, setisLoading] = useState(false);
  const [image, setImage] = useState<any>("");
  const [isHovered, setIsHovered] = useState(false);
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
          pathData: `application`,
        });
      } else {
        e = files;
        // console.log(e.target.value);
        dataUpload = await uploadFileInput(e, {
          pathData: `application`,
        });
      }

      setImage(dataUpload[0].content);
      // setImage("Berhasil");
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
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
        value={image ?? ""}
        onChange={() => {}}
      />
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <div className="bg-black bg-opacity-50 z-9 w-48 h-48 absolute rounded-xl flex justify-center items-center text-white">
              <StateEditIcon />
            </div>
          )}
          <div className="z-1 w-48 h-48">
            <img
              className="rounded-xl"
              src={image ?? "/images/person.png"}
              width={200}
              height={200}
              alt="Picture of the author"
            />
          </div>
        </button>
      )}

      <span className="text-sm text-center mt-3">
        PNG/JPG/JPEG/PDF. Maksimal ukuran 1 MB.
      </span>
    </div>
  );
};

export default ChangeProfileButton;
