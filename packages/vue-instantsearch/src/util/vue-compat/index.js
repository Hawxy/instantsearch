export * from 'vue';
export { version } from 'vue';
import { h as vueH } from 'vue';

/**
 * Compatibility wrapper for render functions.
 * Maps Vue 2-style h() call signatures (with { attrs, props, on } objects)
 * to Vue 3's flat h() API.
 */
function compatH(tag, propsOrChildren, ...children) {
  if (propsOrChildren && typeof propsOrChildren === 'object' && !Array.isArray(propsOrChildren) && !propsOrChildren.__v_isVNode) {
    const { attrs, props: compProps, on, scopedSlots, ...rest } = propsOrChildren;
    const flatProps = { ...rest };
    if (attrs) Object.assign(flatProps, attrs);
    if (compProps) Object.assign(flatProps, compProps);
    if (on) {
      Object.keys(on).forEach((event) => {
        flatProps[`on${event[0].toUpperCase()}${event.slice(1)}`] = on[event];
      });
    }
    if (scopedSlots) {
      // Convert scopedSlots to Vue 3 slots
      children = [scopedSlots];
    }
    return vueH(tag, flatProps, ...children);
  }
  return vueH(tag, propsOrChildren, ...children);
}

export function renderCompat(renderFn) {
  return function () {
    return renderFn.call(this, compatH);
  };
}
