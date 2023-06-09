import type { useDispatch } from 'react-redux';

export type Dispatch = ReturnType<typeof useDispatch>;

export interface LifecycleCallbacks {
  onMounted(dispatch: Dispatch): void;
  onUnMounted(dispatch: Dispatch): void;
  onBeforeMounted(dispatch: Dispatch): void;
}

export type View<P = never> =
  | keyof JSX.IntrinsicElements
  | React.FunctionComponent<P>;

export type WrapProps<Props> = Partial<Pick<Props, keyof Props>>;
