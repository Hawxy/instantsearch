<template>
  <div :class="suit()" v-if="state">
    <slot
      :items="state.options"
      :has-no-results="state.hasNoResults"
      :refine="state.refine"
      :current-refinement="state.currentRefinement"
      :can-refine="state.canRefine"
    >
      <select
        :class="suit('select')"
        @change="state.refine($event.currentTarget.value)"
        aria-label="Sort results by"
      >
        <option
          v-for="item in state.options"
          :key="item.value"
          :class="suit('option')"
          :value="item.value"
          :selected="item.value === state.currentRefinement"
        >
          {{ item.label }}
        </option>
      </select>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { connectSortBy } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisSortBy' });

const props = defineProps({
  items: {
    type: Array,
    required: true,
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
  items: props.items,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectSortBy },
  widgetParams,
  { $$widgetType: 'ais.sortBy' }
);

usePanelConsumer();
const { suit } = useSuit('SortBy', computed(() => props.classNames));
</script>
