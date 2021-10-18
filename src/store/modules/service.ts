import { defineStore } from "pinia";
import { store } from "/@/store";
import { getServices, getWsServices } from "/@/api/service";
import { resolveData } from './resolveHelper'
export const serviceStore = defineStore({
  id: "pure-service",
  actions: {
    getServices(conditions) {
      return new Promise((resolve, reject) => {
        getServices(conditions).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getWsServices(hostName, conditions) {
      return new Promise((resolve, reject) => {
        getWsServices(hostName, conditions).then(response => {
          resolveData(resolve, response)
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
