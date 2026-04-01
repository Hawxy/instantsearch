<template>
  <div :class="{ [suit()]: true, [suit('', 'ssr')]: false }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import instantsearch from 'instantsearch.js/es';
import { toRef } from 'vue';

import { useInstantSearch } from '../composables/useInstantSearch';
import { warn } from '../util/warn';

defineOptions({ name: 'AisInstantSearch' });

const oldApiWarning = `Vue InstantSearch: You used the prop api-key or app-id.
These have been replaced by search-client.

See more info here: https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/#widget-param-search-client`;

const props = defineProps({
  searchClient: {
    type: Object,
    required: true,
  },
  insightsClient: {
    type: Function,
    default: undefined,
  },
  indexName: {
    type: String,
    required: false,
  },
  compositionID: {
    type: String,
    required: false,
  },
  routing: {
    default: undefined,
    validator(value: any) {
      if (
        typeof value === 'boolean' ||
        (!value.router && !value.stateMapping)
      ) {
        warn(
          'The `routing` option expects an object with `router` and/or `stateMapping`.\n\nSee https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/#widget-param-routing'
        );
        return false;
      }
      return true;
    },
  },
  insights: {
    default: undefined,
    validator(value: any) {
      return (
        typeof value === 'undefined' ||
        typeof value === 'boolean' ||
        typeof value === 'object'
      );
    },
  },
  stalledSearchDelay: {
    type: Number,
    default: undefined,
  },
  searchFunction: {
    type: Function,
    default: undefined,
  },
  onStateChange: {
    type: Function,
    default: undefined,
  },
  initialUiState: {
    type: Object,
    default: undefined,
  },
  apiKey: {
    type: String,
    default: undefined,
    validator(value: any) {
      if (value) {
        warn(oldApiWarning);
      }
      return false;
    },
  },
  appId: {
    type: String,
    default: undefined,
    validator(value: any) {
      if (value) {
        warn(oldApiWarning);
      }
      return false;
    },
  },
  middlewares: {
    type: Array,
    default: null,
  },
  future: {
    type: Object,
    default: undefined,
  },
});

const instantSearchInstance = instantsearch({
  searchClient: props.searchClient as any,
  insightsClient: props.insightsClient as any,
  insights: props.insights as any,
  indexName: props.indexName,
  compositionID: props.compositionID,
  routing: props.routing as any,
  stalledSearchDelay: props.stalledSearchDelay,
  searchFunction: props.searchFunction as any,
  onStateChange: props.onStateChange as any,
  initialUiState: props.initialUiState,
  future: props.future as any,
});

const { suit } = useInstantSearch({
  instance: instantSearchInstance,
  searchClient: toRef(props, 'searchClient'),
  indexName: toRef(props, 'indexName'),
  compositionID: toRef(props, 'compositionID'),
  stalledSearchDelay: toRef(props, 'stalledSearchDelay'),
  routing: toRef(props, 'routing'),
  onStateChange: toRef(props, 'onStateChange'),
  searchFunction: toRef(props, 'searchFunction'),
  middlewares: toRef(props, 'middlewares') as any,
  future: toRef(props, 'future'),
});

defineExpose({ instantSearchInstance });
</script>
