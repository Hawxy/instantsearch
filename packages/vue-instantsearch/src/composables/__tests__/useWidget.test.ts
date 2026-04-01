/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

import { mount } from '../../../test/utils';
import { useWidget } from '../useWidget';
import { warn } from '../../util/warn';

import { defineComponent, computed, ref, type Ref, nextTick } from 'vue';

jest.mock('../../util/warn');

function createFakeIndexWidget() {
  return {
    addWidgets: jest.fn(),
    removeWidgets: jest.fn(),
  };
}

function createFakeInstance(overrides: Record<string, any> = {}) {
  return {
    addWidgets: jest.fn(),
    removeWidgets: jest.fn(),
    mainIndex: createFakeIndexWidget(),
    started: true,
    ...overrides,
  };
}

function createTestComponent({
  connector,
  widgetParamsValue,
  additionalProperties,
  widgetParamsRef,
}: {
  connector?: Function | true;
  widgetParamsValue?: Record<string, unknown>;
  additionalProperties?: Record<string, unknown>;
  widgetParamsRef?: Ref<Record<string, unknown>>;
}) {
  let result: ReturnType<typeof useWidget>;
  return {
    component: defineComponent({
      setup() {
        const wp = widgetParamsRef || (widgetParamsValue !== undefined
          ? computed(() => widgetParamsValue)
          : undefined);
        result = useWidget(
          { connector },
          wp,
          additionalProperties
        );
        return () => null;
      },
    }),
    getResult: () => result,
  };
}

