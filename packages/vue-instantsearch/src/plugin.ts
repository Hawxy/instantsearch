import * as widgets from './widgets';

import type { App } from 'vue';

const widgetMap = widgets as Record<string, { name: string }>;

export const plugin = {
  install(app: App) {
    Object.keys(widgetMap).forEach((widgetName) => {
      app.component(widgetMap[widgetName].name, widgetMap[widgetName] as any);
    });
  },
};
