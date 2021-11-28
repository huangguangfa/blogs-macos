import Safari from "@/components/apps/safari/index.vue";
import Vscode from "@/components/apps/vscode/index.vue";
import Facetime from "@/components/apps/facetime/index.vue";
import Termial from "@/components/apps/Terminal/index.vue";
import Maps from "@/components/apps/maps/index.vue";
import Music from "@/components/apps/music/index.vue";
import Blogs from "@/components/apps/blogs/index.vue"
const apps = {
    'app-facetime':{
        component:Facetime,
        index:3
    },
    'app-mpas':{
        component:Maps,
        index:4
    },
    'app-safari':{
        component:Safari,
        index:6
    },
    'app-termial':{
        component:Termial,
        index:7
    },
    'app-vscode':{
        component:Vscode,
        index:8
    },
    'app-music':{
        component:Music,
        index:10
    },
    'app-blogs':{
        component:Blogs,
        index:11
    }
};

export default apps;