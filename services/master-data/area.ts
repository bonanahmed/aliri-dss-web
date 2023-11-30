import ApiResponse from "@/types/ApiResponse";
import { PaginationProps } from "@/types/pagination";
import axios from "axios";
const getDatas = async (
  limit: number,
  page: number,
  callBack: (data: any) => void,
  paginationCallBack: (pagination: PaginationProps) => void
) => {
  try {
    const axiosResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/areas?limit=${limit}&page=${page}`
    );
    const response: ApiResponse<any> = axiosResponse.data;
    callBack(response.data?.docs);
    paginationCallBack({ ...response.data } as PaginationProps);
  } catch (error) {
    throw error;
  }
};
const getDataId = async (id: string, callBack: (data: any) => void) => {
  try {
    const axiosResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/areas/${id}`
    );
    const response: ApiResponse<any> = axiosResponse.data;
    callBack(response.data);
  } catch (error) {
    throw error;
  }
};
const createData = async (body: any) => {
  try {
    const axiosResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/areas`,
      body
    );
    const response: ApiResponse<any> = axiosResponse.data;
    alert(response.message);
    window.location.reload();
    return response;
  } catch (error) {
    throw error;
  }
};
const updateData = async (id: string, body: any) => {
  try {
    const axiosResponse = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/areas/${id}`,
      body
    );
    const response: ApiResponse<any> = axiosResponse.data;
    alert(response.message);
    window.location.reload();
    return response;
  } catch (error) {
    throw error;
  }
};
const deleteData = async (id: string) => {
  try {
    if (confirm("Apakah anda yakin akan menghapus data ini?")) {
      const axiosResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/areas/${id}`
      );
      const response: ApiResponse<any> = axiosResponse.data;

      alert(response.message);
      window.location.reload();
      return response;
    }
  } catch (error) {
    throw error;
  }
};

const getAreaDatas = async (callBack: (data: any) => void) => {
  try {
    const axiosResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/areas`,
      { withCredentials: true }
    );
    const response: any = axiosResponse.data;
    const listData = response.data?.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    callBack(listData);
  } catch (error) {
    throw error;
  }
};

const getLineDatas = async (callBack: (data: any) => void) => {
  try {
    const axiosResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/lines`,
      { withCredentials: true }
    );
    const response: any = axiosResponse.data;
    const listData = response.data?.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    callBack(listData);
  } catch (error) {
    throw error;
  }
};
export {
  getDatas,
  createData,
  updateData,
  deleteData,
  getAreaDatas,
  getLineDatas,
  getDataId,
};
