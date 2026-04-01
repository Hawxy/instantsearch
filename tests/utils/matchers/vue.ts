type VueTestWrapper = {
  html: () => string;
  attributes: (attribute: string) => string;
};

export const vueToHaveEmptyHTML: jest.CustomMatcher = (
  wrapper: VueTestWrapper
) => {
  const html = wrapper.html();
  if (['', '<!---->', '<!--v-if-->'].includes(html)) {
    return {
      pass: true,
      message: () => '',
    };
  } else {
    return {
      pass: false,
      message: () => `expected ${html} to be an empty HTML string`,
    };
  }
};

const toHaveBooleanAttribute =
  (attribute: string): jest.CustomMatcher =>
  (wrapper: VueTestWrapper) => {
    // In Vue 3, :hidden="true" becomes hidden=""
    const value = wrapper.attributes(attribute);
    if (value === '') {
      return {
        pass: true,
        message: () => '',
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${wrapper} to have \`${attribute}\` attribute`,
      };
    }
  };

export const vueToBeDisabled = toHaveBooleanAttribute('disabled');
export const vueToBeHidden = toHaveBooleanAttribute('hidden');
export const vueToBeAutofocused = toHaveBooleanAttribute('autofocus');

declare global {
  // eslint-disable-next-line typescript/no-namespace
  namespace jest {
    // eslint-disable-next-line no-unused-vars, instantsearch/naming-convention
    interface Matchers<R> {
      vueToHaveEmptyHTML: () => jest.CustomMatcherResult;
      vueToBeDisabled: () => jest.CustomMatcherResult;
      vueToBeHidden: () => jest.CustomMatcherResult;
      vueToBeAutofocused: () => jest.CustomMatcherResult;
    }
  }
}
