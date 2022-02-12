import Safari from "@/components/apps/safari/index.vue";
import Vscode from "@/components/apps/vscode/index.vue";
import Facetime from "@/components/apps/facetime/index.vue";
import Termial from "@/components/apps/Terminal/index.vue";
import Maps from "@/components/apps/maps/index.vue";
import Music from "@/components/apps/music/index.vue";
import Blogs from "@/components/apps/blogs/index.vue";
import Home from "@/components/apps/home/index.vue";
import NewYear from "@/components/apps/newYear/index.vue";
const apps = {
    'AppFacetime':{
        component:Facetime,
        index:3
    },
    'AppMpas':{
        component:Maps,
        index:4
    },
    'AppSafari':{
        component:Safari,
        index:6
    },
    'AppTermial':{
        component:Termial,
        index:7
    },
    'AppVscode':{
        component:Vscode,
        index:8
    },
    'AppMusic':{
        component:Music,
        index:10
    },
    'AppBlogs':{
        component:Blogs,
        index:11
    },
    'AppHome':{
        component:Home,
        index:12
    },
    'AppNewYear':{
        component:NewYear,
        index:13
    }
};

export default apps;