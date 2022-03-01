import { serviceHost } from '@/config/service.config';
import axios from "axios";
const service = axios.create({
    baseURL: serviceHost,
    timeout: 6e4,
    validateStatus: x => x === 200
})

const done = function (h:Promise<any>) {
    return this.then(h).catch(({ code, msg }:{code:number, msg:string}) => {
        console.error('请求错误啦 =>', code, msg)
    })
}

const onsend = (req:{[Key:string]:any}) => {
    return req;
}

type onsuccessType = {
    status: number,
    headers:{[Key:string]:any},
    data:any
}
const onsuccess = (res:onsuccessType) => {
    if (res.status !== 200) { throw res.status }
    if (res.headers['content-disposition']) {
        return {
            data: res.data,
            fileName: res.headers['content-disposition'] || ''
        }
    }
    return res.data;
}

const onerror = (e:{[Key:string]:any}) => {
    const info = e.toString();
    const err = {
        Code: -1,
        Message: '请求失败'
    }
    if (info.includes('Network Error')) {
        err.Message = '网络错误'
    }
    else if (info.includes('timeout of')) {
        err.Message = '请求超时'
    }
    throw err
}

Promise.prototype.done = done;
window.Promise.prototype.done = done;
service.interceptors.request.use(onsend);
service.interceptors.response.use(onsuccess, onerror);

export const $get = (url: string, params?: { [key: string]: any }) => service.get(url, { params })
export const $put = (url: string, o?: { [key: string]: any }) => service.put(url, o)
export const $post = (url: string, o?: { [key: string]: any }) => service.post(url, o)
export const $patch = (url: string, o?: { [key: string]: any }) => service.patch(url, o)
export const $form = (url: string, o?: { [key: string]: any }) => service.post(url, o)
export const $auth = (url: string, o?: { [key: string]: any }) => service.post(url, o, { responseType: 'blob' })
export const $uploadPost = (url: string, o?: { [key: string]: any }, fn?:()=> void) => service.post(url, o, { headers: { 'Content-Type': 'multipart/form-data', }, onUploadProgress: fn })
