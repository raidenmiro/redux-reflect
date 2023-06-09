import React from 'react';
import { useSelector } from 'react-redux';

import type { LifecycleCallbacks, View } from '../types';

/**
 * @example
 * ```tsx
 * const Cards = list({
 *   view: Card,
 *   selector: (state: RootState) => state.cards,
 *   getKey: (item: Card) => item.id,
 *   empty: () => <p>No cards</p>,
 * })
 * ```
 */
export function list<Props, State, Selected>(opts: {
  selector: (state: State) => Selected[];
  view: View<Props>;
  getKey?: (item: Selected) => string;
  mapItem?: (item: Selected, index: number) => Props;
  empty?: React.ElementType;
  hooks?: LifecycleCallbacks;
}) {
  let { selector, view, getKey, mapItem = (item) => item } = opts;

  function View() {
    let items = useSelector(selector);

    let filledList = React.useMemo(() => {
      return items.map((item, index) => {
        let key = getKey ? getKey(item) : index;
        let elementProps = Object.assign({}, mapItem(item, index));
        return React.createElement(view as never, { elementProps, key });
      });
    }, [items]);

    if (items.length === 0) {
      return React.isValidElement(opts.empty) ? opts.empty : null;
    }

    return filledList;
  }

  return View;
}
