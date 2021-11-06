import { $post } from "@/services/axios";
import axios from "axios";

export const getTtermId = () => $post('/users/createTemporaryUser');
export const getTtermIdLoca = () => axios.post('http://localhost:4000/xterm/id');