import vmwindow from "./globalComponents/window/index.vue";
import vmloading from "./globalComponents/loading/index.vue";
import vmiframe from "./globalComponents/iframe/index.vue";
import vmempty from "./globalComponents/empty/index.vue";
import { Message  } from "./globalComponents/windowTips/Tips";
export const initGlobalComponent = function (app){
    let compnentsList = [ vmwindow, vmloading, vmiframe, vmempty ];
    for( let i=0,len=compnentsList.length; i<len; i++ ){
        let com = compnentsList[i];
        app.component(com.name,com)
    }
    app.config.globalProperties.$message = Message
}