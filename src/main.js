import { createApp } from 'vue';
import App from './app.vue';
import routes from "./router"
import store from "./store"

const app = createApp(App)

app.use(routes);
app.use(store);

app.mount('#app')
