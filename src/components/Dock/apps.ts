import Safari from "@/components/apps/safari/index.vue";
import Vscode from "@/components/apps/vscode/index.vue";
import Facetime from "@/components/apps/facetime/index.vue";
import Termial from "@/components/apps/terminal/index.vue";
import Maps from "@/components/apps/maps/index.vue";
import Music from "@/components/apps/music/index.vue";
import Blogs from "@/components/apps/blogs/index.vue";
import Home from "@/components/apps/home/index.vue";
import NewYear from "@/components/apps/new-year/index.vue";
import fcwUi from "@/components/apps/fcw-ui/index.vue";
import Yueque from "@/components/apps/yuque/index.vue";
import GfUI from "@/components/apps/gf-ui/index.vue";
import excalidraw from "@/components/apps/excalidraw/index.vue";
import launchpad from "@/components/apps/launchpad/index.vue";
import openAiChat from "@/components/apps/open-ai-chat/index.vue";
import type { ComponentCustomOptions } from "vue";

type appsType = {
  [Key: string]: {
    component: ComponentCustomOptions;
    index: number;
  };
};
const apps: appsType = {
  Launchpad: {
    component: launchpad,
    index: 1,
  },
  AppFacetime: {
    component: Facetime,
    index: 2,
  },
  AppMpas: {
    component: Maps,
    index: 3,
  },
  AppSafari: {
    component: Safari,
    index: 4,
  },
  AppTermial: {
    component: Termial,
    index: 5,
  },
  AppVscode: {
    component: Vscode,
    index: 6,
  },
  AppMusic: {
    component: Music,
    index: 7,
  },
  AppBlogs: {
    component: Blogs,
    index: 8,
  },
  AppHome: {
    component: Home,
    index: 9,
  },
  AppFcwUi: {
    component: fcwUi,
    index: 10,
  },
  AppNewYear: {
    component: NewYear,
    index: 11,
  },
  Yueque: {
    component: Yueque,
    index: 12,
  },
  "@gf-ui": {
    component: GfUI,
    index: 13,
  },
  AppExcalidraw: {
    component: excalidraw,
    index: 14,
  },
  openAiChat: {
    component: openAiChat,
    index: 15,
  },
};

export default apps;
