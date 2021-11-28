export default class EventBus{
    constructor(){
        this.listeners = {};
    }

    $on(name,fn){
        if( !this.listeners[name] ) this.listeners[key] = [];
        this.listeners[name].push(fn);
    }
    
    $emit(name,data){
        if( this.listeners[name] ){
            this.listeners[name].forEach( fn => fn(data));
        }
    }

    $off(name, fns){
        if( this.listeners[name] ){
            this.listeners[name] = this.listeners[name].filter( fn => fn !== fns);
        }
    }
}