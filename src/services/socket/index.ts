import { SocketType } from "./types";

export default class Socket {
    [key: string]: any
    /* websocket实例 */
    ws: { [Key: string]: any } = {}
    //连接状态
    #alive: boolean = false
    //把类的参数传入这里，方便调用
    #params: { [Key: string]: any } = {}
    //重连计时器
    #reconnect_timer: number = 0;
    //心跳计时器
    #heart_timer: number = 0
    // 信息onmessage缓存方法
    #message_func: undefined | Function
    //心跳时间 5秒一次
    heartBeat: number = 5000
    //心跳信息：默认为‘ping’
    heartMsg: string = 'ping'
    //是否自动重连
    reconnect: boolean = true
    //重连间隔时间
    reconnectTime: number = 5000
    //重连次数
    reconnectTimes: number = 10
    constructor(params: { [Key: string]: any }) {
        this.#params = params
        this.init()
    }
    init(): void {
        clearInterval(this.#reconnect_timer)
        clearInterval(this.#heart_timer)
        //取出所有参数
        let params: { [Key: string]: any } = this.#params
        //设置连接路径
        let { url, port } = params;
        let global_params = ['heartBeat', 'heartMsg', 'reconnect', 'reconnectTime', 'reconnectTimes'];
        //定义全局变量
        Object.keys(params).forEach((key: string) => {
            if (global_params.indexOf(key) !== -1) {
                this[key] = params[key]
            }
        })
        let ws_url = port ? url + ':' + port : url
        this.ws = {};
        this.ws = new WebSocket(ws_url);
        if (this.#message_func) {
            this.onmessage(this.#message_func);
        }
        //默认绑定事件
        this.ws.onopen = () => {
            //设置状态为开启
            this.#alive = true;
            clearInterval(this.#reconnect_timer)
            //连接后进入心跳状态
            this.onheartbeat();
        }
        this.ws.onclose = () => {
            //设置状态为断开
            this.#alive = false
            clearInterval(this.#heart_timer)
            //自动重连开启  +  不在重连状态下
            if (true == this.reconnect) {
                /* 断开后立刻重连 */
                this.onreconnect()
            }
        }
    }
    onheartbeat(func?: Function): void {
        //在连接状态下
        if (true == this.#alive) {
            /* 心跳计时器 */
            this.#heart_timer = window.setInterval(() => {
                //发送心跳信息
                this.send(this.heartMsg)
                func ? func(this) : false
            }, this.heartBeat)
        }
    }
    onreconnect(func?: Function): void {
        /* 重连间隔计时器 */
        this.#reconnect_timer = window.setInterval(() => {
            //限制重连次数
            if (this.reconnectTimes <= 0) {
                //关闭定时器
                clearInterval(this.#reconnect_timer)
                return;
            } else {
                //重连一次-1
                this.reconnectTimes--
            }
            //进入初始状态
            this.init()
            func && func(this)
        }, this.reconnectTime)
    }
    send(data: string | { [Key: string]: any }): void {
        if (true == this.#alive) {
            data = typeof data == 'string' ? data : JSON.stringify(data)
            this.ws?.send(data)
        }
    }
    close(): void {
        if (true == this.#alive) {
            this.ws?.close()
            this.#alive = false
            clearInterval(this.#heart_timer)
            this.reconnect = false
        }
    }
    onmessage(func?: Function, all = false): void {
        this.ws.onmessage = (data: { [Key: string]: any }) => {
            this.#message_func = func
            func && func(!all ? data.data : data)
        }
    }
    onopen(func?: Function): void {
        this.ws.onopen = (event?: string) => {
            this.#alive = true;
            this.onheartbeat();
            func && func(event)
        }
    }
    onclose(func?: Function): void {
        this.ws.onclose = (event: string) => {
            //设置状态为断开
            this.#alive = false
            clearInterval(this.#heart_timer)
            //自动重连开启  +  不在重连状态下
            if (true == this.reconnect) {
                /* 断开后立刻重连 */
                this.onreconnect()
            }
            func && func(event)
        }
    }
    onerror(func?: Function): void {
        this.ws.onerror = (event: string) => {
            func && func(event)
        }
    }
}