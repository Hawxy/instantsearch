import { mount as testMount } from '@vue/test-utils';
import {
  createApp as _createApp,
  createSSRApp as _createSSRApp,
  nextTick as _nextTick,
} from 'vue';

export const htmlCompat = function (html) {
  return html
    .replace(/disabled=""/g, 'disabled="disabled"')
    .replace(/hidden=""/g, 'hidden="hidden"')
    .replace(/novalidate=""/g, 'novalidate="novalidate"')
    .replace(/required=""/g, 'required="required"');
};

export const mount = (component, options = {}) => {
  const {
    propsData,
    mixins,
    provide,
    slots,
    scopedSlots,
    stubs,
    ...restOptions
  } = options;
  const wrapper = testMount(component, {
    ...restOptions,
    props: propsData,
    global: {
      mixins,
      provide,
      stubs,
    },
    slots: {
      ...slots,
      ...scopedSlots,
    },
  });
  wrapper.destroy = wrapper.unmount;
  wrapper.htmlCompat = function () {
    return htmlCompat(this.html());
  };
  return wrapper;
};

export const createApp = (props) => _createApp(props);

export const createSSRApp = (props) => _createSSRApp(props);

export const mountApp = (props, container) => _createApp(props).mount(container);

export const nextTick = () => _nextTick();
