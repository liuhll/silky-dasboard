<template>
  <div class="serviceentry-contanier">
    <el-button type="text" icon="el-icon-back" @click="goBack()"
      >返回</el-button
    >
    <el-descriptions
      title="概要信息"
      class="serviceentry-descriptions"
      :column="3"
    >
      <el-descriptions-item label="微服务主机:">{{
        serviceEntry.hostName
      }}</el-descriptions-item>
      <el-descriptions-item label="应用服务:">{{
        serviceEntry.serviceName
      }}</el-descriptions-item>
      <el-descriptions-item label="服务条目:">{{
        serviceEntry.serviceEntryId
      }}</el-descriptions-item>
      <el-descriptions-item label="服务协议:">{{
        displayServiceProtocol(serviceEntry.serviceProtocol)
      }}</el-descriptions-item>
      <el-descriptions-item label="状态:">
        <el-tag :type="serviceEntry.isEnable ? 'success' : 'danger'">
          {{ serviceEntry.isEnable ? "正常" : "异常" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="负载均衡策略:">
        <el-tag type="success">{{
          displayShuntStrategy(governanceOptions.shuntStrategy)
        }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="实例数:">{{
        serviceEntry.serverInstanceCount
      }}</el-descriptions-item>
      <el-descriptions-item label="方法:">{{
        serviceEntry.method
      }}</el-descriptions-item>
      <el-descriptions-item label="禁用外网:">
        <el-tag :type="serviceEntry.prohibitExtranet ? 'danger' : 'success'">
          {{ serviceEntry.prohibitExtranet ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="!serviceEntry.prohibitExtranet"
        label="webApi地址:"
        >{{ serviceEntry.webApi }}</el-descriptions-item
      >
      <el-descriptions-item
        v-if="!serviceEntry.prohibitExtranet"
        label="请求方法:"
      >
        <el-tag type="success" v-if="serviceEntry.httpMethod != null">
          {{ displayHttpMethod(serviceEntry.httpMethod) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="多个实现:">
        <el-tag :type="serviceEntry.multipleServiceKey ? 'success' : 'danger'">
          {{ serviceEntry.multipleServiceKey ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="分布式事务:">
        <el-tag
          :type="serviceEntry.isDistributeTransaction ? 'success' : 'danger'"
        >
          {{ serviceEntry.isDistributeTransaction ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="跳过认证:">
        <el-tag :type="serviceEntry.isAllowAnonymous ? 'success' : 'danger'">
          {{ serviceEntry.isAllowAnonymous ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>

      <el-descriptions-item
        v-if="serviceEntry.supportCachingIntercept"
        label="缓存拦截:"
      >
        <sapn
          v-for="(cacheTemplate, index) in serviceEntry.cacheTemplates"
          :key="index"
        >
          <el-tag type="success">
            缓存模板: {{ cacheTemplate.keyTemplete }}
          </el-tag>
          <el-tag type="success" style="margin-left: 10px">
            缓存方法: {{ displayCachingMethod(cacheTemplate.cachingMethod) }}
          </el-tag>
        </sapn>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="serviceEntry.multipleServiceKey"
        label="serviceKeys"
      >
        <sapn
          v-for="(serviceKey, index) in serviceEntry.serviceKeys"
          :key="index"
        >
          <el-tag type="success" style="margin-left: 10px">
            名称: {{ serviceKey.name }} 权重: {{ serviceKey.weight }}
          </el-tag>
        </sapn>
      </el-descriptions-item>
      <el-descriptions-item label="开发者:" v-if="serviceEntry.author">{{
        serviceEntry.author
      }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      title="容错配置"
      class="serviceentry-descriptions"
      :column="3"
      v-if="governanceOptions != null"
    >
      <el-descriptions-item label="执行超时:"
        >{{ governanceOptions.timeoutMillSeconds }}ms</el-descriptions-item
      >
      <el-descriptions-item label="失败重试次数:"
        >{{ governanceOptions.retryTimes }}次</el-descriptions-item
      >
      <el-descriptions-item label="重试间隔:"
        >{{
          governanceOptions.retryIntervalMillSeconds
        }}ms</el-descriptions-item
      >
      <el-descriptions-item label="允许的最大并发处理量:">{{
        governanceOptions.maxConcurrentHandlingCount
      }}</el-descriptions-item>
      <el-descriptions-item label="熔断保护:">
        <el-tag
          :type="governanceOptions.enableCircuitBreaker ? 'success' : 'danger'"
          >{{
            governanceOptions.enableCircuitBreaker ? "支持" : "不支持"
          }}</el-tag
        >
      </el-descriptions-item>
      <el-descriptions-item label="熔断前允许的异常次数:">{{
        governanceOptions.exceptionsAllowedBeforeBreaking
      }}</el-descriptions-item>
      <el-descriptions-item label="熔断休眠时长:"
        >{{ governanceOptions.breakerSeconds }}s</el-descriptions-item
      >
      <el-descriptions-item label="移除实例前允许不健康次数:"
        >{{
          governanceOptions.unHealthAddressTimesAllowedBeforeRemoving
        }}次</el-descriptions-item
      >
      <el-descriptions-item label="不健康实例休眠时长:"
        >{{
          governanceOptions.addressFuseSleepDurationSeconds
        }}s</el-descriptions-item
      >
      <el-descriptions-item label="是否支持回退:">{{
        serviceEntry.fallback != null ? "支持" : "不支持"
      }}</el-descriptions-item>
      <el-descriptions-item
        v-if="serviceEntry.fallback != null"
        label="回退接口:"
      >
        <el-tag type="success" style="margin-left: 10px">
          {{ serviceEntry.fallback.typeName }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="serviceEntry.fallback != null"
        label="回退方法:"
      >
        <el-tag type="success" style="margin-left: 10px">
          {{ serviceEntry.fallback.methodName }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <el-card>
      <template #header> 应用实例(服务提供者) </template>
      <div>
        <el-table :data="serviceEntryInstances.items">
          <el-table-column
            label="服务条目"
            prop="serviceEntryId"
            width="440"
          ></el-table-column>
          <el-table-column label="实例地址">
            <template #default="scope">
              <el-button type="text" @click="handleSelectedInstance(scope.row)">
                {{ scope.row.address }}</el-button
              >
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
              <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
                {{ scope.row.enabled ? "是" : "否" }}
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
import { ref, onMounted } from "vue";
import { useServiceEntryStoreHook } from "/@/store/modules/serviceentry";
import { useRoute, useRouter } from "vue-router";
import { storageLocal } from "/@/utils/storage";
import { HttpMethod } from "/@/utils/enums/HttpMethod";
import { CachingMethod } from "/@/utils/enums/CachingMethod";
import { ShuntStrategy } from "/@/utils/enums/ShuntStrategy";
import { ServiceProtocol } from "/@/utils/enums/ServiceProtocol";
export default {
  setup() {
    let serviceEntry = ref({});
    let governanceOptions = ref({});
    let serviceEntryInstancesConditions = ref({
      pageIndex: 1,
      pageSize: 10
    });
    let serviceEntryInstances = ref({});

    const route = useRoute();
    const router = useRouter();
    const serviceEntryStore = useServiceEntryStoreHook();

    const loadServiceEntryDetail = () => {
      const serviceEntryId = storageLocal.getItem("serviceEntryId");
      if (serviceEntryId) {
        serviceEntryStore.getServiceEntryDetail(serviceEntryId).then(data => {
          serviceEntry.value = data;
          governanceOptions.value = data["governance"];
        });
      }
    };

    const loadServiceEntryInstances = () => {
      const serviceEntryId = storageLocal.getItem("serviceEntryId");
      if (serviceEntryId) {
        serviceEntryStore
          .getServiceEntryInstances(
            serviceEntryId,
            serviceEntryInstancesConditions.value
          )
          .then(data => {
            serviceEntryInstances.value = data;
          });
      }
    };

    const displayHttpMethod = value => {
      return HttpMethod[value];
    };
    const displayServiceProtocol = (serviceProtocol: Number) => {
      return ServiceProtocol[serviceProtocol];
    };

    const displayCachingMethod = (cachingMethod: Number) => {
      return CachingMethod[cachingMethod];
    };

    const displayShuntStrategy = value => {
      return ShuntStrategy[value];
    };

    const goBack = () => {
      router.go(-1);
    };

    onMounted(() => {
      const serviceEntryId = route.query["serviceEntryId"];
      if (serviceEntryId) {
        storageLocal.setItem("serviceEntryId", serviceEntryId.toString());
      }
      loadServiceEntryDetail();
      loadServiceEntryInstances();
    });

    const handleSelectedInstance = row => {
      router.push({
        name: "instance",
        query: { address: row.address, serviceEntryId: row.serviceEntryId },
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
      displayServiceProtocol,
      displayCachingMethod,
      loadServiceEntryInstances,
      goBack,
      handleSelectedInstance
    };
  }
};
</script>

<style lang="scss" scoped>
.serviceentry-contanier {
  margin: 10px;
}
.serviceentry-descriptions {
  margin-top: 10px;
}
</style>
