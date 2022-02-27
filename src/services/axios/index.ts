import { serviceHost } from '@/config/service.config.js';
import axios from "axios";
const service = axios.create({
    baseURL: serviceHost,
    timeout: 6e4,
    validateStatus: x => x === 200
})

const done = function (h) {
    return this.then(h).catch(({ code, msg }) => {
        console.error('请求错误啦 =>', code, msg)
    })
}

const onsend = req => {
    if (typeof req.data === 'string') {
        req.headers[o.method]['Content-Type'] = 'application/json';
    }
    return req;
}

const onsuccess = res => {
    if (res.status !== 200) {  throw res.status }
    if( res.headers['content-disposition'] ){
        return {
            data:res.data,
            fileName:res.headers['content-disposition'] || ''
        }
    }
    return res.data;
}

const onerror = e => {
    const info = e.toString();
    const err = {
        Code: -1,
        Message: '请求失败'
    }
    if (info.includes('Network Error')){
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

export const $get = (url, params) => service.get(url, { params })
export const $put =  (url, o) => service.put(url, o)
export const $post = (url, o) => service.post(url, o)
export const $patch = (url, o) => service.patch(url, o)
export const $form = (url, o) => service.post(url, o)
export const $auth = (url, o) => service.post(url, o, { responseType: 'blob' })
export const $uploadPost = (url,o,fn) => service.post(url, o,{ headers: {'Content-Type': 'multipart/form-data',},onUploadProgress:fn })
