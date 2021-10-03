import { http } from "../utils/http";

export const getServices = conditions => {
    return http.request("get", `/api/silky/services`,conditions);
  };

export const getWsServices = (hostName,conditions) => {
  return http.request("get", `/api/silky/host/${hostName}/wsservices`,conditions);
};

