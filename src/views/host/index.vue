<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <span>微服务列表</span>
      </template>
      <div class="host-container">
        <el-card
          class="grid-content box-card-item"
          :class="item.hostName == selectedHostName ? boxcardclass : ''"
          v-for="(item, index) in host.items"
          :key="index"
          @click="handleSelectHost(item)"
        >
          <template #header>
            {{ item.hostName }}
          </template>
          <el-descriptions :column="1">
            <el-descriptions-item label="实例数">{{
              item.instanceCount
            }}</el-descriptions-item>
            <el-descriptions-item label="应用服务">{{
              item.appServiceCount
            }}</el-descriptions-item>
            <el-descriptions-item label="服务条目">{{
              item.serviceEntriesCount
            }}</el-descriptions-item>
            <el-descriptions-item label="服务协议">
              <el-tag
                v-for="(serviceProtocol, index) in item.serviceProtocols"
                :key="index"
                type="success"
              >
                {{ displayServiceProtocol(serviceProtocol) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
      <div style="clear: both"></div>
      <el-pagination
        layout="prev, pager, next"
        :total="host.totalCount"
        :page-size="queryHostCondition.pageSize"
        v-model:current-page="queryHostCondition.pageIndex"
        :hide-on-single-page="true"
        @current-change="loadHosts"
      >
      </el-pagination>
    </el-card>
    <el-card class="box-card">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="微服务实例" name="first">
            <el-table :data="hostInstances.items.filter((data) => 
              data.serviceProtocol == instanceServiceProtocol
            )">
              <el-table-column
                label="应用名称"
                prop="hostName"
              ></el-table-column>
              <el-table-column label="地址">
                <template #default="scope">
                  <el-button
                    v-if="scope.row.serviceProtocol == 0"
                    type="text"
                    @click="handleSelectedInstance(scope.row)"
                  >
                    {{ scope.row.address }}</el-button
                  >
                  <span v-if="scope.row.serviceProtocol != 0" type="text">
                    {{ scope.row.address }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="健康状态">
                <template #default="scope">
                  <el-tag :type="scope.row.isHealth ? 'success' : 'danger'">
                    {{ scope.row.isHealth ? "健康" : "不健康" }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="是否在线">
                <template #default="scope">
                  <el-tag :type="scope.row.isEnable ? 'success' : 'danger'">
                    {{ scope.row.isEnable ? "是" : "否" }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="服务协议">
                <template #header>
                  <el-select
                    v-model="instanceServiceProtocol"
                    size="mini"
                    placeholder="请选择服务协议"
                  >
                    <el-option label="Tcp" :value="0"></el-option>
                    <el-option label="Http" :value="4"></el-option>
                    <el-option label="Ws" :value="2"></el-option>
                  </el-select>
                </template>
                <template #default="scope">
                  <el-tag type="success">
                    {{ displayServiceProtocol(scope.row.serviceProtocol) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :total="hostInstances.totalCount"
              :page-size="queryInstanceCondition.pageSize"
              v-model:current-page="queryInstanceCondition.pageIndex"
              :hide-on-single-page="true"
              @current-change="getHostInstaces"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="服务详情" name="second">
            <el-card>
              <template #header>
                <span>{{ selectedHostName }} 应用服务</span>
              </template>

              <el-row>
                <el-col :span="3">
                  <el-select
                    v-model="queryServiceEntryCondition.serviceId"
                    clearable
                    placeholder="请选择应用服务"
                    @change="getServiceEntries"
                  >
                    <el-option
                      v-for="(item, index) in appServices"
                      :key="index"
                      :label="item.serviceName"
                      :value="item.serviceId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-select
                    v-model="queryServiceEntryCondition.isSystem"
                    clearable
                    placeholder="系统服务"
                    @change="getServiceEntries"
                  >
                    <el-option label="是" :value="true"> </el-option>
                    <el-option label="否" :value="false"> </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-select
                    v-model="queryServiceEntryCondition.isAllowAnonymous"
                    clearable
                    placeholder="跳过认证"
                    @change="getServiceEntries"
                  >
                    <el-option label="是" :value="true"> </el-option>
                    <el-option label="否" :value="false"> </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-select
                    v-model="queryServiceEntryCondition.prohibitExtranet"
                    clearable
                    placeholder="禁用外网"
                    @change="getServiceEntries"
                  >
                    <el-option label="是" :value="true"> </el-option>
                    <el-option label="否" :value="false"> </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-input
                    placeholder="关键字"
                    v-model="queryServiceEntryCondition.searchKey"
                    @input="getServiceEntries"
                    clearable
                  ></el-input>
                </el-col>
              </el-row>
              <el-table
                :data="appServiceEntries.items"
                :span-method="objectSpanMethod"
              >
                <el-table-column label="服务" prop="serviceName" width="200">
                </el-table-column>
                <el-table-column label="服务条目" width="450">
                  <template #default="scope">
                    <el-button
                      type="text"
                      @click="handleSelectServiceEntry(scope.row)"
                      >{{ scope.row.serviceEntryId }}</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  label="方法"
                  prop="method"
                  width="200"
                ></el-table-column>
                <el-table-column label="跳过认证" width="100">
                  <template #default="scope">
                    <el-tag
                      :type="scope.row.isAllowAnonymous ? 'success' : 'danger'"
                    >
                      {{ scope.row.isAllowAnonymous ? "是" : "否" }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="禁用外网">
                  <template #default="scope">
                    <el-tag
                      :type="scope.row.prohibitExtranet ? 'danger' : 'success'"
                    >
                      {{ scope.row.prohibitExtranet ? "是" : "否" }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="webApi"
                  prop="webApi"
                  width="300"
                ></el-table-column>
                <el-table-column label="http请求方法">
                  <template #default="scope">
                    <el-tag v-if="scope.row.httpMethod != null" type="success">
                      {{ displayHttpMethod(scope.row.httpMethod) }}</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="开发者" prop="author"></el-table-column>
              </el-table>
              <el-pagination
                layout="prev, pager, next"
                :total="appServiceEntries.totalCount"
                :page-size="queryServiceEntryCondition.pageSize"
                v-model:currentPage="queryServiceEntryCondition.pageIndex"
                :hide-on-single-page="true"
                @current-change="getServiceEntries()"
              >
              </el-pagination>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="WebSocket服务" name="thrid" v-if="hasWsService">
            <el-table
              :data="wsServices.items"
              :span-method="wsObjectSpanMethod"
            >
              <el-table-column label="ws服务" prop="serviceName">
              </el-table-column>
              <el-table-column label="webapi" prop="path"> </el-table-column>
              <el-table-column label="实例地址" prop="address">
              </el-table-column>
               <el-table-column label="会话地址(代理)" prop="proxyAddress">
              </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :total="wsServices.totalCount"
              :page-size="queryWsServiceCondition.pageSize"
              v-model:currentPage="queryWsServiceCondition.pageIndex"
              :hide-on-single-page="true"
              @current-change="getWsServices()"
            >
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useHostStoreHook } from "/@/store/modules/host";
import { useServiceEntryStoreHook } from "/@/store/modules/serviceentry";
import { HttpMethod } from "/@/utils/enums/HttpMethod";
import { ServiceProtocol } from "/@/utils/enums/ServiceProtocol";
import { useRouter } from "vue-router";
import { useServiceStoreHook } from "/@/store/modules/service";
export default {
  name: "Host",
  setup() {
    const hostsStore = useHostStoreHook();
    const serviceEntryStore = useServiceEntryStoreHook();
    const serviceStore = useServiceStoreHook();
    let host = ref({});
    let activeName = ref("first");
    let hostInstances = ref({
      items: []
    });
    let hostDetail = ref({});
    let selectedHostName = ref("");
    let boxcardclass = ref("");
    let hasWsService = ref(false);
    let queryInstanceCondition = ref({
      pageIndex: 1,
      pageSize: 10
    });
    let queryHostCondition = ref({
      pageIndex: 1,
      pageSize: 5
    });

    let queryWsServiceCondition = ref({
      pageIndex: 1,
      pageSize: 10
    });

    let queryServiceEntryCondition = ref({
      pageIndex: 1,
      pageSize: 10
    });
    let appServices = ref([]);
    let appServiceEntries = ref({});

    let wsServices = ref({});

    let instanceServiceProtocol = ref(ServiceProtocol.Tcp);

    let spanArr = [];
    let wsSpanArr = [];
    let wsPathSpanArr = [];

    let router = useRouter();

    const loadHosts = () => {
      hostsStore.getHosts(queryHostCondition.value).then(data => {
        host.value = data;
        selectedHostName.value = data["items"][0].hostName;
        boxcardclass.value = "box-card-shadow";
        queryServiceEntryCondition.value["hostName"] = selectedHostName.value;
        getHostInstaces();
        getServiceEntries();
        loadAppServices();
      });
    };

    const reSetServiceEntryCondition = () => {
      queryServiceEntryCondition.value["pageIndex"] = 1;
      queryServiceEntryCondition.value["pageSize"] = 10;
    };

    const getHostInstaces = () => {
      hostsStore
        .getHostInstances(selectedHostName.value, queryInstanceCondition.value)
        .then(data => {
          hostInstances.value = data;
        });
    };

    const loadAppServices = () => {
      serviceStore
        .getServices({
          hostName: selectedHostName.value
        })
        .then(data => {
          appServices.value = data;
        });
    };

    const handleSelectHost = hostInfo => {
      selectedHostName.value = hostInfo.hostName;
      hasWsService.value = hostInfo.serviceProtocols.includes(
        ServiceProtocol.Ws
      );
      instanceServiceProtocol.value = ServiceProtocol.Tcp;
      queryServiceEntryCondition.value["hostName"] = selectedHostName.value;
      activeName.value = "first";
      reSetServiceEntryCondition();
      getHostInstaces();
      getServiceEntries();
      loadAppServices();
      if (hasWsService.value) {
        getWsServices();
      }
    };

    const getServiceEntries = () => {
      serviceEntryStore
        .getServiceEntries(queryServiceEntryCondition.value)
        .then(data => {
          appServiceEntries.value = data;
          getSpanArr(appServiceEntries.value["items"]);
        });
    };

    const getWsServices = () => {
      serviceStore
        .getWsServices(selectedHostName.value, queryWsServiceCondition.value)
        .then(data => {
          wsServices.value = data;
          getWsSpanArr(wsServices.value["items"]);
        });
    };

    const getWsSpanArr = (data: any[]) => {
      wsSpanArr = [];
      wsPathSpanArr = [];
      let pos = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          wsSpanArr.push(1);
          wsPathSpanArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].serviceName === data[i - 1].serviceName) {
            wsSpanArr[pos] += 1;
            wsSpanArr.push(0);
          } else {
            wsSpanArr.push(1);
            pos = i;
          }
          if (data[i].path === data[i - 1].path) {
            wsPathSpanArr[pos] += 1;
            wsPathSpanArr.push(0);
          } else {
            wsPathSpanArr.push(1);
            pos = i;
          }
        }
      }
    };
    const getSpanArr = (data: any[]) => {
      spanArr = [];
      let pos = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          spanArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].serviceName === data[i - 1].serviceName) {
            spanArr[pos] += 1;
            spanArr.push(0);
          } else {
            spanArr.push(1);
            pos = i;
          }
        }
      }
    };
    const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex == 0) {
        const _row = spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    };

    const wsObjectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex == 0) {
        const _row = wsSpanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    };
    const displayHttpMethod = (httpMethod: Number) => {
      return HttpMethod[httpMethod];
    };

    const displayServiceProtocol = (serviceProtocol: Number) => {
      return ServiceProtocol[serviceProtocol];
    };
    const handleSelectedInstance = row => {
      router.push({
        name: "instance",
        query: { address: row.address },
        params: {
          isHealth: row.isHealth,
          isEnable: row.isEnable
        }
      });
    };
    const handleSelectServiceEntry = row => {
      router.push({
        name: "serviceentry",
        query: { serviceEntryId: row.serviceEntryId }
      });
    };
    const displayServiceKey = serviceKey => {
      return `名称:${serviceKey.name},权重:${serviceKey.wight}`;
    };

    onMounted(() => {
      loadHosts();
    });
    const handleClick = (tab, event) => {};

    return {
      host,
      hostInstances,
      activeName,
      hostDetail,
      queryInstanceCondition,
      queryHostCondition,
      appServiceEntries,
      wsServices,
      selectedHostName,
      queryServiceEntryCondition,
      queryWsServiceCondition,
      boxcardclass,
      hasWsService,
      appServices,
      instanceServiceProtocol,
      loadHosts,
      objectSpanMethod,
      wsObjectSpanMethod,
      displayHttpMethod,
      displayServiceProtocol,
      handleSelectHost,
      handleSelectedInstance,
      handleSelectServiceEntry,
      handleClick,
      getServiceEntries,
      getWsServices,
      displayServiceKey
    };
  }
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 100%;
  margin: 10px;
}
.box-card-item {
  width: 250px;
  float: left;
  margin: 10px;
  cursor: pointer;
}

.box-card-shadow {
  box-shadow: 10px 10px 5px #888888;
}
</style>
