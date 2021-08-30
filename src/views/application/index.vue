<template>
  <div>
     <el-card class="box-card">
       <template #header>
        <span>微服务列表</span>
       </template>
       <div>
         <el-card shadow="always" class="grid-content box-card-item" v-for="(item,index) in applications" :key="index">
           <template #header>
            {{item.hostName}}
           </template>
           <div class="body">
             <ul>
              <li> <span>主机实例: {{item.instanceCount}}</span></li>
              <li> <span>应用服务: {{item.appServiceCount}}</span></li>
              <li> <span>服务条目: {{item.serviceEntriesCount}}</span></li>
              <li> <span>WebSocket服务: {{item.hasWsService ? "支持" : "不支持"}}</span></li>
             </ul>
           </div>
         </el-card>
       </div>
     </el-card>
     <el-card class="box-card">

      <div>
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="微服务实例" name="first">微服务实例</el-tab-pane>
        <el-tab-pane label="服务详情" name="second">服务详情</el-tab-pane>
       </el-tabs>
      </div>
     </el-card>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { getApplications } from "/@/api/application";
export default {
 name: "Application",
 setup(){
   let applications = ref([]);
   let activeName = ref('first');
   
   const loadApplications = () => {
     getApplications().then(result => {
       applications.value = result["data"]
     })
   }
   const handleClick = (tab, event)=>{

   }
   
   loadApplications();
   return {
     applications,
     activeName
   }
 }
}
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