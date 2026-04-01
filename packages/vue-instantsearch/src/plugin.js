/* eslint import/namespace: ['error', { allowComputed: true }]*/

import * as widgets from './widgets';

export const plugin = {
  install(app) {
    Object.keys(widgets).forEach((widgetName) => {
      app.component(widgets[widgetName].name, widgets[widgetName]);
    });
  },
};
