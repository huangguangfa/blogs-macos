
export function addEvents(events: Map<string,() => {}>) {
    events?.forEach( (cb, eventName):void => {
        document.documentElement.addEventListener(eventName, cb);
    })
}

export function removeEvents(events: Map<string,() => {}>) {
    events && events.forEach((cb, eventName) => {
        document.documentElement.removeEventListener(eventName, cb);
    });
}

export function getByIdDom(id:string){
    return document.getElementById(id)
}

/* 绑定事件 */
export const on = (function() {
    let eventTarget = document.addEventListener
    return function(element:Document, event:string, handler:any) {
        if (element && event && handler) {
            eventTarget(event, handler, false);
        }
    };
})();

/* 解除事件绑定 */
export const off = (function() {
    return function(element:Document, event:string, handler:any) {
        if (element && event) {
            element.removeEventListener(event, handler, false);
        }
    };
})();

/* 事件执行1次就被解除 */
export const once = function(el:Document, event:string, fn:Function) {
    let listener = function() {
        if (fn) {
            fn.apply(this, arguments);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
};
