import React, { FC, useEffect, useLayoutEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

type View<Props> = FC<Props>;
type LifecycleCallback = () => unknown;

export interface Lifecycle {
  onMounted: LifecycleCallback;
  onUnMounted: LifecycleCallback;
  onBeforeMounted: LifecycleCallback;
}

export const bindView = <
  State,
  Props extends Record<string, unknown>,
  Selected extends unknown
>(config: {
  selector: (state: State) => Selected;
  view: View<Props>;
  bind: (selected: Selected) => Record<keyof Props, unknown>;
  lifecycle?: Lifecycle;
}) => {
  return (props: Props) => {
    const stateMap = useSelector(config.selector);
    const data = useMemo(() => config.bind(stateMap), [stateMap]);
    const elementProps = Object.assign({}, props, data);

    const lifecycleHooks = config.lifecycle;
    const View = config.view;

    useIsomorphicLayoutEffect(() => {
      lifecycleHooks?.onBeforeMounted();
    }, []);

    useEffect(() => {
      lifecycleHooks?.onMounted();
      return () => {
        lifecycleHooks?.onMounted();
      };
    }, [lifecycleHooks]);

    return <View {...elementProps} />;
  };
};

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
