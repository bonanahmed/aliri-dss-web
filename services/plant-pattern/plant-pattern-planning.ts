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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/plant-pattern-templates?limit=${limit}&page=${page}`,
      { withCredentials: true }
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/plant-pattern-templates/${id}`,
      { withCredentials: true }
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/plant-pattern-templates`,
      body,
      {
        withCredentials: true,
        maxContentLength: 2000000, // Set the maximum allowed content length in bytes
      }
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/plant-pattern-templates/${id}`,
      body,
      { withCredentials: true }
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/plant-pattern-templates/${id}`,
        { withCredentials: true }
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

const getPlantPatterns = async (
  area_id: string,
  yearPeriod: string,
  callBack: (data: any) => void
) => {
  try {
    let query = "";
    if (area_id) query = "?area_id=" + area_id;
    if (yearPeriod) query += "&period=" + yearPeriod;
    const axiosResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/groups/plant-pattern${query}`,
      { withCredentials: true }
    );
    const response: any = axiosResponse.data;

    callBack(response.data);
  } catch (error) {
    throw error;
  }
};
export {
  getDatas,
  getDataId,
  createData,
  updateData,
  deleteData,
  getPlantPatterns,
};
