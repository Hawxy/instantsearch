<template>
  <div
    v-if="state"
    :class="[suit(), !state.canRefine && suit('', 'noRefinement')]"
  >
    <slot
      :items="state.items"
      :can-refine="state.canRefine"
      :can-toggle-show-more="state.canToggleShowMore"
      :is-showing-more="state.isShowingMore"
      :refine="state.refine"
      :createURL="state.createURL"
      :toggle-show-more="state.toggleShowMore"
      :send-event="state.sendEvent"
    >
      <hierarchical-menu-list
        :items="state.items"
        :level="0"
        :refine="state.refine"
        :createURL="state.createURL"
        :suit="suit"
      />

      <button
        v-if="showMore"
        :class="[
          suit('showMore'),
          !state.canToggleShowMore && suit('showMore', 'disabled'),
        ]"
        :disabled="!state.canToggleShowMore"
        @click.prevent="state.toggleShowMore"
      >
        <slot name="showMoreLabel" :is-showing-more="state.isShowingMore">
          {{ state.isShowingMore ? 'Show less' : 'Show more' }}
        </slot>
      </button>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { connectHierarchicalMenu } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

import HierarchicalMenuList from './HierarchicalMenuList.vue';

defineOptions({ name: 'AisHierarchicalMenu' });

const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  limit: {
    type: Number,
    default: undefined,
  },
  showMoreLimit: {
    type: Number,
    default: undefined,
  },
  showMore: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: [Array, Function],
    default: undefined,
  },
  separator: {
    type: String,
    default: undefined,
  },
  rootPath: {
    type: String,
    default: undefined,
  },
  showParentLevel: {
    type: Boolean,
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
  attributes: props.attributes,
  limit: props.limit,
  showMore: props.showMore,
  showMoreLimit: props.showMoreLimit,
  separator: props.separator,
  rootPath: props.rootPath,
  showParentLevel: props.showParentLevel,
  sortBy: props.sortBy,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectHierarchicalMenu },
  widgetParams,
  { $$widgetType: 'ais.hierarchicalMenu' }
);

usePanelConsumer();
const { suit } = useSuit('HierarchicalMenu', computed(() => props.classNames));
</script>
