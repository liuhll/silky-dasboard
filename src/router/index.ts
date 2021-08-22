import { createRouter, createWebHashHistory, Router } from "vue-router";

import homeRouter from "./modules/home";

import remainingRouter from "./modules/remaining"; //静态路由

import { storageSession } from "../utils/storage";
import { i18n } from "/@/plugins/i18n";
import { usePermissionStoreHook } from "/@/store/modules/permission";

import Layout from "/@/layout/index.vue";
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/*/*/*.vue");

const constantRoutes: Array<any> = [
  homeRouter
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
    if (v.redirect) {
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

export const initRouter = (name, next?, to?) => {

  return new Promise(resolve=>{
    usePermissionStoreHook().changeSetting([]);
    resolve(router);
    router.addRoute({
      path: "/:pathMatch(.*)",
      redirect: "/error/404"
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

router.beforeEach((to, _from, next) => {
  const name = storageSession.getItem("info");
  NProgress.start();
  const { t } = i18n.global;
  // @ts-ignore
  to.meta.title ? (document.title = t(to.meta.title)) : ""; // 动态title
  if (name) {
    if (_from?.name) {
      next();
    } else {
      if (usePermissionStoreHook().wholeRoutes.length === 0)
        initRouter(name.username, next, to).then((router: Router) => {
          router.push(to.path);
        });
      next();
    }
  } else {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
