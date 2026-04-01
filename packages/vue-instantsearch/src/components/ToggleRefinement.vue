<template>
  <div
    v-if="state"
    :class="[suit(), !state.canRefine && suit('', 'noRefinement')]"
  >
    <slot
      :value="state.value"
      :can-refine="state.canRefine"
      :refine="state.refine"
      :createURL="state.createURL"
      :send-event="state.sendEvent"
    >
      <label :class="suit('label')">
        <input
          :class="suit('checkbox')"
          type="checkbox"
          :name="state.value.name"
          :value="on"
          :checked="state.value.isRefined"
          @change="state.refine(state.value)"
        />
        <span :class="suit('labelText')">{{ label || state.value.name }}</span>
        <span v-if="state.value.count !== null" :class="suit('count')">{{
          state.value.count.toLocaleString()
        }}</span>
      </label>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { connectToggleRefinement } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisToggleRefinement' });

const props = defineProps({
  attribute: {
    type: String,
    required: true,
  },
  on: {
    type: [String, Number, Boolean, Array],
    required: false,
    default: true,
  },
  off: {
    type: [String, Number, Boolean, Array],
    required: false,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const widgetParams = computed(() => ({
  attribute: props.attribute,
  on: props.on,
  off: props.off,
}));

const { state } = useWidget(
  { connector: connectToggleRefinement },
  widgetParams,
  { $$widgetType: 'ais.toggleRefinement' }
);

usePanelConsumer();
const { suit } = useSuit('ToggleRefinement', computed(() => props.classNames));
</script>
