import { CssTheme } from "@/utils/cssTheme";
import { initGlobalComponent } from "@/components/index";
import { initGlobalDirectives } from "@/directives/index";
import { initScoket } from "@/services/api/sockets";
import EventBus from "@/utils/event-bus";
import ContinuousEvent from "@/utils/continuousEvent";
import { disableDevTool, gflogs } from "./mixin";

import type { App } from "vue";

export function initGlobalMethods(app: App) {
  // 初始化换肤方法
  app.config.globalProperties.$theme = new CssTheme();
  // eventBus
  app.config.globalProperties.$eventBus = new EventBus();
  // 校验一个方法是否连续执行
  app.config.globalProperties.$continuousEvent = new ContinuousEvent();
  // 初始化全局scoket
  initScoket().then((res) => {
    app.config.globalProperties.$scoket = res;
  });
  // 初始化全局组件
  initGlobalComponent(app);
  // 初始化全局指令
  initGlobalDirectives(app);
  // 禁用开发工具
  if (import.meta.env.PROD) {
    disableDevTool();
    gflogs();
  }
}
