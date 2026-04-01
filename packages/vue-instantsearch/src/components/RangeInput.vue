<template>
  <div
    v-if="state"
    :class="[suit(), !state.canRefine && suit('', 'noRefinement')]"
  >
    <slot
      :current-refinement="values"
      :refine="refine"
      :can-refine="state.canRefine"
      :range="state.range"
      :send-event="state.sendEvent"
    >
      <form
        :class="suit('form')"
        @submit.prevent="
          refine({
            min: pick(minInput, values.min),
            max: pick(maxInput, values.max),
          })
        "
      >
        <label :class="suit('label')">
          <slot name="minLabel" />
          <input
            type="number"
            :class="[suit('input'), suit('input', 'min')]"
            :step="step"
            :min="state.range.min"
            :max="state.range.max"
            :placeholder="state.range.min"
            :value="values.min"
            @change="minInput = $event.currentTarget.value"
          />
        </label>
        <span :class="suit('separator')">
          <slot name="separator">to</slot>
        </span>
        <label :class="suit('label')">
          <slot name="maxLabel" />
          <input
            :class="[suit('input'), suit('input', 'max')]"
            type="number"
            :step="step"
            :min="state.range.min"
            :max="state.range.max"
            :placeholder="state.range.max"
            :value="values.max"
            @change="maxInput = $event.currentTarget.value"
          />
        </label>
        <button :class="suit('submit')" type="submit">
          <slot name="submitLabel"> Go </slot>
        </button>
      </form>
    </slot>
  </div>
</template>

<script setup>
import { ref, computed, onUpdated } from 'vue';
import { connectRange } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisRangeInput' });

const props = defineProps({
  attribute: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: false,
    default: undefined,
  },
  max: {
    type: Number,
    required: false,
    default: undefined,
  },
  precision: {
    type: Number,
    required: false,
    default: 0,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const widgetParams = computed(() => ({
  attribute: props.attribute,
  min: props.min,
  max: props.max,
  precision: props.precision,
}));

const { state } = useWidget(
  { connector: connectRange },
  widgetParams,
  { $$widgetType: 'ais.rangeInput' }
);

usePanelConsumer();
const { suit } = useSuit('RangeInput', computed(() => props.classNames));

const minInput = ref(undefined);
const maxInput = ref(undefined);

onUpdated(() => {
  minInput.value = undefined;
  maxInput.value = undefined;
});

const step = computed(() => 1 / Math.pow(10, props.precision));

const values = computed(() => {
  const [minValue, maxValue] = state.value.start;
  const { min: minRange, max: maxRange } = state.value.range;
  return {
    min: minValue !== -Infinity && minValue !== minRange ? minValue : undefined,
    max: maxValue !== Infinity && maxValue !== maxRange ? maxValue : undefined,
  };
});

function pick(first, second) {
  if (first !== null && first !== undefined) {
    return first;
  } else {
    return second;
  }
}

function refine({ min, max }) {
  state.value.refine([min, max]);
}
</script>
