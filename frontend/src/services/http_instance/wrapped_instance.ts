import CookieManager from "@/utils/cookie_manager";
import axios, { HeadersDefaults, AxiosInstance } from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:3005",
// });

const instance = axios.create({
  baseURL: "https://pst-webservice.onrender.com/",
});

export function getJWT() {
  if (typeof window !== "undefined") {
    let token = CookieManager.getCookie("token");
    if (token?.charAt(0) === '"' && token?.charAt(token?.length - 1) === '"') {
      token = token?.substring(1, token?.length - 2);
    }
    // token?.replace(/^"(.*)"$/, '$1');
    // console.log(token?.split('"'))
    return "Bearer " + token;
  }
  return "";
}

class HTTPClient {
  static async get(endpoint: string) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Content-Type": "application/json",
      Authorization: getJWT(),
    };

    const response = await instance.get(endpoint, { headers });
    return response;
  }

  static async post(endpoint: string, data: any) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Content-Type": "application/json",
      Authorization: getJWT(),
    };

    const response = await instance.post(endpoint, data, { headers });
    return response;
  }

  static async delete(endpoint: string) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Content-Type": "application/json",
      Authorization: getJWT(),
    };
    const response = await instance.delete(endpoint, { headers });
    return response;
  }

  static async put(endpoint: string, data: any) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Content-Type": "application/json",
      Authorization: getJWT(),
    };

    const response = await instance.put(endpoint, data, { headers });
    return response;
  }
  static async formDataPost(endpoint: string, data: any) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Content-Type": "multipart/form", //this is not the correct content type please change it
      Authorization: getJWT(),
    };

    const response = await instance.post(endpoint, data, { headers });
    return response;
  }

  static async patch(endpoint: string, data: any) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PATCH",
      "Content-Type": "application/json",
      Authorization: getJWT(),
    };
    const response = await instance.patch(endpoint, data, { headers });
    return response;
  }
}
export default HTTPClient;
