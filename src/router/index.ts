import { createRouter, createWebHashHistory, Router } from "vue-router";

import homeRouter from "./modules/home";
import applicationRouter from "./modules/host";
import gatewayRouter from "./modules/gateway";
import serviceRouter from "./modules/service";
import registryCenterRouter from "./modules/registrycenter";

import remainingRouter from "./modules/remaining"; //静态路由

import { storageSession } from "../utils/storage";
import { i18n } from "/@/plugins/i18n";
import { usePermissionStoreHook } from "/@/store/modules/permission";

import { getExternalRoutes } from "/@/api/routes";

import Layout from "/@/layout/index.vue";

import { convertToBoolean } from '/@/utils/convert'

let useAuth = convertToBoolean(window.useAuth);
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/*/*/*.vue");

const constantRoutes: Array<any> = [
  homeRouter,
  applicationRouter,
  serviceRouter,
  gatewayRouter,
  registryCenterRouter
];

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = arr => {
  return arr.sort((a: any, b: any) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
};

// 将所有静态路由导出
export const constantRoutesArr = ascending(constantRoutes).concat(
  ...remainingRouter
);

// 过滤后端传来的动态路由重新生成规范路由
export const addAsyncRoutes = (arrRoutes: Array<string>) => {
  if (!arrRoutes || !arrRoutes.length) return;
  arrRoutes.forEach((v: any) => {
    if (v.redirect || v.meta.isLayout) {
      v.component = Layout;
    } else {
      v.component = modulesRoutes[`/src/views${v.path}/index.vue`];
    }
    if (v.children) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: ascending(constantRoutes).concat(...remainingRouter),
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

export const initRouter = (next?, to?) => {
  return new Promise(resolve => {
    getExternalRoutes().then(({ data }) => {
      if (!data || data.length === 0) {
        usePermissionStoreHook().changeSetting([]);
      } else {
        addAsyncRoutes(data).map((v: any) => {
          if (
            router.options.routes.findIndex(value => value.path === v.path) !==
            -1
          ) {
            return;
          } else {
            router.options.routes.push(v);
            // 最终路由进行升序
            ascending(router.options.routes);
            router.addRoute(v.name, v);
            if (next && to) next({ ...to, replace: true });
            usePermissionStoreHook().changeSetting(data);
          }
          resolve(router);
        });
      }
      router.addRoute({
        path: "/:pathMatch(.*)",
        redirect: "/error/404"
      });

    });

  });
};

// reset router
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

import NProgress from "../utils/progress";

// const whiteList = ["/login", "/register"];

const routeBefore = (to, _from, next) => {
  if (_from?.name) {
    next();
  } else {
    if (usePermissionStoreHook().wholeRoutes.length === 0) {
      initRouter(next, to).then((router: Router) => {
        router.push(to.path);
      });
      next();
    } else {
      next();
    }
  }
};

router.beforeEach((to, _from, next) => {

  NProgress.start();
  const { t } = i18n.global;
  // // @ts-ignore
  to.meta.title ? (document.title = t(to.meta.title)) : ""; // 动态title
  if (useAuth) {
    const loginInfo = storageSession.getItem("info");
    if (loginInfo) {
      routeBefore(to, _from, next);
    } else {
      if (to.path !== '/login') {
        next({ path: '/login' })
      } else {
        next();
      }
    }

  } else {
    routeBefore(to, _from, next);
  }
});


router.afterEach(() => {
  NProgress.done();
});

export default router;
