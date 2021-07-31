export function addEvents(events) {
    events.forEach((cb, eventName) => {
        document.documentElement.addEventListener(eventName, cb);
    });
}
export function removeEvents(events) {
    events.forEach((cb, eventName) => {
        document.documentElement.removeEventListener(eventName, cb);
    });
}

export function getByIdDom(id){
    return document.getElementById(id)
}