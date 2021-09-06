import { AxiosRequestConfig } from "axios";
import { excludeProps } from "./utils";
import { storageSession } from "/@/utils/storage";

/**
 * 默认配置
 */
export const defaultConfig: AxiosRequestConfig = {
  baseURL: "",
  timeout: 10000, //10秒超时
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  }
};

export function genConfig(config?: AxiosRequestConfig): AxiosRequestConfig {

  let loginUserInfo = storageSession.getItem("info");
  if (loginUserInfo && loginUserInfo.accessToken) {
    defaultConfig.headers.Authorization = loginUserInfo.accessToken;
  }
  if (!config) {
    return defaultConfig;
  }

  const { headers } = config;
  if (headers && typeof headers === "object") {
    defaultConfig.headers = {
      ...defaultConfig.headers,
      ...headers
    };
  }
  return { ...excludeProps(config!, "headers"), ...defaultConfig };
}

export const METHODS = ["post", "get", "put", "delete", "option", "patch"];
