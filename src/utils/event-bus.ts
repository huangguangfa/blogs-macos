export default class EventBus {
  listeners: {
    [Key: string]: Function[];
  };
  constructor() {
    this.listeners = {};
  }
  $on(key: string, fn: Function): void {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(fn);
  }

  $emit(key: string, data: unknown): void {
    if (this.listeners[key]) {
      this.listeners[key]?.forEach((fn: Function) => fn(data));
    }
  }

  $off(key: string, fns: Function) {
    if (this.listeners[key]) {
      this.listeners[key] = this.listeners[key]?.filter((fn) => fn !== fns);
    }
  }
}
