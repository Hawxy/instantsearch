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
      <ul :class="suit('list')">
        <li
          v-for="item in state.items"
          :key="item.value"
          :class="[suit('item'), item.isRefined && suit('item', 'selected')]"
        >
          <a
            :href="state.createURL(item.value)"
            :class="suit('link')"
            @click.exact.left.prevent="state.refine(item.value)"
          >
            <span :class="suit('label')">{{ item.label }}</span>
            <span :class="suit('count')">{{ item.count }}</span>
          </a>
        </li>
      </ul>

      <button
        v-if="showShowMoreButton"
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
import { connectMenu } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisMenu' });

const props = defineProps({
  attribute: {
    type: String,
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
  attribute: props.attribute,
  limit: props.limit,
  showMore: props.showMore,
  showMoreLimit: props.showMoreLimit,
  sortBy: props.sortBy,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectMenu },
  widgetParams,
  { $$widgetType: 'ais.menu' }
);

usePanelConsumer();
const { suit } = useSuit('Menu', computed(() => props.classNames));

const showShowMoreButton = computed(() => state.value && state.value.canRefine && props.showMore);
</script>
