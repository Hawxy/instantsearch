import { createHitsComponent } from 'instantsearch-ui-components';
import { connectHitsWithInsights } from 'instantsearch.js/es/connectors/index.umd';
import { h } from 'vue';

import { createSuitMixin } from '../mixins/suit';
import { createWidgetMixin } from '../mixins/widget';

export default {
  name: 'AisHits',
  mixins: [
    createWidgetMixin(
      {
        connector: connectHitsWithInsights,
      },
      {
        $$widgetType: 'ais.hits',
      }
    ),
    createSuitMixin({ name: 'Hits' }),
  ],
  props: {
    showBanner: {
      type: Boolean,
      default: true,
    },
    escapeHTML: {
      type: Boolean,
      default: true,
    },
    transformItems: {
      type: Function,
      default: undefined,
    },
  },
  computed: {
    widgetParams() {
      return {
        showBanner: this.showBanner,
        escapeHTML: this.escapeHTML,
        transformItems: this.transformItems,
      };
    },
  },
  render() {
    if (!this.state) {
      return null;
    }

    const defaultSlot = this.$slots.default;
    const itemSlot = this.$slots.item;
    const bannerSlot = this.$slots.banner;

    const itemComponent = ({
      hit,
      index,
      onClick,
      onAuxClick,
      // We don't want to pass the Preact key as a prop
      key: _key,
      ...rootProps
    }) => {
      return h(
        'li',
        {
          key: hit.objectID,
          ...rootProps,
          onClick,
          onAuxclick: onAuxClick,
        },
        [
          (itemSlot &&
            itemSlot({
              item: hit,
              index,
              insights: this.state.insights,
              sendEvent: this.state.sendEvent,
            })) ||
            `objectID: ${hit.objectID}, index: ${index}`,
        ]
      );
    };

    // We only want to render the default slot
    // if no other slots are defined
    if (!itemSlot && !bannerSlot && defaultSlot) {
      return h(
        'div',
        {
          class: this.suit(),
        },
        [
          defaultSlot({
            banner: this.state.banner,
            items: this.state.items,
            insights: this.state.insights,
            sendEvent: this.state.sendEvent,
          }),
        ]
      );
    }

    return h(createHitsComponent({ createElement: h }), {
      hits: this.state.items,
      itemComponent,
      banner: this.showBanner ? this.state.banner : undefined,
      bannerComponent: bannerSlot,
      sendEvent: this.state.sendEvent,
      classNames: this.classNames && {
        root: this.classNames['ais-Hits'],
        list: this.classNames['ais-Hits-list'],
        item: this.classNames['ais-Hits-item'],
        bannerRoot: this.classNames['ais-Hits-banner'],
        bannerImage: this.classNames['ais-Hits-banner-image'],
        bannerLink: this.classNames['ais-Hits-banner-link'],
      },
    });
  },
};
