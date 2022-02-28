import { $post } from "@/services/axios";
export const getTtermId = () => $post('/users/createTemporaryUser');