import { defineStore } from 'pinia';

import {
    TABABR_NAVIGATION,
    TABABR_MINIMIZE
} from "@/config/dock.config";

import {
    SET_WINDOW_ID,
    SET_FULL_SCREENBAR,
    SET_START_GLOBAL_SEARCH,
    SET_TABABR_NAVIGATION,
    SET_SYSTEM_CONFIG,
    SET_TABABR_MINIMIZE,
    SET_GLOABL_SOCKET_DATA,
} from "@/config/store.config";

export const useSystemStore = defineStore({
    id: "system-store",
    state: () => {
        return {
            windowId: null,
            fullscreenbar: false, //是否全屏以及显示bar和最顶部topbar
            startGlobalSearch: false,  //开启全局搜索
            tabbarNavigation: TABABR_NAVIGATION,
            tabbarMinimize: TABABR_MINIMIZE, // 当前系统最小化窗口列表、存放的是窗口ID
            systemConfig: {
                isFullscreen: false, //是否全屏
                isShowControlcenter: false, //显示控制
            },
            globalSocketData: {} // 全局socket消息
        }
    },
    getters: {
        WINDOWID: state => state.windowId,
        FULLSCREENBAR: state => state.fullscreenbar,
        STARTGLOBALSEARCH: state => state.startGlobalSearch,
        TABABR_MINIMIZE: state => state.tabbarMinimize,
        TABABR_NAVIGATION: state => state.tabbarNavigation,
        SYSTEM_CONFIG: state => state.systemConfig,
        GLOABL_SOCKET_DATA: state => state.globalSocketData
    },
    actions: {
        [SET_WINDOW_ID](id: string) {
            this.windowId = id;
        },
        [SET_FULL_SCREENBAR](status) {
            this.fullscreenbar = status;
        },
        [SET_START_GLOBAL_SEARCH](status) {
            this.startGlobalSearch = status;
        },
        [SET_TABABR_MINIMIZE](list) {
            this.TABABR_MINIMIZE = list;
        },
        [SET_TABABR_NAVIGATION]({ _index, dockData }) {
            for (let key in dockData) {
                let value = dockData[key]
                this.tabbarNavigation[_index][key] = value;
            }
        },
        [SET_SYSTEM_CONFIG](data:{ [Key:string]:any }) {
            this.systemConfig = data;
        },
        [SET_GLOABL_SOCKET_DATA](data) {
            this.globalSocketData = data;
        }
    }
});
