const DEFAULT_DATABASE_POOL_MAX = 1;

export function readDatabasePoolMax(value = process.env.DATABASE_POOL_MAX) {
  const parsedValue = Number(value);

  if (Number.isSafeInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return DEFAULT_DATABASE_POOL_MAX;
}
