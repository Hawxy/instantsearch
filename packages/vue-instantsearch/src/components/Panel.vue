<template>
  <div :class="[suit(), !canRefine && suit('', 'noRefinement')]">
    <div v-if="getSlot('header')" :class="suit('header')">
      <slot name="header" :has-refinements="canRefine" />
    </div>
    <div :class="suit('body')">
      <slot :has-refinements="canRefine" />
    </div>
    <div v-if="getSlot('footer')" :class="suit('footer')">
      <slot name="footer" :has-refinements="canRefine" />
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { useSuit } from '../composables/useSuit';
import { usePanelProvider } from '../composables/usePanel';

defineOptions({ name: 'AisPanel' });

const props = defineProps({
  classNames: {
    type: Object,
    default: undefined,
  },
});

const { suit } = useSuit('Panel', computed(() => props.classNames));
const { canRefine } = usePanelProvider();

const slots = useSlots();

function getSlot(name) {
  return slots[name];
}
</script>
