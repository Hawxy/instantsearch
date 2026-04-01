<template>
  <ais-highlighter
    :hit="hit"
    :attribute="attribute"
    :highlighted-tag-name="highlightedTagName"
    :suit="suit"
    highlight-property="_highlightResult"
    pre-tag="<mark>"
    post-tag="</mark>"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSuit } from '../composables/useSuit';
import AisHighlighter from './Highlighter.vue';

defineOptions({ name: 'AisHighlight' });

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

const { suit } = useSuit('Highlight', computed(() => props.classNames));
</script>
