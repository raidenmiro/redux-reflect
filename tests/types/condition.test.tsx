import React from 'react';
import type { Store } from 'redux';
import { createStore } from 'redux';

import { condition } from '../../dist';

/**
 * @see https://vitest.dev/guide/testing-types.html
 */

//#region Utils types
type StoreValue<T> = T extends Store<infer R> ? R : never;
type ShallowOptional<T> = Partial<Pick<T, keyof T>>;
//#endregion

test('correct type of component', () => {
  let store = createStore((state: number = 10) => state + 1);

  let Message = condition({
    if: (state: StoreValue<typeof store>) => state % 2 === 0,
    then: () => <div>Event</div>,
    else: () => <div>Odd</div>,
  });

  assertType<React.FC>(Message);
});

test('allow to use then branch only', () => {
  let initialState = { isAuthorized: true };
  let store = createStore((state: typeof initialState = initialState) => state);

  let OnlyAuthorized = condition({
    if: (state: StoreValue<typeof store>) => state.isAuthorized,
    then: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  });

  assertType<React.FC>(OnlyAuthorized);
});

test('should be correct infer props', () => {
  let initialState = { amountOfItems: 0 };
  let store = createStore((state: typeof initialState = initialState) => state);

  interface Props {
    step: number;
    onMaxSet(): void;
    onMinSet(): void;
  }

  function Stepper(_props: Props) {
    return <div>stepper</div>;
  }

  let CartStepper = condition({
    if: (state: StoreValue<typeof store>) => state.amountOfItems > 0,
    then: Stepper,
  });

  assertType<React.FC<ShallowOptional<Props>>>(CartStepper);
});

test('should be prohibit provide of inappropriate props', () => {
  let store = createStore((state: number = 10) => state);

  function Input(props: React.ComponentPropsWithoutRef<'input'>) {
    return <input {...props} />;
  }

  let InputComponent = condition({
    if: (state: StoreValue<typeof store>) => state % 2 === 0,
    then: Input,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  let Page = () => <InputComponent hello="world" />;

  assertType<React.FC>(Page);
});
