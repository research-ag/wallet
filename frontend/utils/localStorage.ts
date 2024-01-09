const LOCAL_STORAGE_PREFIX = "ICRC2";

export function setInLocalStorage<T>(key: string, value: T): T | null {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${key}`, JSON.stringify(value));
    return value;
  } catch (error) {
    return null;
  }
}

export function getFromLocalStorage<T>(key: string): T | null {
  const value = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-${key}`);
  return value ? JSON.parse(value) : null;
}

export const removeFromLocalStorage = (key: string): void => {
  localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}-${key}`);
};

export const existInLocalStorage = (key: string): boolean => {
  return getFromLocalStorage(key) !== null;
};
