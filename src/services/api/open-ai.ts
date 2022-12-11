import { $get } from "@/services/axios/index";

export const getOpenAiRes = (content: string) =>
  $get("/openaiChat?content=" + content);
