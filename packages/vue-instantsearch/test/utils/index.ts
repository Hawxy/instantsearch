import { mount as testMount, type MountingOptions, type VueWrapper } from '@vue/test-utils';
import {
  createApp as _createApp,
  createSSRApp as _createSSRApp,
  nextTick as _nextTick,
  type Component,
  type App,
} from 'vue';

export const htmlCompat = function (html: string): string {
  return html
    .replace(/disabled=""/g, 'disabled="disabled"')
    .replace(/hidden=""/g, 'hidden="hidden"')
    .replace(/novalidate=""/g, 'novalidate="novalidate"')
    .replace(/required=""/g, 'required="required"');
};

interface MountOptions {
  propsData?: Record<string, any>;
  mixins?: any[];
  provide?: Record<string | symbol, any>;
  slots?: Record<string, any>;
  scopedSlots?: Record<string, any>;
  stubs?: Record<string, any>;
  global?: Record<string, any>;
  [key: string]: any;
}

export const mount = (component: Component, options: MountOptions = {}) => {
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
      ...(options.global || {}),
    },
    slots: {
      ...slots,
      ...scopedSlots,
    },
  } as MountingOptions<any>);
  (wrapper as any).destroy = wrapper.unmount;
  (wrapper as any).htmlCompat = function (this: VueWrapper) {
    return htmlCompat(this.html());
  };
  return wrapper;
};

export const createApp = (props: Component): App => _createApp(props);

export const createSSRApp = (props: Component): App => _createSSRApp(props);

export const mountApp = (props: Component, container: Element) => _createApp(props).mount(container);

export const nextTick = (): Promise<void> => _nextTick();
