export const initGlobalComponent = function (app){
    let compnentsList = [  ];
    for(let i=0,len=compnentsList.length; i<len; i++){
        let com = compnentsList[i];
        app.component(com.name,com)
    }
}