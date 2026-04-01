import { INSTANTSEARCH_FUTURE_DEFAULTS } from 'instantsearch.js/es/lib/InstantSearch';
import {
  provide,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  type Ref,
} from 'vue';

import { version } from '../../package.json';
import type { InstantSearch, Middleware } from '../types';
import { INSTANTSEARCH_INSTANCE_KEY } from '../types';
import { warn } from '../util/warn';

import { useSuit } from './useSuit';

export interface UseInstantSearchProps {
  instance: InstantSearch;
  searchClient?: Ref<any>;
  indexName?: Ref<string | undefined>;
  compositionID?: Ref<string | undefined>;
  stalledSearchDelay?: Ref<number | undefined>;
  routing?: Ref<any>;
  onStateChange?: Ref<any>;
  searchFunction?: Ref<any>;
  middlewares?: Ref<Middleware[] | undefined>;
  future?: Ref<Record<string, any> | undefined>;
}

export function useInstantSearch(props: UseInstantSearchProps) {
  const { instance } = props;
  const vm = getCurrentInstance()!;

  provide(INSTANTSEARCH_INSTANCE_KEY, instance);

  // Watch searchClient
  if (props.searchClient) {
    watch(props.searchClient, (searchClient) => {
      warn(
        'The `search-client` prop of `<ais-instant-search>` changed between renders, which may cause more search requests than necessary. If this is an unwanted behavior, please provide a stable reference: https://www.algolia.com/doc/api-reference/widgets/instantsearch/vue/#widget-param-search-client'
      );
      instance.helper!.setClient(searchClient).search();
    });
  }

  // Watch indexName
  if (props.indexName) {
    watch(props.indexName, (indexName) => {
      instance.helper!.setIndex(indexName || '').search();
    });
  }

  // Watch compositionID
  if (props.compositionID) {
    watch(props.compositionID, (compositionID) => {
      instance.helper!.setIndex(compositionID || '').search();
    });
  }

  // Watch stalledSearchDelay
  if (props.stalledSearchDelay) {
    watch(props.stalledSearchDelay, (stalledSearchDelay) => {
      (instance as any)._stalledSearchDelay = stalledSearchDelay;
    });
  }

  // Watch routing
  if (props.routing) {
    watch(props.routing, () => {
      throw new Error(
        'routing configuration can not be changed dynamically at this point.' +
          '\n\n' +
          'Please open a new issue: https://github.com/algolia/instantsearch/discussions/new?category=ideas&labels=triage%2cLibrary%3A+Vue+InstantSearch&title=Feature%20request%3A%20dynamic%20props'
      );
    });
  }

  // Watch onStateChange
  if (props.onStateChange) {
    watch(props.onStateChange, () => {
      throw new Error(
        'onStateChange configuration can not be changed dynamically at this point.' +
          '\n\n' +
          'Please open a new issue: https://github.com/algolia/instantsearch/discussions/new?category=ideas&labels=triage%2cLibrary%3A+Vue+InstantSearch&title=Feature%20request%3A%20dynamic%20props'
      );
    });
  }

  // Watch searchFunction
  if (props.searchFunction) {
    watch(props.searchFunction, (searchFunction) => {
      (instance as any)._searchFunction = searchFunction;
    });
  }

  // Watch middlewares
  if (props.middlewares) {
    watch(
      props.middlewares,
      (next, prev) => {
        (prev || [])
          .filter((middleware) => (next || []).indexOf(middleware) === -1)
          .forEach((middlewareToRemove) => {
            instance.unuse(middlewareToRemove);
          });

        (next || [])
          .filter((middleware) => (prev || []).indexOf(middleware) === -1)
          .forEach((middlewareToAdd) => {
            instance.use(middlewareToAdd);
          });
      },
      { immediate: true }
    );
  }

  // Watch future
  if (props.future) {
    watch(props.future, (future) => {
      (instance as any).future = Object.assign(
        INSTANTSEARCH_FUTURE_DEFAULTS,
        future
      );
    });
  }

  // Register Algolia agent
  const { version: vueVersion } = require('vue');
  const searchClient = instance.client;
  if (typeof (searchClient as any).addAlgoliaAgent === 'function') {
    (searchClient as any).addAlgoliaAgent(`Vue (${vueVersion})`);
    (searchClient as any).addAlgoliaAgent(`Vue InstantSearch (${version})`);
  }

  // Lifecycle
  onMounted(() => {
    vm.proxy!.$nextTick(() => {
      if (!instance.started) {
        instance.start();
      }
    });
  });

  onBeforeUnmount(() => {
    if (instance.started) {
      instance.dispose();
    }
    (instance as any).__initialSearchResults = undefined;
  });

  const suit = useSuit('InstantSearch');

  return { suit };
}
