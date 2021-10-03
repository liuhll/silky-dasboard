import { http } from "../utils/http";

export const getGeteway = () => {
  return http.request("get", "/api/silky/gateway");
};

export const getGatewayInstances = (conditions) => {
  return http.request("get", "/api/silky/gateway/instances", conditions)
}

export const getGatewayServiceEntries = (conditions) => {
  return http.request("get", "/api/silky/gateway/serviceentries", conditions)
}

export const getGatewayServices = () => {
  return http.request("get", "/api/silky/gateway/services")
}