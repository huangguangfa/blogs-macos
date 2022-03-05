import clickoutside from "./clickoutside"

export function initGlobalDirectives(app:any){
    let directivesList:{[Key:string]:any} = {
        clickoutside, //v-clickoutside
    };
    Object.keys(directivesList).map( (key:string) => {
        app.directive( key, directivesList[ key ] );
    })
}