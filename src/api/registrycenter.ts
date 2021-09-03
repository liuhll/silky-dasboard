import { http } from "../utils/http";

export const getRegistryCenters = () => {
  return http.request("get", "/api/silky/registrycenters");
};