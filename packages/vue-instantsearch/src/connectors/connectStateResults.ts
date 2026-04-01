const connectStateResults =
  (renderFn: Function, unmountFn = () => {}) =>
  (widgetParams = {}) => ({
    init({ instantSearchInstance }: { instantSearchInstance: unknown }) {
      renderFn(
        {
          state: undefined,
          results: undefined,
          instantSearchInstance,
          widgetParams,
        },
        true
      );
    },

    render({ results, instantSearchInstance, state }: Record<string, unknown>) {
      const resultsCopy = { ...results };
      const stateCopy = { ...state };

      renderFn(
        {
          results: resultsCopy,
          state: stateCopy,
          instantSearchInstance,
          widgetParams,
        },
        false
      );
    },

    dispose() {
      unmountFn();
    },
  });

export default connectStateResults;
