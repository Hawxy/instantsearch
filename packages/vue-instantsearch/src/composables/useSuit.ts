import suit from '../util/suit';

import type { ComputedRef } from 'vue';

export function useSuit(name: string, classNames?: ComputedRef<Record<string, string> | undefined>) {
  function suitFn(element?: string, modifier?: string) {
    const className = suit(name, element, modifier);
    const userClassName =
      classNames && classNames.value && classNames.value[className];
    if (userClassName) {
      return [className, userClassName].join(' ');
    }
    return className;
  }

  return { suit: suitFn };
}
