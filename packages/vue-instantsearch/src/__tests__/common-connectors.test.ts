/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */
import { runTestSuites } from '@instantsearch/tests/common';
import * as testSuites from '@instantsearch/tests/connectors';
import {
  connectBreadcrumb,
  connectCurrentRefinements,
  connectHierarchicalMenu,
  connectHitsPerPage,
  connectMenu,
  connectNumericMenu,
  connectPagination,
  connectRatingMenu,
  connectRefinementList,
  connectToggleRefinement,
} from 'instantsearch.js/es/connectors/index.umd';
import { h, computed, defineComponent } from 'vue';

import { nextTick, mountApp } from '../../test/utils';
import { useWidget } from '../composables/useWidget';
import {
  AisInstantSearch,
  AisMenu,
  AisRefinementList,
} from '../instantsearch';
jest.unmock('instantsearch.js/es');

const testSetups = {
  async createRefinementListConnectorTests({
    instantSearchOptions,
    widgetParams,
  }) {
    const CustomRefinementList = createCustomWidget({
      connector: connectRefinementList,
      name: 'RefinementList',
      requiredProps: ['attribute'],
      urlValue: 'value',
      refineComponents: [
        (state) =>
          h(
            'form',
            {
              onSubmit: (event) => {
                state.refine(event.currentTarget.elements[0].value);
              },
            },
            [
              h('input', {
                type: 'text',
                'data-testid': 'RefinementList-refine-input',
              }),
            ]
          ),
      ],
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomRefinementList, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createHierarchicalMenuConnectorTests({
    instantSearchOptions,
    widgetParams,
  }) {
    const CustomHierarchicalMenu = createCustomWidget({
      connector: connectHierarchicalMenu,
      name: 'HierarchicalMenu',
      requiredProps: ['attributes'],
      urlValue: 'value',
      refineComponents: [
        (state) =>
          h(
            'form',
            {
              onSubmit: (event) => {
                state.refine(event.currentTarget.elements[0].value);
              },
            },
            [
              h('input', {
                type: 'text',
                'data-testid': 'HierarchicalMenu-refine-input',
              }),
            ]
          ),
      ],
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomHierarchicalMenu, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createBreadcrumbConnectorTests({ instantSearchOptions, widgetParams }) {
    const CustomBreadcrumb = createCustomWidget({
      connector: connectBreadcrumb,
      name: 'Breadcrumb',
      requiredProps: ['attributes'],
      urlValue: 'Apple > iPhone',
      refineValue: 'Apple',
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomBreadcrumb, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createMenuConnectorTests({ instantSearchOptions, widgetParams }) {
    const CustomMenu = createCustomWidget({
      connector: connectMenu,
      name: 'Menu',
      requiredProps: ['attribute'],
      urlValue: 'value',
      refineComponents: [
        (state) =>
          h(
            'form',
            {
              onSubmit: (event) => {
                state.refine(event.currentTarget.elements[0].value);
              },
            },
            [
              h('input', {
                type: 'text',
                'data-testid': 'Menu-refine-input',
              }),
            ]
          ),
      ],
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomMenu, widgetParams),
            h(AisMenu, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createPaginationConnectorTests({ instantSearchOptions, widgetParams }) {
    const CustomPagination = createCustomWidget({
      connector: connectPagination,
      name: 'Pagination',
      urlValue: 10,
      refineValue: (state) => (state.currentRefinement === 0 ? 1 : 0),
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomPagination, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createCurrentRefinementsConnectorTests({
    instantSearchOptions,
    widgetParams,
  }) {
    const CustomCurrentRefinements = createCustomWidget({
      connector: connectCurrentRefinements,
      name: 'CurrentRefinements',
      urlValue: {
        attribute: 'brand',
        type: 'disjunctive',
        value: 'Apple',
        label: 'Apple',
      },
      refineValue: {
        attribute: 'brand',
        type: 'disjunctive',
        value: 'Samsung',
        label: 'Samsung',
      },
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomCurrentRefinements, widgetParams),
            h(AisRefinementList, { attribute: 'brand' }),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createHitsPerPageConnectorTests({
    instantSearchOptions,
    widgetParams,
  }) {
    const CustomHitsPerPage = createCustomWidget({
      connector: connectHitsPerPage,
      name: 'HitsPerPage',
      requiredProps: ['items'],
      urlValue: 12,
      refineValue: (state) => (state.value === 10 ? 5 : 10),
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomHitsPerPage, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createNumericMenuConnectorTests({
    instantSearchOptions,
    widgetParams,
  }) {
    const CustomNumericMenu = createCustomWidget({
      connector: connectNumericMenu,
      name: 'NumericMenu',
      requiredProps: ['attribute', 'items'],
      urlValue: encodeURI('{ "start": 500 }'),
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomNumericMenu, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createRatingMenuConnectorTests({ instantSearchOptions, widgetParams }) {
    const CustomRatingMenu = createCustomWidget({
      connector: connectRatingMenu,
      name: 'RatingMenu',
      requiredProps: ['attribute'],
      urlValue: encodeURI('5'),
      refineValue: 5,
    });

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomRatingMenu, widgetParams),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createToggleRefinementConnectorTests({
    instantSearchOptions,
    widgetParams,
  }) {
    const CustomToggleRefinement = createCustomWidget({
      name: 'ToggleRefinement',
      connector: connectToggleRefinement,
      requiredProps: ['attribute', 'label'],
      refineValue: (state) => state.value,
    });

    // Label is required in Vue
    const props = {
      ...widgetParams,
      label: 'Free Shipping',
    };

    mountApp(
      {
        render() {
          return h(AisInstantSearch, instantSearchOptions, () => [
            h(CustomToggleRefinement, props),
          ]);
        },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  createRelatedProductsConnectorTests: () => {},
  createFrequentlyBoughtTogetherConnectorTests: () => {},
  createTrendingItemsConnectorTests: () => {},
  createLookingSimilarConnectorTests: () => {},
  createChatConnectorTests: () => {},
  createFilterSuggestionsConnectorTests: () => {},
};

function createCustomWidget({
  connector,
  name,
  urlValue,
  refineValue,
  requiredProps = [],
  refineComponents = [
    (state) =>
      h(
        'button',
        {
          'data-testid': `${name}-refine`,
          onClick: () => {
            state.refine(
              typeof refineValue === 'function'
                ? refineValue(state)
                : refineValue
            );
          },
        },
        'REFINE'
      ),
  ],
}) {
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
          ? h('div', {}, [
              h(
                'a',
                {
                  'data-testid': `${name}-link`,
                  href: state.value.createURL(urlValue),
                },
                'LINK'
              ),
              ...refineComponents.map((component) => component(state.value)),
            ])
          : null;
    },
  });
}

const testOptions = {
  createHierarchicalMenuConnectorTests: undefined,
  createBreadcrumbConnectorTests: undefined,
  createRefinementListConnectorTests: undefined,
  createMenuConnectorTests: undefined,
  createPaginationConnectorTests: undefined,
  createCurrentRefinementsConnectorTests: undefined,
  createHitsPerPageConnectorTests: undefined,
  createNumericMenuConnectorTests: undefined,
  createRatingMenuConnectorTests: undefined,
  createToggleRefinementConnectorTests: undefined,
  createRelatedProductsConnectorTests: {
    skippedTests: {
      options: true,
      state: true,
    },
  },
  createFrequentlyBoughtTogetherConnectorTests: {
    skippedTests: {
      options: true,
      state: true,
    },
  },
  createTrendingItemsConnectorTests: {
    skippedTests: {
      options: true,
      state: true,
    },
  },
  createLookingSimilarConnectorTests: {
    skippedTests: {
      options: true,
      state: true,
    },
  },
  createChatConnectorTests: { skippedTests: { options: true } },
  createFilterSuggestionsConnectorTests: {
    skippedTests: {
      options: true,
    },
  },
};

describe('Common connector tests (Vue InstantSearch)', () => {
  runTestSuites({
    flavor: 'vue',
    testSuites,
    testSetups,
    testOptions,
  });
});
