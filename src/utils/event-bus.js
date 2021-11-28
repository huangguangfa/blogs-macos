export default class EventBus{
    constructor(){
        this.listeners = {};
    }

    $on(key,fn){
        if( !this.listeners[key] ) this.listeners[key] = [];
        this.listeners[key].push(fn);
    }
    
    $emit(key,data){
        if( this.listeners[key] ){
            this.listeners[key].forEach( fn => fn(data) );
        }
    }

    $off(key, fns){
        if( this.listeners[key] ){
            this.listeners[key] = this.listeners[key].filter( fn => fn !== fns);
        }
    }
}