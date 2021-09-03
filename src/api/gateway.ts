import { http } from "../utils/http";

export const getGeteway = () => {
  return http.request("get", "/api/silky/gateway");
};

export const getGatewayInstances = (conditions) => {
  return http.request("get", "/api/silky/gateway/instances", conditions)
}
