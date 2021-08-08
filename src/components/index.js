import vmwindow from "./window/index.vue";
import vmloading from "./loading/index.vue";
import vmiframe from "./iframe/index.vue"
export const initGlobalComponent = function (app){
    let compnentsList = [ vmwindow, vmloading, vmiframe ];
    for(let i=0,len=compnentsList.length; i<len; i++){
        let com = compnentsList[i];
        app.component(com.name,com)
    }
}