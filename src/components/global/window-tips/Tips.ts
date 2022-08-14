import messageComponent from "./Tips.vue";
import { createComponent } from "@/utils/component";
import { isVNode } from "vue";

const instanceList = [];

export function Message(opts) {
  return createMessage(mergeOptions(opts));
}

["info", "success", "warning", "error"].forEach((type) => {
  Message[type] = (opts) => {
    return createMessage(mergeOptions(opts, type));
  };
});

function createMessage(opts) {
  const instance = createMessageComponentByOpts(opts);
  appendToBody(instance);
  addInstance(instance);
  return instance.proxy;
}

function createMessageComponentByOpts(opts) {
  if (isVNode(opts.message)) {
    return createComponent(messageComponent, opts, () => opts.message);
  }
  return createComponent(messageComponent, opts);
}

function mergeOptions(opts, type = "info") {
  const defaultOptions = {
    duration: 2000,
    type,
  };
  return Object.assign({}, defaultOptions, opts);
}

function addInstance(instance) {
  instanceList.push(instance);
}

function removeInstance(instance) {
  instanceList.splice(getIndexByInstance(instance), 1);
}

function getIndexByInstance(instance) {
  return instanceList.findIndex((i) => i.uid == instance.uid);
}

function appendToBody(componentInstance) {
  document.body.append(componentInstance.vnode.el);
}
