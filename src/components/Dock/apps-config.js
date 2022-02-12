import apps from "./apps";
let APPSCONFIG = {
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