<template>
  <div class="gateway-container">
    <el-descriptions title="网关信息" :column="5" size="medium" border>
      <el-descriptions-item label="名称">{{
        gatewayInfo.hostName
      }}</el-descriptions-item>
      <el-descriptions-item label="实例数">{{
        gatewayInfo.instanceCount
      }}</el-descriptions-item>
      <el-descriptions-item label="支持的服务数">{{
        gatewayInfo.supportServiceCount
      }}</el-descriptions-item>
      <el-descriptions-item label="支持的服务条目数">{{
        gatewayInfo.supportServiceEntryCount
      }}</el-descriptions-item>
      <el-descriptions-item label="是否存在websocket服务">
        <el-tag
          :type="gatewayInfo.existWebSocketService ? 'success' : 'danger'"
        >
          {{ gatewayInfo.existWebSocketService ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-card class="supportservices-card">
      <el-tag
        class="supportservice-item"
        type="info"
        v-for="(item, index) in gatewayInfo.supportServices"
        :key="index"
        >{{ item }}</el-tag
      >
    </el-card>

    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="网关实例" name="first">
          <el-table :data="gatewayInstances.items">
            <el-table-column label="应用名" prop="hostName"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="gatewayInstances.totalCount"
            :page-size="gatewayInstanceCondition.pageSize"
            v-model:currentPage="gatewayInstanceCondition.pageIndex"
            :hide-on-single-page="true"
            @current-change="loadGatewayInstances()"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
import { useGatewayStoreHook } from "/@/store/modules/gateway";
import { ref, onMounted } from "vue";
export default {
  setup() {
    let gatewayInfo = ref({});
    let activeName = ref("first");
    let gatewayInstances = ref({});
    let gatewayInstanceCondition = ref({
      pageIndex: 1,
      pageSize: 10
    });
    const gatewayStore = useGatewayStoreHook();
    const loadGatewayInfo = () => {
      gatewayStore.getGeteway().then(data => {
        gatewayInfo.value = data;
      });
    };
    const loadGatewayInstances = () => {
      gatewayStore
        .getGatewayInstances(gatewayInstanceCondition.value)
        .then(data => {
          gatewayInstances.value = data;
        });
    };
    onMounted(() => {
      loadGatewayInfo();
      loadGatewayInstances();
    });
    return {
      gatewayInfo,
      activeName,
      gatewayInstances,
      gatewayInstanceCondition
    };
  }
};
</script>

<style lang="scss" scoped>
.gateway-container {
  margin: 10px;
}
.supportservices-card {
  margin-top: 20px;
}
.supportservice-item {
  margin: 10px;
}
.box-card {
  margin-top: 10px;
}
</style>
