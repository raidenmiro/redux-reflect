export const isHandler = (
  handler: unknown
): handler is (...args: any[]) => any => {
  return typeof handler === 'function';
};

export const isObject = (value: unknown): value is Record<any, any> => {
  return typeof value === 'object' && value !== null;
};

export const isEmptyObject = (
  object: Record<string, unknown>
): object is Record<string, never> => {
  return Object.keys(object).length === 0;
};

export const isEmptyArray = (array: unknown[]): array is never[] => {
  return array.length === 0;
};
