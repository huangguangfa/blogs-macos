import vmwindow from "./globalComponents/window/index.vue";
import vmloading from "./globalComponents/loading/index.vue";
import vmiframe from "./globalComponents/iframe/index.vue";
import vmempty from "./globalComponents/empty/index.vue";
import { Message  } from "./globalComponents/windowTips/Tips";
export const initGlobalComponent = function (app){
    let compnentsList = [ 
        { name:"window", compnent:vmwindow }, 
        { name:"vmLoading", compnent:vmloading }, 
        { name:"vmIframe", compnent:vmiframe }, 
        { name:"vmEmpty", compnent:vmempty }, 
    ];
    for( let i=0,len=compnentsList.length; i<len; i++ ){
        let { name, compnent } = compnentsList[i];
        app.component(name,compnent)
    }
    app.config.globalProperties.$message = Message
}