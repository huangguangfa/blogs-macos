import { createRouter, createWebHistory } from "vue-router";
import { routerModuleList } from "./router-module";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("@/views/index/index.vue") },
    { path: "/demo", component: () => import("@/views/demo/index.vue") },
    ...routerModuleList(),
  ],
});
export default router;
