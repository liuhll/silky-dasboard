import { defineStore } from "pinia";
import { store } from "/@/store";
import { getProfiles } from "/@/api/profile";

export const profileStore = defineStore({
  id: "pure-profile",
  actions: {
    getProfiles() {
      return new Promise((resolve, reject) => {
        getProfiles().then(response => {
          const { data } = response
          resolve(data)
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
