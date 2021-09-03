import { defineStore } from "pinia";
import { store } from "/@/store";
import { getRegistryCenters } from "/@/api/registrycenter";

export const registryCenterStore = defineStore({
  id: "pure-registrycenter",
  actions: {
    getRegistryCenters() {
      return new Promise((resolve, reject) => {
        getRegistryCenters().then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
});

export function useRegistryCenterStoreHook() {
  return registryCenterStore(store);
}
