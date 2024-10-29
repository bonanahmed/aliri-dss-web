/* eslint-disable @next/next/no-img-element */
"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardImage from "@/components/CardImage/CardImage";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import DropDownInput from "@/components/Input/DropDownInput";
import Modal from "@/components/Modals/Modals";
import Pagination from "@/components/Pagination/Pagination";
import CreateFile from "@/components/CreateFile/CreateFile";
import TextInput from "@/components/Input/TextInput";
import Button from "@/components/Buttons/Buttons";
import {
  DeleteIcon,
  DocumentIcon,
  Edit2Icon,
  FilterIcon,
  SearchIcon,
  VerticalThreeDotsIcon,
} from "@/public/images/icon/icon";
import {
  deleteFileData,
  deleteFolderData,
  getFiles,
  getFolders,
  createFolderData,
  getRoot,
  getAll,
} from "@/services/master-data/file-manager";
import { PaginationProps } from "@/types/pagination";
import { getColorByExt, getExtensionName } from "@/utils/fileExtension";
import { handleDownload } from "@/utils/downloadFile";

const FileManagerPage: React.FC<any> = ({ id }: { id?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRoot = searchParams.get("isRoot");

  // State management
  const [allDatas, setAllDatas] = useState<any>();
  const [files, setFiles] = useState<any>();
  const [folders, setFolders] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [delayedSearch] = useDebounce(search, 1000);
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: 1,
    limit: 12,
  });
  const [folderName, setFolderName] = useState<string>("");
  const [folderParent, setFolderParent] = useState<string>("");
  const [modalUpload, setModalUpload] = useState<boolean>(false);
  const [modalFolder, setModalFolder] = useState<boolean>(false);
  const [foldersDropdown, setFoldersDropdown] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"folder" | "file" | "all">("all");

  const handleGetRoot = useCallback(async () => {
    const folderId = await getRoot({});
    router.push(`/configuration/file-manager/${folderId}?isRoot=true`);
  }, [router]);

  // Fetch files and folders
  const handlesGetDatas = useCallback(async () => {
    if (activeTab === "file") {
      await getFiles(
        { limit: paginationData.limit, page: paginationData.page },
        {
          search: delayedSearch,
          folderId: id ?? "",
        },
        setFiles,
        setPaginationData
      );
    } else if (activeTab === "folder") {
      getFolders(
        { limit: paginationData.limit, page: paginationData.page },
        {
          search: delayedSearch,
          parentId: id ?? "",
          isRoot: id ? false : true,
        },
        setFolders,
        setPaginationData
      );
    } else {
      if (id)
        getAll(
          id,
          { limit: paginationData.limit, page: paginationData.page },
          {
            search: delayedSearch,
          },
          setAllDatas,
          setPaginationData
        );
    }
  }, [delayedSearch, paginationData.limit, paginationData.page, id, activeTab]);

  useEffect(() => {
    if (!id) {
      handleGetRoot();
    } else {
      handlesGetDatas();
    }
  }, [handlesGetDatas, handleGetRoot, id]);

  // Handle file and folder actions
  const handleDeleteFile = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteFileData(id);
      handlesGetDatas();
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteFolderData(id);
      handlesGetDatas();
    }
  };

  const handleCreateFolder = async () => {
    await createFolderData({
      name: folderName,
      parentId: id || null,
    });
    // setFolderName("");
    // setFolderParent("");
    setModalFolder(false);
    handlesGetDatas();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL Copied to Clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text");
      });
  };
  // Fetch folders for dropdown in modal
  useEffect(() => {
    if (modalFolder) {
      getFolders(
        { limit: 999, page: 1 },
        {},
        setFoldersDropdown,
        setPaginationData
      );
    }
  }, [modalFolder]);

  // Convert folders to dropdown options
  const convertFoldersToDropDown = (foldersData: any[]) => [
    { label: "Pilih Direktori Parent", value: "" },
    ...foldersData.map((folder) => ({ value: folder.id, label: folder.name })),
  ];

  return (
    <>
      <Breadcrumb
        pageName={"File Manager"}
        onBack={
          id && isRoot !== "true"
            ? () => {
                router.back();
              }
            : undefined
        }
      />
      <div className="bg-white rounded-2xl w-full p-5">
        <div className="flex flex-col">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex flex-row items-center">
              <span className="mr-3">Tampilkan</span>
              <div>
                <DropDownInput
                  options={[
                    {
                      label: "12",
                      value: 12,
                    },
                    {
                      label: "24",
                      value: 24,
                    },
                    {
                      label: "56",
                      value: 56,
                    },
                    {
                      label: "120",
                      value: 120,
                    },
                  ]}
                  onChange={(e) => {
                    setPaginationData({
                      ...paginationData,
                      page: 1,
                      totalPages: Math.ceil(
                        paginationData.totalDocs / parseInt(e.target.value)
                      ),
                      limit: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
              <span className="ml-3">Data</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-5 ">
              <div className="flex gap-3 bg-[#F9F9F9] rounded-xl p-3">
                <SearchIcon />
                <input
                  className="bg-[#F9F9F9] focus:outline-none"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Pencarian"
                />
              </div>

              <button className="bg-transparent flex gap-3">
                <FilterIcon />
                <span className="font-semibold">Filter</span>
              </button>
              {id && (
                <DropdownButton
                  className="p-3"
                  style={{
                    backgroundColor: "#EEF6FF",
                    color: "#1F3368",
                  }}
                  label="Aksi"
                  options={[
                    {
                      label: "Upload File",
                      action: (e: any) => {
                        if (id) setModalUpload(true);
                        else alert("Silahkan Pilih Folder Terlebih Dahulu!");
                      },
                    },
                    {
                      label: "Tambah Folder",
                      action: (e: any) => {
                        setModalFolder(true);
                      },
                    },
                  ]}
                />
              )}
            </div>
          </div>
          {/* Tabs */}
          {id && (
            <div className="mb-4 flex space-x-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2 px-4 ${
                  activeTab === "all" ? "border-b-2 border-blue-500" : ""
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("file")}
                className={`py-2 px-4 ${
                  activeTab === "file" ? "border-b-2 border-blue-500" : ""
                }`}
              >
                File
              </button>
              <button
                onClick={() => setActiveTab("folder")}
                className={`py-2 px-4 ${
                  activeTab === "folder" ? "border-b-2 border-blue-500" : ""
                }`}
              >
                Folder
              </button>
            </div>
          )}
          {/* Files and Folders */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
            {activeTab === "folder" ? (
              <Fragment>
                {folders?.map((folder: any, index: any) => (
                  <div
                    key={index}
                    className="shadow-3 rounded-xl w-full px-5 relative group"
                  >
                    <div className="relative py-5">
                      <div
                        className="w-full h-[27.5vh] mb-5 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/configuration/file-manager/${folder.id}`
                          )
                        }
                      >
                        <img
                          className="object-cover rounded-xl w-full h-[27.5vh]"
                          src="/images/icon/folder-mac.png"
                          alt={folder.name}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ellipsis line-clamp-1">
                          {folder.name}
                        </span>
                        {id && (
                          <DropdownButton
                            className="group-hover:flex flex bg-transparent text-black"
                            icon={<VerticalThreeDotsIcon size="24" />}
                            options={[
                              {
                                label: "Hapus",
                                action: () => handleDeleteFolder(folder.id),
                              },
                            ]}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ) : activeTab === "file" ? (
              <Fragment>
                {files?.map((file: any, index: any) => (
                  <div
                    key={index}
                    className="shadow-3 rounded-xl w-full px-5 relative group"
                  >
                    <div className="relative py-5">
                      {file.format.includes("image") ? (
                        <CardImage images={file.url} />
                      ) : (
                        <div className="w-full h-[27.5vh] border rounded-xl mb-5 border-graydark flex justify-center items-center">
                          <div className="relative">
                            <div className="absolute z-1 w-[90%] h-full">
                              <div className="text-white text-2xl font-bold flex justify-center items-center w-full h-full">
                                {getExtensionName(file.name)}
                              </div>
                            </div>
                            <div className="z-0">
                              <DocumentIcon
                                size="96"
                                color={getColorByExt(
                                  getExtensionName(file.name)
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-ellipsis line-clamp-1">
                            {file.name}
                          </span>
                          <span className="text-xs line-clamp-1">
                            {(file.size / (1024 * 1024)).toFixed(2)} mb
                          </span>
                        </div>
                        <DropdownButton
                          className="group-hover:flex flex bg-transparent text-black"
                          icon={<VerticalThreeDotsIcon size="24" />}
                          options={[
                            {
                              label: "Hapus",
                              action: () => handleDeleteFile(file.id),
                            },
                            {
                              label: "Salin URL",
                              action: () => handleCopyUrl(file.url),
                            },
                            {
                              label: "Download File",
                              action: () => handleDownload(file.name, file.url),
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ) : (
              <Fragment>
                {allDatas?.map((data: any, index: any) => (
                  <Fragment key={data.id}>
                    {data.type === "FILE" ? (
                      <div
                        key={index}
                        className="shadow-3 rounded-xl w-full px-5 relative group"
                      >
                        <div className="relative py-5">
                          {data.format?.includes("image") ? (
                            <CardImage images={data.url} />
                          ) : (
                            <div className="w-full h-[27.5vh] border rounded-xl mb-5 border-graydark flex justify-center items-center">
                              <div className="relative">
                                <div className="absolute z-1 w-[90%] h-full">
                                  <div className="text-white text-2xl font-bold flex justify-center items-center w-full h-full">
                                    {getExtensionName(data.name)}
                                  </div>
                                </div>
                                <div className="z-0">
                                  <DocumentIcon
                                    size="96"
                                    color={getColorByExt(
                                      getExtensionName(data.name)
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-ellipsis line-clamp-1">
                                {data.name}
                              </span>
                              <span className="text-xs line-clamp-1">
                                {(data.size / (1024 * 1024)).toFixed(2)} mb
                              </span>
                            </div>
                            <DropdownButton
                              className="group-hover:flex flex bg-transparent text-black"
                              icon={<VerticalThreeDotsIcon size="24" />}
                              options={[
                                {
                                  label: "Hapus",
                                  action: () => handleDeleteFile(data.id),
                                },
                                {
                                  label: "Salin URL",
                                  action: () => handleCopyUrl(data.url),
                                },
                                {
                                  label: "Download File",
                                  action: () =>
                                    handleDownload(data.name, data.url),
                                },
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="shadow-3 rounded-xl w-full px-5 relative group"
                      >
                        <div className="relative py-5">
                          <div
                            className="w-full h-[27.5vh] mb-5 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/configuration/file-manager/${data.id}`
                              )
                            }
                          >
                            <img
                              className="object-cover rounded-xl w-full h-[27.5vh]"
                              src="/images/icon/folder-mac.png"
                              alt={data.name}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-ellipsis line-clamp-1">
                              {data.name}
                            </span>
                            {id && (
                              <DropdownButton
                                className="group-hover:flex flex bg-transparent text-black"
                                icon={<VerticalThreeDotsIcon size="24" />}
                                options={[
                                  {
                                    label: "Hapus",
                                    action: () => handleDeleteFolder(data.id),
                                  },
                                ]}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Fragment>
                ))}
              </Fragment>
            )}
          </div>
          {/* Pagination */}
          {paginationData && (
            <div className="mt-3">
              <Pagination
                {...paginationData}
                onNumberClick={(currentNumber) =>
                  setPaginationData({ ...paginationData, page: currentNumber })
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalUpload}
        onClose={() => setModalUpload(false)}
        title="Upload File"
      >
        <div className="md:w-[50vw] h-[100%]">
          <CreateFile
            folderId={id}
            onClose={() => {
              setModalUpload(false);
              handlesGetDatas();
            }}
          />
        </div>
      </Modal>

      <Modal
        isOpen={modalFolder}
        onClose={() => setModalFolder(false)}
        title="Tambah Folder"
      >
        <div className="md:w-[30vw] h-[100%]">
          <div className="grid grid-cols-1 gap-3">
            <TextInput
              name="folderName"
              value={folderName}
              label="Nama Folder"
              placeholder="Nama Folder"
              onChange={(e) => setFolderName(e.target.value)}
            />
            {/* <DropDownInput
              value={folderParent}
              name="folderParent"
              label="Parent Folder"
              placeholder="Parent Folder"
              options={convertFoldersToDropDown(foldersDropdown)}
              onChange={(e) => setFolderParent(e.target.value)}
            /> */}
          </div>
          <Modal.Footer>
            <div className="flex justify-end gap-3">
              <Button label="Cancel" onClick={() => setModalFolder(false)} />
              <Button label="Submit" onClick={handleCreateFolder} />
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default FileManagerPage;
