import Safari from "@/components/apps/safari/index.vue";
import Vscode from "@/components/apps/vscode/index.vue";
import Facetime from "@/components/apps/facetime/index.vue";
import Termial from "@/components/apps/Terminal/index.vue";
import Maps from "@/components/apps/maps/index.vue";
import Music from "@/components/apps/music/index.vue";
import Blogs from "@/components/apps/blogs/index.vue";
import Home from "@/components/apps/home/index.vue";
import NewYear from "@/components/apps/newYear/index.vue";
import fcwUi from "@/components/apps/fcwUi/index.vue";
const apps = {
    'AppFacetime':{
        component:Facetime,
        index:2
    },
    'AppMpas':{
        component:Maps,
        index:3
    },
    'AppSafari':{
        component:Safari,
        index:4
    },
    'AppTermial':{
        component:Termial,
        index:5
    },
    'AppVscode':{
        component:Vscode,
        index:6
    },
    'AppMusic':{
        component:Music,
        index:7
    },
    'AppBlogs':{
        component:Blogs,
        index:8
    },
    'AppHome':{
        component:Home,
        index:9
    },
    'AppFcwUi':{
        component:fcwUi,
        index:10
    },
    'AppNewYear':{
        component:NewYear,
        index:11
    }
};

export default apps;