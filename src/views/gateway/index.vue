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
      <el-descriptions-item label="是否支持websocket代理">
        <el-tag
          :type="gatewayInfo.supportWebSocketProxy ? 'success' : 'danger'"
        >
          {{ gatewayInfo.supportWebSocketProxy ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
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
        <el-tab-pane label="支持的服务" name="second">
          <el-row class="search-place">
            <el-col :span="4">
              <el-select v-model="gatewayServiceEntryCondition.serviceId" placeholder="请选择服务" @change="loadGatewayServiceEntries()">
                <el-option v-for="(item,index) in gatewayServices" :key="index" :label="item.serviceName" :value="item.serviceId"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input
                placeholder="请输入关键字搜索"
                v-model="gatewayServiceEntryCondition.searchKey"
                clearable
                @input="loadGatewayServiceEntries()"
              ></el-input>
            </el-col>
          </el-row>
          <el-table
            :data="gatewayServiceEntries.items"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              label="服务名称"
              prop="serviceName"
              width="250"
            ></el-table-column>
            <el-table-column
              label="服务条目"
              prop="id"
              width="500"
            ></el-table-column>
            <el-table-column label="webapi" prop="webApi"></el-table-column>
            <el-table-column label="http请求方法">
              <template #default="scope">
                <el-tag v-if="scope.row.httpMethod != null" type="success">
                  {{ displayHttpMethod(scope.row.httpMethod) }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="AllowAnonymous" width="100">
              <template #default="scope">
                <el-tag
                  :type="scope.row.isAllowAnonymous ? 'success' : 'danger'"
                >
                  {{ scope.row.isAllowAnonymous ? "是" : "否" }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="gatewayServiceEntries.totalCount"
            :page-size="gatewayServiceEntryCondition.pageSize"
            v-model:currentPage="gatewayServiceEntryCondition.pageIndex"
            :hide-on-single-page="true"
            @current-change="loadGatewayServiceEntries()"
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
import { HttpMethod } from "/@/utils/enums/HttpMethod";
export default {
  setup() {
    let gatewayInfo = ref({});
    let activeName = ref("first");
    let gatewayInstances = ref({});
    let gatewayServices = ref([]);
    let gatewayServiceEntries = ref({});
    let gatewayInstanceCondition = ref({
      pageIndex: 1,
      pageSize: 10
    });

    let gatewayServiceEntryCondition = ref({
      pageIndex: 1,
      pageSize: 10,
      serviceId: null,
      serviceKey: null
    });

    let spanArr = [];

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

    const loadGatewayServices = () => {
      gatewayStore
      .getGatewayServices()
      .then(data => {
        gatewayServices.value = data;
      })
    }
    
    const loadGatewayServiceEntries = () => {
      gatewayStore
        .getGatewayServiceEntries(gatewayServiceEntryCondition.value)
        .then(data => {
          gatewayServiceEntries.value = data;
          getSpanArr(gatewayServiceEntries.value["items"]);
        });
    };
    const displayHttpMethod = (httpMethod: Number) => {
      return HttpMethod[httpMethod];
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
    onMounted(() => {
      loadGatewayInfo();
      loadGatewayInstances();
      loadGatewayServices();
      loadGatewayServiceEntries();
    });
    return {
      gatewayInfo,
      activeName,
      gatewayInstances,
      gatewayInstanceCondition,
      gatewayServiceEntries,
      gatewayServiceEntryCondition,
      gatewayServices,
      displayHttpMethod,
      loadGatewayServiceEntries,
      objectSpanMethod
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
