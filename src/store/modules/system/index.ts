import { defineStore } from 'pinia';

import {
    TABABR_NAVIGATION,
    TABABR_MINIMIZE
} from "@/config/dock.config";

import {
    SYSTEM_CONFIG_TYPE,
    TABABR_MINIMIZE_TYPE
} from "./types"

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
            windowId: '',
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
        [SET_WINDOW_ID](id: string): void {
            this.windowId = id;
        },
        [SET_FULL_SCREENBAR](status: boolean): void {
            this.fullscreenbar = status;
        },
        [SET_START_GLOBAL_SEARCH](status: boolean): void {
            this.startGlobalSearch = status;
        },
        [SET_TABABR_MINIMIZE](list: []): void {
            this.tabbarMinimize = list;
        },
        [SET_TABABR_NAVIGATION]({ _index, dockData }:TABABR_MINIMIZE_TYPE): void {
            for (let key in dockData) {
                let value = dockData[key];
                let appInfo:{ [key:string]:any } = this.tabbarNavigation[_index];
                appInfo[key] = value;
            }
        },
        [SET_SYSTEM_CONFIG](data: SYSTEM_CONFIG_TYPE): void {
            this.systemConfig = data;
        },
        [SET_GLOABL_SOCKET_DATA](data: { [key: string]: any }): void {
            this.globalSocketData = data;
        }
    }
});
