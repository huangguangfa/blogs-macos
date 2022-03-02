import apps from "./apps";

type appsConfigType = {
    [Key:string]:any
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