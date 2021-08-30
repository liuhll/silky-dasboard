<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>集群概要信息</span>
      </div>
      <div>
        <el-card
          class="grid-content box-card-item"
          v-for="(item, index) in profiles"
          :key="index"
        >
          <div slot="header" class="clearfix">
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
import { getProfiles } from "/@/api/profile";
import { ref } from "vue";

export default {
  name: "Welcome",
  setup() {
    let profiles = ref([]);
    const loadProfiles = async () => {
      getProfiles().then(result => {
        const { data } = result;
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
