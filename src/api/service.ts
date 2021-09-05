import { http } from "../utils/http";

export const getServices = (condition) => {
    return http.request("get", "/api/silky/services", condition);
  };

export const getServiceEntries = (condition) => {
  return http.request("get", "/api/silky/serviceentries", condition);
}

export const getServiceEntryDetail = (serviceId) => {
  return http.request("get", `/api/silky/serviceentry/${serviceId}/detail`);
}

export const getServiceEntryRoutes = (serviceId,conditions) => {
  return http.request("get", `/api/silky/serviceentry/${serviceId}/routes`, conditions);
}