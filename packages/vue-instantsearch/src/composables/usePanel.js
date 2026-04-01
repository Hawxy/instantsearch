import { ref, inject, provide, watch, onBeforeUnmount } from 'vue';
import mitt from 'mitt';

export const PANEL_EMITTER_NAMESPACE = 'instantSearchPanelEmitter';
export const PANEL_CHANGE_EVENT = 'PANEL_CHANGE_EVENT';

export function usePanelProvider(emitterProp) {
  const emitter = emitterProp || mitt();
  const canRefine = ref(true);

  provide(PANEL_EMITTER_NAMESPACE, emitter);

  emitter.on(PANEL_CHANGE_EVENT, (value) => {
    canRefine.value = value;
  });

  onBeforeUnmount(() => {
    emitter.all.clear();
  });

  return { canRefine, emitter };
}

export function usePanelConsumer({
  mapStateToCanRefine = (state) => Boolean(state.canRefine),
} = {}) {
  const emitter = inject(PANEL_EMITTER_NAMESPACE, { emit: () => {} });
  const state = ref(null);
  let hasAlreadyEmitted = false;
  let previousCanRefine;

  watch(
    state,
    (nextState, prevState) => {
      if (!nextState) {
        return;
      }

      const prevCanRefine = mapStateToCanRefine(prevState || {});
      const nextCanRefine = mapStateToCanRefine(nextState);

      if (!hasAlreadyEmitted || prevCanRefine !== nextCanRefine) {
        emitter.emit(PANEL_CHANGE_EVENT, nextCanRefine);
        hasAlreadyEmitted = true;
      }

      previousCanRefine = nextCanRefine;
    },
    { immediate: true }
  );

  return { state, emitter };
}
