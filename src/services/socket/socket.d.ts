declare class Socket{
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
    //心跳信息：默认为‘ping’随便改，看后台
    heartMsg: string = 'ping'
    //是否自动重连
    reconnect: boolean = true
    //重连间隔时间
    reconnectTime: number = 5000
    //重连次数
    reconnectTimes: number = 10
}