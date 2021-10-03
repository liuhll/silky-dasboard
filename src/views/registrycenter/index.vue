<template>
  <div> 
   <el-card class="box-card">
    <template #header>
      <span>服务注册中心</span>
    </template>
    <div>
      <el-card class="box-card-item" v-for="(item,index) in registryCenters" :key="index">
         <el-descriptions size="medium" :column="1" border>
           <el-descriptions-item label="类型">
             <el-tag type="success">{{item.registryCenterType}}</el-tag>
           </el-descriptions-item>
           <el-descriptions-item label="服务注册中心地址">{{item.registryCenterAddress}}</el-descriptions-item>
           <el-descriptions-item label="是否健康">
             <el-tag :type="item.isHealth ? 'success' : 'danger'">{{item.isHealth ? "健康": "不健康" }}</el-tag>
            </el-descriptions-item>
           <el-descriptions-item label="不健康次数">{{item.unHealthTimes}}</el-descriptions-item>
           <el-descriptions-item label="不健康原因" v-if="item.unHealthReason">{{item.unHealthReason}}</el-descriptions-item>
         </el-descriptions>
      </el-card>
    </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRegistryCenterStoreHook } from "/@/store/modules/registercenter";
import { RegistryCenterType } from "/@/utils/enums/RegistryCenterType"
export default {
  setup() {
    let registryCenterStore = useRegistryCenterStoreHook();
    let registryCenters = ref([]);

    const loadRegistryCenters = ()=>{
        registryCenterStore.getRegistryCenters().then( data => {
           registryCenters.value = data;
        })
    }

    const displayRegisterCenterType = (type) =>{
        return RegistryCenterType[type];
    }
    
    onMounted(() => {
        loadRegistryCenters();
    });

    return {
        registryCenters,
        displayRegisterCenterType
    }
  }

}
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  margin: 10px;
}
.box-card-item {
  width: 550px;
  float: left;
  margin: 10px;
}
</style>