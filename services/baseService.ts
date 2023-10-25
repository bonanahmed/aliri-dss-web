import { PaginationProps } from "@/types/pagination";
import axiosClient from ".";

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
  const response: any = await axiosClient.get(
    `${url}?limit=${options.limit}&page=${options.page}${query}`
  );

  callBack(response.docs);
  paginationCallback({
    ...(response as PaginationProps),
  });
}
//get list datas
export async function getList(
  url: string,
  filter: any,
  options: any,
  callBack: (data: any) => void
) {
  let query = "";
  Object.entries(filter).forEach(([key, value], index: number) => {
    if (value) query += `${index === 0 ? "?" : "&"}${key}=${value}`;
  });
  let response: any = await axiosClient.get(`${url}${query}`);
  if (options.isDropDown)
    response = response.map((item: any, index: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });

  callBack(response);
}

//get data detail
export async function getData(
  url: string,
  id: string,
  callBack: (data: any) => void
) {
  const response: any = await axiosClient.get(url + `/${id}`);
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
