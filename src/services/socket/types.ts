// export interface socketType{
//     heartBeat:any, 
//     heartMsg:any, 
//     reconnect:any, 
//     reconnectTime:any, 
//     reconnectTimes:any
// }

// export type socketType<Obj extends object> = {
//     [Key in keyof Obj as Key & string]: Obj[Key]
// }

export class SocketType{
    heartBeat:any
    heartMsg:any
    reconnect:any
    reconnectTime:any
    reconnectTimes:any
}