/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

import { nextTick } from 'vue';
import { mount } from '../../../test/utils';
import {
  __setIndexHelper,
  __setIndexResults,
} from '../../composables/useWidget';
import StateResults from '../StateResults.vue';
jest.mock('../../composables/useWidget');
import '../../../test/utils/sortedHtmlSerializer';

it('renders explanation if no slot is used', async () => {
  __setIndexResults({
    query: 'this is the quer',
    hits: [
      { objectID: '1', name: 'one' },
      { objectID: '2', name: 'two' },
    ],
    page: 1,
  });
  __setIndexHelper({
    state: {
      query: 'this is the query',
    },
  });
  const wrapper = mount(StateResults);
  await nextTick();
  expect(wrapper.html()).toMatchSnapshot();
});

it("doesn't render if no results", async () => {
  __setIndexResults(null);
  const wrapper = mount(StateResults);
  await nextTick();
  expect(wrapper).vueToHaveEmptyHTML();
});

it('gives state & results to default slot', async () => {
  const results = {
    query: 'q',
    hits: [
      { objectID: '1', name: 'one' },
      { objectID: '2', name: 'two' },
    ],
    page: 1,
  };
  const state = {
    query: 'something',
    disjunctiveFacetsRefinements: {},
    page: 1,
  };

  __setIndexResults(results);
  __setIndexHelper({ state });

  const wrapper = mount(StateResults, {
    scopedSlots: {
      default: (props) => {
        expect(props).toEqual(expect.objectContaining(results));
        expect(props.results).toEqual(results);
        expect(props.state).toEqual(state);
        expect(props.status).toEqual('idle');
        expect(props.error).toEqual(undefined);
      },
    },
  });
  await nextTick();
});

it('allows default slot to render whatever they want', async () => {
  const results = {
    query: 'hi',
    hits: [
      { objectID: '1', name: 'one' },
      { objectID: '2', name: 'two' },
    ],
    page: 1,
  };
  const state = {
    query: 'hi!',
  };
  __setIndexResults(results);
  __setIndexHelper({ state });

  const wrapper = mount({
    components: { StateResults },
    template: `
      <StateResults>
        <template v-slot="{ state: { query }, results: { page } }">
          <p v-if="query">
            Query is here, page is {{ page }}
          </p>
          <p v-else>
            There's no query
          </p>
        </template>
      </StateResults>
    `,
  });

  await nextTick();

  expect(wrapper.html()).toMatchInlineSnapshot(`
    <div class="ais-StateResults">
      <p>
        Query is here, page is 1
      </p>
    </div>
  `);
});

it('allows default slot to render whatever they want (truthy query)', async () => {
  const results = {
    query: 'hi',
    hits: [
      { objectID: '1', name: 'one' },
      { objectID: '2', name: 'two' },
    ],
    page: 1,
  };
  const state = {
    query: 'hi!',
  };
  __setIndexResults(results);
  __setIndexHelper({ state });

  const wrapper = mount({
    components: { StateResults },
    template: `
      <StateResults>
        <template v-slot="{ results: { query } }">
          <p v-if="query">
            Query is here
          </p>
          <p v-else>
            There's no query
          </p>
        </template>
      </StateResults>
    `,
  });

  await nextTick();

  expect(wrapper.html()).toMatchInlineSnapshot(`
    <div class="ais-StateResults">
      <p>
        Query is here
      </p>
    </div>
  `);
});

it('allows default slot to render whatever they want (falsy query)', async () => {
  const results = {
    query: '',
    hits: [
      { objectID: '1', name: 'one' },
      { objectID: '2', name: 'two' },
    ],
    page: 1,
  };
  const state = {
    query: 'hi!',
  };
  __setIndexResults(results);
  __setIndexHelper({ state });

  const wrapper = mount({
    components: { StateResults },
    template: `
      <StateResults>
        <template v-slot="{ results: { query } }">
          <p v-if="query">
            Query is here
          </p>
          <p v-else>
            There's no query
          </p>
        </template>
      </StateResults>
    `,
  });

  await nextTick();

  expect(wrapper.html()).toMatchInlineSnapshot(`
    <div class="ais-StateResults">
      <p>
        There's no query
      </p>
    </div>
  `);
});

describe('legacy spread props', () => {
  it('allows default slot to render whatever they want (truthy query)', async () => {
    __setIndexResults({
      query: 'q',
      hits: [
        { objectID: '1', name: 'one' },
        { objectID: '2', name: 'two' },
      ],
      page: 1,
    });
    __setIndexHelper({ state: {} });

    const wrapper = mount({
      components: { StateResults },
      template: `
        <StateResults>
          <template v-slot="{ query }">
            <p v-if="query">
              Query is here
            </p>
            <p v-else>
              There's no query
            </p>
          </template>
        </StateResults>
      `,
    });

    expect(wrapper.html()).toMatchInlineSnapshot(``);
  });

  it('allows default slot to render whatever they want (falsy query)', async () => {
    __setIndexResults({
      query: '',
      hits: [
        { objectID: '1', name: 'one' },
        { objectID: '2', name: 'two' },
      ],
      page: 1,
    });
    __setIndexHelper({ state: {} });

    const wrapper = mount({
      components: { StateResults },
      template: `
        <StateResults>
          <template v-slot="{ query }">
            <p v-if="query">
              Query is here
            </p>
            <p v-else>
              There's no query
            </p>
          </template>
        </StateResults>
      `,
    });

    expect(wrapper.html()).toMatchInlineSnapshot(``);
  });
});
