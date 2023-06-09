import React from 'react';
import { useSelector } from 'react-redux';

import type { View, WrapProps } from '../types';

export interface ConditionConfig<Props, State> {
  if(state: State): boolean;
  then: View<Props>;
  else?: View<Props>;
}

/**
 *
 * @example
 * ```tsx
 * const PageContent = condition({
 *   if: (state: RootState) => state.isAuthenticated,
 *   then: AuthorizedContent,
 *   else: AnonymousContent
 * })
 * ```
 */
export function condition<Props, State>(opts: ConditionConfig<Props, State>) {
  function View(props: WrapProps<Props>, ref: React.ElementRef<any>) {
    let selected = useSelector(opts.if);

    let component = React.useMemo(
      () => (selected ? opts.then : opts.else ?? null),
      [selected]
    );

    if (!component) {
      return null;
    }

    return React.createElement(component as never, { ...props, ref });
  }

  return React.forwardRef(View);
}
