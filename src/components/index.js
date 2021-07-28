import window from "./window/index.vue"
export const initGlobalComponent = function (app){
    let compnentsList = [ window ];
    for(let i=0,len=compnentsList.length; i<len; i++){
        let com = compnentsList[i];
        app.component(com.name,com)
    }
}