import { http } from "../utils/http";

export const getApplications = () => {
  return http.request("get", "/api/silky/applications");
};

export const getApplicationDetail = (appName) => {
  return http.request("get", `/api/silky/application/${appName}/detail`)
}

export const getApplicationInstances = (appName, queryInstanceCondition) => {
  return http.request("get", `/api/silky/application/${appName}/instances`, queryInstanceCondition)
}
