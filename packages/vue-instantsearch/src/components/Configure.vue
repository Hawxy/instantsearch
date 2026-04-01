<template>
  <div v-if="state && $slots.default" :class="suit()">
    <slot
      :refine="state.refine"
      :search-parameters="state.widgetParams.searchParameters"
    />
  </div>
</template>

<script setup lang="ts">
import { connectConfigure } from 'instantsearch.js/es/connectors/index.umd';
import { computed, useAttrs } from 'vue';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';

defineOptions({ name: 'AisConfigure', inheritAttrs: false });

const attrs = useAttrs();

const widgetParams = computed(() => ({
  searchParameters: Object.assign({}, attrs),
}));

const { state } = useWidget(
  { connector: connectConfigure },
  widgetParams,
  { $$widgetType: 'ais.configure' }
);

const { suit } = useSuit('Configure');
</script>
