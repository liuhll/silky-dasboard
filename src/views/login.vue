<template>
  <div class="login">
    <info
      :ruleForm="contextInfo"
      @on-behavior="onLogin"
      @refreshVerify="refreshVerify"
    />
  </div>
</template>

<script lang="ts">
import { reactive, onBeforeMount } from "vue";
import info, { ContextProps } from "../components/ReInfo/index.vue";
import { getVerify, getLogin } from "/@/api/user";
import { useRouter } from "vue-router";
import { storageSession } from "/@/utils/storage";
import { warnMessage, successMessage, errorMessage } from "/@/utils/message";
import { initRouter } from "/@/router";

export default {
  name: "login",
  components: {
    info
  },
  setup() {
    const router = useRouter();
    const contextInfo: ContextProps = reactive({
      userName: "",
      passWord: "",
      verify: null,
      svg: null
    });

    const toPage = (info: Object): void => {
      storageSession.setItem("info", info);
      initRouter().then(() => {});
      router.push("/");
    };

    // 登录
    const onLogin = async () => {
      let { tenantName, userName, passWord } = contextInfo;

      try {
        let { status, result, errorMessage } = await getLogin({
          tenantName: tenantName,
          userName: userName,
          password: passWord
        });
        status === 200
          ? successMessage("登陆成功") &&
            toPage({
              username: userName,
              accessToken: result
            })
          : warnMessage(errorMessage);
      } catch (error) {
        errorMessage(error.message);
      }
    };

    onBeforeMount(() => {});

    return {
      contextInfo,
      onLogin,
      router,
      toPage
    };
  }
};
</script>
