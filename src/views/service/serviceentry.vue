<template>
  <div class="serviceentry-contanier">
    <el-button type="text" icon="el-icon-back" @click="goBack()">返回</el-button>
    <el-descriptions title="概要信息" class="serviceentry-descriptions" :column="3">
      <el-descriptions-item label="所属应用:">{{serviceEntry.application}}</el-descriptions-item>
      <el-descriptions-item label="服务:">{{serviceEntry.appService}}</el-descriptions-item>
      <el-descriptions-item label="服务条目:">{{serviceEntry.serviceId}}</el-descriptions-item>
      <el-descriptions-item label="状态:">
        <el-tag
          :type="serviceEntry.isEnable ? 'success' : 'danger'">
          {{ serviceEntry.isEnable ? "有效" : "无效" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="实例数:">{{serviceEntry.serviceRouteCount}}</el-descriptions-item>
      <el-descriptions-item label="方法:">{{serviceEntry.method}}</el-descriptions-item>
      <el-descriptions-item label="webApi地址:">{{serviceEntry.webApi}}</el-descriptions-item>
      <el-descriptions-item label="请求方法:">
        <el-tag type="success" v-if="serviceEntry.httpMethod != null">
          {{displayHttpMethod(serviceEntry.httpMethod)}}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="多个服务实现:">
        <el-tag
          :type="serviceEntry.multipleServiceKey ? 'success' : 'danger'">
          {{ serviceEntry.multipleServiceKey ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>      
      <el-descriptions-item label="分布式事务:">
        <el-tag
          :type="serviceEntry.isDistributeTransaction ? 'success' : 'danger'">
          {{ serviceEntry.isDistributeTransaction ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>     
       <el-descriptions-item label="开发者:" v-if="serviceEntry.author">{{serviceEntry.author}}</el-descriptions-item>       
    </el-descriptions>
    <el-descriptions title="服务治理配置" class="serviceentry-descriptions" :column="3">
      <el-descriptions-item label="负载均衡策略:">
        <el-tag type="success">{{displayShuntStrategy(governanceOptions.shuntStrategy)}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="rpc调用执行超时时间:">{{ governanceOptions.executionTimeout == -1 ? "不超时": `${governanceOptions.executionTimeout}ms` }}</el-descriptions-item>
      <el-descriptions-item label="缓存拦截:">
        <el-tag
          :type="governanceOptions.cacheEnabled ? 'success' : 'danger'">
          {{ governanceOptions.cacheEnabled ? "支持" : "不支持" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="最大并发量:">{{governanceOptions.maxConcurrent}}</el-descriptions-item>
      <el-descriptions-item label="禁用外网:">
        <el-tag
          :type="serviceEntry.prohibitExtranet ? 'danger' : 'success'">
          {{ serviceEntry.prohibitExtranet ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="失败重试次数:">{{governanceOptions.failoverCount}}次</el-descriptions-item>
      <el-descriptions-item label="熔断保护:">
        <el-tag :type="governanceOptions.fuseProtection ? 'success' : 'danger'">{{governanceOptions.fuseProtection ? "支持": "不支持"}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="熔断休眠时长:">{{governanceOptions.fuseSleepDuration}}s</el-descriptions-item>
      <el-descriptions-item label="熔断n次后不健康实例下线:">{{governanceOptions.fuseTimes}}次</el-descriptions-item>
      <el-descriptions-item label="跳过认证:">
        <el-tag
          :type="governanceOptions.isAllowAnonymous ? 'success' : 'danger'">
          {{ governanceOptions.isAllowAnonymous ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <el-card>
      <template #header>
        应用实例(服务提供者)
      </template>
      <div>
        <el-table :data="serviceEntryInstances.items">
          <el-table-column label="服务条目" prop="serviceId" width="420"></el-table-column>
          <el-table-column label="实例地址">
            <template #default="scope">
              <el-button
                type="text"
                @click="handleSelectedInstance(scope.row)">
                {{ scope.row.address }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="是否健康">
            <template #default="scope">
             <el-tag :type="scope.row.isHealth ? 'success' : 'danger'">
             {{ scope.row.isHealth ? "是" : "否" }}
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
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :total="serviceEntryInstances.totalCount"
            :page-size="serviceEntryInstancesConditions.pageSize"
            v-model:current-page="serviceEntryInstancesConditions.pageIndex"
            :hide-on-single-page="true"
            @current-change="loadServiceEntryInstances"
            >
         </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useServiceStoreHook } from "/@/store/modules/service";
import { useRoute, useRouter } from "vue-router";
import { storageLocal } from "/@/utils/storage"
import { HttpMethod } from '/@/utils/enums/HttpMethod';
import { ShuntStrategy } from "/@/utils/enums/ShuntStrategy"

export default {
  setup(){
    let serviceEntry = ref({});
    let governanceOptions = ref({});
    let serviceEntryInstancesConditions = ref({
      pageIndex: 1,
      pageSize: 10
    });
    let  serviceEntryInstances = ref({});

    const route = useRoute();
    const router = useRouter();
    const serviceStore = useServiceStoreHook();

    const loadServiceEntryDetail = () => {
      const serviceEntryId = storageLocal.getItem("serviceEntryId");
      if(serviceEntryId) {
        serviceStore.getServiceEntryDetail(serviceEntryId).then(data => {
          serviceEntry.value = data;
          governanceOptions.value = data["governanceOptions"];
        });
      }

    };

    const loadServiceEntryInstances = () =>{
      const serviceEntryId = storageLocal.getItem("serviceEntryId");
      if(serviceEntryId) {
        serviceStore.getServiceEntryRoutes(serviceEntryId,serviceEntryInstancesConditions.value).then(data => {
          serviceEntryInstances.value = data;
        })
      }
    }


    const displayHttpMethod = (value) => {
      return HttpMethod[value];
      
    }

    const displayShuntStrategy = (value) => {
     return ShuntStrategy[value];
    };

    const goBack = () => {
      router.go(-1);
    }

    onMounted(()=>{
      const serviceEntryId = route.query["serviceEntryId"];
      if(serviceEntryId) {
        storageLocal.setItem("serviceEntryId", serviceEntryId.toString())
      }
      loadServiceEntryDetail();
      loadServiceEntryInstances();
    });

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
    return {
      serviceEntry,
      governanceOptions,
      serviceEntryInstancesConditions,
      serviceEntryInstances,
      displayHttpMethod,
      displayShuntStrategy,
      loadServiceEntryInstances,
      goBack,
      handleSelectedInstance
    }
  }
}
</script>

<style lang="scss" scoped>
.serviceentry-contanier {
  margin: 10px;
}
.serviceentry-descriptions {
  margin-top: 10px;
}

</style>