type Events = { [Key:string]: Function }

export function addEvents(events: Array<Events>) {
    events?.forEach( (cb, eventName) => {
        document.documentElement.addEventListener(eventName, cb);
    })
}

export function removeEvents(events) {
    events && events.forEach((cb, eventName) => {
        document.documentElement.removeEventListener(eventName, cb);
    });
}

export function getByIdDom(id:string){
    return document.getElementById(id)
}

/* 绑定事件 */
export const on = (function() {
    if (document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();

/* 解除事件绑定 */
export const off = (function() {
    if (document.removeEventListener) {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler);
            }
        };
    }
})();

/* 事件执行1次就被解除 */
export const once = function(el, event, fn) {
    var listener = function() {
        if (fn) {
            fn.apply(this, arguments);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
};
