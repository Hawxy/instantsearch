import { ref } from 'vue';

let state = {};
let widget = {};
let indexResults = null;
let indexHelper = null;

const listeners = {};

let instantSearchInstance = {
  status: 'idle',
  error: undefined,
  addListener: (event, fn) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  },
  removeListener: (event, fn) => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter((f) => f !== fn);
    }
  },
};

// Track the last created state ref so __setState can update it reactively
let lastStateRef = null;

export function __setState(newState) {
  state = newState;
  if (lastStateRef) {
    lastStateRef.value = newState;
  }
}

export function __setWidget(newWidget) {
  widget = newWidget;
}

export function __setIndexResults(newResults) {
  indexResults = newResults;
}

export function __setIndexHelper(newHelper) {
  indexHelper = newHelper;
}

export function __overrideInstantSearchInstance(newInstantSearchInstance) {
  instantSearchInstance = Object.assign(
    instantSearchInstance,
    newInstantSearchInstance
  );
}

// Trigger render listeners (used by StateResults)
export function __emitRender() {
  if (listeners.render) {
    listeners.render.forEach((fn) => fn());
  }
}

export const useWidget = jest.fn(() => {
  lastStateRef = ref(state);
  return {
    state: lastStateRef,
    instantSearchInstance,
    getParentIndex: () => ({
      getResults: () => indexResults,
      getHelper: () => indexHelper,
    }),
    get widget() {
      return widget;
    },
  };
});
