import axios from "axios";
import { getCookie } from "cookies-next";
export const baseDomain = "https://api.nyxx.ai/";

// //export const baseDomain = "http://gasewtag2-53835.portmap.host:53835/";
// please test with gasewtag2-53835.portmap.host 53835

export const axiosInstance = axios.create({
  baseURL: baseDomain
});
export const apiPassword="ij.iuokoi6o8l78cjdsancnacewoih"

const RequestInterceptor = (config) => {
//   config.headers.token = getCookie("token");
  return config;
};
axiosInstance.interceptors.request.use(RequestInterceptor);
// axiosInstance.interceptors.response.use(ResponseInterceptor, (error) => {
//   const expectedErrors =
//     error.response &&
//     error.response.status >= 400 &&
//     error.response.status < 509;
//   if (!expectedErrors) {
//     return Promise.reject(error.response);
//   } else {
//     return Promise.reject(error.response);
//   }
// });
