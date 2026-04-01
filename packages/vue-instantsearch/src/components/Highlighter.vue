<script lang="ts">
import { createHighlightComponent } from 'instantsearch-ui-components';
import {
  getHighlightedParts,
  getPropertyByPath,
  unescape,
} from 'instantsearch.js/es/lib/utils';
import { defineComponent, type PropType } from 'vue';

import { createElement, Fragment } from '../util/pragma';

const Highlight = createHighlightComponent({ createElement, Fragment });

export default defineComponent({
  name: 'AisHighlighter',
  props: {
    hit: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    attribute: {
      type: String,
      required: true,
    },
    highlightedTagName: {
      type: String,
      default: 'mark',
    },
    suit: {
      type: Function as PropType<(element?: string, modifier?: string) => string>,
      required: true,
    },
    highlightProperty: {
      type: String,
      required: true,
    },
    preTag: {
      type: String,
      required: true,
    },
    postTag: {
      type: String,
      required: true,
    },
  },
  render() {
    const property =
      getPropertyByPath(this.hit[this.highlightProperty], this.attribute) || [];
    const properties = Array.isArray(property) ? property : [property];

    const parts = properties.map((singleValue: any) =>
      getHighlightedParts(unescape(singleValue.value || '')).map(
        ({ value, isHighlighted }: { value: string; isHighlighted: boolean }) => ({
          value: value === ' ' ? '  ' : value,
          isHighlighted,
        })
      )
    );

    return createElement(Highlight, {
      classNames: {
        root: this.suit(),
        highlighted: this.suit('highlighted'),
      },
      highlightedTagName: this.highlightedTagName,
      nonHighlightedTagName: Fragment,
      parts,
    });
  },
});
</script>
