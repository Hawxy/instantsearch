<template>
  <div :class="suit()" v-if="state && state.state && state.results">
    <slot v-bind="stateResults">
      <p>
        Use this component to have a different layout based on a certain state.
      </p>
      <p>Fill in the slot, and get access to the following things:</p>
      <pre>results: {{ Object.keys(state.results) }}</pre>
      <pre>state: {{ Object.keys(state.state) }}</pre>
      <pre>status: {{ state.status }}</pre>
      <pre>error: {{ state.error }}</pre>
    </slot>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useSuit } from '../composables/useSuit';
import { useWidget } from '../composables/useWidget';
import { _objectSpread } from '../util/polyfills';

defineOptions({ name: 'AisStateResults' });

const props = defineProps({
  catchError: {
    type: Boolean,
    default: false,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const { suit } = useSuit('StateResults', computed(() => props.classNames));
const { instantSearchInstance, getParentIndex } = useWidget(
  { connector: true },
  undefined,
  undefined
);

const state = ref(null);
let errorFn;

function renderFn() {
  const { status, error } = instantSearchInstance;
  const results = getParentIndex().getResults();
  const helper = getParentIndex().getHelper();
  const helperState = helper ? helper.state : null;

  state.value = {
    results,
    state: helperState,
    status,
    error,
  };
}

onMounted(() => {
  instantSearchInstance.addListener('render', renderFn);
  renderFn();
});

onBeforeUnmount(() => {
  instantSearchInstance.removeListener('render', renderFn);
  if (errorFn) {
    instantSearchInstance.removeListener('error', errorFn);
  }
});

watch(
  () => props.catchError,
  (catchError) => {
    if (catchError) {
      errorFn = () => {};
      instantSearchInstance.addListener('error', errorFn);
    } else if (errorFn) {
      instantSearchInstance.removeListener('error', errorFn);
      errorFn = undefined;
    }
  },
  { immediate: true }
);

const stateResults = computed(() => {
  if (!state.value) return null;
  const { results, state: helperState, status, error } = state.value;
  return _objectSpread({}, results, { results, state: helperState, status, error });
});
</script>
