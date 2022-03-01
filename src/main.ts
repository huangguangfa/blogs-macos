import { createApp } from 'vue';
import piniaStore from "./store";
import App from './views/app.vue';
import routes from "./router/index";
import { initGlobalMethods } from "./plugins/index";


function bootstrap() {
    const app = createApp(App);
    app.use(routes).use(piniaStore).mount('#app');
    initGlobalMethods(app);
}

bootstrap()