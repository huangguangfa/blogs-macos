import safari from "@/components/apps/safari/index.vue";
import vscode from "@/components/apps/vscode/index.vue";
import facetime from "@/components/apps/facetime/index.vue";
import termial from "@/components/apps/Terminal/index.vue";
import maps from "@/components/apps/maps/index.vue";
import music from "@/components/apps/music/index.vue";
import blogs from "@/components/apps/blogs/index.vue"
const apps = {
    'app-facetime':{
        component:facetime,
        index:3
    },
    'app-mpas':{
        component:maps,
        index:4
    },
    'app-safari':{
        component:safari,
        index:6
    },
    'app-termial':{
        component:termial,
        index:7
    },
    'app-vscode':{
        component:vscode,
        index:8
    },
    'app-music':{
        component:music,
        index:10
    },
    'app-blogs':{
        component:blogs,
        index:11
    }
};

export default apps;