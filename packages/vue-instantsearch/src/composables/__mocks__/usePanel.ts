import { ref } from 'vue';

let canRefineRef = ref(false);

export function __setCanRefine(value) {
  canRefineRef.value = value;
}

export function __resetCanRefine() {
  canRefineRef = ref(false);
}

export const usePanelProvider = jest.fn(() => ({
  canRefine: canRefineRef,
}));

export const usePanelConsumer = jest.fn(() => {});
