const identity = <T>(x: T): T => x;

export const createLogger =
  (appName: string) =>
  (label?: string, mapFn?: (_: any) => unknown) =>
  <T>(item: T) => {
    const _mapFn = mapFn ?? identity;
    console.log(`[${appName}]`, label, _mapFn(item));
    return item;
  };
