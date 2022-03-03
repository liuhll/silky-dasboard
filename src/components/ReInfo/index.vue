<template>
  <div class="info">
    <el-form :model="model" :rules="rules" ref="ruleForm" class="rule-form">

     <el-form-item prop="tenantName" v-if="useTenant">
        <el-input
          clearable
          v-model="model.tenantName"
          placeholder="请输入租户标识"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input
          clearable
          v-model="model.userName"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input
          clearable
          type="password"
          show-password
          v-model="model.passWord"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.prevent="onBehavior">{{
          tipsFalse
        }}</el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  PropType,
  onBeforeMount,
  getCurrentInstance,
  watch,
  nextTick,
  toRef
} from "vue";
import { storageSession } from "/@/utils/storage";

export interface ContextProps {
  tenantName?: string | null;
  userName: string;
  passWord: string;
  verify: number | null;
  svg: any;
  telephone?: number;
  dynamicText?: string;
}

import { useRouter, useRoute } from "vue-router";

import { initRouter } from "/@/router";
import { convertToBoolean } from "/@/utils/convert";

export default defineComponent({
  name: "Info",
  props: {
    ruleForm: {
      type: Object as PropType<ContextProps>,
      require: true
    }
  },
  emits: ["onBehavior", "refreshVerify"],
  setup(props, ctx) {
    let vm: any;

    const model = toRef(props, "ruleForm");
    let tips = ref("注册");
    let tipsFalse = ref("登录");

    const route = useRoute();
    const router = useRouter();

    const useTenant = ref(convertToBoolean(window.useTenant));

    watch(
      route,
      async ({ path }): Promise<void> => {
        await nextTick();
        path.includes("register")
          ? (tips.value = "登录") && (tipsFalse.value = "注册")
          : (tips.value = "注册") && (tipsFalse.value = "登录");
      },
      { immediate: true }
    );

    const rules: Object = ref({
      userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      passWord: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, message: "密码长度必须不小于6位", trigger: "blur" }
      ],
      verify: [
        { required: true, message: "请输入验证码", trigger: "blur" },
        { type: "number", message: "验证码必须是数字类型", trigger: "blur" }
      ]
    });

    // 点击登录或注册
    const onBehavior = (evt: Object): void => {
      vm.refs.ruleForm.validate((valid: boolean) => {
        if (valid) {
          ctx.emit("onBehavior", evt);
        } else {
          return false;
        }
      });
    };

    // 刷新验证码
    const refreshVerify = (): void => {
      ctx.emit("refreshVerify");
    };

    // 表单重置
    const resetForm = (): void => {
      vm.refs.ruleForm.resetFields();
    };

    // 登录、注册页面切换
    const changPage = (): void => {
      tips.value === "注册" ? router.push("/register") : router.push("/login");
    };

    const noSecret = (): void => {
      storageSession.setItem("info", {
        username: "admin",
        accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
      });
      initRouter().then(() => {});
      router.push("/");
    };

    onBeforeMount(() => {
      vm = getCurrentInstance(); //获取组件实例
    });

    return {
      model,
      rules,
      tips,
      tipsFalse,
      useTenant,
      resetForm,
      onBehavior,
      refreshVerify,
      changPage,
      noSecret
    };
  }
});
</script>

<style lang="scss" scoped>
.info {
  width: 30vw;
  height: 48vh;
  background: url("../../assets/login.png") no-repeat center;
  background-size: cover;
  position: absolute;
  border-radius: 20px;
  right: 100px;
  top: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 750px) {
    width: 88vw;
    right: 25px;
    top: 22vh;
  }
  .rule-form {
    width: 80%;
    .verify {
      position: absolute;
      margin: -10px 0 0 -120px;
      &:hover {
        cursor: pointer;
      }
    }
    .tips {
      color: #409eff;
      float: right;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .secret {
    color: #409eff;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
