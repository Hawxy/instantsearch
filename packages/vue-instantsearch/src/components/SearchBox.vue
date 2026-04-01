<template>
  <div v-if="state" :class="suit()">
    <slot
      :current-refinement="currentRefinement"
      :is-search-stalled="state.isSearchStalled"
      :refine="state.refine"
    >
      <search-input
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @reset="$emit('reset')"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :show-loading-indicator="showLoadingIndicator"
        :should-show-loading-indicator="state.isSearchStalled"
        :ignore-composition-events="ignoreCompositionEvents"
        :submit-title="submitTitle"
        :reset-title="resetTitle"
        :class-names="classNames"
        v-model="currentRefinement"
        ref="searchInput"
      >
        <template #loading-indicator>
          <slot name="loading-indicator" />
        </template>

        <template #submit-icon>
          <slot name="submit-icon" />
        </template>

        <template #reset-icon>
          <slot name="reset-icon" />
        </template>
      </search-input>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { connectSearchBox } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';

import SearchInput from './SearchInput.vue';

defineOptions({ name: 'AisSearchBox' });

const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  showLoadingIndicator: {
    type: Boolean,
    default: true,
  },
  ignoreCompositionEvents: {
    type: Boolean,
    default: false,
  },
  submitTitle: {
    type: String,
    default: 'Submit the search query',
  },
  resetTitle: {
    type: String,
    default: 'Clear the search query',
  },
  modelValue: {
    type: String,
    default: undefined,
  },
  queryHook: {
    type: Function,
    default: undefined,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const emit = defineEmits(['focus', 'blur', 'reset', 'update:modelValue']);

const widgetParams = computed(() => ({
  queryHook: props.queryHook,
}));

const { state } = useWidget(
  { connector: connectSearchBox },
  widgetParams,
  { $$widgetType: 'ais.searchBox' }
);

const { suit } = useSuit('SearchBox', computed(() => props.classNames));

const searchInput = ref(null);
const localValue = ref('');

const isControlled = computed(() => typeof props.modelValue !== 'undefined');

const currentRefinement = computed({
  get() {
    if (isControlled.value && props.modelValue !== localValue.value) {
      localValue.value = props.modelValue;
      emit('update:modelValue', props.modelValue);
      state.value.refine(props.modelValue);
    }

    if (searchInput.value && searchInput.value.isFocused()) {
      return localValue.value;
    }

    return props.modelValue || state.value.query || '';
  },
  set(val) {
    localValue.value = val;
    state.value.refine(val);
    if (isControlled.value) {
      emit('update:modelValue', val);
    }
  },
});
</script>
