<template>
  <div class="instance-contanier">
    <el-button type="text" icon="el-icon-back" @click="goBack()">返回</el-button>
    <el-descriptions :title="instanceInfo.hostName">
      <el-descriptions-item label="应用实例地址">{{instanceInfo.address}}</el-descriptions-item>
      <el-descriptions-item label="是否健康">
        <el-tag :type="instanceInfo.isHealth === 'true' ? 'success' : 'danger'">
          {{ instanceInfo.isHealth === 'true' ? "健康" : "不健康" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="是否在线">
        <el-tag :type="instanceInfo.isEnable === 'true' ? 'success' : 'danger'">
          {{ instanceInfo.isEnable === 'true' ? "健康" : "不健康" }}
        </el-tag>
      </el-descriptions-item>      
    </el-descriptions>
    <el-tabs v-model="activeName">
      <el-tab-pane label="本地执行信息" name="first">
        <el-descriptions title="该实例本地执行概要信息">
          <el-descriptions-item label="首次执行本地方法时间">{{dateFormat(instanceHandleInfo.firstHandleTime,"yyyy-mm-dd HH:MM:ss")}}</el-descriptions-item>
          <el-descriptions-item label="最后执行本地方法时间">{{dateFormat(instanceHandleInfo.finalHandleTime, "yyyy-mm-dd HH:MM:ss")}}</el-descriptions-item>
          <el-descriptions-item label="平均执行时长">{{displayAet(instanceHandleInfo.aet)}} ms</el-descriptions-item>
          <el-descriptions-item label="本地执行次数(汇总)">{{instanceHandleInfo.totalHandles}}</el-descriptions-item>
          <el-descriptions-item label="本地执行异常次数">{{instanceHandleInfo.faultHandles}}</el-descriptions-item>
          <el-descriptions-item label="本地执行严重错误(非业务异常)次数">{{instanceHandleInfo.seriousError}}</el-descriptions-item>
          <el-descriptions-item label="最后发生严重错误(非业务异常)时间" v-if="instanceHandleInfo.finalSeriousErrorTime">{{dateFormat(instanceHandleInfo.finalSeriousErrorTime,"yyyy-mm-dd HH:MM:ss")}}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="Rpc请求信息" name="second">
        <el-descriptions title="该实例Rpc请求概要信息">
          <el-descriptions-item label="首次rpc请求时间">{{dateFormat(instanceInvokeInfo.firstInvokeTime,"yyyy-mm-dd HH:MM:ss")}}</el-descriptions-item>
          <el-descriptions-item label="最后rpc请求时间">{{dateFormat(instanceInvokeInfo.finalInvokeTime, "yyyy-mm-dd HH:MM:ss")}}</el-descriptions-item>
          <el-descriptions-item label="rpc平均请求执行时长">{{displayAet(instanceInvokeInfo.aet)}} ms</el-descriptions-item>
          <el-descriptions-item label="rpc请求次数(汇总)">{{instanceInvokeInfo.totalRequests}}</el-descriptions-item>
          <el-descriptions-item label="rpc请求异常次数">{{instanceInvokeInfo.faultRequests}}</el-descriptions-item>
          <el-descriptions-item label="最后请求异常时间" v-if="instanceInvokeInfo.finalFaultInvokeTime">{{dateFormat(instanceInvokeInfo.finalFaultInvokeTime,"yyyy-mm-dd HH:MM:ss")}}</el-descriptions-item>
        </el-descriptions> 
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import dateFormat from "dateformat";
import { useRoute, useRouter } from "vue-router";
import { storageLocal } from "/@/utils/storage"
import { useApplicationStoreHook } from "/@/store/modules/applications";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const applicationStore = useApplicationStoreHook();
    const activeName = ref("first");
    let instanceInfo = ref({});
    let instanceHandleInfo = ref({});
    let instanceInvokeInfo = ref({});

    let serviceHandlePageRequest = ref({
      pageIndex: 1,
      pageSize: 10
    });

    let serviceInvokePageRequest = ref({
      pageIndex: 1,
      pageSize: 10
    });

    const goBack = () => {
      router.go(-1);
    }

    const getInstanceDetail = () => {
      const address = storageLocal.getItem("instanceAddress");
      if (address) {
        applicationStore.getInstanceDetail(address).then(data => {
          instanceHandleInfo.value = data["handleInfo"];
          instanceInvokeInfo.value = data["invokeInfo"];
        });
      }
    }
    
    const getInstanceServiceHandle = () => {
      const address = storageLocal.getItem("instanceAddress");
      if (address) {
        applicationStore.getInstanceServiceHandle(address, serviceHandlePageRequest.value).then(data => {
          instanceHandleInfo.value = data["handleInfo"];
          instanceInvokeInfo.value = data["invokeInfo"];
        });
      }
    }

    const getInstanceServiceInvoke = () => {
      const address = storageLocal.getItem("instanceAddress");
      if (address) {
        applicationStore.getInstanceServiceInvoke(address, serviceInvokePageRequest.value).then(data => {
          instanceHandleInfo.value = data["handleInfo"];
          instanceInvokeInfo.value = data["invokeInfo"];
        });
      } 
    }
    
    const displayAet = (aet) => {
      if (aet) {
        aet.toFixed(2);
      }
      return 0;
    }

    onMounted(() => {
      const address = route.query["address"];
      if (address) {
        storageLocal.setItem('instanceAddress', address);
      }
      if(Object.keys(route.params).length > 0) {
        storageLocal.setItem("instance",route.params);
      }
      instanceInfo.value = storageLocal.getItem("instance");

      getInstanceDetail();
      getInstanceServiceHandle();
      getInstanceServiceInvoke();
    });

    return {
      instanceInfo,
      instanceHandleInfo,
      instanceInvokeInfo,
      activeName,
      goBack,
      dateFormat,
      displayAet
    }
  }
}
</script>

<style lang="scss" scoped>
.instance-contanier {
  margin: 10px;
}
</style>