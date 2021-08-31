import { defineStore } from "pinia";
import { store } from "/@/store";
import { getApplications } from "/@/api/application";

export const applicationStore = defineStore({
  id: "pure-application",
  actions: {
    getApplications() {
      return new Promise((resolve, reject) => {
        getApplications().then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
});

export function useApplicationStoreHook() {
  return applicationStore(store);
}
