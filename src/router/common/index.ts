export default [
  {
    path: "/:pathMatch(.*)",
    component: () => import("@/components/global/404/index.vue"),
  },
];
