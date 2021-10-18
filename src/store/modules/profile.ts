import { defineStore } from "pinia";
import { store } from "/@/store";
import { getProfiles } from "/@/api/profile";
import { resolveData } from "./resolveHelper"

export const profileStore = defineStore({
  id: "pure-profile",
  actions: {
    getProfiles() {
      return new Promise((resolve, reject) => {
        getProfiles().then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
});

export function useProfileStoreHook() {
  return profileStore(store);
}
