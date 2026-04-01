import { ref, type Ref } from 'vue';

let canRefineRef: Ref<boolean> = ref(false);

export function __setCanRefine(value: boolean) {
  canRefineRef.value = value;
}

export function __resetCanRefine() {
  canRefineRef = ref(false);
}

export const usePanelProvider = jest.fn(() => ({
  canRefine: canRefineRef,
}));

export const usePanelConsumer = jest.fn(() => {});
