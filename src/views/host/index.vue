<template>
  <div>
      微服务应用列表
  </div>
</template>

<script lang="ts">
import { getProfiles } from "/@/api/profile";

import { onMounted } from "vue";

export default {
 name: "host",

 setup(){
     onMounted( async ()=>{
         await getProfiles()
     })
 }

}
</script>

<style>

</style>