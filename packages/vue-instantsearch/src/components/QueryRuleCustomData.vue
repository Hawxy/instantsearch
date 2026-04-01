<template>
  <div v-if="state" :class="suit()">
    <slot :items="state.items">
      <div v-for="(item, key) in state.items" :key="key">
        <slot name="item" :item="item">
          <pre>{{ item }}</pre>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { connectQueryRules } from 'instantsearch.js/es/connectors/index.umd';

import { useWidget } from '../composables/useWidget';
import { useSuit } from '../composables/useSuit';

defineOptions({ name: 'AisQueryRuleCustomData' });

const props = defineProps({
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
  transformItems: props.transformItems,
}));

const { state } = useWidget(
  { connector: connectQueryRules },
  widgetParams,
  { $$widgetType: 'ais.queryRuleCustomData' }
);

const { suit } = useSuit('QueryRuleCustomData', computed(() => props.classNames));
</script>
