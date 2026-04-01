/* eslint-disable no-console */

import assert from 'assert';

import * as VueInstantSearch from 'vue-instantsearch/dist/es/index.js';
import * as VueWidgets from 'vue-instantsearch/dist/es/src/widgets.js';

assert.ok(VueInstantSearch);
assert.ok(VueWidgets);

console.log('vue-instantsearch is valid ESM');
