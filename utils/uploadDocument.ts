import { toast } from "react-toastify";
import axios from "axios";
const uploadFileInput = async (event: any, bodyData: any) => {
  try {
    //   let data = event.target.files[0];
    let documents = event.target.files;
    let foundBigSize = false;
    Object.values(documents).forEach((item: any, index) => {
      if (item.size > 10000000 && foundBigSize === false) {
        toast.error("Ukuran File Maks 10 Mb!!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        foundBigSize = true;
      }
    });

    if (!foundBigSize) return await handleUpload(documents, bodyData);
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
const uploadFileDrop = async (files: any, event: any, bodyData: any) => {
  // console.log("File Data", files, event);
  // let data = files[0];
  try {
    //   let data = event.target.files[0];
    let documents = files;
    let foundBigSize = false;
    Object.values(documents).forEach((item: any, index) => {
      if (item.size > 10000000 && foundBigSize === false) {
        toast.error("Ukuran File Maks 10 Mb!!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        foundBigSize = true;
      }
    });

    if (!foundBigSize) return await handleUpload(documents, bodyData);
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
const handleUpload = async (documents: any, bodyData: any) => {
  return await new Promise((resolve, reject) => {
    const body = new FormData();
    for (let i = 0; i < documents.length; i++) {
      body.append("documents", documents[i]);
    }
    body.append("pathData", bodyData.pathData);

    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/utils/upload`, body, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data.data);
        toast.success("Berhasil upload dokumen", {
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
        toast.error("Terjadi kesalahan: " + error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        reject([]);
      });
  });
};

export { uploadFileDrop, uploadFileInput };
