/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

import { mount } from '../../../test/utils';
import { __setState } from '../../composables/useWidget';
import QueryRuleCustomData from '../QueryRuleCustomData.vue';
import '../../../test/utils/sortedHtmlSerializer';

jest.mock('../../composables/useWidget');

it('renders in a list of <pre> by default', () => {
  __setState({
    items: [{ text: 'this is user data' }, { text: 'this too!' }],
  });

  const wrapper = mount(QueryRuleCustomData);

  expect(wrapper.html()).toMatchInlineSnapshot(`
<div class="ais-QueryRuleCustomData">
  <div>
    <pre>
      {
  "text": "this is user data"
}
    </pre>
  </div>
  <div>
    <pre>
      {
  "text": "this too!"
}
    </pre>
  </div>
</div>
`);
});

it('gives the items to the main slot', () => {
  const items = [{ text: 'this is user data' }, { text: 'this too!' }];
  __setState({
    items,
  });

  mount(QueryRuleCustomData, {
    scopedSlots: {
      default(props) {
        expect(props).toEqual({
          items,
        });
      },
    },
  });
});

it('gives individual items to the item slot', () => {
  const items = [{ text: 'this is user data' }, { text: 'this too!' }];
  __setState({
    items,
  });

  const itemSlot = jest.fn();
  mount(QueryRuleCustomData, {
    scopedSlots: {
      item: itemSlot,
    },
  });

  expect(itemSlot).toHaveBeenCalledWith(
    expect.objectContaining({
      item: expect.objectContaining({ text: 'this is user data' }),
    })
  );
  expect(itemSlot).toHaveBeenCalledWith(
    expect.objectContaining({
      item: expect.objectContaining({ text: 'this too!' }),
    })
  );
});

it('accepts transformItems', () => {
  const { useWidget } = require('../../composables/useWidget');
  const transformItems = jest.fn();
  mount(QueryRuleCustomData, {
    propsData: {
      transformItems,
    },
  });

  // useWidget is called with the widgetParams computed
  const widgetParamsComputed = useWidget.mock.calls[useWidget.mock.calls.length - 1][1];
  expect(widgetParamsComputed.value).toEqual({
    transformItems,
  });
});
