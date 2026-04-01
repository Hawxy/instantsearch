import type { SearchResults, SearchParameters } from 'algoliasearch-helper';
import type {
  Connector,
  InstantSearch,
  Middleware,
  UiState,
  IndexUiState,
  Widget,
  WidgetDescription,
  UnknownWidgetParams,
  Renderer,
  Unmounter,
} from 'instantsearch.js/es/types';

export type {
  Connector,
  InstantSearch,
  Middleware,
  UiState,
  IndexUiState,
  Widget,
  WidgetDescription,
  UnknownWidgetParams,
  Renderer,
  Unmounter,
  SearchResults,
  SearchParameters,
};

export const INSTANTSEARCH_INSTANCE_KEY = '$_ais_instantSearchInstance';
export const PARENT_INDEX_KEY = '$_ais_getParentIndex';
export const SSR_INSTANCE_KEY = '$_ais_ssrInstantSearchInstance';

export interface HighlightPart {
  value: string;
  isHighlighted: boolean;
}
