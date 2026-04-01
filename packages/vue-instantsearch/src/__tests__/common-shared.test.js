/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */
import { runTestSuites } from '@instantsearch/tests/common';
import * as testSuites from '@instantsearch/tests/shared';
import {
  connectMenu,
  connectPagination,
} from 'instantsearch.js/es/connectors/index.umd';

import { nextTick, mountApp } from '../../test/utils';
import {
  AisBreadcrumb,
  AisHierarchicalMenu,
  AisHits,
  AisInstantSearch,
  AisMenu,
  AisPagination,
} from '../instantsearch';
import { useWidget } from '../composables/useWidget';
jest.unmock('instantsearch.js/es');
import { h, computed, defineComponent } from 'vue';

const testSetups = {
  async createSharedTests({ instantSearchOptions, widgetParams }) {
    const CustomMenu = createCustomWidget({
      connector: connectMenu,
      name: 'Menu',
      requiredProps: ['attribute'],
      urlValue: 'value',
    });
    const CustomPagination = createCustomWidget({
      connector: connectPagination,
      name: 'Pagination',
      urlValue: 10,
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomMenu, widgetParams.menu),
            h(AisHierarchicalMenu, widgetParams.hierarchicalMenu),
            h(AisMenu, widgetParams.menu),
            h(AisBreadcrumb, {
              attributes: widgetParams.hierarchicalMenu.attributes,
            }),
            h(AisHits, widgetParams.hits),
            h(CustomPagination, widgetParams.pagination),
            h(AisPagination, widgetParams.pagination),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
};

function createCustomWidget({ connector, name, urlValue, requiredProps = [] }) {
  return defineComponent({
    name: `Custom${name}`,
    props: Object.fromEntries(
      requiredProps.map((prop) => [prop, { required: true }])
    ),
    setup(props) {
      const widgetParams = computed(() =>
        Object.fromEntries(
          requiredProps.map((prop) => [prop, props[prop]])
        )
      );
      const { state } = useWidget({ connector }, widgetParams);
      return () =>
        state.value
          ? h(
              'a',
              {
                'data-testid': `${name}-link`,
                href: state.value.createURL(urlValue),
              },
              'LINK'
            )
          : null;
    },
  });
}

const testOptions = {
  createSharedTests: undefined,
};

describe('Common shared tests (Vue InstantSearch)', () => {
  runTestSuites({
    flavor: 'vue',
    testSuites,
    testSetups,
    testOptions,
  });
});
