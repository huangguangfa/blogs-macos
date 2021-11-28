export default class ContinuousEvent{
    constructor(){
        this.flagNameList = {};
    }
    checkDouble( flagName, fn, time = 200 ){
        if( this.flagNameList[flagName] ){
            fn();
            this.clearFlagTimer(flagName);
            this.deleteFlag(flagName);
        }else{
            this.flagNameList[flagName] = setTimeout( () =>{
                this.deleteFlag(flagName)
            }, time)
        }
    }
    deleteFlag(flagName){
        this.flagNameList[flagName] && delete this.flagNameList[flagName];
    }
    clearFlagTimer(flagName){
        this.flagNameList[flagName] && clearTimeout(this.flagNameList[flagName]);
    }
}