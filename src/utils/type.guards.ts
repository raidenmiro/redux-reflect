export function isHandler(
  handler: unknown
): handler is (...args: any[]) => any {
  return typeof handler === 'function';
}
