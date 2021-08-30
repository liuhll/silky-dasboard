import Layout from "/@/layout/index.vue";

const hostRouter = {
  path: "/application",
  name: "application",
  component: Layout,
  redirect: "/application/index",
  meta: {
    icon: "el-icon-set-up",
    title: "message.hsapplicationlist",
    showLink: true,
    savedPosition: true,
    rank: 1
  },
  children: [
    {
      path: "/application/index",
      name: "application",
      component: () => import("/@/views/application/index.vue"),
      meta: {
        title: "message.hsapplicationlist",
        showLink: true,
        savedPosition: true
      }
    }
  ]
};

export default hostRouter;
