import vmwindow from "./global/window/index.vue";
import vmloading from "./global/loading/index.vue";
import vmiframe from "./global/iframe/index.vue";
import vmempty from "./global/empty/index.vue";
import vmClock from "./global/clock/index.vue";
import { Message } from "./global/window-tips/Tips";
import type { App, Component } from "vue";
type CompnentsList = Array<{
  name: string;
  compnent: Component;
}>;
export const initGlobalComponent = function (app: App) {
  let compnentsList: CompnentsList = [
    { name: "window", compnent: vmwindow },
    { name: "vmLoading", compnent: vmloading },
    { name: "vmIframe", compnent: vmiframe },
    { name: "vmEmpty", compnent: vmempty },
    { name: "vmClock", compnent: vmClock },
  ];
  for (let i = 0, len = compnentsList.length; i < len; i++) {
    let { name, compnent } = compnentsList[i];
    app.component(name, compnent);
  }
  app.config.globalProperties.$message = Message;
};
