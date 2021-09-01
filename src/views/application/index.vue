<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <span>微服务列表</span>
      </template>
      <div>
        <el-card
          shadow="always"
          class="grid-content box-card-item"
          v-for="(item, index) in applications"
          :key="index"
          @click="handleSelectApplication(item)"
        >
          <template #header>
            {{ item.hostName }}
          </template>
          <div class="body">
            <ul>
              <li>
                <span>主机实例: {{ item.instanceCount }}</span>
              </li>
              <li>
                <span>应用服务: {{ item.appServiceCount }}</span>
              </li>
              <li>
                <span>服务条目: {{ item.serviceEntriesCount }}</span>
              </li>
              <li>
                <span
                  >WebSocket服务:
                  {{ item.hasWsService ? "支持" : "不支持" }}</span
                >
              </li>
            </ul>
          </div>
        </el-card>
      </div>
    </el-card>
    <el-card class="box-card">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="微服务实例" name="first">
            <el-table :data="applicationInstances.items">
              <el-table-column
                label="主机名称"
                prop="hostName"
              ></el-table-column>
              <el-table-column label="地址" prop="address"></el-table-column>
              <el-table-column label="健康状态">
                <template #default="scope">
                  <el-tag :type="scope.row.isHealth ? 'success' : 'danger'">
                    {{ scope.row.isHealth ? "健康" : "不健康" }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="是否会被路由">
                <template #default="scope">
                  <el-tag :type="scope.row.isEnable ? 'success' : 'danger'">
                    {{ scope.row.isEnable ? "是" : "否" }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :total="applicationInstances.totalCount"
              :page-size="queryInstanceCondition.pageSize"
              v-model:current-page="queryInstanceCondition.pageIndex"
              :hide-on-single-page="true"
              @current-change="getApplicationInstaces"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="服务详情" name="second">
            <el-card>
              <template #header>
                <span>{{ selectedAppName }} 应用服务</span>
              </template>
              <el-table
                :data="appServiceEntries.data"
                :span-method="objectSpanMethod"
              >
                <el-table-column
                  label="服务"
                  prop="appService"
                ></el-table-column>
                <el-table-column
                  label="服务条目Id"
                  prop="serviceId"
                ></el-table-column>
                <el-table-column label="方法" prop="method"></el-table-column>
                <el-table-column label="禁用外网">
                  <template #default="scope">
                    <el-tag
                      :type="scope.row.prohibitExtranet ? 'danger' : 'success'"
                    >
                      {{ scope.row.prohibitExtranet ? "是" : "否" }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="webapi" prop="webApi"></el-table-column>
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
                :page-size="appServiceEntries.pageSize"
                v-model:currentPage="appServiceEntries.pageIndex"
                :hide-on-single-page="true"
                @current-change="getAppServiceEntries()"
              >
              </el-pagination>
            </el-card>
            <el-card v-if="wsServices.length > 0">
              <template #header>
                <span>{{ selectedAppName }} WebSocket服务</span>
              </template>
              <el-table :data="wsServices">
                <el-table-column
                  label="服务"
                  prop="appService"
                ></el-table-column>
                <el-table-column
                  label="websocket会话地址"
                  prop="wsPath"
                ></el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useApplicationStoreHook } from "/@/store/modules/applications";
export default {
  name: "Application",
  setup() {
    const enum HttpMethod {
      Get = 0,
      Put = 1,
      Delete = 2,
      Post = 3,
      Head = 4,
      Trace = 5,
      Patch = 6,
      Connect = 7,
      Options = 8,
      Custom = 9,
      None = 255 // 0xFF
    }
    const applicationsStore = useApplicationStoreHook();
    let applications = ref([]);
    let activeName = ref("first");
    let applicationInstances = ref({});
    let applicationDetail = ref({});
    let selectedAppName = ref("");
    let queryInstanceCondition = ref({
      pageIndex: 1,
      pageSize: 10
    });

    let appServiceEntries = ref({
      data: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: 10
    });

    let wsServices = ref([]);

    let allServiceEntries = [];

    let spanArr = [];

    const loadApplications = () => {
      applicationsStore.getApplications().then(data => {
        applications.value = data;
        selectedAppName.value = data[0].hostName;
        getApplicationInstaces(
          selectedAppName.value,
          queryInstanceCondition.value
        );
        getApplicationDetail(selectedAppName.value);
      });
    };

    const getApplicationInstaces = (appName, queryInstanceCondition) => {
      applicationsStore
        .getApplicationInstances(appName, queryInstanceCondition)
        .then(data => {
          applicationInstances.value = data;
        });
    };
    const getApplicationDetail = appName => {
      applicationsStore.getApplicationDetail(appName).then(data => {
        applicationDetail.value = data;
        allServiceEntries = data["appServiceEntries"];
        wsServices.value = data["wsServices"];
        getAppServiceEntries();
      });
    };
    const handleClick = (tab, event) => {};
    loadApplications();
    const handleSelectApplication = applicationInfo => {
      selectedAppName.value = applicationInfo.hostName;
      getApplicationInstaces(
        selectedAppName.value,
        queryInstanceCondition.value
      );
      getApplicationDetail(selectedAppName.value);
    };

    const getAppServiceEntries = () => {
      appServiceEntries.value.totalCount = allServiceEntries.length;
      appServiceEntries.value.data = allServiceEntries.slice(
        (appServiceEntries.value.pageIndex - 1) *
          appServiceEntries.value.pageSize,
        appServiceEntries.value.pageIndex * appServiceEntries.value.pageSize
      );
      getSpanArr(appServiceEntries.value.data);
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
          if (data[i].appService === data[i - 1].appService) {
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
    const displayHttpMethod = (httpMethod: Number) => {
      return HttpMethod[httpMethod];
    };
    return {
      applications,
      applicationInstances,
      activeName,
      applicationDetail,
      queryInstanceCondition,
      appServiceEntries,
      wsServices,
      selectedAppName,
      objectSpanMethod,
      displayHttpMethod,
      handleSelectApplication,
      getAppServiceEntries
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
</style>
