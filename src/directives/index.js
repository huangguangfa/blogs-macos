import clickoutside from "./clickoutside.js"

export function initGlobalDirectives(app){
    let directivesList = {
        clickoutside, //v-clickoutside
    };
    Object.keys(directivesList).map( key => {
        console.log(key)
        app.directive( key, directivesList[ key ] );
    })
}