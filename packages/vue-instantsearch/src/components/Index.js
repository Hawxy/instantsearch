import indexWidget from 'instantsearch.js/es/widgets/index/index';
import { h } from 'vue';

import { createSuitMixin } from '../mixins/suit';
import { createWidgetMixin } from '../mixins/widget';

// wrapped in a dummy function, since indexWidget doesn't render
const connectIndex = () => indexWidget;

export default {
  name: 'AisIndex',
  mixins: [
    createSuitMixin({ name: 'Index' }),
    createWidgetMixin(
      { connector: connectIndex },
      {
        $$widgetType: 'ais.index',
      }
    ),
  ],
  provide() {
    return {
      // The widget is created & registered by widgetMixin, accessor is needed
      // because provide is not reactive.
      $_ais_getParentIndex: () => this.widget,
    };
  },
  props: {
    indexName: {
      type: String,
      required: true,
    },
    indexId: {
      type: String,
      required: false,
    },
  },
  render() {
    const defaultSlot = this.$slots.default;
    return h('div', {}, defaultSlot ? defaultSlot() : undefined);
  },
  computed: {
    widgetParams() {
      return {
        indexName: this.indexName,
        indexId: this.indexId,
      };
    },
  },
};
