<template>
  <div :class="[suit(), noRefinement && suit('', 'noRefinement')]" v-if="state">
    <slot
      :refine="state.refine"
      :items="state.items"
      :createURL="state.createURL"
    >
      <ul :class="suit('list')">
        <li
          v-for="item in state.items"
          :key="item.attribute"
          :class="suit('item')"
        >
          <slot
            name="item"
            :refine="item.refine"
            :item="item"
            :createURL="state.createURL"
          >
            <span :class="suit('label')">{{ capitalize(item.label) }}: </span>
            <span
              v-for="refinement in item.refinements"
              :key="createItemKey(refinement)"
              :class="suit('category')"
            >
              <slot
                name="refinement"
                :refine="item.refine"
                :refinement="refinement"
                :createURL="state.createURL"
              >
                <span :class="suit('categoryLabel')">
                  <q v-if="refinement.attribute === 'query'">{{
                    refinement.label
                  }}</q>
                  <template v-else>{{ refinement.label }}</template> </span
                ><button
                  :class="suit('delete')"
                  type="button"
                  @click.left.exact="item.refine(refinement)"
                >
                  ✕
                </button>
              </slot>
            </span>
          </slot>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { connectCurrentRefinements } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisCurrentRefinements' });

const props = defineProps({
  includedAttributes: {
    type: Array,
    default: undefined,
  },
  excludedAttributes: {
    type: Array,
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
  includedAttributes: props.includedAttributes,
  excludedAttributes: props.excludedAttributes,
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectCurrentRefinements },
  widgetParams,
  { $$widgetType: 'ais.currentRefinements' }
);

usePanelConsumer();
const { suit } = useSuit('CurrentRefinements', computed(() => props.classNames));

const noRefinement = computed(() => state.value && state.value.items.length === 0);

function createItemKey({ attribute, value, type, operator }) {
  return [attribute, type, value, operator].join(':');
}

function capitalize(value) {
  if (!value) return '';
  return (
    value.toString().charAt(0).toLocaleUpperCase() +
    value.toString().slice(1)
  );
}
</script>
