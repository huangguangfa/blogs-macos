import { createRouter, createWebHistory } from "vue-router";
import routers from './routers.js';

const router = createRouter({
    history: createWebHistory(),
    routes:routers, 
})
export default router