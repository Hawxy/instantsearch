<template>
  <div :class="suit()" v-if="state">
    <slot
      :refine="state.refine"
      :current-refinement="state.currentRefinement"
      :indices="state.indices"
    >
      <p>
        This widget doesn't render anything without a filled in default slot.
      </p>
      <p>query, function to refine and results are provided.</p>
      <pre>refine: Function</pre>
      <pre>currentRefinement: "{{ state.currentRefinement }}"</pre>
      <details>
        <summary><code>indices</code>:</summary>
        <pre>{{ state.indices }}</pre>
      </details>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { connectAutocomplete } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';

defineOptions({ name: 'AisAutocomplete' });

const props = defineProps({
  escapeHTML: {
    type: Boolean,
    required: false,
    default: true,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const widgetParams = computed(() => ({
  escapeHTML: props.escapeHTML,
}));

const { state } = useWidget(
  { connector: connectAutocomplete },
  widgetParams,
  { $$widgetType: 'ais.autocomplete' }
);

const { suit } = useSuit('Autocomplete', computed(() => props.classNames));
</script>
