/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

import { mount } from '../../../test/utils';
import { __setState } from '../../composables/useWidget';
import QueryRuleContext from '../QueryRuleContext';
import '../../../test/utils/sortedHtmlSerializer';

jest.mock('../../composables/useWidget');

it('is renderless', () => {
  __setState({
    items: ["this isn't used"],
  });
  const wrapper = mount(QueryRuleContext, {
    propsData: {
      trackedFilters: {},
    },
  });
  expect(wrapper.text()).toMatchInlineSnapshot(`""`);
});

it('accepts only trackedFilters and transformRuleContexts', () => {
  const trackedFilters = {};
  const transformRuleContexts = jest.fn();
  const wrapper = mount(QueryRuleContext, {
    propsData: {
      trackedFilters,
      transformRuleContexts,
      transformItems: "won't be transferred",
    },
  });

  expect(wrapper.vm.widgetParams).toEqual({
    trackedFilters,
    transformRuleContexts,
  });
});
