import { $post } from "@/services/axios";

export const getTemporaryUser = () => $post('/users/createTemporaryUser');
export const logins = (params:{[Key:string]:any}) => $post('/login', params);