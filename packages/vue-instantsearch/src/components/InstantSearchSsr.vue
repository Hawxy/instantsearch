<template>
  <div :class="{ [suit()]: true, [suit('', 'ssr')]: true }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

import { useInstantSearch } from '../composables/useInstantSearch';
import type { InstantSearch } from '../types';
import { SSR_INSTANCE_KEY } from '../types';

defineOptions({ name: 'AisInstantSearchSsr' });

const ssrInstance = inject<InstantSearch>(SSR_INSTANCE_KEY);
if (!ssrInstance) {
  throw new Error('`createServerRootMixin` is required when using SSR.');
}

const { suit } = useInstantSearch({ instance: ssrInstance });
</script>
