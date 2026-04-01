<template>
  <div><slot /></div>
</template>

<script setup lang="ts">
import indexWidget from 'instantsearch.js/es/widgets/index/index';
import { computed, provide } from 'vue';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { PARENT_INDEX_KEY } from '../types';

defineOptions({ name: 'AisIndex' });

// wrapped in a dummy function, since indexWidget doesn't render
const connectIndex = () => indexWidget;

const props = defineProps({
  indexName: {
    type: String,
    required: true,
  },
  indexId: {
    type: String,
    required: false,
  },
});

const widgetParams = computed(() => ({
  indexName: props.indexName,
  indexId: props.indexId,
}));

const { widget } = useWidget(
  { connector: connectIndex },
  widgetParams,
  { $$widgetType: 'ais.index' }
);

// The widget is created & registered by useWidget, accessor is needed
// because provide is not reactive.
provide(PARENT_INDEX_KEY, () => widget);

const { suit } = useSuit('Index');
</script>
