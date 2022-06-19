import clickoutside from "./clickoutside"
import type { App } from "vue"
export function initGlobalDirectives(app: App) {
    let directivesList: { [Key: string]: any } = {
        clickoutside, //v-clickoutside
    };
    Object.keys(directivesList).map((key: string) => {
        app.directive(key, directivesList[key]);
    })
}