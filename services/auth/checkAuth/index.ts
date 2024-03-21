import axiosClient from "@/services";

export async function getUserAuth() {
  return await axiosClient.get("/auth/get-data");
}
