export function getStorage<T>(
  key: string,
  defaultValue: T
): T {
  const item = localStorage.getItem(key);

  if (!item) {
    return defaultValue;
  }

  return JSON.parse(item);
}

export function setStorage(
  key: string,
  value: unknown
) {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}