import { $post } from "@/services/axios";

export const getTemporaryUser = () => $post('/users/createTemporaryUser');