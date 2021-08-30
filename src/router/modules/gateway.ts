import Layout from "/@/layout/index.vue";

const hostRouter = {
  path: "/gateway",
  name: "gateway",
  component: Layout,
  redirect: "/gateway/index",
  meta: {
    icon: "el-icon-set-up",
    title: "message.hsgatewaylist",
    showLink: true,
    savedPosition: true,
    rank: 1
  },
  children: [
    {
      path: "/gateway/index",
      name: "gateway",
      component: () => import("/@/views/gateway/index.vue"),
      meta: {
        title: "message.hsgateway",
        showLink: true,
        savedPosition: true
      }
    }
  ]
};

export default hostRouter;
