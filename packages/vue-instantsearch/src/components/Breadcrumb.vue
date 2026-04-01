<template>
  <div
    v-if="state"
    :class="[suit(), !state.canRefine && suit('', 'noRefinement')]"
  >
    <slot
      :items="state.items"
      :can-refine="state.canRefine"
      :refine="state.refine"
      :createURL="state.createURL"
    >
      <ul :class="suit('list')">
        <li
          :class="[
            suit('item'),
            !state.items.length && suit('item', 'selected'),
          ]"
        >
          <a
            v-if="Boolean(state.items.length)"
            :href="state.createURL()"
            :class="suit('link')"
            @click.exact.left.prevent="state.refine()"
          >
            <slot name="rootLabel">Home</slot>
          </a>
          <a
            v-else
            :href="state.createURL(null)"
            :class="suit('link')"
            @click.exact.left.prevent="state.refine(null)"
          >
            <slot name="rootLabel">Home</slot>
          </a>
        </li>
        <li
          v-for="(item, index) in state.items"
          :key="item.label"
          :class="[suit('item'), isLastItem(index) && suit('item', 'selected')]"
        >
          <span :class="suit('separator')" aria-hidden="true">
            <slot name="separator">></slot> </span
          ><a
            v-if="!isLastItem(index)"
            :href="state.createURL(item.value)"
            :class="suit('link')"
            @click.exact.left.prevent="state.refine(item.value)"
            >{{ item.label }}</a
          >
          <template v-else>{{ item.label }}</template>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { connectBreadcrumb } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisBreadcrumb' });

const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  separator: {
    type: String,
    default: undefined,
  },
  rootPath: {
    type: String,
    default: undefined,
  },
  transformItems: {
    type: Function,
    default: undefined,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const widgetParams = computed(() => ({
  attributes: props.attributes,
  separator: props.separator,
  rootPath: props.rootPath,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectBreadcrumb },
  widgetParams,
  { $$widgetType: 'ais.breadcrumb' }
);

usePanelConsumer();
const { suit } = useSuit('Breadcrumb', computed(() => props.classNames));

function isLastItem(index) {
  return state.value.items.length - 1 === index;
}
</script>
