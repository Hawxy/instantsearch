import { suit as suitFn } from '../../util/suit';

export const useSuit = jest.fn((name, classNames) => ({
  suit: (...args) => suitFn(name, classNames && classNames.value, ...args),
}));
