/* eslint-disable @next/next/no-img-element */
"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import CardImage from "@/components/CardImage/CardImage";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import DropDownInput from "@/components/Input/DropDownInput";
import Pagination from "@/components/Pagination/Pagination";
import {
  DocumentIcon,
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
import { IconArrowLeft } from "@tabler/icons-react";

const PickFilePage = ({
  callBack,
  pickType,
}: {
  callBack?: (data: any) => void;
  pickType?: "image" | "file";
}) => {
  const router = useRouter();

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
  const [modalUpload, setModalUpload] = useState<boolean>(false);
  const [modalFolder, setModalFolder] = useState<boolean>(false);
  const [parentFolderId, setParentFolderId] = useState<string>("");
  const [rootFolderId, setRootFolderId] = useState<string>("");
  const [parentFolderList, setParentFolderList] = useState<Array<string>>([]);
  const [parentFolderNameList, setParentFolderNameList] = useState<
    Array<string>
  >([]);
  const [activeTab, setActiveTab] = useState<"folder" | "file" | "all">("all");

  // Fetch files and folders
  const handlesGetDatas = useCallback(async () => {
    if (activeTab === "file") {
      await getFiles(
        { limit: paginationData.limit, page: paginationData.page },
        {
          search: delayedSearch,
          folderId: parentFolderId ?? "",
        },
        setFiles,
        setPaginationData
      );
    } else if (activeTab === "folder") {
      getFolders(
        { limit: paginationData.limit, page: paginationData.page },
        {
          search: delayedSearch,
          parentId: parentFolderId ?? "",
          // isRoot: parentFolderId ? false : true,
        },
        setFolders,
        setPaginationData
      );
    } else {
      if (parentFolderId)
        getAll(
          parentFolderId,
          { limit: paginationData.limit, page: paginationData.page },
          {
            search: delayedSearch,
          },
          setAllDatas,
          setPaginationData
        );
    }
  }, [
    delayedSearch,
    paginationData.limit,
    paginationData.page,
    parentFolderId,
    activeTab,
  ]);
  const handleGetRoot = useCallback(async () => {
    const folderId = await getRoot({});
    parentFolderList.push(folderId);
    setParentFolderId(folderId);
    setParentFolderList([...parentFolderList]);
  }, [parentFolderList]);

  useEffect(() => {
    if (parentFolderList.length === 0) {
      handleGetRoot();
    } else {
      handlesGetDatas();
    }
  }, [handlesGetDatas, handleGetRoot, parentFolderList]);

  // Handle file and folder actions
  const handleDeleteFile = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      await deleteFileData(id);
      handlesGetDatas();
    }
  };

  const handleSelectedFile = async (item: any) => {
    callBack!(item);
    setActiveTab("all");
    setParentFolderId("");
    setParentFolderList([]);
    setParentFolderNameList([]);
    await handlesGetDatas();
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
      parentId: parentFolderId || null,
    });
    setFolderName("");
    setModalFolder(false);
    handlesGetDatas();
  };

  // Convert folders to dropdown options
  const convertFoldersToDropDown = (foldersData: any[]) => [
    { label: "Pilih Direktori Parent", value: "" },
    ...foldersData.map((folder) => ({ value: folder.id, label: folder.name })),
  ];

  const folderBack = () => {
    parentFolderList.splice(parentFolderList.length - 1, 1);
    setParentFolderId(parentFolderList[parentFolderList.length - 1]);
    setParentFolderList([...parentFolderList]);
    parentFolderNameList.splice(parentFolderNameList.length - 1, 1);
    setParentFolderNameList([...parentFolderNameList]);
    if (parentFolderList.length === 0) setActiveTab("all");
  };
  const folderForward = (id: string, name: string) => {
    parentFolderList.push(id);
    setParentFolderList([...parentFolderList]);
    parentFolderNameList.push(name);
    setParentFolderNameList([...parentFolderNameList]);
    // if (activeTab === "folder") setActiveTab("file");
    setActiveTab("all");
  };

  return (
    <div className="bg-white rounded-2xl w-full pb-5 h-full px-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-row items-center">
            {parentFolderList.length > 1 && (
              <div
                className="text-title-sm font-semibold text-black dark:text-white mr-3 cursor-pointer"
                onClick={() => {
                  folderBack();
                }}
              >
                <IconArrowLeft />
              </div>
            )}
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
          <div className="flex items-center text-2xl font-bold">
            {parentFolderNameList[parentFolderNameList.length - 1]}
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
          </div>
        </div>
        {/* Tabs */}
        {parentFolderId && (
          <div className="mb-4 flex space-x-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("all");
              }}
              className={`py-2 px-4 ${
                activeTab === "all" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              All
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("file");
              }}
              className={`py-2 px-4 ${
                activeTab === "file" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              File
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("folder");
              }}
              className={`py-2 px-4 ${
                activeTab === "folder" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Folder
            </button>
          </div>
        )}
        {/* Files and Folders */}
        <div className="overflow-y-scroll h-[100%]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-5">
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
                        onClick={() => {
                          setParentFolderId(folder.id);
                          folderForward(folder.id, folder.name);
                        }}
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
                        {((file.format.includes("image") &&
                          pickType === "image") ||
                          (!file.format.includes("image") &&
                            pickType === "file") ||
                          !pickType) && (
                          <DropdownButton
                            className="group-hover:flex flex bg-transparent text-black"
                            icon={<VerticalThreeDotsIcon size="24" />}
                            options={[
                              {
                                label: "Pilih File",
                                action: (e: any) => {
                                  e.preventDefault();
                                  handleSelectedFile(file);
                                },
                              },
                            ]}
                          />
                        )}
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
                            {((data.format.includes("image") &&
                              pickType === "image") ||
                              (!data.format.includes("image") &&
                                pickType === "file") ||
                              !pickType) && (
                              <DropdownButton
                                className="group-hover:flex flex bg-transparent text-black"
                                icon={<VerticalThreeDotsIcon size="24" />}
                                options={[
                                  {
                                    label: "Pilih File",
                                    action: (e: any) => {
                                      e.preventDefault();
                                      handleSelectedFile(data);
                                    },
                                  },
                                ]}
                              />
                            )}
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
                            onClick={() => {
                              setParentFolderId(data.id);
                              folderForward(data.id, data.name);
                            }}
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
                          </div>
                        </div>
                      </div>
                    )}
                  </Fragment>
                ))}
              </Fragment>
            )}
          </div>
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
  );
};

export default PickFilePage;
