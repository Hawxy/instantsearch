/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */
import { runTestSuites } from '@instantsearch/tests/common';
import * as testSuites from '@instantsearch/tests/widgets';

import { h, defineComponent } from 'vue';

import { nextTick, mountApp } from '../../test/utils';
import { useWidget } from '../composables/useWidget';
import {
  AisInstantSearch,
  AisRefinementList,
  AisHierarchicalMenu,
  AisBreadcrumb,
  AisMenu,
  AisPagination,
  AisInfiniteHits,
  AisSearchBox,
  AisHits,
  AisIndex,
  AisRangeInput,
  AisHitsPerPage,
  AisClearRefinements,
  AisCurrentRefinements,
  AisToggleRefinement,
  AisSortBy,
  AisStats,
  AisRatingMenu,
  AisNumericMenu,
  AisPoweredBy,
  AisMenuSelect,
  AisDynamicWidgets,
} from '../instantsearch';

jest.unmock('instantsearch.js/es');

/**
 * prevent rethrowing InstantSearch errors, so tests can be asserted.
 * IRL this isn't needed, as the error doesn't stop execution.
 */
const GlobalErrorSwallower = defineComponent({
  setup() {
    const { instantSearchInstance } = useWidget({ connector: true });
    return { instantSearchInstance };
  },
  mounted() {
    (this as any).instantSearchInstance.on('error', () => {});
  },
  render() {
    return null;
  },
});

