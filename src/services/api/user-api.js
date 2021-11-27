import { $post } from "@/services/axios";

export const getTemporaryUser = () => $post('/users/createTemporaryUser');
export const logins = params => $post('/login', params);