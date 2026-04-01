<template>
  <div v-if="state && state.isVirtualReplica" :class="suit()">
    <slot :is-relevant-sorted="state.isRelevantSorted" :refine="state.refine">
      <div :class="suit('text')">
        <slot name="text" :is-relevant-sorted="state.isRelevantSorted" />
      </div>
      <button type="button" :class="suit('button')" @click="refine()">
        <slot name="button" :is-relevant-sorted="state.isRelevantSorted">
          {{
            state.isRelevantSorted ? 'See all results' : 'See relevant results'
          }}
        </slot>
      </button>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { connectRelevantSort } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';

defineOptions({ name: 'AisRelevantSort' });

const props = defineProps({
  classNames: {
    type: Object,
    default: undefined,
  },
});

const widgetParams = computed(() => ({}));

const { state } = useWidget(
  { connector: connectRelevantSort },
  widgetParams,
  { $$widgetType: 'ais.relevantSort' }
);

const { suit } = useSuit('RelevantSort', computed(() => props.classNames));

function refine() {
  if (state.value.isRelevantSorted) {
    state.value.refine(0);
  } else {
    state.value.refine(undefined);
  }
}
</script>
