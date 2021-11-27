import apps from "./apps";
let APPSCONFIG = {
    appsInject:{},
    appsComponent:{}
}
for( let key in apps ){
    const { component, index } = apps[key];
    APPSCONFIG.appsInject[key] = component;
    APPSCONFIG.appsComponent[key] = {
        appsDataIndex:index,
        appsName:key
    }
}
export default APPSCONFIG;