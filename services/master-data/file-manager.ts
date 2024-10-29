import { PaginationProps } from "@/types/pagination";
import axios from "axios";
import { toast } from "react-toastify";

export const handleUploadFile = async (file: any, bodyData: any) => {
  return await new Promise(async (resolve, reject) => {
    try {
      const url = await uploadFile(file);
      const body = {
        ...bodyData,
        url: url,
        thumbnail: url + "?q=80&w=200",
      };
      await createFileData(body);
      resolve(true);
      toast.success("Upload File Berhasil", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      reject(false);
      toast.error("Terjadi kesalahan: " + error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  });
};

const uploadFile = async (file: any) => {
  return await new Promise((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    axios
      .post(`https://dev.api.airso.digibay.id/files/uploads`, body, {
        withCredentials: true,
      })
      .then(async (response) => {
        const responseData = response.data.data;
        const returnUrl = responseData.urls
          ? responseData.urls.raw
          : responseData.url;
        resolve(returnUrl);
      })
      .catch((error) => {
        console.error("error on uploading: ", error);
        reject("error on uploading");
      });
  });
};

const createFileData = async (body: any) => {
  return await new Promise((resolve, reject) => {
    axios
      .post(`https://dev.api.airso.digibay.id/files`, body, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((error) => {
        console.error(error);

        reject([]);
      });
  });
};

export const deleteFileData = async (id: any) => {
  return await new Promise((resolve, reject) => {
    axios
      .delete(`https://dev.api.airso.digibay.id/files/` + id, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data.data);
        toast.success("Hapus File Berhasil", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
        toast.error("Hapus File Gagal", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  });
};

export const createFolderData = async (body: any) => {
  return await new Promise((resolve, reject) => {
    axios
      .post(`https://dev.api.airso.digibay.id/folders`, body, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data.data);
        toast.success("Buat Folder Berhasil", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
        toast.error("Buat Folder Gagal", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  });
};
export const deleteFolderData = async (id: any) => {
  return await new Promise((resolve, reject) => {
    axios
      .delete(`https://dev.api.airso.digibay.id/folders/` + id, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data.data);
        toast.success("Hapus Folder Berhasil", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
        toast.error("Hapus Folder Gagal", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  });
};

export const getFiles = async (
  options: any,
  filter: any,
  callBack: (data: any) => void,
  paginationCallback: (pagination: PaginationProps) => void
) => {
  let query = "";
  Object.entries(filter).forEach(([key, value]) => {
    if (value) query += `&${key}=${value}`;
  });
  const paginationData =
    options.limit && options.page
      ? `?limit=${options.limit}&page=${options.page}`
      : "?";
  const response = await axios.get(
    `https://dev.api.airso.digibay.id/files` + paginationData + query,
    {
      withCredentials: true,
    }
  );
  callBack(response.data.data);
  // const metadata = response.data.metadata;
  // paginationCallback({
  //   limit: parseInt(metadata.limit),
  //   page: parseInt(metadata.page),
  //   totalDocs: metadata.totalData,
  //   totalPages: metadata.totalPage,
  // });
};
export const getFolders = async (
  options: any,
  filter: any,
  callBack: (data: any) => void,
  paginationCallback: (pagination: PaginationProps) => void
) => {
  let query = "";
  Object.entries(filter).forEach(([key, value]) => {
    if (value) query += `&${key}=${value}`;
  });
  const paginationData =
    options.limit && options.page
      ? `?limit=${options.limit}&page=${options.page}`
      : "?";
  const response = await axios.get(
    `https://dev.api.airso.digibay.id/folders` + paginationData + query,
    {
      withCredentials: true,
    }
  );
  callBack(response.data.data);
  const metadata = response.data.metadata;
  paginationCallback({
    limit: parseInt(metadata.limit),
    page: parseInt(metadata.page),
    totalDocs: metadata.totalData,
    totalPages: metadata.totalPage,
  });
};
export const getAll = async (
  id: string,
  options: any,
  filter: any,
  callBack: (data: any) => void,
  paginationCallback: (pagination: PaginationProps) => void
) => {
  let query = "";
  Object.entries(filter).forEach(([key, value]) => {
    if (value) query += `&${key}=${value}`;
  });
  const paginationData =
    options.limit && options.page
      ? `?limit=${options.limit}&page=${options.page}`
      : "?";
  const response = await axios.get(
    `https://dev.api.airso.digibay.id/folders/${id}/items` +
      paginationData +
      query,
    {
      withCredentials: true,
    }
  );
  callBack(response.data.data);
  const metadata = response.data.metadata;
  paginationCallback({
    limit: parseInt(metadata.limit),
    page: parseInt(metadata.page),
    totalDocs: metadata.totalData,
    totalPages: metadata.totalPage,
  });
};
export const getRoot = async (filter: any) => {
  let query = "";
  Object.entries(filter).forEach(([key, value], index) => {
    if (value) query += index === 0 ? `?${key}=${value}` : `&${key}=${value}`;
  });
  const response = await axios.get(
    `https://dev.api.airso.digibay.id/folders/root` + query,
    {
      withCredentials: true,
    }
  );
  return response.data.data.id;
};
