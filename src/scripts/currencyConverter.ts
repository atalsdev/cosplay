interface ExchangeRates {
  [key: string]: number;
}

class CurrencyConverter {
  private rates: ExchangeRates = {};
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.initializeCurrencySwitcher();
    this.loadStoredRates();
  }

  private async initializeCurrencySwitcher() {
    const switcher = document.getElementById('currency-switcher') as HTMLSelectElement;
    if (!switcher) return;

    // Set initial currency from localStorage
    const storedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    switcher.value = storedCurrency;

    // Convert prices on load
    await this.convertAllPrices(storedCurrency);

    // Add change listener
    switcher.addEventListener('change', async (e) => {
      const newCurrency = (e.target as HTMLSelectElement).value;
      localStorage.setItem('selectedCurrency', newCurrency);
      await this.convertAllPrices(newCurrency);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('currencyChange', {
        detail: { currency: newCurrency }
      }));
    });
  }

  private async loadStoredRates() {
    const stored = localStorage.getItem('exchangeRates');
    const timestamp = localStorage.getItem('ratesTimestamp');

    if (stored && timestamp) {
      const storedTime = parseInt(timestamp);
      if (Date.now() - storedTime < this.CACHE_DURATION) {
        this.rates = JSON.parse(stored);
        this.lastFetch = storedTime;
        return;
      }
    }

    await this.fetchLatestRates();
  }

  private async fetchLatestRates() {
    try {
      // Using exchangerate-api.com (you'll need to sign up for an API key)
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD`
      );
      const data = await response.json();
      
      if (data.conversion_rates) {
        this.rates = data.conversion_rates;
        this.lastFetch = Date.now();
        
        // Store in localStorage
        localStorage.setItem('exchangeRates', JSON.stringify(this.rates));
        localStorage.setItem('ratesTimestamp', this.lastFetch.toString());
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Fallback to some hardcoded rates if API fails
      this.rates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        CAD: 1.25
      };
    }
  }

  private async convertAllPrices(toCurrency: string) {
    if (Object.keys(this.rates).length === 0) {
      await this.loadStoredRates();
    }

    const priceElements = document.querySelectorAll('[data-price]');
    priceElements.forEach(element => {
      const originalPrice = parseFloat(element.getAttribute('data-price') || '0');
      const originalCurrency = element.getAttribute('data-currency') || 'USD';
      
      const convertedPrice = this.convert(originalPrice, originalCurrency, toCurrency);
      this.updatePriceDisplay(element as HTMLElement, convertedPrice, toCurrency);
    });
  }

  private convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first (as base currency)
    const inUSD = fromCurrency === 'USD' 
      ? amount 
      : amount / (this.rates[fromCurrency] || 1);
    
    // Convert from USD to target currency
    return inUSD * (this.rates[toCurrency] || 1);
  }

  private updatePriceDisplay(element: HTMLElement, price: number, currency: string) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    element.textContent = formatter.format(price);
    element.setAttribute('data-current-currency', currency);
  }
}

// Initialize the converter
document.addEventListener('astro:page-load', () => {
  new CurrencyConverter();
});

export default CurrencyConverter;
