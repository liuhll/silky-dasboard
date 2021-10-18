import { defineStore } from "pinia";
import { store } from "/@/store";
import { getLogin } from "../../api/user";

import { resolveLoginData, resolveLoginErrorData } from './resolveHelper'

export const userStore = defineStore({
  id: "pure-service",
  actions: {
    getLogin(loginInfo) {
      return new Promise((resolve, reject) => {
        getLogin(loginInfo).then(response => {
          resolveLoginData(resolve, response)

        }).catch(err => {
          resolveLoginErrorData(resolve, err.response)
        })
      })
    }
  }
});

export function useUserHook() {
  return userStore(store);
}
