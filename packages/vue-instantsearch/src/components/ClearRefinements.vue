<!-- @MAJOR remove `type="reset"` -->
<template>
  <div v-if="state" :class="suit()">
    <slot
      :can-refine="canRefine"
      :refine="state.refine"
      :createURL="state.createURL"
    >
      <button
        type="reset"
        :class="[suit('button'), !canRefine && suit('button', 'disabled')]"
        :disabled="!canRefine"
        @click.prevent="state.refine"
      >
        <slot name="resetLabel"> Clear refinements </slot>
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { connectClearRefinements } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisClearRefinements' });

const props = defineProps({
  excludedAttributes: {
    type: Array,
    default: undefined,
  },
  includedAttributes: {
    type: Array,
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
  includedAttributes: props.includedAttributes,
  excludedAttributes: props.excludedAttributes,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectClearRefinements },
  widgetParams,
  { $$widgetType: 'ais.clearRefinements' }
);

usePanelConsumer();
const { suit } = useSuit('ClearRefinements', computed(() => props.classNames));

const canRefine = computed(() => state.value && state.value.hasRefinements);
</script>
