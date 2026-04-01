import { ref, type Ref } from 'vue';

let state: Record<string, any> = {};
let widget: Record<string, any> = {};
let indexResults: any = null;
let indexHelper: any = null;

const listeners: Record<string, Array<(...args: any[]) => void>> = {};

let instantSearchInstance: Record<string, any> = {
  status: 'idle',
  error: undefined,
  addListener: (event: string, fn: (...args: any[]) => void) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  },
  removeListener: (event: string, fn: (...args: any[]) => void) => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter((f) => f !== fn);
    }
  },
};

// Track the last created state ref so __setState can update it reactively
let lastStateRef: Ref<any> | null = null;

export function __setState(newState: Record<string, any>) {
  state = newState;
  if (lastStateRef) {
    lastStateRef.value = newState;
  }
}

export function __setWidget(newWidget: Record<string, any>) {
  widget = newWidget;
}

export function __setIndexResults(newResults: any) {
  indexResults = newResults;
}

export function __setIndexHelper(newHelper: any) {
  indexHelper = newHelper;
}

export function __overrideInstantSearchInstance(newInstantSearchInstance: Record<string, any>) {
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
