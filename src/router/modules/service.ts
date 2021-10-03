import Layout from "/@/layout/index.vue";

const serviceRouter = {
  path: "/service",
  name: "service",
  component: Layout,
  redirect: "/service/index",
  meta: {
    icon: "iconfont icon-yingyongfuwu",
    title: "message.hsservice",
    showLink: true,
    savedPosition: true,
    rank: 1
  },
  children: [
    {
      path: "/service/index",
      name: "service",
      component: () => import("/@/views/service/index.vue"),
      meta: {
        title: "message.hsservice",
        showLink: true,
        savedPosition: true
      }
    }
  ]
};

export default serviceRouter;
