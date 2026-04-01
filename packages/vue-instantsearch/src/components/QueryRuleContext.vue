<script setup lang="ts">
import { connectQueryRules } from 'instantsearch.js/es/connectors/index.umd';
import { computed } from 'vue';

import { useWidget } from '../composables/useWidget';

defineOptions({ name: 'AisQueryRuleContext' });

const props = defineProps({
  trackedFilters: {
    type: Object,
    required: true,
  },
  transformRuleContexts: {
    type: Function,
    required: false,
    default: undefined,
  },
});

const widgetParams = computed(() => ({
  trackedFilters: props.trackedFilters,
  transformRuleContexts: props.transformRuleContexts,
}));

useWidget(
  { connector: connectQueryRules },
  widgetParams,
  { $$widgetType: 'ais.queryRuleContext' }
);
</script>

<template>
  <slot v-if="false" />
</template>
