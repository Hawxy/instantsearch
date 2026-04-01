/**
 * Create class names like ais-widgetName-element--modifier
 *
 * @param {string} widgetName first part
 * @param {string} element part separated by -
 * @param {string} modifier final part, separated by --
 *
 * @returns {string} the composed class name
 */
export default function suit(
  widgetName: string,
  element?: string,
  modifier?: string
) {
  if (!widgetName) {
    throw new Error('You need to provide `widgetName` in your data');
  }

  const elements: string[] = [`ais-${widgetName}`];

  if (element) {
    elements.push(`-${element}`);
  }

  if (modifier) {
    elements.push(`--${modifier}`);
  }

  return elements.join('');
}
