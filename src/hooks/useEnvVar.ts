import { useState, useEffect } from 'react';

export function useEnvVar(key: string, defaultValue: string = '') {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined' && (window as any).__ENV?.[key]) {
      return (window as any).__ENV[key];
    }
    return import.meta.env[key] || defaultValue;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const envValue = (window as any).__ENV?.[key];
      if (envValue) {
        setValue(envValue);
      }
    }
  }, [key]);

  return value;
} 