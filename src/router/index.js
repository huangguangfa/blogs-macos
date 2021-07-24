import { createRouter,createWebHashHistory } from "vue-router";
import routers from './routers.js';

const router = createRouter({
    history: createWebHashHistory(),
    routes:routers, 
})

export default router