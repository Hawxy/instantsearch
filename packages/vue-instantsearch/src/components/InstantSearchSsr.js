import { h } from 'vue';

import { createInstantSearchComponent } from '../util/createInstantSearchComponent';

export default createInstantSearchComponent({
  name: 'AisInstantSearchSsr',
  inject: {
    $_ais_ssrInstantSearchInstance: {
      default() {
        throw new Error('`createServerRootMixin` is required when using SSR.');
      },
    },
  },
  data() {
    return {
      instantSearchInstance: this.$_ais_ssrInstantSearchInstance,
    };
  },
  render() {
    const defaultSlot = this.$slots.default;
    return h(
      'div',
      {
        class: {
          [this.suit()]: true,
          [this.suit('', 'ssr')]: true,
        },
      },
      defaultSlot ? defaultSlot() : undefined
    );
  },
});
