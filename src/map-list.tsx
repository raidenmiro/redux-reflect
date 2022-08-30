import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isEmptyArray } from './shared';

type ArrayValue<T extends any[]> = T[number];

export const mapList = <
  State,
  Selected extends any[],
  TItemValue extends ArrayValue<Selected>
>(config: {
  selector: (state: State) => Selected;
  keyMap?: (item: TItemValue) => string;
  item: FC<TItemValue>;
  empty: FC;
}) => {
  const View = () => {
    const stateMap = useSelector(config.selector);

    const Item = useMemo(() => {
      return (props: TItemValue, key: string) => {
        const View = config.item;

        return <View key={key} {...props} />;
      };
    }, []);

    if (isEmptyArray(stateMap)) {
      const Empty = config.empty;

      return <Empty />;
    }

    return stateMap.map((item, idx) => {
      const key = config.keyMap ? config.keyMap(item) : idx;
      return <Item key={key} {...item} />;
    });
  };

  // @FIXME
  return View as unknown as FC;
};
