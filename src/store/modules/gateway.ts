import { defineStore } from "pinia";
import { store } from "/@/store";
import { getGeteway, getGatewayInstances, getGatewayServiceEntries, getGatewayServices } from "/@/api/gateway";
import { resolveData } from "./resolveHelper";

export const gatewayStore = defineStore({
  id: "pure-gateway",
  actions: {
    getGeteway() {
      return new Promise((resolve, reject) => {
        getGeteway().then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getGatewayInstances(condition) {
      return new Promise((resolve, reject) => {
        getGatewayInstances(condition).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getGatewayServiceEntries(condition) {
      return new Promise((resolve, reject) => {
        getGatewayServiceEntries(condition).then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getGatewayServices() {
      return new Promise((resolve, reject) => {
        getGatewayServices().then(response => {
          resolveData(resolve, response)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
});

export function useGatewayStoreHook() {
  return gatewayStore(store);
}
