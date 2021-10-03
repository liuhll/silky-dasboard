import { defineStore } from "pinia";
import { store } from "/@/store";
import { getServiceEntries, getServiceEntryDetail, getServiceEntryInstances } from "/@/api/serviceentry";

export const serviceEntryStore = defineStore({
  id: "pure-serviceentry",
  actions: {
    getServiceEntries(condition) {
      return new Promise((resolve, reject) => {
        getServiceEntries(condition).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getServiceEntryDetail(serviceId) {
      return new Promise((resolve, reject) => {
        getServiceEntryDetail(serviceId).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getServiceEntryInstances(serviceId, conditions) {
      return new Promise((resolve, reject) => {
        getServiceEntryInstances(serviceId, conditions).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
});

export function useServiceEntryStoreHook() {
  return serviceEntryStore(store);
}
