/* eslint-disable @next/next/no-img-element */
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FormEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Loader from "../common/Loader";
import { handleUploadFile } from "@/services/master-data/file-manager";
import TextInput from "../Input/TextInput";
import formDataToObject from "@/utils/formDataToObject";
import Button from "../Buttons/Buttons";
import { DocumentIcon } from "@/public/images/icon/icon";
import { getExtensionName, getColorByExt } from "@/utils/fileExtension";
type CreateFileProps = {
  folderId?: string;
  name?: string;
  path?: string;
  onClose: () => void;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const CreateFile = ({ folderId, name, onClose }: CreateFileProps) => {
  const fileInputRef = useRef<any>(null);
  const [isLoading, setisLoading] = useState(false);
  const [file, setFile] = useState<any>();
  const [previewUrl, setPreviewUrl] = useState<any>();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setisLoading(true);
    if (!formRef.current) return;
    const formData = formDataToObject(new FormData(formRef.current));
    const body = {
      ...formData,
      size: file.size,
      format: file.type,
      folderId: folderId ?? null,
    };
    await handleUploadFile(file, body);
    setisLoading(false);
    setFile(null);
    setPreviewUrl(null);
    onClose();
  };
  const uploadFile: any = async (files: any, event: any) => {
    try {
      let e;
      setisLoading(true);
      if (event) {
        e = event;
      } else {
        e = files;
      }
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        const fileUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(fileUrl);
        setFile(selectedFile);
      }
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  return (
    <div className="flex w-full">
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
        onChange={(e) => {}}
      />
      {/* Upload New */}
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col justify-center items-center w-full">
          {isLoading ? (
            <div className="h-48">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-[35vh] border rounded-lg p-3">
              <div
                className="relative w-full h-full"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef?.current?.click();
                }}
              >
                {file?.type?.includes("image") || !file ? (
                  <Image
                    layout="fill"
                    className="rounded-xl"
                    src={
                      previewUrl ? previewUrl : "/images/icon/upload-icon.png"
                    }
                    objectFit="contain"
                    alt="Images"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <div className="absolute z-1 w-full h-full">
                      <div className="text-white text-2xl font-bold flex justify-center items-center w-[full] h-full pr-4">
                        {getExtensionName(file?.name ?? "")}
                      </div>
                    </div>
                    <div className="z-0 flex justify-center items-center h-full">
                      <DocumentIcon
                        size="96"
                        color={getColorByExt(
                          getExtensionName(file?.name ?? "")
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
              {!previewUrl && (
                <span className="flex text-xl font-bold text-center">
                  Click Icon Above to Upload the File
                </span>
              )}
            </div>
          )}
        </div>
        {file && (
          <Fragment>
            <div className="grid grid-cols-3 mt-5 gap-3">
              <div className="w-full xl:w-full">
                <TextInput
                  required
                  data={file}
                  name="name"
                  label="Nama File"
                  placeholder="Nama File"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  disabled
                  required
                  data={file}
                  name="type"
                  label="Format"
                  placeholder="Format"
                />
              </div>
              <div className="w-full xl:w-full">
                <TextInput
                  disabled
                  required
                  value={(file.size / (1024 * 1024)).toFixed(2)}
                  name="size"
                  label="Ukuran (mb)"
                  placeholder="Ukuran (mb)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                label="Cancel"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              />
              <Button label="Submit" />
            </div>
          </Fragment>
        )}
      </form>
    </div>
  );
};

export default CreateFile;
