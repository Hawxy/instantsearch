<template>
  <div :class="suit()">
    <slot v-bind="state">
      <button @click="state.refine('hi')" :class="suit('button')">
        example refine
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useSuit } from '../composables/useSuit';
import { useWidget } from '../composables/useWidget';
// Uncomment and change here ⬇️
// import { connectorName } from 'instantsearch.js/es/connectors/index.umd';

/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
// Remove this part ⬇,️ only here for testing the template
const connectorName =
  (renderFn: any, unmountFn: any) =>
  ({ someProp }: any) => ({
    render: () => renderFn(),
  });
/* eslint-enable */

defineOptions({
  name: 'AisTemplate', // ◀️ change this to the component name that will be exported
});

const { suit } = useSuit('Template'); // ◀️ change this

// ⬇️ Those are all the options of your widget (attribute, items ...)
const props = defineProps({
  someProp: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const widgetParams = computed(() => ({
  someProp: props.someProp,
}));

const { state } = useWidget({
  connector: connectorName, // ◀️ change this to the right connectorName you imported
  widgetParams,
});
</script>
