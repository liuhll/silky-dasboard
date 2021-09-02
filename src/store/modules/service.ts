import { defineStore } from "pinia";
import { store } from "/@/store";
import { getServices, getServiceEntries } from "/@/api/service";

export const serviceStore = defineStore({
  id: "pure-service",
  actions: {
    getServices(condition) {
      return new Promise((resolve, reject) => {
        getServices(condition).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getServiceEntries(condition) {
      return new Promise((resolve, reject) => {
        getServiceEntries(condition).then(response => {
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
