import { ref, inject, watch, onBeforeUnmount, computed } from 'vue';
import { _objectSpread } from '../util/polyfills';
import { warn } from '../util/warn';

export function useWidget(
  { connector } = {},
  widgetParams,
  additionalProperties = {}
) {
  const instantSearchInstance = inject('$_ais_instantSearchInstance', () => {
    throw new TypeError(
      'It looks like you forgot to wrap your Algolia search component inside of an "<ais-instant-search>" component.'
    );
  });

  const getParentIndex = inject('$_ais_getParentIndex', () => {
    return () => instantSearchInstance.mainIndex;
  });

  const state = ref(null);
  let factory;
  let widget;

  function updateState(newState = {}, isFirstRender) {
    if (!isFirstRender) {
      state.value = newState;
    }
  }

  if (typeof connector === 'function') {
    factory = connector(updateState, () => {});
    widget = _objectSpread(
      factory(widgetParams ? widgetParams.value : {}),
      additionalProperties
    );
    getParentIndex().addWidgets([widget]);

    if (
      instantSearchInstance._initialResults &&
      !instantSearchInstance.started
    ) {
      if (typeof instantSearchInstance.__forceRender !== 'function') {
        throw new Error(
          'You are using server side rendering with <ais-instant-search> instead of <ais-instant-search-ssr>.'
        );
      }
      instantSearchInstance.__forceRender(widget, getParentIndex());
    }
  } else if (connector !== true) {
    warn(
      `You are using the InstantSearch widget mixin, but didn't provide a connector.
While this is technically possible, and will give you access to the Helper,
it's not the recommended way of making custom components.

If you want to disable this message, pass { connector: true } to the mixin.

Read more on using connectors: https://alg.li/vue-custom`
    );
  }

  if (widgetParams) {
    watch(
      widgetParams,
      (nextWidgetParams) => {
        if (!factory) return;
        state.value = null;
        getParentIndex().removeWidgets([widget]);
        widget = _objectSpread(
          factory(nextWidgetParams),
          additionalProperties
        );
        getParentIndex().addWidgets([widget]);
      },
      { deep: true }
    );
  }

  onBeforeUnmount(() => {
    if (widget) {
      getParentIndex().removeWidgets([widget]);
    }
  });

  return {
    state,
    instantSearchInstance,
    getParentIndex,
    get widget() {
      return widget;
    },
  };
}
