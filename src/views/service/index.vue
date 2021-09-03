<template>
  <div>
    <el-row class="search-place">
      <el-col :span="4">
        <el-select
          v-model="searchServiceEntriesCondition.application"
          @change="handleChangeApplication"
          clearable
          placeholder="请选择应用"
        >
          <el-option
            v-for="(item, index) in applications"
            :key="index"
            :label="item.hostName"
            :value="item.hostName"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="searchServiceEntriesCondition.appService"
          clearable
          placeholder="请选择服务"
        >
          <el-option
            v-for="(item, index) in appServices"
            :key="index"
            :label="item.appService"
            :value="item.appService"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input
          placeholder="请输入服务或是服务条目名称"
          v-model="searchServiceEntriesCondition.name"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" class="btn-search" @click="loadServiceEntries"
          >搜索</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="serviceEntries.items"
      class="table-place"
      :span-method="objectSpanMethods"
    >
      <el-table-column
        label="应用"
        prop="application"
        width="200"
      ></el-table-column>
      <el-table-column
        label="服务"
        prop="appService"
        width="320"
      ></el-table-column>
      <el-table-column
        label="服务条目"
        prop="serviceId"
        width="460"
      ></el-table-column>
      <el-table-column label="是否可用">
        <template #default="scope">
          <el-tag :type="scope.row.isEnable ? 'success' : 'danger'">
            {{ scope.row.isEnable ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="实例数"
        prop="serviceRouteCount"
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
      <el-table-column label="多个服务实现" prop="multipleServiceKey">
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
import { ref, onMounted } from "vue";
import { useApplicationStoreHook } from "/@/store/modules/applications";
import { useServiceStoreHook } from "/@/store/modules/service";
import { HttpMethod } from "/@/utils/enums/HttpMethod";
export default {
  name: "Service",
  setup() {
    const applicationStore = useApplicationStoreHook();
    const serviceStore = useServiceStoreHook();

    let applications = ref([]);
    let appServices = ref([]);
    let serviceEntries = ref([]);
    let searchServiceEntriesCondition = ref({
      application: null,
      appService: null,
      name: null,
      pageIndex: 1,
      pageSize: 10
    });

    let spanApplicationArr = [];
    let spanServiceArr = [];

    const loadApplications = () => {
      applicationStore.getApplications().then(data => {
        applications.value = data;
      });
    };
    const loadAppServices = () => {
      serviceStore
        .getServices({
          appName: searchServiceEntriesCondition.value.application
        })
        .then(data => {
          appServices.value = data;
        });
    };

    const loadServiceEntries = () => {
      serviceStore
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
      loadApplications();
      loadAppServices();
      loadServiceEntries();
    });

    const handleChangeApplication = () => {
      loadAppServices();
      searchServiceEntriesCondition.value.appService = null;
      appServices.value = [];
    };

    const flitterData = (data: any[]) => {
      spanApplicationArr = [];
      spanServiceArr = [];
      let pos1 = 0;
      let pos2 = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          spanApplicationArr.push(1);
          spanServiceArr.push(1);
          pos1 = 0;
          pos2 = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].application === data[i - 1].application) {
            spanApplicationArr[pos1] += 1;
            spanApplicationArr.push(0);
          } else {
            spanApplicationArr.push(1);
            pos1 = i;
          }

          if (data[i].appService === data[i - 1].appService) {
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
        const _row = spanApplicationArr[rowIndex];
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
      applications,
      searchServiceEntriesCondition,
      appServices,
      serviceEntries,
      handleChangeApplication,
      loadServiceEntries,
      displayHttpMethod,
      objectSpanMethods
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
