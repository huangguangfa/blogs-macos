import { $post } from "@/services/axios";

export const getTtermId = () => $post('/xterm/id');