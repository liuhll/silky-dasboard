<template>
  <div>
    <el-row class="search-place">
      <el-col :span="4">
        <el-select v-model="selectedApp" clearable placeholder="请选择应用">
          <el-option
            v-for="(item, index) in applications"
            :key="index"
            :label="item.hostName"
            :value="item.hostName"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="selectedService" placeholder="请选择服务">
          <el-option
            v-for="(item, index) in appServices"
            :key="index"
            :label="item.appService"
            :value="item.appService"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入服务或是服务条目名称"></el-input>
      </el-col>
    </el-row>
    <el-table :data="[]" class="table-place">
      <el-table-column label=""></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useApplicationStoreHook } from "/@/store/modules/applications";
export default {
  name: "Service",
  setup() {
    const applicationStore = useApplicationStoreHook();
    let applications = ref([]);
    let selectedApp = ref(null);
    let appServices = ref([]);
    let selectedService = ref(null);
    const loadApplications = () => {
      applicationStore.getApplications().then(data => {
        applications.value = data;
        debugger;
      });
    };
    onMounted(() => {
      loadApplications();
    });
    return {
      applications,
      selectedApp,
      appServices,
      selectedService
    };
  }
};
</script>

<style  lang="scss"  scoped>
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
</style>
