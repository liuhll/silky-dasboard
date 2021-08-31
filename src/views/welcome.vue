<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <span>集群概要信息</span>
      </template>
      <div>
        <el-card
          class="grid-content box-card-item"
          v-for="(item, index) in profiles"
          :key="index"
        >
          <div>
            <span>{{ item.title }}</span>
          </div>
          <div>
            <span> 数量 </span>
            <span> {{ item.count }}</span>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { useProfileStoreHook } from "/@/store/modules/profile";
import { ref } from "vue";

export default {
  name: "Welcome",
  setup() {
    const profileStore = useProfileStoreHook();
    let profiles = ref([]);
    const loadProfiles = async () => {
      profileStore.getProfiles().then(data => {
        profiles.value = data;
      });
    };
    loadProfiles();
    return {
      profiles
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
}
</style>
