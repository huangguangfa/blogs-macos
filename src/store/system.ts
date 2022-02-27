import { defineStore } from 'pinia';

import { 
    TABABR_NAVIGATION, 
    TABABR_MINIMIZE 
} from "@/config/dock.config.js";

import {
    SET_WINDOW_ID,
    SET_FULL_SCREENBAR,
    SET_START_GLOBAL_SEARCH,
    SET_TABABR_NAVIGATION,
    SET_SYSTEM_CONFIG,
    SET_TABABR_MINIMIZE,
    SET_GLOABL_SOCKET_DATA,
} from "@/config/store.config.js";

export const useSystemStore = defineStore({
    id:"system-store",
    state: () => {
        return {
            // WINDOWID:null,   //当前窗口ID
            windowId:null,
            // FULLSCREENBAR:false, //是否全屏以及显示bar和最顶部topbar
            fullscreenbar:false,
            // STARTGLOBALSEARCH:false , //开启全局搜索
            startGlobalSearch:false,
            // TABABR_NAVIGATION:TABABR_NAVIGATION,
            tabbarNavigation:TABABR_NAVIGATION,
            // TABABR_MINIMIZE,  // 当前系统最小化窗口列表、存放的是窗口ID
            tabbarMinimize:TABABR_MINIMIZE,
            // SYSTEM_CONFIG:{  //系统配置
            //     isFullscreen:false, //是否全屏
            //     isShowControlcenter:false, //显示控制
            // },
            systemConfig:{
                isFullscreen:false, //是否全屏
                isShowControlcenter:false, //显示控制
            },
            // GLOABL_SOCKET_DATA:{}, // 全局socket消息
            globalSocketData:{}
        }
    },
    getters:{
        WINDOWID:state => state.windowId,
        FULLSCREENBAR :state => state.fullscreenbar,
        STARTGLOBALSEARCH :state => state.startGlobalSearch,
        TABABR_MINIMIZE :state => state.tabbarMinimize,
        TABABR_NAVIGATION :state => state.tabbarNavigation,
        SYSTEM_CONFIG :state => state.systemConfig,
        GLOABL_SOCKET_DATA :state => state.globalSocketData
    },
    actions:{
        [SET_WINDOW_ID](id) {
            this.windowId = id;
        },
        [SET_FULL_SCREENBAR](status){
            this.fullscreenbar = status;
        },
        [SET_START_GLOBAL_SEARCH](status){
            this.startGlobalSearch = status;
        },
        [SET_TABABR_MINIMIZE](list){
            this.TABABR_MINIMIZE = list;
        },
        [SET_TABABR_NAVIGATION]({ _index, dockData }){
            for(let key in dockData){
                let value = dockData[key]
                this.tabbarNavigation[_index][key] = value;
            }
        },
        [SET_SYSTEM_CONFIG]( data){
            this.systemConfig = data;
        },
        [SET_GLOABL_SOCKET_DATA](data){
            this.globalSocketData = data;
        }
    }
});
