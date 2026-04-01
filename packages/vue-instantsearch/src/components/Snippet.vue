<template>
  <ais-highlighter
    :hit="hit"
    :attribute="attribute"
    :highlighted-tag-name="highlightedTagName"
    :suit="suit"
    highlight-property="_snippetResult"
    pre-tag="<mark>"
    post-tag="</mark>"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useSuit } from '../composables/useSuit';
import AisHighlighter from '../util/vue-compat/Highlighter';

defineOptions({ name: 'AisSnippet' });

const props = defineProps({
  hit: {
    type: Object,
    required: true,
  },
  attribute: {
    type: String,
    required: true,
  },
  highlightedTagName: {
    type: String,
    default: 'mark',
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const { suit } = useSuit('Snippet', computed(() => props.classNames));
</script>
