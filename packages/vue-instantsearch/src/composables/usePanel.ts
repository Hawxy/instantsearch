import { ref, inject, provide, watch, onBeforeUnmount } from 'vue';
import mitt, { type Emitter } from 'mitt';

import type { Ref } from 'vue';

type PanelEvents = { [PANEL_CHANGE_EVENT]: boolean };

export const PANEL_EMITTER_NAMESPACE = 'instantSearchPanelEmitter';
export const PANEL_CHANGE_EVENT = 'PANEL_CHANGE_EVENT' as const;

export function usePanelProvider(emitterProp?: Emitter<PanelEvents>) {
  const emitter = emitterProp || mitt<PanelEvents>();
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
  mapStateToCanRefine = (state: any) => Boolean(state.canRefine),
} = {}) {
  const emitter = inject<Emitter<PanelEvents>>(PANEL_EMITTER_NAMESPACE, { emit: () => {} } as any);
  const state: Ref<any> = ref(null);
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
