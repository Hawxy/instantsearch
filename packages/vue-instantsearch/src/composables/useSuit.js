import suit from '../util/suit';

export function useSuit(name, classNames) {
  function suitFn(element, modifier) {
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
