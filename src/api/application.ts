import { http } from "../utils/http";

export const getApplications = () => {
    return http.request("get", "/api/silky/applications");
  };