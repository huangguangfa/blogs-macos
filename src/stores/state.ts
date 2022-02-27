import { TABABR_NAVIGATION, TABABR_MINIMIZE } from "@/config/dock.config.js";
const state = {
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
export default state;