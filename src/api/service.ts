import { http } from "../utils/http";

export const getServices = (condition) => {
    return http.request("get", "/api/silky/services", condition);
  };

export const getServiceEntries = (condition) => {
  return http.request("get", "/api/silky/serviceentries", condition);
}