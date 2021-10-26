import { createApp } from 'vue';
import App from './views/app.vue';
import routes from "./router";
import store from "./store";
import { initGlobalMethods } from "./plugins/index";

const app = createApp(App);
initGlobalMethods(app);
app.config.globalProperties.aaa = '11111'
app.use(routes).use(store);
app.mount('#app')
