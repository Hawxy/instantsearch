<template>
  <div
    v-if="state"
    :class="[suit(), !state.canRefine && suit('', 'noRefinement')]"
  >
    <slot
      :items="state.items"
      :can-refine="state.canRefine"
      :refine="state.refine"
      :createURL="state.createURL"
      :send-event="state.sendEvent"
    >
      <ul :class="[suit('list')]">
        <li
          v-for="item in state.items"
          :key="item.label"
          :class="[suit('item'), item.isRefined && suit('item', 'selected')]"
        >
          <label :class="suit('label')">
            <input
              type="radio"
              :class="suit('radio')"
              :name="attribute"
              :value="item.value"
              :checked="item.isRefined"
              @change="state.refine($event.target.value)"
            />
            <span :class="suit('labelText')">{{ item.label }}</span>
          </label>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { connectNumericMenu } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';
import { usePanelConsumer } from '../composables/usePanel';

defineOptions({ name: 'AisNumericMenu' });

const props = defineProps({
  attribute: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
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
  transformItems: props.transformItems,
  items: props.items,
}));

const { state } = useWidget(
  { connector: connectNumericMenu },
  widgetParams,
  { $$widgetType: 'ais.numericMenu' }
);

usePanelConsumer();
const { suit } = useSuit('NumericMenu', computed(() => props.classNames));
</script>