const testSetups = {
  async createRefinementListWidgetTests({
    instantSearchOptions,
    widgetParams,
  }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisRefinementList, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createHierarchicalMenuWidgetTests({
    instantSearchOptions,
    widgetParams,
  }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisHierarchicalMenu, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createBreadcrumbWidgetTests({ instantSearchOptions, widgetParams }) {
    // The passed `transformItems` prop is meant to apply only to the breadcrumb,
    // not the hierarchical menu
    // eslint-disable-next-line no-unused-vars
    const { transformItems, ...hierarchicalWidgetParams } = widgetParams;

    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisBreadcrumb, widgetParams),
            h(AisHierarchicalMenu, hierarchicalWidgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createMenuWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisMenu, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createPaginationWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisPagination, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createInfiniteHitsWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisSearchBox),
            h(AisInfiniteHits, { id: 'main-hits', ...widgetParams }, {
              item: ({ item: hit, sendEvent }) =>
                h(
                  'div',
                  { 'data-testid': `main-hits-top-level-${hit.__position}` },
                  [
                    hit.objectID,
                    h('button', {
                      'data-testid': `main-hits-convert-${hit.__position}`,
                      onClick: () => sendEvent('conversion', hit, 'Converted'),
                    }),
                    h('button', {
                      'data-testid': `main-hits-click-${hit.__position}`,
                      onClick: () => sendEvent('click', hit, 'Clicked'),
                    }),
                  ]
                ),
            }),
            h('div', { id: 'hits-with-defaults' }, [
              h(AisInfiniteHits, widgetParams),
            ]),
            h(AisIndex, { indexName: 'nested' }, () => [
              h(AisInfiniteHits, { id: 'nested-hits' }, {
                item: ({ item: hit, sendEvent }) =>
                  h(
                    'div',
                    { 'data-testid': `nested-hits-top-level-${hit.__position}` },
                    [
                      hit.objectID,
                      h('button', {
                        'data-testid': `nested-hits-click-${hit.__position}`,
                        onClick: () => sendEvent('click', hit, 'Clicked nested'),
                      }),
                    ]
                  ),
              }),
            ]),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createHitsWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisSearchBox),
            h(AisHits, { id: 'main-hits', ...widgetParams }, {
              item: ({ item: hit, sendEvent }) =>
                h(
                  'div',
                  { 'data-testid': `main-hits-top-level-${hit.__position}` },
                  [
                    hit.objectID,
                    h('button', {
                      'data-testid': `main-hits-convert-${hit.__position}`,
                      onClick: () => sendEvent('conversion', hit, 'Converted'),
                    }),
                    h('button', {
                      'data-testid': `main-hits-click-${hit.__position}`,
                      onClick: () => sendEvent('click', hit, 'Clicked'),
                    }),
                  ]
                ),
            }),
            h('div', { id: 'hits-with-defaults' }, [
              h(AisHits, widgetParams),
            ]),
            h(AisIndex, { indexName: 'nested' }, () => [
              h(AisHits, { id: 'nested-hits' }, {
                item: ({ item: hit, sendEvent }) =>
                  h(
                    'div',
                    { 'data-testid': `nested-hits-top-level-${hit.__position}` },
                    [
                      hit.objectID,
                      h('button', {
                        'data-testid': `nested-hits-click-${hit.__position}`,
                        onClick: () => sendEvent('click', hit, 'Clicked nested'),
                      }),
                    ]
                  ),
              }),
            ]),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createRangeInputWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisRangeInput, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  createInstantSearchWidgetTests({ instantSearchOptions }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    return {
      algoliaAgents: [
        `instantsearch.js (${
          require('../../../instantsearch.js/package.json').version
        })`,
        `Vue InstantSearch (${
          require('../../../vue-instantsearch/package.json').version
        })`,
        `Vue (${require('vue').version})`,
      ],
    };
  },
  async createHitsPerPageWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisHitsPerPage, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createClearRefinementsWidgetTests({
    instantSearchOptions,
    widgetParams,
  }) {
    const refinementListAttributes = Object.keys(
      instantSearchOptions.initialUiState?.indexName.refinementList || {}
    );

    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            ...refinementListAttributes.map((attribute) =>
              h(AisRefinementList, { attribute })
            ),
            h(AisCurrentRefinements),
            h(AisClearRefinements, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createCurrentRefinementsWidgetTests({
    instantSearchOptions,
    widgetParams,
  }) {
    mountApp(
      {
        render() { return h('form', {}, [
            h(AisInstantSearch, instantSearchOptions, [
              h(AisSearchBox),
              h(AisRefinementList, { attribute: 'brand' }),
              h(AisRefinementList, { operator: 'and', attribute: 'feature' }),
              h(AisHierarchicalMenu, {
                attributes: [
                  'hierarchicalCategories.lvl0',
                  'hierarchicalCategories.lvl1',
                  'hierarchicalCategories.lvl2',
                ],
              }),
              h(AisRangeInput, { attribute: 'price' }),
              h(AisCurrentRefinements, widgetParams),
              h(GlobalErrorSwallower),
            ]),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createRatingMenuWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisRatingMenu, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createNumericMenuWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisNumericMenu, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createToggleRefinementWidgetTests({
    instantSearchOptions,
    widgetParams,
  }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisToggleRefinement, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createSearchBoxWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisSearchBox, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createSortByWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisSortBy, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  async createStatsWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h('div', {}, [
            h(AisInstantSearch, instantSearchOptions, [
              h(AisSearchBox),
              h(AisStats, widgetParams),
              h(GlobalErrorSwallower),
            ]),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  createRelatedProductsWidgetTests() {
    throw new Error('RelatedProduct is not supported in Vue InstantSearch');
  },
  createFrequentlyBoughtTogetherWidgetTests() {
    throw new Error(
      'FrequentlyBoughtTogether is not supported in Vue InstantSearch'
    );
  },
  createTrendingItemsWidgetTests() {
    throw new Error('TrendingItems is not supported in Vue InstantSearch');
  },
  createLookingSimilarWidgetTests() {
    throw new Error('LookingSimilar is not supported in Vue InstantSearch');
  },
  createPoweredByWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisPoweredBy, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    return {
      flavor: 'vue-instantsearch',
    };
  },
  async createMenuSelectWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(AisMenuSelect, widgetParams),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );

    await nextTick();
  },
  createDynamicWidgetsWidgetTests({ instantSearchOptions, widgetParams }) {
    mountApp(
      {
        render() { return h(AisInstantSearch, instantSearchOptions, [
            h(
              AisDynamicWidgets,
              widgetParams,
              h(AisRefinementList, { attribute: 'brand' }),
              h(AisMenu, { attribute: 'category' }),
              h(AisHierarchicalMenu, {
                props: {
                  attributes: [
                    'hierarchicalCategories.lvl0',
                    'hierarchicalCategories.lvl1',
                  ],
                },
              })
            ),
            h(GlobalErrorSwallower),
          ]); },
      },
      document.body.appendChild(document.createElement('div'))
    );
  },
  createChatWidgetTests() {
    throw new Error('Chat is not supported in Vue InstantSearch');
  },
  createAutocompleteWidgetTests() {
    throw new Error('Autocomplete is not supported in Vue InstantSearch');
  },
  createFilterSuggestionsWidgetTests() {
    throw new Error('FilterSuggestions is not supported in Vue InstantSearch');
  },
};

const testOptions = {
  createRefinementListWidgetTests: {
    skippedTests: {
      'selects first item on submitting the search (with searchableSelectOnSubmit: true)': true,
    },
  },
  createHierarchicalMenuWidgetTests: undefined,
  createBreadcrumbWidgetTests: undefined,
  createMenuWidgetTests: undefined,
  createPaginationWidgetTests: undefined,
  createInfiniteHitsWidgetTests: undefined,
  createHitsWidgetTests: undefined,
  createRangeInputWidgetTests: undefined,
  createRatingMenuWidgetTests: undefined,
  createInstantSearchWidgetTests: undefined,
  createHitsPerPageWidgetTests: undefined,
  createClearRefinementsWidgetTests: undefined,
  createCurrentRefinementsWidgetTests: undefined,
  createToggleRefinementWidgetTests: undefined,
  createSearchBoxWidgetTests: {
    skippedTests: { 'searchAsYouType option': true },
  },
  createSortByWidgetTests: undefined,
  createStatsWidgetTests: undefined,
  createRelatedProductsWidgetTests: {
    skippedTests: {
      'RelatedProducts widget common tests': true,
    },
  },
  createFrequentlyBoughtTogetherWidgetTests: {
    skippedTests: { 'FrequentlyBoughtTogether widget common tests': true },
  },
  createTrendingItemsWidgetTests: {
    skippedTests: { 'TrendingItems widget common tests': true },
  },
  createLookingSimilarWidgetTests: {
    skippedTests: { 'LookingSimilar widget common tests': true },
  },
  createPoweredByWidgetTests: undefined,
  createDynamicWidgetsWidgetTests: undefined,
  createChatWidgetTests: {
    skippedTests: { 'Chat widget common tests': true },
  },
  createAutocompleteWidgetTests: {
    skippedTests: { 'Autocomplete widget common tests': true },
  },
  createFilterSuggestionsWidgetTests: {
    skippedTests: { 'FilterSuggestions widget common tests': true },
  },
};

describe('Common widget tests (Vue InstantSearch)', () => {
  runTestSuites({
    flavor: 'vue',
    testSuites,
    testSetups,
    testOptions,
  });
});
