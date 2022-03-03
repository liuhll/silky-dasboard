<template>
  <div>
    <el-row class="search-place">
      <el-col :span="3">
        <el-select
          v-model="searchServiceEntriesCondition.hostName"
          @change="handleChangeHost"
          clearable
          placeholder="请选择微服务应用"
        >
          <el-option
            v-for="(item, index) in hosts"
            :key="index"
            :label="item.hostName"
            :value="item.hostName"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="searchServiceEntriesCondition.serviceId"
          clearable
          placeholder="请选择应用服务"
          @change="loadServiceEntries"
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
          v-model="searchServiceEntriesCondition.isSystem"
          clearable
          placeholder="系统服务"
          @change="loadServiceEntries"
        >
          <el-option label="是" :value="true"> </el-option>
          <el-option label="否" :value="false"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="searchServiceEntriesCondition.isEnable"
          clearable
          placeholder="状态"
          @change="loadServiceEntries"
        >
          <el-option label="正常" :value="true"> </el-option>
          <el-option label="异常" :value="false"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="searchServiceEntriesCondition.isAllowAnonymous"
          clearable
          placeholder="跳过认证"
          @change="loadServiceEntries"
        >
          <el-option label="是" :value="true"> </el-option>
          <el-option label="否" :value="false"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="searchServiceEntriesCondition.prohibitExtranet"
          clearable
          placeholder="禁用外网"
          @change="loadServiceEntries"
        >
          <el-option label="是" :value="true"> </el-option>
          <el-option label="否" :value="false"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="searchServiceEntriesCondition.isDistributeTransaction"
          clearable
          placeholder="分布式事务"
          @change="loadServiceEntries"
        >
          <el-option label="是" :value="true"> </el-option>
          <el-option label="否" :value="false"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input
          placeholder="关键字"
          v-model="searchServiceEntriesCondition.searchKey"
          @input="loadServiceEntries"
          clearable
        ></el-input>
      </el-col>
    </el-row>
    <el-table
      :data="serviceEntries.items"
      class="table-place"
      :span-method="objectSpanMethods"
    >
      <el-table-column
        label="微服务应用"
        prop="hostName"
        width="200"
      ></el-table-column>
      <el-table-column
        label="服务"
        prop="serviceName"
        width="320"
      ></el-table-column>
      <el-table-column label="服务条目" width="460">
        <template #default="scope">
          <el-button type="text" @click="handleSelectServiceEntry(scope.row)">{{
            scope.row.serviceEntryId
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否可用">
        <template #default="scope">
          <el-tag :type="scope.row.isEnable ? 'success' : 'danger'">
            {{ scope.row.isEnable ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="实例数"
        prop="serverInstanceCount"
      ></el-table-column>
      <el-table-column label="方法" prop="method" width="100"></el-table-column>
      <el-table-column label="禁用外网">
        <template #default="scope">
          <el-tag :type="scope.row.prohibitExtranet ? 'danger' : 'success'">
            {{ scope.row.prohibitExtranet ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="WebApi"
        prop="webApi"
        width="200"
      ></el-table-column>
      <el-table-column label="http请求方法">
        <template #default="scope">
          <el-tag v-if="scope.row.httpMethod != null" type="success">
            {{ displayHttpMethod(scope.row.httpMethod) }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="跳过认证" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.isAllowAnonymous ? 'success' : 'danger'">
            {{ scope.row.isAllowAnonymous ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="多个实现" prop="multipleServiceKey">
        <template #default="scope">
          <el-tag :type="scope.row.multipleServiceKey ? 'success' : 'danger'">
            {{ scope.row.multipleServiceKey ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分布式事务" prop="isDistributeTransaction">
        <template #default="scope">
          <el-tag
            :type="scope.row.isDistributeTransaction ? 'success' : 'danger'"
          >
            {{ scope.row.isDistributeTransaction ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开发者" prop="author"></el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="serviceEntries.totalCount"
      :page-size="searchServiceEntriesCondition.pageSize"
      v-model:currentPage="searchServiceEntriesCondition.pageIndex"
      :hide-on-single-page="true"
      @current-change="loadServiceEntries()"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { useHostStoreHook } from "/@/store/modules/host";
import { useServiceStoreHook } from "/@/store/modules/service";
import { useServiceEntryStoreHook } from "/@/store/modules/serviceentry";
import { HttpMethod } from "/@/utils/enums/HttpMethod";
import { useRouter } from "vue-router";
export default {
  name: "Service",
  setup() {
    const hostStore = useHostStoreHook();
    const serviceStore = useServiceStoreHook();
    const serviceEntryStore = useServiceEntryStoreHook();
    const router = useRouter();

    let hosts = ref([]);
    let appServices = ref([]);
    let serviceEntries = ref([]);
    let searchServiceEntriesCondition = ref({
      hostName: null,
      serviceName: null,
      serviceEntryId: null,
      searchKey: null,
      pageIndex: 1,
      pageSize: 10
    });

    let spanHostArr = [];
    let spanServiceArr = [];

    const loadHosts = () => {
      hostStore.getAllHosts().then(data => {
        hosts.value = data;
      });
    };
    const loadAppServices = () => {
      serviceStore
        .getServices({
          hostName: searchServiceEntriesCondition.value.hostName
        })
        .then(data => {
          appServices.value = data;
        });
    };

    const loadServiceEntries = () => {
      serviceEntryStore
        .getServiceEntries(searchServiceEntriesCondition.value)
        .then(data => {
          serviceEntries.value = data;
          flitterData(data["items"]);
        });
    };
    const displayHttpMethod = (httpMethod: Number) => {
      return HttpMethod[httpMethod];
    };
    onMounted(() => {
      loadHosts();
      loadAppServices();
      loadServiceEntries();
    });

    const handleChangeHost = () => {
      loadAppServices();
      searchServiceEntriesCondition.value.appService = null;
      appServices.value = [];
      loadServiceEntries();
    };

    const handleSelectServiceEntry = row => {
      router.push({
        name: "serviceentry",
        query: { serviceEntryId: row.serviceEntryId }
      });
    };

    const flitterData = (data: any[]) => {
      spanHostArr = [];
      spanServiceArr = [];
      let pos1 = 0;
      let pos2 = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          spanHostArr.push(1);
          spanServiceArr.push(1);
          pos1 = 0;
          pos2 = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].hostName === data[i - 1].hostName) {
            spanHostArr[pos1] += 1;
            spanHostArr.push(0);
          } else {
            spanHostArr.push(1);
            pos1 = i;
          }

          if (data[i].serviceName === data[i - 1].serviceName) {
            spanServiceArr[pos2] += 1;
            spanServiceArr.push(0);
          } else {
            spanServiceArr.push(1);
            pos2 = i;
          }
        }
      }
    };

    const objectSpanMethods = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex == 0) {
        const _row = spanHostArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex == 1) {
        const _row = spanServiceArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    };

    return {
      hosts,
      searchServiceEntriesCondition,
      appServices,
      serviceEntries,
      handleChangeHost,
      loadServiceEntries,
      displayHttpMethod,
      objectSpanMethods,
      handleSelectServiceEntry
    };
  }
};
</script>

<style lang="scss"  scoped>
.search-place {
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
}
.table-place {
  margin: 0, 20px;
}
.btn-search {
  margin-left: 30px;
}
</style>
