import apps from "./apps";
import type { ComponentCustomOptions } from "vue"
type appsConfigType = {
    appsComponent:{
        [Key:string]:{
            appsDataIndex:number,
            appsName:string,
            appComponent:ComponentCustomOptions
        }
    }
}
let APPSCONFIG:appsConfigType = {
    appsComponent:{}
}
for( let key in apps ){
    const { component, index } = apps[key];
    APPSCONFIG.appsComponent[key] = {
        appsDataIndex:index,
        appsName:key,
        appComponent:component
    }
}
export default APPSCONFIG;