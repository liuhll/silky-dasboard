import { defineStore } from "pinia";
import { store } from "/@/store";
import { getServices, getWsServices } from "/@/api/service";

export const serviceStore = defineStore({
  id: "pure-service",
  actions: {
    getServices(conditions) {
      return new Promise((resolve, reject) => {
        getServices(conditions).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getWsServices(hostName, conditions) {
      return new Promise((resolve, reject) => {
        getWsServices(hostName,conditions).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })      
    }
  }
});

export function useServiceStoreHook() {
  return serviceStore(store);
}
