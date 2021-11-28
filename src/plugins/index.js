import { CssTheme } from '@/utils/cssTheme.js';
import { initGlobalComponent } from "@/components/index";
import { initGlobalDirectives } from "@/directives/index";
import { initScoket } from "@/services/api/sockets.js";
import EventBus from "@/utils/event-bus";
export function initGlobalMethods( app ){
    // 初始化换肤方法
    app.config.globalProperties.$theme = new CssTheme();
    // eventBus
    app.config.globalProperties.$eventBus = new EventBus();
    // 初始化全局scoket
    initScoket().then( res =>{
        app.config.globalProperties.$scoket = res;
    });
    // 初始化全局组件
    initGlobalComponent(app);
    // 初始化全局指令
    initGlobalDirectives(app);
}