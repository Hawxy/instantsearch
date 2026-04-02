/**
 * @jest-environment @instantsearch/testutils/jest-environment-jsdom.ts
 */

/* eslint-disable jest/no-conditional-expect */

import { mount } from '../../test/utils';
import InstantSearch from '../instantsearch';
import { createApp } from 'vue';
import { AisInstantSearch } from '../widgets';

const renderlessComponents = ['AisExperimentalConfigureRelatedItems'];
const nonWidgetComponents = [
  'AisInstantSearch',
  'AisInstantSearchSsr',
  'AisHighlight',
  'AisSnippet',
  'AisPanel',
  'AisPoweredBy',
  'AisStateResults',
];

function getAllComponents() {
  const app = createApp();
  app.component = jest.fn();
  app.use(InstantSearch);
  const calls = app.component.mock.calls;

  return calls.map(([installedName, call]) => {
    const { name } = call;
    let suitClass = `Error! ${name} is missing the suit classes`;
    let widget = `Error! ${name} is missing the widget`;

    try {
      // All components use <script setup> or defineComponent: derive suit class from name
      // AisSearchBox -> ais-SearchBox, AisRefinementList -> ais-RefinementList
      const suitNameMap: Record<string, string> = {
        AisInstantSearchSsr: 'InstantSearch',
      };
      const widgetName = suitNameMap[name] || name.replace(/^Ais/, '');
      suitClass = `ais-${widgetName}`;
    } catch (e) {
      /* no suit class, so will fail the assertions */
    }

    try {
      if (nonWidgetComponents.includes(name)) {
        throw new Error('not a widget');
      }

      const props = {};
      if (name === 'AisHierarchicalMenu' || name === 'AisBreadcrumb') {
        props.attributes = ['attr'];
      } else if (name === 'AisExperimentalConfigureRelatedItems') {
        props.hit = {};
        props.matchingPatterns = {};
      } else if (name === 'AisToggleRefinement') {
        props.attribute = 'attr';
        props.label = 'label';
        props.value = 'value';
      } else if (name === 'AisSortBy') {
        props.items = [];
      } else if (name === 'AisNumericMenu') {
        props.items = [{ label: 'start', start: 1 }];
        props.attribute = 'attr';
      } else if (name === 'AisHitsPerPage') {
        props.items = [{ default: true, label: 'ten', value: 10 }];
      } else if (name === 'AisQueryRuleContext') {
        props.trackedFilters = {};
      } else if (name === 'AisIndex') {
        props.indexName = 'indexName';
      } else {
        props.attribute = 'attr';
      }

      // All components use composables. Derive the widget type from the name.
      const widgetTypeMap: Record<string, string> = {
        AisExperimentalConfigureRelatedItems: 'ais.configureRelatedItems',
      };
      const widgetName = name.replace(/^Ais/, '');
      widget = {
        $$widgetType: widgetTypeMap[name] || `ais.${widgetName[0].toLowerCase()}${widgetName.slice(1)}`,
      };
    } catch (e) {
      /* no widget, so will fail the assertions */
    }

    return {
      installedName,
      name,
      suitClass,
      widget,
    };
  });
}

const components = getAllComponents();

describe('DOM component', () => {
  test.each(
    components.filter(
      ({ name }) => renderlessComponents.includes(name) === false
    )
  )(
    '$name should have the same `name` as suit class',
    ({ name, installedName, suitClass }) => {
      expect(installedName).toBe(name);
      if (name === 'AisInstantSearchSsr') {
        expect(suitClass).toBe(`ais-InstantSearch`);
      } else {
        expect(suitClass).toBe(`ais-${name.substr(3)}`);
      }
    }
  );
});

describe('installed widget', () => {
  test.each(
    components.filter(
      ({ name }) => nonWidgetComponents.includes(name) === false
    )
  )('sets widgetType $name', ({ name, widget }) => {
    if (name === 'AisExperimentalConfigureRelatedItems') {
      expect(widget.$$widgetType).toBe('ais.configureRelatedItems');
    } else {
      expect(widget.$$widgetType).toBe(
        `ais.${name[3].toLowerCase()}${name.substr(4)}`
      );
    }
  });
});
