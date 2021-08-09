import { $get } from "./axios/index"
//获取视频电话活跃用户
export const getActiveUserList = () => $get('/scoket/getActiveUserList');