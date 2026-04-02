/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

import { mount } from '../../../test/utils';
import { __setState } from '../../composables/useWidget';
import Menu from '../Menu.vue';
import '../../../test/utils/sortedHtmlSerializer';

jest.mock('../../composables/useWidget');
jest.mock('../../composables/usePanel');

it('exposes send-event method for insights middleware', async () => {
  const sendEvent = jest.fn();
  __setState({
    sendEvent,
  });

  const wrapper = mount({
    components: { Menu },
    data() {
      return {
        props: {
          attribute: 'brand',
        },
      };
    },
    template: `
      <Menu v-bind="props">
        <template v-slot="{ sendEvent }">
          <div>
            <button @click="sendEvent()">Send Event</button>
          </div>
        </template>
      </Menu>
    `,
  });

  await wrapper.find('button').trigger('click');
  expect(sendEvent).toHaveBeenCalledTimes(1);
});
