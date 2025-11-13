import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for localStorage with debounce
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @param debounceMs - Debounce time in milliseconds (default: 500)
 * @returns Tuple of [state, setState]
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  debounceMs: number = 500
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state from localStorage
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[useLocalStorageState] Failed to load ${key} from localStorage:`, error);
      return defaultValue;
    }
  });

  // Debounced effect to save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`[useLocalStorageState] Failed to save ${key} to localStorage:`, error);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [state, key, debounceMs]);

  return [state, setState];
}

/**
 * Gets a value from localStorage
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The value from localStorage or default value
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[getLocalStorageItem] Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Sets a value in localStorage
 * @param key - The localStorage key
 * @param value - The value to store
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[setLocalStorageItem] Failed to save ${key} to localStorage:`, error);
  }
}

/**
 * Removes a value from localStorage
 * @param key - The localStorage key
 */
export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[removeLocalStorageItem] Failed to remove ${key} from localStorage:`, error);
  }
}
