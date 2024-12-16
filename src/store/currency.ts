// src/store/currency.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyStore {
  currency: string;
  setCurrency: (currency: string) => void;
  rates: Record<string, number>;
  setRates: (rates: Record<string, number>) => void;
  convert: (amount: number, from: string, to: string) => number;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      rates: {},
      isLoading: false,
      setCurrency: (currency) => {
        console.log('Setting currency to:', currency);
        set({ currency });
      },
      setRates: (rates) => {
        console.log('Setting rates:', rates);
        set({ rates });
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      convert: (amount, from, to) => {
        const rates = get().rates;
        console.log('Converting', amount, 'from', from, 'to', to);
        console.log('Available rates:', rates);
        
        if (!rates[from] || !rates[to]) {
          console.warn('Missing exchange rate for', from, 'or', to);
          return amount;
        }
        
        const converted = (amount / rates[from]) * rates[to];
        console.log('Converted amount:', converted);
        return converted;
      },
    }),
    {
      name: 'currency-store',
      onRehydrateStorage: () => {
        console.log('Rehydrating currency store');
      },
    }
  )
);

// Add a global type for the exchange rates
declare global {
  interface Window {
    exchangeRates: Record<string, number>;
  }
}