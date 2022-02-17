import { defineStore } from 'pinia';
import { TABABR_NAVIGATION, TABABR_MINIMIZE } from "@/config/dock.config.js";

export const useSystemStore = defineStore({
    id:"system-store",
    state: () => {
        return {
            WINDOWID:null,   //当前窗口ID
            FULLSCREENBAR:false, //是否全屏以及显示bar和最顶部topbar
            STARTGLOBALSEARCH:false , //开启全局搜索
            TABABR_NAVIGATION:TABABR_NAVIGATION,
            TABABR_MINIMIZE,  // 当前系统最小化窗口列表、存放的是窗口ID
            SYSTEM_CONFIG:{  //系统配置
                isFullscreen:false, //是否全屏
                isShowControlcenter:false, //显示控制
            },
            GLOABL_SOCKET_DATA:{} // 全局socket消息
        }
    },
    getters:{
        aa:state => state.TABABR_NAVIGATION
        // WINDOWID:state => state.WINDOWID,
        // FULLSCREENBAR :state => state.FULLSCREENBAR,
        // STARTGLOBALSEARCH :state => state.STARTGLOBALSEARCH,
        // TABABR_MINIMIZE :state => state.TABABR_MINIMIZE,
        // TABABR_NAVIGATION :state => state.TABABR_NAVIGATION,
        // SYSTEM_CONFIG :state => state.SYSTEM_CONFIG,
        // GLOABL_SOCKET_DATA :state => state.GLOABL_SOCKET_DATA
    }
});
