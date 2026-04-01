import { connectConfigure } from 'instantsearch.js/es/connectors/index.umd';
import { h } from 'vue';

import { createSuitMixin } from '../mixins/suit';
import { createWidgetMixin } from '../mixins/widget';

export default {
  inheritAttrs: false,
  name: 'AisConfigure',
  mixins: [
    createSuitMixin({ name: 'Configure' }),
    createWidgetMixin(
      {
        connector: connectConfigure,
      },
      {
        $$widgetType: 'ais.configure',
      }
    ),
  ],
  computed: {
    widgetParams() {
      return {
        searchParameters: Object.assign({}, this.$attrs),
      };
    },
  },
  render() {
    const slot = this.$slots.default;

    if (!this.state || !slot) {
      return null;
    }

    return h(
      'div',
      {
        class: this.suit(),
      },
      [
        slot({
          refine: this.state.refine,
          searchParameters: this.state.widgetParams.searchParameters,
        }),
      ]
    );
  },
};
