import Layout from "/@/layout/index.vue";

const hostRouter = {
  path: "/host",
  name: "host",
  component: Layout,
  redirect: "/host/index",
  meta: {
    icon: "iconfont icon-xingzhuang",
    title: "message.hshost",
    showLink: true,
    savedPosition: true,
    rank: 1
  },
  children: [
    {
      path: "/host/index",
      name: "host",
      component: () => import("/@/views/host/index.vue"),
      meta: {
        title: "message.hshost",
        showLink: true,
        savedPosition: true
      }
    } 
  ]
};

export default hostRouter;
