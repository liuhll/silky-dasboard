<template>
  <div class="instance-contanier">
    <el-button type="text" icon="el-icon-back" @click="goBack()"
      >返回</el-button
    >
    <el-descriptions :title="instanceInfo.hostName" :column="4">
      <el-descriptions-item label="实例地址">
        <el-tag>{{ instanceInfo.address }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="应用启动时间">
        <el-tag>{{ displayDate(instanceInfo.startTime) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="是否健康">
        <el-tag
          :type="instanceStatus.isHealth === 'true' ? 'success' : 'danger'"
        >
          {{ instanceStatus.isHealth === "true" ? "健康" : "不健康" }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-tabs v-model="activeName">
      <el-tab-pane label="服务执行信息" name="first">
        <el-descriptions title="该实例处理概要信息">
          <el-descriptions-item label="首次执行时间">{{
            displayDate(instanceHandleInfo.firstHandleTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="最后执行时间">{{
            displayDate(instanceHandleInfo.finalHandleTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="平均执行时长">
            {{ displayAet(instanceHandleInfo.aet) }} ms</el-descriptions-item
          >
          <el-descriptions-item label="实时并发量">{{
            instanceHandleInfo.concurrentCount
          }}</el-descriptions-item>
          <el-descriptions-item label="最大并发量">{{
            instanceHandleInfo.maxConcurrentCount
          }}</el-descriptions-item>
          <el-descriptions-item label="允许的最大并发量">{{
            instanceHandleInfo.allowMaxConcurrentCount
          }}</el-descriptions-item>
          <el-descriptions-item label="执行次数(汇总)">
            {{ instanceHandleInfo.totalHandleCount }}次</el-descriptions-item
          >
          <el-descriptions-item label="异常执行次数">
            {{ instanceHandleInfo.faultHandleCount }}次</el-descriptions-item
          >

          <el-descriptions-item label="严重错误(非业务异常)">
            {{
              instanceHandleInfo.totalSeriousErrorCount
            }}次</el-descriptions-item
          >
          <el-descriptions-item
            label="最后发生严重错误(非业务异常)时间"
            v-if="instanceHandleInfo.finalSeriousErrorTime"
          >
            {{
              displayDate(instanceHandleInfo.finalSeriousErrorTime)
            }}</el-descriptions-item
          >
        </el-descriptions>
        <el-row>
          <el-col :span="6">
            <el-input
              placeholder="关键字"
              v-model="serviceHandlePageRequest.searchKey"
              @input="getInstanceServiceHandle"
              clearable
            ></el-input>
          </el-col>
        </el-row>
        <el-table
          :data="serviceHandles.items"
          :span-method="objectSpanHandleMethod"
        >
          <el-table-column
            label="服务条目"
            prop="serviceEntryId"
            width="450"
          ></el-table-column>
          <el-table-column label="消费者地址" width="160">
            <template #default="scope">
              <el-tag>{{ scope.row.address }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="首次执行时间">
            <template #default="scope">
              {{ displayDate(scope.row.firstHandleTime) }}
            </template>
          </el-table-column>
          <el-table-column label="最后执行时间">
            <template #default="scope">
              {{ displayDate(scope.row.finalHandleTime) }}
            </template>
          </el-table-column>
          <el-table-column label="平均执行时长(ms)">
            <template #default="scope">
              {{ displayAet(scope.row.aet) }}
            </template>
          </el-table-column>
          <el-table-column
            label="执行次数(次)"
            prop="totalHandleCount"
          ></el-table-column>
          <el-table-column
            label="异常执行次数(次)"
            prop="faultHandleCount"
          ></el-table-column>
          <el-table-column
            label="严重错误[非业务异常](次)"
            prop="seriousErrorCount"
          ></el-table-column>
          <el-table-column label="最后严重错误[非业务异常]发生时间">
            <template #default="scope">
              {{ displayDate(scope.row.finalSeriousErrorTime) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :total="serviceHandles.totalCount"
          :page-size="serviceHandlePageRequest.pageSize"
          v-model:currentPage="serviceHandlePageRequest.pageIndex"
          :hide-on-single-page="true"
          @current-change="getInstanceServiceHandle()"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="Rpc请求信息" name="second">
        <el-descriptions title="该实例Rpc请求概要信息">
          <el-descriptions-item label="rpc首次请求时间">{{
            displayDate(instanceInvokeInfo.firstInvokeTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="rpc最后请求时间">{{
            displayDate(instanceInvokeInfo.finalInvokeTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="rpc平均请求响应时长"
            >{{ displayAet(instanceInvokeInfo.aet) }} ms</el-descriptions-item
          >
          <el-descriptions-item label="实时并发量">{{
            instanceInvokeInfo.concurrentCount
          }}</el-descriptions-item>
          <el-descriptions-item label="最大并发量">{{
            instanceInvokeInfo.maxConcurrentCount
          }}</el-descriptions-item>
          <el-descriptions-item label="rpc请求次数(汇总)">{{
            instanceInvokeInfo.totalInvokeCount
          }}</el-descriptions-item>
          <el-descriptions-item label="rpc请求异常次数">{{
            instanceInvokeInfo.faultInvokeCount
          }}</el-descriptions-item>
          <el-descriptions-item
            label="最后请求异常时间"
            v-if="instanceInvokeInfo.finalFaultInvokeTime"
          >
            {{
              displayDate(instanceInvokeInfo.finalFaultInvokeTime)
            }}</el-descriptions-item
          >
        </el-descriptions>
        <el-row>
          <el-col :span="6">
            <el-input
              placeholder="关键字"
              v-model="serviceInvokePageRequest.searchKey"
              @input="getInstanceServiceInvoke"
              clearable
            ></el-input>
          </el-col>
        </el-row>        
        <el-table
          :data="serviceInvokes.items"
          :span-method="objectSpanInvokeMethod"
        >
          <el-table-column label="服务条目" prop="serviceEntryId" width="400">
          </el-table-column>
          <el-table-column label="服务提供者地址(当前状态)" width="220">
            <template #default="scope">
              <el-tag :type="scope.row.isEnable ? 'success' : 'danger'"
                >{{ scope.row.address }}
                {{ scope.row.isEnable ? "(在线)" : "(离线)" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="首次调用时间">
            <template #default="scope">
              {{ displayDate(scope.row.firstInvokeTime) }}
            </template>
          </el-table-column>
          <el-table-column label="最后调用时间">
            <template #default="scope">
              {{ displayDate(scope.row.finalInvokeTime) }}
            </template>
          </el-table-column>
          <el-table-column label="平均响应(ms)">
            <template #default="scope">
              {{ displayAet(scope.row.aet) }}
            </template>
          </el-table-column>
          <el-table-column
            label="请求次数(次)"
            prop="totalInvokeCount"
          ></el-table-column>
          <el-table-column
            label="异常请求(次)"
            prop="faultInvokeCount"
          ></el-table-column>
          <el-table-column label="最后异常请求时间">
            <template #default="scope">
              {{ displayDate(scope.row.finalFaultInvokeTime) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :total="serviceInvokes.totalCount"
          :page-size="serviceInvokePageRequest.pageSize"
          v-model:currentPage="serviceInvokePageRequest.pageIndex"
          :hide-on-single-page="true"
          @current-change="getInstanceServiceInvoke()"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import dateFormat from "dateformat";
import { useRoute, useRouter } from "vue-router";
import { storageLocal } from "/@/utils/storage";
import { useHostStoreHook } from "/@/store/modules/host";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const hostStore = useHostStoreHook();
    const activeName = ref("first");
    let instanceStatus = ref({});
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

    let serviceHandles = ref({});
    let serviceInvokes = ref({});

    let spanHandleArr = [];
    let spanInvokeArr = [];

    const goBack = () => {
      router.go(-1);
    };

    const getInstanceDetail = () => {
      const address = storageLocal.getItem("instanceAddress");

      if (address && instanceStatus.value["isHealth"] === "true") {
        hostStore.getInstanceDetail(address).then(data => {
          instanceHandleInfo.value = data["handleInfo"];
          instanceInvokeInfo.value = data["invokeInfo"];
          instanceInfo.value = {
            hostName: data["hostName"],
            address: data["address"],
            startTime: data["startTime"]
          };
        });
      }
    };

    const getInstanceServiceHandle = () => {
      const address = storageLocal.getItem("instanceAddress");
      if (address) {
        hostStore
          .getInstanceServiceHandle(address, serviceHandlePageRequest.value)
          .then(data => {
            serviceHandles.value = data;
            getSpanHandleArr(data["items"]);
          });
      }
    };

    const getInstanceServiceInvoke = () => {
      const address = storageLocal.getItem("instanceAddress");
      if (address) {
        hostStore
          .getInstanceServiceInvoke(address, serviceInvokePageRequest.value)
          .then(data => {
            serviceInvokes.value = data;
            getSpanInvokeArr(data["items"]);
          });
      }
    };

    const displayAet = aet => {
      if (aet) {
        return aet.toFixed(2);
      }
      return 0;
    };

    const displayDate = date => {
      if (date) {
        return dateFormat(date, "yyyy-mm-dd HH:MM:ss");
      }
      return "";
    };

    onMounted(() => {
      const address = route.query["address"];
      if (address) {
        storageLocal.setItem("instanceAddress", address);
      }
      const serviceEntryId = route.query["serviceEntryId"];
      if (serviceEntryId) {
        serviceHandlePageRequest.value.searchKey = serviceEntryId;
      }

      if (Object.keys(route.params).length > 0) {
        storageLocal.setItem("instanceStatus", route.params);
      }
      instanceStatus.value = storageLocal.getItem("instanceStatus");
      getInstanceServiceHandle();
      getInstanceServiceInvoke();
      getInstanceDetail();
    });

    const getSpanHandleArr = (data: any[]) => {
      spanHandleArr = [];
      let pos = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          spanHandleArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].serviceEntryId === data[i - 1].serviceEntryId) {
            spanHandleArr[pos] += 1;
            spanHandleArr.push(0);
          } else {
            spanHandleArr.push(1);
            pos = i;
          }
        }
      }
    };

    const objectSpanHandleMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex == 0) {
        const _row = spanHandleArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    };

    const getSpanInvokeArr = (data: any[]) => {
      spanInvokeArr = [];
      let pos = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          spanInvokeArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].serviceEntryId === data[i - 1].serviceEntryId) {
            spanInvokeArr[pos] += 1;
            spanInvokeArr.push(0);
          } else {
            spanInvokeArr.push(1);
            pos = i;
          }
        }
      }
    };

    const objectSpanInvokeMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex == 0) {
        const _row = spanInvokeArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    };

    return {
      instanceStatus,
      instanceHandleInfo,
      instanceInvokeInfo,
      serviceHandlePageRequest,
      serviceInvokePageRequest,
      activeName,
      serviceHandles,
      serviceInvokes,
      instanceInfo,
      goBack,
      displayDate,
      displayAet,
      objectSpanHandleMethod,
      objectSpanInvokeMethod,
      getInstanceServiceHandle,
      getInstanceServiceInvoke
    };
  }
};
</script>

<style lang="scss" scoped>
.instance-contanier {
  margin: 10px;
}
</style>
