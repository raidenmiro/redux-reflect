import React, { createElement, FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isHandler } from './shared';

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export const splitView = <
  State,
  Props extends Record<string, unknown>,
  Cases extends string,
  Selected extends unknown
>(config: {
  selector: (state: State) => Selected;
  match:
    | Record<Cases, (state: Selected) => boolean>
    | ((state: Selected) => Cases);
  cases: AtLeastOne<Record<Cases, FC<Props>>>;
  otherwise: FC<Props>;
}) => {
  const matchFn = isHandler(config.match)
    ? config.match
    : parseConfigToCase(config.match);

  return (props: Props) => {
    const stateMap = useSelector(config.selector);
    const variant = useMemo(() => matchFn(stateMap), [stateMap]);

    const findCase = config.cases[variant];
    const component = findCase ?? config.otherwise ?? null;

    const elementProps = Object.assign({}, props, stateMap);
    return createElement(component, elementProps);
  };
};

const parseConfigToCase = <State>(
  args: Record<string, (state: State) => boolean>
) => {
  return (state: State) => {
    let finalCase = '';

    for (const key in args) {
      const variant = args[key];
      const result = variant(state);

      if (result) {
        finalCase = key;
      }
    }

    return finalCase;
  };
};
