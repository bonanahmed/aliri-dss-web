import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// axiosClient.interceptors.request.use(function (request) {
//   return request;
// });

axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    if (response.config.method !== "get") {
      toast.success(response.data.message, { autoClose: 1500 });
    }
    if (response.config.url === "/auth/login") {
      const queryString = window.location.search;

      // Parse the query string into an object
      const params = new URLSearchParams(queryString);
      const getUrl = params.get("url") ?? "/";
      setTimeout(() => {
        window.location.href = getUrl;
      }, 1500);
    }
    return response.data.data;
  },
  function (error) {
    let res = error.response;

    if (res.status == 401) {
      if (window.location.pathname !== "/auth/signin")
        window.location.href = `/auth/signin`;
      if (res.config.url === "/auth/login")
        toast.error("Error: " + res.data.message, {
          autoClose: 1500,
        });
    } else {
      toast.error("Error: " + res.data.message);
    }
    console.error(`Looks like there was a problem. Status Code: ` + res.status);
    if (res.status !== 401) return Promise.reject(error);
  }
);

export default axiosClient;
