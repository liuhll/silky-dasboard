import Layout from "/@/layout/index.vue";

const registryCenterRouter = {
  path: "/registrycenter",
  name: "registrycenter",
  component: Layout,
  redirect: "/registrycenter/index",
  meta: {
    icon: "iconfont icon-fuwuzhuce",
    title: "message.hsregistrycenter",
    showLink: true,
    savedPosition: true,
    rank: 1
  },
  children: [
    {
      path: "/registrycenter/index",
      name: "registrycenter",
      component: () => import("/@/views/registrycenter/index.vue"),
      meta: {
        title: "message.hsregistrycenter",
        showLink: true,
        savedPosition: true
      }
    }
  ]
};

export default registryCenterRouter;
