import { CssTheme } from '@/utils/cssTheme.js';
import { initGlobalComponent } from "@/components/index";
export function initGlobalMethods( app ){
    app.config.globalProperties.$theme = new CssTheme()
    initGlobalComponent(app);
}