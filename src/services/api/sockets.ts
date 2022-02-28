import { SET_GLOABL_SOCKET_DATA } from "@/config/store.config";
import socket from "@/services/socket/index";
import { socketHost } from "@/config/service.config";
import { getTemporaryUser } from "@/services/api/user-api";
import { useSystemStore } from "@/store/index";
let systemStore: { [Key: string]: any }
export async function initScoket() {
    const { result }: { [key: string]: any } = await getTemporaryUser();
    sessionStorage.setItem('userId', `/ws/${result.userId}`)
    // 初始化临时用户
    let sockets = new socket({
        //网址
        url: `${socketHost}/${result.userId}`,
        //心跳时间（单位:ms）
        'heartBeat': 5000,
        //开起重连
        'reconnect': true,
        //重连间隔时间（单位:ms）
        'reconnectTime': 5000,
        //重连次数
        'reconnectTimes': 10
    })
    handleGlobalSocketEvent(sockets);
    return sockets;
}

function handleGlobalSocketEvent(socket: { [Key: string]: any }) {
    socket.onopen(function () {
        console.log('%cscoket_success', 'color: green;');
    })
    socket.onmessage(function (data: string) {
        if (!systemStore) {
            systemStore = useSystemStore();
        }
        systemStore[SET_GLOABL_SOCKET_DATA](JSON.parse(data))
    })
    socket.onerror(function () {
        console.log('%cscoket_error', 'color: red;');
    });
    socket.onclose(function () {
        console.log('%cscoket_异常关闭', 'color: red;');
    })
}