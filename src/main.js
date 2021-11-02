import { createApp } from 'vue';
import App from './views/app.vue';
import routes from "./router";
import store from "./store";
import { initGlobalMethods } from "./plugins/index";

const app = createApp(App);
app.use(routes).use(store);
initGlobalMethods(app);
app.mount('#app')
