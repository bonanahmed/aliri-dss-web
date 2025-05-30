import ApiResponse from "@/types/ApiResponse";
import { PaginationProps } from "@/types/pagination";
import axios from "axios";
import axiosClient from "..";
const getDatas = async (
  options: any,
  filter: any,
  callBack: (data: any) => void,
  paginationCallBack: (pagination: PaginationProps) => void
) => {
  try {
    const { search } = filter;
    let query = "";
    if (search) query += `&search=${search}`;
    const axiosResponse = await axios.get(
      `/pastens?limit=${options.limit}&page=${options.page}`
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/pastens/${id}`
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/pastens`,
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/pastens/${id}`,
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/pastens/${id}`
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
export { getDatas, getDataId, createData, updateData, deleteData };
