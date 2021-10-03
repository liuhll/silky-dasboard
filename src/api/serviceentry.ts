import { http } from "../utils/http";

export const getServiceEntries = (condition) => {
    return http.request("get", "/api/silky/serviceentries", condition);
  }
  
  export const getServiceEntryDetail = (serviceEntryId) => {
    return http.request("get", `/api/silky/serviceentry/${serviceEntryId}/detail`);
  }
  
  export const getServiceEntryInstances = (serviceEntryId,conditions) => {
    return http.request("get", `/api/silky/serviceentry/${serviceEntryId}/instances`, conditions);
  }