import { http } from "../utils/http";

export const getExternalRoutes = () => {
    return http.request("get", "/api/silky/externalroutes");
  };