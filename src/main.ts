import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from './views/app.vue';
import routes from "./router";
import { initGlobalMethods } from "./plugins/index";



function bootstrap() {
    const app = createApp(App);
    app.use(routes).use(createPinia());
    initGlobalMethods(app);
    app.mount('#app');
}

bootstrap()