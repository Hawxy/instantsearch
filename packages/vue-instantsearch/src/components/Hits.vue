<script lang="ts">
import { createHitsComponent } from 'instantsearch-ui-components';
import { connectHitsWithInsights } from 'instantsearch.js/es/connectors/index.umd';
import { computed, defineComponent, h, type PropType } from 'vue';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';

export default defineComponent({
  name: 'AisHits',
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
      type: Function as PropType<(items: any[]) => any[]>,
      default: undefined,
    },
    classNames: {
      type: Object as PropType<Record<string, string>>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const widgetParams = computed(() => ({
      showBanner: props.showBanner,
      escapeHTML: props.escapeHTML,
      transformItems: props.transformItems,
    }));

    const { state } = useWidget(
      { connector: connectHitsWithInsights },
      widgetParams,
      { $$widgetType: 'ais.hits' }
    );

    const { suit } = useSuit('Hits', computed(() => props.classNames));

    return () => {
      if (!state.value) {
        return null;
      }

      const defaultSlot = slots.default;
      const itemSlot = slots.item;
      const bannerSlot = slots.banner;

      const itemComponent = ({
        hit,
        index,
        onClick,
        onAuxClick,
        key: _key,
        ...rootProps
      }: any) => {
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
                insights: state.value.insights,
                sendEvent: state.value.sendEvent,
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
            class: suit(),
          },
          [
            defaultSlot({
              banner: state.value.banner,
              items: state.value.items,
              insights: state.value.insights,
              sendEvent: state.value.sendEvent,
            }),
          ]
        );
      }

      return h(createHitsComponent({ createElement: h }), {
        hits: state.value.items,
        itemComponent,
        banner: props.showBanner ? state.value.banner : undefined,
        bannerComponent: bannerSlot,
        sendEvent: state.value.sendEvent,
        classNames: props.classNames && {
          root: props.classNames['ais-Hits'],
          list: props.classNames['ais-Hits-list'],
          item: props.classNames['ais-Hits-item'],
          bannerRoot: props.classNames['ais-Hits-banner'],
          bannerImage: props.classNames['ais-Hits-banner-image'],
          bannerLink: props.classNames['ais-Hits-banner-link'],
        },
      });
    };
  },
});
</script>
