import { PaginationProps } from "@/types/pagination";
import axiosClient from ".";
import { convertStringToProperties } from "@/utils/convertStringToProperties";

//get all data
export async function getDatas(
  url: string,
  options: any,
  filter: any,
  callBack: (data: any) => void,
  paginationCallback: (pagination: PaginationProps) => void
) {
  let query = "";
  Object.entries(filter).forEach(([key, value]) => {
    if (value) query += `&${key}=${value}`;
  });

  const paginationData =
    options.limit && options.page
      ? `?limit=${options.limit}&page=${options.page}`
      : "?";
  const response: any = await axiosClient.get(
    `${url}${paginationData}${query}`
  );

  callBack(response.docs);
  paginationCallback({
    ...(response as PaginationProps),
  });
}
//get list datas for options
interface IOptionOptions {
  isDropDown: boolean;
  label?: string | undefined;
  key?: string | undefined;
  withCredential?: boolean | undefined;
}
export async function getOptions(
  url: string,
  callBack: (data: any) => void,
  options: IOptionOptions | undefined,
  filter?: any | undefined
) {
  let query = "";
  Object.entries(filter).forEach(([key, value], index: number) => {
    if (value) query += `${index === 0 ? "?" : "&"}${key}=${value}`;
  });
  let response: any = await axiosClient.get(`${url}${query}`);
  if (options?.isDropDown) {
    response = response.map((item: any, index: any) => {
      return {
        value: options?.key
          ? convertStringToProperties(options?.key, item)
          : item.id,
        label: options?.label
          ? convertStringToProperties(options?.label, item)
          : item.name,
      };
    });
  }

  callBack!(response);
}

//get data detail
export async function getData(
  url: string,
  id: string,
  callBack: (data: any) => void,
  filter?: any
) {
  let query = "";
  if (filter) {
    Object.entries(filter).forEach(([key, value]: any, index: number) => {
      if (index === 0) {
        query += `?${key}=${value}`;
      } else {
        query += `&${key}=${value}`;
      }
    });
  }
  const response: any = await axiosClient.get(url + `/${id}` + query);
  callBack(response);
}

//create data
export async function createData(url: string, body: any) {
  await axiosClient.post(url, body);
}

//update data
export async function updateData(url: string, id: string, body: any) {
  await axiosClient.patch(url + `/${id}`, body);
}

//delete data
export async function deleteData(url: string, id: string) {
  await axiosClient.delete(url + `/${id}`);
}
