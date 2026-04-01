<script setup lang="ts">
import { EXPERIMENTAL_connectConfigureRelatedItems } from 'instantsearch.js/es/connectors/index.umd';
import { computed } from 'vue';

import { useWidget } from '../composables/useWidget';

defineOptions({ name: 'AisExperimentalConfigureRelatedItems', inheritAttrs: false });

const props = defineProps({
  hit: {
    type: Object,
    required: true,
  },
  matchingPatterns: {
    type: Object,
    required: true,
  },
  transformSearchParameters: {
    type: Function,
    required: false,
  },
});

const widgetParams = computed(() => ({
  hit: props.hit,
  matchingPatterns: props.matchingPatterns,
  transformSearchParameters: props.transformSearchParameters,
}));

useWidget(
  { connector: EXPERIMENTAL_connectConfigureRelatedItems },
  widgetParams,
  { $$widgetType: 'ais.configureRelatedItems' }
);
</script>

<template>
  <slot v-if="false" />
</template>
