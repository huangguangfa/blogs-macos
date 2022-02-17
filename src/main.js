import { createApp } from 'vue';
import App from './views/app.vue';
import routes from "./router";
import { createPinia } from "pinia"
// import store from "./store";
import { initGlobalMethods } from "./plugins/index";

const app = createApp(App);
app.use(routes).use(createPinia);
initGlobalMethods(app);
app.mount('#app')
