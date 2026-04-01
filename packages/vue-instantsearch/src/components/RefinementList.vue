<template>
  <div
    :class="[suit(), items.length === 0 && suit('', 'noRefinement')]"
    v-if="state"
  >
    <slot
      :items="items"
      :refine="refine"
      :search-for-items="state.searchForItems"
      :search-for-items-query="searchForFacetValuesQuery"
      :toggle-show-more="toggleShowMore"
      :can-toggle-show-more="state.canToggleShowMore"
      :is-showing-more="state.isShowingMore"
      :createURL="state.createURL"
      :is-from-search="state.isFromSearch"
      :can-refine="state.canRefine"
      :send-event="state.sendEvent"
    >
      <div :class="suit('searchBox')" v-if="searchable">
        <search-input
          v-model="searchForFacetValues"
          :show-loading-indicator="true"
          :placeholder="searchablePlaceholder"
          :class-names="classNames"
        />
      </div>
      <slot
        name="noResults"
        :query="searchForFacetValues"
        v-if="state.isFromSearch && items.length === 0"
      >
        <div :class="suit('noResults')">No results.</div>
      </slot>
      <ul v-if="items.length > 0" :class="suit('list')">
        <li
          :class="[suit('item'), item.isRefined && suit('item', 'selected')]"
          v-for="item in items"
          :key="item.value"
        >
          <slot
            name="item"
            :item="item"
            :refine="refine"
            :createURL="state.createURL"
          >
            <label :class="suit('label')">
              <input
                :class="suit('checkbox')"
                type="checkbox"
                :value="item.value"
                :checked="item.isRefined"
                @change="refine(item.value)"
              />
              <span v-if="searchable" :class="suit('labelText')">
                <ais-highlight attribute="item" :hit="item" />
              </span>
              <span v-else :class="suit('labelText')">{{ item.label }}</span>
              <span :class="suit('count')">{{ item.count }}</span>
            </label>
          </slot>
        </li>
      </ul>
      <button
        :class="[
          suit('showMore'),
          {
            [suit('showMore', 'disabled')]: !state.canToggleShowMore,
          },
        ]"
        @click="toggleShowMore"
        v-if="showMore"
        :disabled="!state.canToggleShowMore"
      >
        <slot name="showMoreLabel" :is-showing-more="state.isShowingMore">
          Show {{ state.isShowingMore ? 'less' : 'more' }}
        </slot>
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { connectRefinementList } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

import AisHighlight from './Highlight.vue';
import SearchInput from './SearchInput.vue';

defineOptions({ name: 'AisRefinementList' });

const noop = () => {};

const props = defineProps({
  attribute: {
    type: String,
    required: true,
  },
  searchable: {
    type: Boolean,
    default: undefined,
  },
  searchablePlaceholder: {
    type: String,
    required: false,
    default: 'Search here…',
  },
  operator: {
    default: 'or',
    validator(value) {
      return value === 'and' || value === 'or';
    },
    required: false,
  },
  limit: {
    type: Number,
    required: false,
    default: undefined,
  },
  showMoreLimit: {
    type: Number,
    required: false,
    default: undefined,
  },
  showMore: {
    type: Boolean,
    required: false,
    default: false,
  },
  sortBy: {
    type: [Array, Function],
    required: false,
    default: undefined,
  },
  transformItems: {
    type: Function,
    required: false,
    default: undefined,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const widgetParams = computed(() => ({
  attribute: props.attribute,
  operator: props.operator,
  limit: props.limit,
  showMore: props.showMore,
  showMoreLimit: props.showMoreLimit,
  sortBy: props.sortBy,
  escapeFacetValues: true,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectRefinementList },
  widgetParams,
  { $$widgetType: 'ais.refinementList' }
);

usePanelConsumer();
const { suit } = useSuit('RefinementList', computed(() => props.classNames));

const searchForFacetValuesQuery = ref('');

const searchForFacetValues = computed({
  get() {
    return searchForFacetValuesQuery.value;
  },
  set(value) {
    state.value.searchForItems(value);
    searchForFacetValuesQuery.value = value;
  },
});

const toggleShowMore = computed(() => state.value.toggleShowMore || noop);

const items = computed(() =>
  state.value.items.map((item) =>
    Object.assign({}, item, {
      _highlightResult: {
        item: {
          value: item.highlighted,
        },
      },
    })
  )
);

function refine(value) {
  state.value.refine(value);
  searchForFacetValuesQuery.value = '';
}
</script>
