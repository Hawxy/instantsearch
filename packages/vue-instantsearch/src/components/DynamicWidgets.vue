<script lang="ts">
import { connectDynamicWidgets } from 'instantsearch.js/es/connectors/index.umd';
import { computed, defineComponent, h, type VNode, type PropType } from 'vue';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';

function getWidgetAttribute(vnode: VNode): string | undefined {
  const props = vnode.props;
  if (props) {
    if (props.attribute) {
      return props.attribute;
    }
    if (Array.isArray(props.attributes)) {
      return props.attributes[0];
    }
  }

  const children =
    vnode.children && (vnode.children as any).default && (vnode.children as any).default();

  if (Array.isArray(children)) {
    return children.reduce(
      (acc: string | undefined, curr: VNode) => acc || getWidgetAttribute(curr),
      undefined
    );
  }

  return undefined;
}

export default defineComponent({
  name: 'AisDynamicWidgets',
  props: {
    transformItems: {
      type: Function as PropType<(items: any[]) => any[]>,
      default: undefined,
    },
    facets: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
    maxValuesPerFacet: {
      type: Number,
      default: undefined,
    },
    classNames: {
      type: Object as PropType<Record<string, string>>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const widgetParams = computed(() => ({
      transformItems: props.transformItems,
      facets: props.facets,
      maxValuesPerFacet: props.maxValuesPerFacet,
      // we do not pass "widgets" to the connector, since Vue is in charge of rendering
      widgets: [],
    }));

    const { state } = useWidget(
      { connector: connectDynamicWidgets },
      widgetParams,
      { $$widgetType: 'ais.dynamicWidgets' }
    );

    const { suit } = useSuit('DynamicWidgets', computed(() => props.classNames));

    return () => {
      const components = new Map<string, VNode>();

      const defaultSlot = slots.default;
      (defaultSlot ? defaultSlot() : []).forEach((vnode) => {
        const attribute = getWidgetAttribute(vnode);
        if (attribute) {
          components.set(
            attribute,
            h('div', { key: attribute, class: [suit('widget')] }, [vnode])
          );
        }
      });

      // by default, render everything, but hidden so that the routing doesn't disappear
      if (!state.value) {
        const allComponents: VNode[] = [];
        components.forEach((component) => allComponents.push(component));

        return h(
          'div',
          {
            class: [suit()],
            hidden: true,
          },
          allComponents
        );
      }

      return h(
        'div',
        { class: [suit()] },
        state.value.attributesToRender.map((attribute: string) =>
          components.get(attribute)
        )
      );
    };
  },
});
</script>
