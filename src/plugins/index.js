import { CssTheme } from '@/utils/cssTheme.js'
export function initGlobalMethods( app ){
    app.config.globalProperties.$theme = new CssTheme()
}