/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

/* eslint-disable jest/no-done-callback */
import {
  AlgoliaSearchHelper,
  SearchParameters,
  SearchResults,
} from 'algoliasearch-helper';
import { createI18n } from 'vue-i18n';
import { createStore } from 'vuex';

import { mount, createSSRApp } from '../../../test/utils';
import Configure from '../../components/Configure';
import Index from '../../components/Index';
import InstantSearchSsr from '../../components/InstantSearchSsr';
import SearchBox from '../../components/SearchBox.vue';
import { useWidget } from '../../composables/useWidget';
import { createServerRootMixin } from '../createServerRootMixin';
import { createFakeClient } from '../testutils/client';
import { createSerializedState } from '../testutils/helper';
import { renderCompat } from '../vue-compat';

jest.unmock('instantsearch.js/es');

function renderToString(app) {
  return require('@vue/server-renderer').renderToString(app);
}

const forceIsServerMixin = {
  beforeCreate() {
    Object.setPrototypeOf(
      this,
      new Proxy(Object.getPrototypeOf(this), {
        get: (target, key, receiver) =>
          key === '$isServer' ? true : Reflect.get(target, key, receiver),
      })
    );
  },
};

process.env.VUE_ENV = 'server';

describe('createServerRootMixin', () => {
  describe('creation', () => {
    it('requires searchClient', () => {
      expect(() =>
        createSSRApp({
          mixins: [
            createServerRootMixin({
              searchClient: undefined,
              indexName: 'lol',
            }),
          ],
        })
      ).toThrowErrorMatchingInlineSnapshot(`
"The \`searchClient\` option is required.

See documentation: https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/"
`);
    });

    it('creates an instantsearch instance on "data"', () => {
      const App = {
        mixins: [
          createServerRootMixin({
            searchClient: createFakeClient(),
            indexName: 'lol',
          }),
        ],
        render: () => null,
      };

      const wrapper = mount(App);
      expect(wrapper.vm.$data).toEqual({
        instantsearch: expect.objectContaining({
          start: expect.any(Function),
        }),
      });
    });

    it('provides the instantsearch instance', (done) => {
      const App = {
        mixins: [
          createServerRootMixin({
            searchClient: createFakeClient(),
            indexName: 'myIndexName',
          }),
        ],
        template: `<div><slot /></div>`,
      };

      const Child = {
        setup() {
          const { instantSearchInstance } = useWidget({ connector: true });
          return { instantSearchInstance };
        },
        mounted() {
          expect(this.instantSearchInstance).toEqual(
            expect.objectContaining({
              start: expect.any(Function),
              dispose: expect.any(Function),
              mainIndex: expect.any(Object),
              addWidgets: expect.any(Function),
              removeWidgets: expect.any(Function),
            })
          );
          done();
        },
        render() {
          return null;
        },
      };

      mount({
        components: { App, InstantSearchSsr, Child },
        template: `
          <App>
            <InstantSearchSsr>
              <Child />
            </InstantSearchSsr>
          </App>
        `,
      });
    });
  });

  describe('findResultsState', () => {
    it('provides findResultsState', () => {
      return new Promise((resolve) => {
        const app = createSSRApp({
          mixins: [
            forceIsServerMixin,
            createServerRootMixin({
              searchClient: createFakeClient(),
              indexName: 'hello',
            }),
          ],
          render: renderCompat((h) => h(InstantSearchSsr, {})),
          created() {
            expect(typeof this.instantsearch.findResultsState).toBe('function');
            resolve();
          },
        });

        renderToString(app);
      });
    });

    it('requires renderToString', async () => {
      const searchClient = createFakeClient();

      const app = {
        mixins: [
          forceIsServerMixin,
          createServerRootMixin({
            searchClient,
            indexName: 'hello',
          }),
        ],
        render: renderCompat((h) =>
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
        serverPrefetch() {
          expect(() =>
            this.instantsearch.findResultsState({ component: this })
          ).toThrowErrorMatchingInlineSnapshot(
            `"findResultsState requires \`renderToString: (component) => Promise<string>\` in the first argument."`
          );
        },
      };

      const wrapper = createSSRApp({
        mixins: [forceIsServerMixin],
        render: renderCompat((h) => h(app)),
      });

      await renderToString(wrapper);
    });

    it('detects child widgets', async () => {
      const searchClient = createFakeClient();
      let mainIndex;

      const app = {
        mixins: [
          forceIsServerMixin,
          createServerRootMixin({
            searchClient,
            indexName: 'hello',
          }),
        ],
        render: renderCompat((h) =>
          /**
           * This code triggers this warning in Vue 3:
           * > Non-function value encountered for default slot. Prefer function slots for better performance.
           *
           * To fix it, replace the third argument
           * > [h(...), h(...)]
           * with
           * > { default: () => [h(...), h(...)] }
           *
           * but it's not important (and not compatible in vue2), we're leaving it as-is.
           */
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
        serverPrefetch() {
          return this.instantsearch.findResultsState({
            component: this,
            renderToString,
          });
        },
        created() {
          mainIndex = this.instantsearch.mainIndex;
        },
      };

      const wrapper = createSSRApp({
        mixins: [forceIsServerMixin],
        render: renderCompat((h) => h(app)),
      });

      await renderToString(wrapper);

      expect(mainIndex.getWidgetUiState({})).toMatchInlineSnapshot(`
        {
          "hello": {
            "configure": {
              "hitsPerPage": 100,
            },
          },
        }
      `);

      expect(searchClient.search).toHaveBeenCalledTimes(1);
      expect(searchClient.search.mock.calls[0][0]).toMatchInlineSnapshot(`
        [
          {
            "indexName": "hello",
            "params": {
              "hitsPerPage": 100,
              "query": "",
            },
          },
        ]
      `);
    });

    it('returns correct results state', () => {
      const searchClient = createFakeClient();

      return new Promise((resolve, reject) => {
        const app = {
          mixins: [
            forceIsServerMixin,
            createServerRootMixin({
              searchClient,
              indexName: 'hello',
            }),
          ],
          render: renderCompat((h) =>
            h(InstantSearchSsr, {}, [
              h(Configure, {
                attrs: {
                  hitsPerPage: 100,
                },
              }),
              h(SearchBox),
              h(
                Index,
                {
                  attrs: {
                    indexName: 'hello',
                    indexId: 'nestedIndex',
                  },
                },
                []
              ),
            ])
          ),
          async serverPrefetch() {
            const state = await this.instantsearch.findResultsState({
              component: this,
              renderToString,
            });

            try {
              expect(state).toEqual({
                hello: expect.objectContaining({}),
                nestedIndex: expect.objectContaining({}),
              });

              expect(state.hello).toEqual({
                requestParams: [
                  {
                    hitsPerPage: 100,
                    query: '',
                  },
                ],
                results: [
                  {
                    query: '',
                  },
                ],
                state: {
                  disjunctiveFacets: [],
                  disjunctiveFacetsRefinements: {},
                  facets: [],
                  facetsExcludes: {},
                  facetsRefinements: {},
                  hierarchicalFacets: [],
                  hierarchicalFacetsRefinements: {},
                  hitsPerPage: 100,
                  index: 'hello',
                  numericRefinements: {},
                  query: '',
                  tagRefinements: [],
                },
              });

              // Parent's widgets state should not be merged into nested index state
              expect(state.nestedIndex).toEqual({
                requestParams: [
                  {
                    hitsPerPage: 100,
                    query: '',
                  },
                ],
                results: [
                  {
                    query: '',
                  },
                ],
                state: {
                  disjunctiveFacets: [],
                  disjunctiveFacetsRefinements: {},
                  facets: [],
                  facetsExcludes: {},
                  facetsRefinements: {},
                  hierarchicalFacets: [],
                  hierarchicalFacetsRefinements: {},
                  index: 'hello',
                  numericRefinements: {},
                  tagRefinements: [],
                },
              });
            } catch (err) {
              reject(err);
            }

            resolve();
            return state;
          },
        };

        const wrapper = createSSRApp({
          mixins: [forceIsServerMixin],
          render: renderCompat((h) => h(app)),
        });

        renderToString(wrapper);
      });
    });

    it('forwards router', async () => {
      const searchClient = createFakeClient();
      const Router4 = require('vue-router');
      const router = Router4.createRouter({
        history: Router4.createMemoryHistory(),
        routes: [{ path: '', component: {} }],
      });

      // there are two renders of App, each with an assertion
      expect.assertions(2);

      const App = {
        mixins: [
          forceIsServerMixin,
          createServerRootMixin({
            searchClient,
            indexName: 'hello',
          }),
        ],
        data() {
          expect(this.$router).toBe(router);
          return {};
        },
        render: renderCompat((h) =>
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
        serverPrefetch() {
          return this.instantsearch.findResultsState({
            component: this,
            renderToString,
          });
        },
      };

      const wrapper = createSSRApp({
        mixins: [forceIsServerMixin],
        render: renderCompat((h) => h(App)),
      });
      wrapper.use(router);

      await renderToString(wrapper);
    });

    it('forwards vuex', async () => {
      const searchClient = createFakeClient();

      const store = createStore();

      // there are two renders of App, each with an assertion
      expect.assertions(2);

      const App = {
        mixins: [
          forceIsServerMixin,
          createServerRootMixin({
            searchClient,
            indexName: 'hello',
          }),
        ],
        data() {
          expect(this.$store).toBe(store);
          return {};
        },
        render: renderCompat((h) =>
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
        serverPrefetch() {
          return this.instantsearch.findResultsState({
            component: this,
            renderToString,
          });
        },
      };

      const wrapper = createSSRApp({
        mixins: [forceIsServerMixin],
        render: renderCompat((h) => h(App)),
      });

      wrapper.use(store);

      await renderToString(wrapper);
    });

    it('forwards i18n', async () => {
      const searchClient = createFakeClient();

      const i18n = createI18n();

      // there are two renders of App, each with an assertion
      expect.assertions(2);

      const App = {
        mixins: [
          forceIsServerMixin,
          createServerRootMixin({
            searchClient,
            indexName: 'hello',
          }),
        ],
        data() {
          expect(this.$i18n).toBe(i18n.global);
          return {};
        },
        render: renderCompat((h) =>
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
        serverPrefetch() {
          return this.instantsearch.findResultsState({
            component: this,
            renderToString,
          });
        },
      };

      const wrapper = createSSRApp({
        mixins: [forceIsServerMixin],
        render: renderCompat((h) => h(App)),
      });

      wrapper.use(i18n);

      await renderToString(wrapper);
    });
  });

  describe('hydrate', () => {
    it('sets _initialResults', () => {
      const serialized = createSerializedState();

      const app = {
        mixins: [
          createServerRootMixin({
            searchClient: createFakeClient(),
            indexName: 'hello',
          }),
        ],
        render: renderCompat((h) =>
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
        // in test, beforeCreated doesn't have $data yet, but IRL it does
        created() {
          this.instantsearch.hydrate({
            hello: serialized,
          });
        },
      };

      const {
        vm: { instantsearch },
      } = mount(app);

      expect(instantsearch._initialResults).toEqual(
        expect.objectContaining({
          hello: {
            state: expect.any(Object),
            results: expect.any(Object),
          },
        })
      );

      expect(instantsearch._initialResults.hello).toEqual(
        expect.objectContaining(serialized)
      );
    });

    it('inits the main index', () => {
      const serialized = createSerializedState();

      const app = {
        mixins: [
          createServerRootMixin({
            searchClient: createFakeClient(),
            indexName: 'hello',
          }),
        ],
        render: renderCompat((h) =>
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
      };

      const {
        vm: { instantsearch },
      } = mount(app);

      expect(instantsearch.mainIndex.getHelper()).toBe(null);

      instantsearch.hydrate({
        hello: serialized,
      });

      expect(instantsearch.mainIndex.getHelper()).toEqual(
        expect.any(AlgoliaSearchHelper)
      );
      expect(instantsearch.mainIndex.getHelper()).not.toBeNull();
    });

    it('sets helper & mainHelper', () => {
      const serialized = createSerializedState();

      const app = {
        mixins: [
          createServerRootMixin({
            searchClient: createFakeClient(),
            indexName: 'hello',
          }),
        ],
        render: renderCompat((h) =>
          h(InstantSearchSsr, {}, [
            h(Configure, {
              attrs: {
                hitsPerPage: 100,
              },
            }),
            h(SearchBox),
          ])
        ),
      };

      const {
        vm: { instantsearch },
      } = mount(app);

      expect(instantsearch.helper).toBe(null);
      expect(instantsearch.mainHelper).toBe(null);

      instantsearch.hydrate({
        hello: serialized,
      });

      expect(instantsearch.helper).toEqual(expect.any(AlgoliaSearchHelper));
      expect(instantsearch.mainHelper).toEqual(expect.any(AlgoliaSearchHelper));
    });
  });

  describe('__forceRender', () => {
    it('calls render on widget', () => {
      let instantSearchInstance;
      mount({
        mixins: [
          createServerRootMixin({
            searchClient: createFakeClient(),
            indexName: 'lol',
          }),
        ],
        created() {
          instantSearchInstance = this.instantsearch;
        },
        render() {},
      });

      const widget = {
        init: jest.fn(),
        render: jest.fn(),
      };

      instantSearchInstance.hydrate({
        lol: createSerializedState(),
      });

      instantSearchInstance.__forceRender(
        widget,
        instantSearchInstance.mainIndex
      );

      expect(widget.init).toHaveBeenCalledTimes(0);
      expect(widget.render).toHaveBeenCalledTimes(1);

      const renderArgs = widget.render.mock.calls[0][0];

      expect(renderArgs).toMatchInlineSnapshot(
        {
          helper: expect.anything(),
          results: expect.anything(),
          scopedResults: expect.arrayContaining([
            expect.objectContaining({
              helper: expect.anything(),
              indexId: expect.any(String),
              results: expect.anything(),
            }),
          ]),
          parent: expect.anything(),
          state: expect.anything(),
          instantSearchInstance: expect.anything(),
        },
        `
        {
          "createURL": [Function],
          "helper": Anything,
          "instantSearchInstance": Anything,
          "parent": Anything,
          "results": Anything,
          "scopedResults": ArrayContaining [
            ObjectContaining {
              "helper": Anything,
              "indexId": Any<String>,
              "results": Anything,
            },
          ],
          "searchMetadata": {
            "isSearchStalled": false,
          },
          "state": Anything,
          "templatesConfig": {},
        }
      `
      );
    });

    it('uses the results passed to hydrate for rendering', () => {
      let instantSearchInstance;
      mount({
        mixins: [
          createServerRootMixin({
            searchClient: createFakeClient(),
            indexName: 'lol',
          }),
        ],
        created() {
          instantSearchInstance = this.instantsearch;
        },
        render() {},
      });

      const widget = {
        init: jest.fn(),
        render: jest.fn(),
      };

      const resultsState = createSerializedState();
      const state = new SearchParameters(resultsState.state);
      const localState = new SearchParameters({
        index: 'lol',
      });
      const results = new SearchResults(state, resultsState.results);

      instantSearchInstance.hydrate({
        lol: resultsState,
      });

      instantSearchInstance.__forceRender(
        widget,
        instantSearchInstance.mainIndex
      );

      expect(widget.init).toHaveBeenCalledTimes(0);
      expect(widget.render).toHaveBeenCalledTimes(1);

      const renderArgs = widget.render.mock.calls[0][0];

      // renders with local state, not the one from results
      expect(renderArgs.state).toEqual(localState);
      results._state = localState;
      expect(renderArgs.results).toEqual(results);
      expect(renderArgs.scopedResults).toHaveLength(1);
      expect(renderArgs.scopedResults[0].indexId).toEqual('lol');
      expect(renderArgs.scopedResults[0].results).toEqual(results);
    });

    describe('createURL', () => {
      it('returns # if instantsearch has no routing', () => {
        let instantSearchInstance;
        mount({
          mixins: [
            createServerRootMixin({
              searchClient: createFakeClient(),
              indexName: 'lol',
            }),
          ],
          created() {
            instantSearchInstance = this.instantsearch;
          },
          render() {},
        });

        const widget = {
          init: jest.fn(),
          render: jest.fn(),
        };

        instantSearchInstance.hydrate({
          lol: createSerializedState(),
        });

        instantSearchInstance.__forceRender(
          widget,
          instantSearchInstance.mainIndex
        );

        const renderArgs = widget.render.mock.calls[0][0];

        expect(renderArgs.createURL()).toBe('#');
      });

      it('allows for widgets without getWidgetState', () => {
        let instantSearchInstance;
        mount({
          mixins: [
            createServerRootMixin({
              searchClient: createFakeClient(),
              indexName: 'lol',
            }),
          ],
          created() {
            instantSearchInstance = this.instantsearch;
          },
          render() {},
        });

        const widget = {
          init: jest.fn(),
          render: jest.fn(),
          getWidgetState(uiState) {
            return uiState;
          },
        };

        const widgetWithoutGetWidgetState = {
          init: jest.fn(),
          render: jest.fn(),
        };

        instantSearchInstance.hydrate({
          lol: createSerializedState(),
        });

        instantSearchInstance.addWidgets([widget, widgetWithoutGetWidgetState]);

        instantSearchInstance.__forceRender(
          widget,
          instantSearchInstance.mainIndex
        );

        const renderArgs = widget.render.mock.calls[0][0];

        expect(renderArgs.createURL()).toBe('#');
      });
    });
  });
});
