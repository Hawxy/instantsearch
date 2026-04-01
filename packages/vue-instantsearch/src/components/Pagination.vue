<template>
  <div
    v-if="state"
    :class="{ [suit()]: true, [suit('', 'noRefinement')]: state.nbPages <= 1 }"
  >
    <slot
      :refine="refine"
      :createURL="state.createURL"
      :current-refinement="state.currentRefinement"
      :nb-hits="state.nbHits"
      :nb-pages="state.nbPages"
      :pages="state.pages"
      :is-first-page="state.isFirstPage"
      :is-last-page="state.isLastPage"
    >
      <ul :class="suit('list')">
        <li
          :class="{
            [suit('item')]: true,
            [suit('item', 'disabled')]: state.isFirstPage,
            [suit('item', 'firstPage')]: true,
          }"
          v-if="showFirst"
        >
          <slot
            name="first"
            :createURL="() => state.createURL(0)"
            :is-first-page="state.isFirstPage"
            :refine="() => refine(0)"
          >
            <template v-if="!state.isFirstPage">
              <a
                :class="suit('link')"
                aria-label="First Page"
                :href="state.createURL(0)"
                @click.exact.left.prevent="refine(0)"
                >‹‹</a
              >
            </template>
            <template v-else>
              <span :class="suit('link')" aria-label="First Page">‹‹</span>
            </template>
          </slot>
        </li>
        <li
          :class="{
            [suit('item')]: true,
            [suit('item', 'disabled')]: state.isFirstPage,
            [suit('item', 'previousPage')]: true,
          }"
          v-if="showPrevious"
        >
          <slot
            name="previous"
            :createURL="() => state.createURL(state.currentRefinement - 1)"
            :is-first-page="state.isFirstPage"
            :refine="() => refine(state.currentRefinement - 1)"
          >
            <template v-if="!state.isFirstPage">
              <a
                :class="suit('link')"
                aria-label="Previous Page"
                :href="state.createURL(state.currentRefinement - 1)"
                @click.exact.left.prevent="refine(state.currentRefinement - 1)"
                >‹</a
              >
            </template>
            <template v-else>
              <span :class="suit('link')" aria-label="Previous Page">‹</span>
            </template>
          </slot>
        </li>

        <li
          :class="{
            [suit('item')]: true,
            [suit('item', 'page')]: true,
            [suit('item', 'selected')]: state.currentRefinement === page,
          }"
          v-for="page in state.pages"
          :key="page"
        >
          <slot
            name="item"
            :page="page"
            :createURL="() => state.createURL(page)"
            :is-first-page="state.isFirstPage"
            :is-last-page="state.isLastPage"
            :refine="() => refine(page)"
          >
            <a
              :class="suit('link')"
              :href="state.createURL(page)"
              :aria-label="`Page ${page + 1}`"
              @click.exact.left.prevent="refine(page)"
              >{{ page + 1 }}</a
            >
          </slot>
        </li>

        <li
          :class="{
            [suit('item')]: true,
            [suit('item', 'disabled')]: state.isLastPage,
            [suit('item', 'nextPage')]: true,
          }"
          v-if="showNext"
        >
          <slot
            name="next"
            :createURL="() => state.createURL(state.currentRefinement + 1)"
            :is-last-page="state.isLastPage"
            :refine="() => refine(state.currentRefinement + 1)"
          >
            <template v-if="!state.isLastPage">
              <a
                :class="suit('link')"
                aria-label="Next Page"
                :href="state.createURL(state.currentRefinement + 1)"
                @click.exact.left.prevent="refine(state.currentRefinement + 1)"
                >›</a
              >
            </template>
            <template v-else>
              <span :class="suit('link')" aria-label="Next Page">›</span>
            </template>
          </slot>
        </li>
        <li
          :class="{
            [suit('item')]: true,
            [suit('item', 'disabled')]: state.isLastPage,
            [suit('item', 'lastPage')]: true,
          }"
          v-if="showLast"
        >
          <slot
            name="last"
            :createURL="() => state.createURL(state.nbPages - 1)"
            :is-last-page="state.isLastPage"
            :refine="() => refine(state.nbPages - 1)"
          >
            <template v-if="!state.isLastPage">
              <a
                :class="suit('link')"
                :aria-label="`Last Page, Page ${state.nbPages}`"
                :href="state.createURL(state.nbPages - 1)"
                @click.exact.left.prevent="refine(state.nbPages - 1)"
                >››</a
              >
            </template>
            <template v-else>
              <span
                :class="suit('link')"
                :aria-label="`Last Page, Page ${state.nbPages}`"
              >
                ››
              </span>
            </template>
          </slot>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { connectPagination } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisPagination' });

const props = defineProps({
  padding: {
    type: Number,
    default: undefined,
    validator(value) {
      return value > 0;
    },
  },
  totalPages: {
    type: Number,
    default: undefined,
    validator(value) {
      return value > 0;
    },
  },
  showFirst: {
    type: Boolean,
    default: true,
  },
  showLast: {
    type: Boolean,
    default: true,
  },
  showNext: {
    type: Boolean,
    default: true,
  },
  showPrevious: {
    type: Boolean,
    default: true,
  },
  classNames: {
    type: Object,
    default: undefined,
  },
});

const emit = defineEmits(['page-change']);

const widgetParams = computed(() => ({
  padding: props.padding,
  totalPages: props.totalPages,
}));

const { state } = useWidget(
  { connector: connectPagination },
  widgetParams,
  { $$widgetType: 'ais.pagination' }
);

usePanelConsumer();
const { suit } = useSuit('Pagination', computed(() => props.classNames));

function refine(page) {
  const p = Math.min(Math.max(page, 0), state.value.nbPages - 1);
  state.value.refine(p);
  emit('page-change', p);
}
</script>
