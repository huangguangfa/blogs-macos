import { h, render } from "vue";
import type { VNode, DefineComponent, VNodeProps } from "vue";
const MOUNT_COMPONENT_REF = "component";
const COMPONENT_CONTAINER_SYMBOL = Symbol("component_container");

type _Vnode = VNode & {
  [key: string | symbol]: any;
};
/**
 * 创建组件实例对象
 * 返回的实例和调用 getCurrentComponent() 返回的一致
 * @param {*} Component
 */
export function createComponent(
  Component: DefineComponent,
  props: VNodeProps,
  children: _Vnode
) {
  const vnode: _Vnode = h(
    Component,
    { ...props, ref: MOUNT_COMPONENT_REF },
    children
  );
  const container = document.createElement("div");
  vnode[COMPONENT_CONTAINER_SYMBOL] = container;
  render(vnode, container);
  return vnode.component;
}

/**
 * 销毁组件实例对象
 * @param {*} ComponnetInstance 通过createComponent方法得到的组件实例对象
 */
export function unmountComponent(ComponnetInstance: DefineComponent) {
  render(null, ComponnetInstance.vnode[COMPONENT_CONTAINER_SYMBOL]);
}
