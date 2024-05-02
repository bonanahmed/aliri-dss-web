/* eslint-disable @next/next/no-img-element */
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Loader from "../common/Loader";
import { uploadFileDrop, uploadFileInput } from "@/utils/uploadDocument";
type DocumentUploadProps = {
  dataDocument?: Array<any>;
  name?: string;
  path?: string;
  // color?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const DocumentUpload = ({ dataDocument, name, path }: DocumentUploadProps) => {
  const fileInputRef = useRef<any>(null);
  const [isLoading, setisLoading] = useState(false);
  const [dataFile, setDataFile] = useState<any>();
  useEffect(() => {
    setDataFile(dataDocument);
  }, [dataDocument]);

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

      setDataFile(dataUpload[0]);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
    }
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
        value={JSON.stringify(dataFile) ?? ""}
        onChange={(e) => {}}
      />
      {/* Upload New */}
      <div className="flex flex-col justify-center items-center py-5 border border-dashed min-w-[50vw] h-full">
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
            {dataFile ? (
              <Fragment>
                {dataFile.type?.includes("image") ? (
                  <div className="z-1 w-48 h-32">
                    <img src={dataFile.content} alt={dataFile.name} />
                  </div>
                ) : (
                  <div className="z-1 w-24 h-24">
                    <Image
                      className="rounded-xl"
                      src={"/images/icon/pdf-data.png"}
                      width={400}
                      height={400}
                      objectFit="cover"
                      alt="Documents"
                    />
                  </div>
                )}
              </Fragment>
            ) : (
              <div className="z-1 w-48 h-24">
                <Image
                  className="rounded-xl"
                  src={"/images/icon/upload-icon.png"}
                  width={400}
                  height={400}
                  objectFit="cover"
                  alt="Documents"
                />
              </div>
            )}
          </button>
        )}

        <span className="text-lg font-semibold text-center mt-5">
          {dataFile?.name ? dataFile?.name : "Upload File Disini"}
        </span>
        <span className="text-sm text-center mt-5">
          PNG/JPG/JPEG/PDF. Maksimal ukuran 100 MB.
        </span>
      </div>
    </div>
  );
};

export default DocumentUpload;
