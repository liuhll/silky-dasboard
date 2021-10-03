import { http } from "../utils/http";

export const getHosts = (conditions) => {
  return http.request("get", "/api/silky/hosts",conditions);
}

export const getAllHosts = () => {
  return http.request("get", "/api/silky/allhosts");
}

export const getHostDetail = (hostName) => {
  return http.request("get", `/api/silky/host/${hostName}/detail`)
}

export const getHostInstances = (hostName, queryInstanceCondition) => {
  return http.request("get", `/api/silky/host/${hostName}/instances`, queryInstanceCondition)
}

export const getInstanceDetail = (address) => {
  return http.request("get", `/api/silky/instance/${address}/detail`)
}

export const getInstanceServiceHandle = (address, conditions) => {
  return http.request("get", `/api/silky/instance/${address}/servicehandle`, conditions)
}

export const getInstanceServiceInvoke = (address, conditions) => {
  return http.request("get", `/api/silky/instance/${address}/serviceinvoke`, conditions)
}