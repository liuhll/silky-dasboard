import { http } from "../utils/http";

export const getProfiles = () => {
    return http.request("get", "/api/silky/profiles");
  };