describe('useWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('injection', () => {
    it('throws if no instantsearch instance is provided', () => {
      const { component } = createTestComponent({
        connector: jest.fn(() => jest.fn(() => ({}))),
      });

      expect(() => {
        mount(component);
      }).toThrow(
        'It looks like you forgot to wrap your Algolia search component inside of an "<ais-instant-search>" component.'
      );
    });
  });

  describe('on root index', () => {
    it('adds a widget on create', () => {
      const instance = createFakeInstance();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);
      const widgetParamsValue = { attribute: 'brand' };

      const { component } = createTestComponent({
        connector,
        widgetParamsValue,
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(connector).toHaveBeenCalled();
      expect(factory).toHaveBeenCalledWith(widgetParamsValue);
      expect(instance.mainIndex.addWidgets).toHaveBeenCalledWith([widget]);
    });

    it('removes a widget on destroy', () => {
      const instance = createFakeInstance();
      const widget = { render: () => {}, dispose: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);

      const { component } = createTestComponent({
        connector,
        widgetParamsValue: { attribute: 'brand' },
      });

      const wrapper = mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(instance.mainIndex.addWidgets).toHaveBeenCalledWith([widget]);

      wrapper.unmount();

      expect(instance.mainIndex.removeWidgets).toHaveBeenCalledWith([widget]);
    });

    it('updates widget on widgetParams change', async () => {
      const instance = createFakeInstance();
      const widget = { render: () => {}, dispose: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);
      const wpRef = ref<Record<string, unknown>>({ attribute: 'brand' });

      const { component, getResult } = createTestComponent({
        connector,
        widgetParamsRef: computed(() => wpRef.value),
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(instance.mainIndex.addWidgets).toHaveBeenCalledTimes(1);
      expect(factory).toHaveBeenCalledWith({ attribute: 'brand' });

      // Simulate widgetParams change
      wpRef.value = { attribute: 'price' };
      await nextTick();

      expect(getResult().state.value).toBe(null);
      expect(instance.mainIndex.removeWidgets).toHaveBeenCalledTimes(1);
      expect(instance.mainIndex.removeWidgets).toHaveBeenCalledWith([widget]);
      expect(factory).toHaveBeenCalledTimes(2);
      expect(factory).toHaveBeenCalledWith({ attribute: 'price' });
      expect(instance.mainIndex.addWidgets).toHaveBeenCalledTimes(2);
    });

    it('ignores first render to avoid flash of empty state', () => {
      const instance = createFakeInstance();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);
      const state = { items: ['a', 'b'] };

      const { component, getResult } = createTestComponent({
        connector,
        widgetParamsValue: { attribute: 'brand' },
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      // Simulate init (first render)
      const updateState = connector.mock.calls[0][0];
      updateState(state, true);
      expect(getResult().state.value).toBe(null);

      // Simulate subsequent render
      updateState(state, false);
      expect(getResult().state.value).toEqual(state);
    });
  });

  describe('on child index', () => {
    it('adds a widget to the parent index', () => {
      const instance = createFakeInstance();
      const indexWidget = createFakeIndexWidget();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);

      const { component } = createTestComponent({
        connector,
        widgetParamsValue: { attribute: 'brand' },
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
          $_ais_getParentIndex: () => indexWidget,
        },
      });

      expect(indexWidget.addWidgets).toHaveBeenCalledWith([widget]);
      // Should NOT add to root index
      expect(instance.mainIndex.addWidgets).not.toHaveBeenCalled();
    });

    it('removes a widget from the parent index on destroy', () => {
      const instance = createFakeInstance();
      const indexWidget = createFakeIndexWidget();
      const widget = { render: () => {}, dispose: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);

      const { component } = createTestComponent({
        connector,
        widgetParamsValue: { attribute: 'brand' },
      });

      const wrapper = mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
          $_ais_getParentIndex: () => indexWidget,
        },
      });

      wrapper.unmount();

      expect(indexWidget.removeWidgets).toHaveBeenCalledWith([widget]);
    });

    it('updates widget on widgetParams change', async () => {
      const instance = createFakeInstance();
      const indexWidget = createFakeIndexWidget();
      const widget = { render: () => {}, dispose: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);
      const wpRef = ref<Record<string, unknown>>({ attribute: 'brand' });

      const { component, getResult } = createTestComponent({
        connector,
        widgetParamsRef: computed(() => wpRef.value),
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
          $_ais_getParentIndex: () => indexWidget,
        },
      });

      expect(indexWidget.addWidgets).toHaveBeenCalledTimes(1);

      wpRef.value = { attribute: 'price' };
      await nextTick();

      expect(getResult().state.value).toBe(null);
      expect(indexWidget.removeWidgets).toHaveBeenCalledTimes(1);
      expect(factory).toHaveBeenCalledTimes(2);
      expect(factory).toHaveBeenCalledWith({ attribute: 'price' });
      expect(indexWidget.addWidgets).toHaveBeenCalledTimes(2);
    });

    it('updates local state on connector render', () => {
      const instance = createFakeInstance();
      const indexWidget = createFakeIndexWidget();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);
      const state = { items: [] };

      const { component, getResult } = createTestComponent({
        connector,
        widgetParamsValue: { attribute: 'brand' },
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
          $_ais_getParentIndex: () => indexWidget,
        },
      });

      // Simulate init (first render — should be skipped)
      connector.mock.calls[0][0](state, true);
      expect(getResult().state.value).toBe(null);

      // Simulate render
      connector.mock.calls[0][0](state, false);
      expect(getResult().state.value).toEqual(state);
    });
  });

  describe('general', () => {
    it('merges additional properties onto the widget', () => {
      const instance = createFakeInstance();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);
      const additionalProperties = { $$widgetType: 'ais.fakeWidget' };

      const { component } = createTestComponent({
        connector,
        widgetParamsValue: { attribute: 'brand' },
        additionalProperties,
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(instance.mainIndex.addWidgets).toHaveBeenCalledTimes(1);
      expect(instance.mainIndex.addWidgets.mock.calls[0][0]).toEqual([
        { ...widget, ...additionalProperties },
      ]);
    });

    it('preserves additional properties after widgetParams change', async () => {
      const instance = createFakeInstance();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);
      const additionalProperties = { $$widgetType: 'ais.fakeWidget' };
      const wpRef = ref<Record<string, unknown>>({ attribute: 'brand' });

      const { component } = createTestComponent({
        connector,
        widgetParamsRef: computed(() => wpRef.value),
        additionalProperties,
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      wpRef.value = { attribute: 'price' };
      await nextTick();

      expect(instance.mainIndex.addWidgets).toHaveBeenCalledTimes(2);
      expect(instance.mainIndex.addWidgets.mock.calls[1][0]).toEqual([
        { ...widget, ...additionalProperties },
      ]);
    });

    it('warns when no connector is provided', () => {
      const instance = createFakeInstance();

      const { component } = createTestComponent({});

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "You are using the InstantSearch widget mixin, but didn't provide a connector."
        )
      );
    });

    it('does not warn when connector is true', () => {
      const instance = createFakeInstance();

      const { component } = createTestComponent({ connector: true });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(warn).not.toHaveBeenCalled();
    });

    it('returns the instantsearch instance', () => {
      const instance = createFakeInstance();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);

      const { component, getResult } = createTestComponent({
        connector,
        widgetParamsValue: {},
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(getResult().instantSearchInstance).toBe(instance);
    });

    it('returns getParentIndex defaulting to mainIndex', () => {
      const instance = createFakeInstance();
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);

      const { component, getResult } = createTestComponent({
        connector,
        widgetParamsValue: {},
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(getResult().getParentIndex()).toBe(instance.mainIndex);
    });

    it('throws SSR error when initial results exist without __forceRender', () => {
      const instance = createFakeInstance({
        _initialResults: { some: 'results' },
        started: false,
      });
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);

      const { component } = createTestComponent({
        connector,
        widgetParamsValue: {},
      });

      expect(() => {
        mount(component, {
          provide: {
            $_ais_instantSearchInstance: instance,
          },
        });
      }).toThrow(
        'You are using server side rendering with <ais-instant-search> instead of <ais-instant-search-ssr>.'
      );
    });

    it('calls __forceRender during SSR when available', () => {
      const forceRender = jest.fn();
      const instance = createFakeInstance({
        _initialResults: { some: 'results' },
        started: false,
        __forceRender: forceRender,
      });
      const widget = { render: () => {} };
      const factory = jest.fn(() => widget);
      const connector = jest.fn(() => factory);

      const { component } = createTestComponent({
        connector,
        widgetParamsValue: {},
      });

      mount(component, {
        provide: {
          $_ais_instantSearchInstance: instance,
        },
      });

      expect(forceRender).toHaveBeenCalledWith(widget, instance.mainIndex);
    });
  });
});
