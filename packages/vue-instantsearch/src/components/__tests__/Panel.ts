/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

import { nextTick } from 'vue';
import { mount } from '../../../test/utils';
import { __setCanRefine } from '../../composables/usePanel';
import Panel from '../Panel.vue';
import '../../../test/utils/sortedHtmlSerializer';

jest.mock('../../composables/usePanel');

describe('default render', () => {
  const defaultSlot = `
    <p>This is the body of the Panel.</p>
  `;

  it('renders correctly', () => {
    const wrapper = mount(Panel, {
      slots: {
        default: defaultSlot,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly without refinement', async () => {
    __setCanRefine(false);

    const wrapper = mount(Panel, {
      slots: {
        default: defaultSlot,
      },
    });

    await nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('passes data without refinement', async () => {
    __setCanRefine(false);

    const defaultScopedSlot = jest.fn();
    const headerScopedSlot = jest.fn();
    const footerScopedSlot = jest.fn();
    const wrapper = mount(Panel, {
      scopedSlots: {
        default: defaultScopedSlot,
        header: headerScopedSlot,
        footer: footerScopedSlot,
      },
    });

    await nextTick();

    expect(defaultScopedSlot).toHaveBeenCalledWith({ hasRefinements: false });
    expect(headerScopedSlot).toHaveBeenCalledWith({ hasRefinements: false });
    expect(footerScopedSlot).toHaveBeenCalledWith({ hasRefinements: false });
  });

  it('passes data with refinement', async () => {
    __setCanRefine(true);

    const defaultScopedSlot = jest.fn();
    const headerScopedSlot = jest.fn();
    const footerScopedSlot = jest.fn();
    const wrapper = mount(Panel, {
      scopedSlots: {
        default: defaultScopedSlot,
        header: headerScopedSlot,
        footer: footerScopedSlot,
      },
    });

    await nextTick();

    expect(defaultScopedSlot).toHaveBeenCalledWith({ hasRefinements: true });
    expect(headerScopedSlot).toHaveBeenCalledWith({ hasRefinements: true });
    expect(footerScopedSlot).toHaveBeenCalledWith({ hasRefinements: true });
  });

  it('renders correctly with header', () => {
    const wrapper = mount(Panel, {
      slots: {
        default: defaultSlot,
        header: `<span>Header</span>`,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly with footer', () => {
    const wrapper = mount(Panel, {
      slots: {
        default: defaultSlot,
        footer: `<span>Footer</span>`,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
