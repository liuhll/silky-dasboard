import { defineStore } from "pinia";
import { store } from "/@/store";
import { getRegistryCenters } from "/@/api/registrycenter";
import { resolveData } from "./resolveHelper"

export const registryCenterStore = defineStore({
  id: "pure-registrycenter",
  actions: {
    getRegistryCenters() {
      return new Promise((resolve, reject) => {
        getRegistryCenters().then(response => {
          resolveData(resolve, response)
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
