// import store from '@/store/index';
import { SET_GLOABL_SOCKET_DATA } from "@/config/store.config.js";
import socket from "@/services/socket/index.js";
import { socketHost } from "@/config/service.config.js";
import { getTemporaryUser } from "@/services/api/user-api.js";
export async function initScoket(){
    const { result } = await getTemporaryUser();
    sessionStorage.setItem('userId',`/ws/${result.userId}`)
    // 初始化临时用户
    let sockets = new socket({
        //网址
        url:`${socketHost}/${result.userId}`,
        //心跳时间（单位:ms）
        'heartBeat':5000,
        //开起重连
        'reconnect':true,
        //重连间隔时间（单位:ms）
        'reconnectTime':5000,
        //重连次数
        'reconnectTimes':10
    })
    handleGlobalSocketEvent(sockets);
    return sockets;
}

function handleGlobalSocketEvent( socket ){
    socket.onopen( function(){
        console.log('%cscoket_success', 'color: green;');
    })
    socket.onmessage( function( data ){
        // store.commit(SET_GLOABL_SOCKET_DATA, JSON.parse(data))
    })
    socket.onerror(function (error) {
        console.log('%cscoket_error', 'color: red;'); 
    });
    socket.onclose(function (data) {
        console.log('%cscoket_异常关闭', 'color: red;'); 
    })
}