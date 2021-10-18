import { defineStore } from "pinia";
import { store } from "/@/store";
import { getHosts, getAllHosts, getHostDetail, getHostInstances, getInstanceDetail, getInstanceServiceHandle, getInstanceServiceInvoke } from "../../api/host";

import { resolveData } from './resolveHelper'

export const applicationStore = defineStore({
  id: "pure-application",
  actions: {
    getHosts(conditions) {
      return new Promise((resolve, reject) => {
        getHosts(conditions).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAllHosts() {
      return new Promise((resolve, reject) => {
        getAllHosts().then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getHostInstances(appName, queryInstanceCondition) {
      return new Promise((resolve, reject) => {
        getHostInstances(appName, queryInstanceCondition).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getHostDetail(appName) {
      return new Promise((resolve, reject) => {
        getHostDetail(appName).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getInstanceDetail(address) {
      return new Promise((resolve, reject) => {
        getInstanceDetail(address).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getInstanceServiceHandle(address, conditions) {
      return new Promise((resolve, reject) => {
        getInstanceServiceHandle(address, conditions).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getInstanceServiceInvoke(address, conditions) {
      return new Promise((resolve, reject) => {
        getInstanceServiceInvoke(address, conditions).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
});

export function useHostStoreHook() {
  return applicationStore(store);
}
