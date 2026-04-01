<template>
  <div v-if="state" :class="suit()">
    <slot
      :current-refinement="currentRefinement"
      :is-search-stalled="state.isSearchStalled"
      :refine="state.refine"
    >
      <search-input
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @reset="$emit('reset')"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :show-loading-indicator="showLoadingIndicator"
        :should-show-loading-indicator="state.isSearchStalled"
        :ignore-composition-events="ignoreCompositionEvents"
        :submit-title="submitTitle"
        :reset-title="resetTitle"
        :class-names="classNames"
        v-model="currentRefinement"
        ref="searchInput"
      >
        <template #loading-indicator>
          <slot name="loading-indicator" />
        </template>

        <template #submit-icon>
          <slot name="submit-icon" />
        </template>

        <template #reset-icon>
          <slot name="reset-icon" />
        </template>
      </search-input>
    </slot>
  </div>
</template>

<script>
import { connectSearchBox } from 'instantsearch.js/es/connectors/index.umd';

import { createSuitMixin } from '../mixins/suit';
import { createWidgetMixin } from '../mixins/widget';

import SearchInput from './SearchInput.vue';

export default {
  name: 'AisSearchBox',
  mixins: [
    createWidgetMixin(
      {
        connector: connectSearchBox,
      },
      {
        $$widgetType: 'ais.searchBox',
      }
    ),
    createSuitMixin({ name: 'SearchBox' }),
  ],
  components: {
    SearchInput,
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    showLoadingIndicator: {
      type: Boolean,
      default: true,
    },
    ignoreCompositionEvents: {
      type: Boolean,
      default: false,
    },
    submitTitle: {
      type: String,
      default: 'Submit the search query',
    },
    resetTitle: {
      type: String,
      default: 'Clear the search query',
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    queryHook: {
      type: Function,
      default: undefined,
    },
  },
  emits: ['focus', 'blur', 'reset', 'update:modelValue'],
  data() {
    return {
      localValue: '',
    };
  },
  computed: {
    widgetParams() {
      return {
        queryHook: this.queryHook,
      };
    },
    isControlled() {
      return typeof this.modelValue !== 'undefined';
    },
    model() {
      return this.modelValue;
    },
    currentRefinement: {
      get() {
        // if the input is controlled, but not up to date
        // this means it didn't search, and we should pretend it was `set`
        if (this.isControlled && this.model !== this.localValue) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.localValue = this.model;
          this.$emit('update:modelValue', this.model);
          this.state.refine(this.model);
        }

        // we return the local value if the input is focused to avoid
        // concurrent updates when typing
        const { searchInput } = this.$refs;
        if (searchInput && searchInput.isFocused()) {
          return this.localValue;
        }

        return this.model || this.state.query || '';
      },
      set(val) {
        this.localValue = val;
        this.state.refine(val);
        if (this.isControlled) {
          this.$emit('update:modelValue', val);
        }
      },
    },
  },
};
</script>
