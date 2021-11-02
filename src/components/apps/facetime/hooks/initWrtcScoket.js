import scoket from "@/services/socket/index.js";
import { socketHost } from "@/config/service.config.js";
export function initScoket({uId, uName, uAvatar, isStartCamera}){
    const url = `${socketHost}/scoket/webrtc/user?uId=${uId}&uName=${uName}&uAvatar=${uAvatar}&isStartCamera=${isStartCamera}`
    // const url = `${scoketHost}`
    return new scoket({
        //网址
        url,
        //心跳时间（单位:ms）
        'heartBeat':5000,
        //开起重连
        'reconnect':true,
        //重连间隔时间（单位:ms）
        'reconnectTime':5000,
        //重连次数
        'reconnectTimes':10
    })
}