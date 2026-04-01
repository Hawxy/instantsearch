import suitUtil from '../../util/suit';

import type { ComputedRef } from 'vue';

export const useSuit = jest.fn((name: string, classNames?: ComputedRef<Record<string, string> | undefined>) => ({
  suit: (element?: string, modifier?: string) => {
    const className = suitUtil(name, element, modifier);
    const userClassName =
      classNames && classNames.value && classNames.value[className];
    if (userClassName) {
      return [className, userClassName].join(' ');
    }
    return className;
  },
}));
