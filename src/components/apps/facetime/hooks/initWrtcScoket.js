import scoket from "@/services/scoket/index.js";
import { wrtcScoketHost } from "@/config/service.config.js";
export function initScoket(uid,uname){
    const url = `${wrtcScoketHost}?uid=${uid}&uname=${uname}`
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