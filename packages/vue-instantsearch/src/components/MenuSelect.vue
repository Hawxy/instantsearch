<template>
  <div
    :class="[suit(), !state.canRefine && suit('', 'noRefinement')]"
    v-if="state"
  >
    <slot
      :items="state.items"
      :can-refine="state.canRefine"
      :refine="refine"
      :createURL="state.createURL"
      :send-event="state.sendEvent"
    >
      <select
        :class="suit('select')"
        @change="refine($event.currentTarget.value)"
      >
        <option :class="suit('option')" value="">
          <slot name="defaultOption"> See all </slot>
        </option>
        <option
          v-for="item in state.items"
          :key="item.value"
          :class="suit('option')"
          :value="item.value"
          :selected="item.isRefined"
        >
          <slot name="item" :item="item">
            {{ item.label }} ({{ item.count }})
          </slot>
        </option>
      </select>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { connectMenu } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisMenuSelect' });

const props = defineProps({
  attribute: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    default: 10,
  },
  sortBy: {
    type: [Array, Function],
    default: undefined,
  },
  transformItems: {
    type: Function,
    default(items) {
      return items;
    },
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const widgetParams = computed(() => ({
  attribute: props.attribute,
  limit: props.limit,
  sortBy: props.sortBy,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectMenu },
  widgetParams,
  { $$widgetType: 'ais.menuSelect' }
);

usePanelConsumer();
const { suit } = useSuit('MenuSelect', computed(() => props.classNames));

function refine(value) {
  state.value.refine(value);
}
</script>
