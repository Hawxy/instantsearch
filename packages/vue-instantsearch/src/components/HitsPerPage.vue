<template>
  <div v-if="state" :class="suit()">
    <slot
      :items="state.items"
      :refine="state.refine"
      :has-no-results="state.hasNoResults"
      :can-refine="state.canRefine"
      :createURL="state.createURL"
    >
      <select
        :class="suit('select')"
        @change="state.refine(Number($event.currentTarget.value))"
      >
        <option
          v-for="item in state.items"
          :key="item.value"
          :class="suit('option')"
          :value="item.value"
          :selected="item.isRefined"
        >
          {{ item.label }}
        </option>
      </select>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { connectHitsPerPage } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisHitsPerPage' });

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
  { connector: connectHitsPerPage },
  widgetParams,
  { $$widgetType: 'ais.hitsPerPage' }
);

usePanelConsumer();
const { suit } = useSuit('HitsPerPage', computed(() => props.classNames));
</script>
