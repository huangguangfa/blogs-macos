import { CssTheme } from '@/utils/cssTheme.js';
import { initGlobalComponent } from "@/components/index";
import { initGlobalDirectives } from "@/directives/index";
import { initScoket } from "@/services/api/sockets.js"
export async function initGlobalMethods( app ){
    // 初始化换肤方法
    app.config.globalProperties.$theme = new CssTheme();
    // 初始化全局scoket
    app.config.globalProperties.$scoket = await initScoket();
    // 初始化全局组件
    initGlobalComponent(app);
    // 初始化全局指令
    initGlobalDirectives(app);
}