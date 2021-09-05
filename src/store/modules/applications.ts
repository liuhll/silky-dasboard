import { defineStore } from "pinia";
import { store } from "/@/store";
import { getApplications, getApplicationDetail, getApplicationInstances, getInstanceDetail, getInstanceServiceHandle, getInstanceServiceInvoke } from "/@/api/application";

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
    },
    getApplicationInstances(appName, queryInstanceCondition) {
      return new Promise((resolve, reject) => {
        getApplicationInstances(appName, queryInstanceCondition).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getApplicationDetail(appName) {
      return new Promise((resolve, reject) => {
        getApplicationDetail(appName).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getInstanceDetail(address) {
      return new Promise((resolve, reject) => {
        getInstanceDetail(address).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getInstanceServiceHandle(address,conditions) {
      return new Promise((resolve, reject) => {
        getInstanceServiceHandle(address,conditions).then(response => {
          const { data } = response
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getInstanceServiceInvoke(address, conditions) {
      return new Promise((resolve, reject) => {
        getInstanceServiceInvoke(address, conditions).then(response => {
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
