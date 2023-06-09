import React from 'react';
import { useSelector } from 'react-redux';

import type { View, WrapProps } from '../types';
import { isHandler } from '../utils/type.guards';

export type Matcher<V extends string, S> =
  | ((selected: S) => V)
  | Record<V, (selected: S) => boolean>;

/**
 * @example
 * ```tsx
 * const Section = splitView({
 *   selector: (state: RootState) => state.status,
 *   match: {
 *     pending: (status) => status === 'idle' || status === 'loading',
 *     successes: (status) => status === 'success',
 *   },
 *   cases: {
 *     pending: Spinner,
 *     successes: Content,
 *   },
 *   default: DefaultComponent // (optional) if matching variant is not found
 * })
 * ```
 */
export function splitView<Props, Store, Selected, Cases extends string>(opts: {
  selector: (state: Store) => Selected;
  match: Matcher<Cases, Selected>;
  cases: { [K in Cases]?: View<Props> };
  default?: React.ReactElement;
}) {
  let matchFn = isHandler(opts.match) ? opts.match : parseMatcher(opts.match);

  function View(props: WrapProps<Props>, ref: React.Ref<any>) {
    let computed = useSelector(opts.selector);
    let matchedCase = React.useMemo(
      () => matchFn(computed) as Cases,
      [computed]
    );

    if (!matchedCase || !opts.cases[matchedCase]) {
      if (React.isValidElement(opts.default)) {
        return <>{opts.default}</>;
      }

      return null;
    }

    let component = opts.cases[matchedCase] as never;
    return React.createElement(component, { ...props, ref });
  }

  return React.forwardRef(View);
}

function parseMatcher<S>(match: Record<string, (s: S) => boolean>) {
  let mathCases = Object.keys(match);

  return function matchCases(selected: S) {
    for (let variant of mathCases) {
      let checkSuitable = match[variant];

      if (checkSuitable(selected)) {
        return variant;
      }
    }
  };
}
