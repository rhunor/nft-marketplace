'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface EthPriceContextType {
  ethPrice: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshPrice: () => Promise<void>;
  ethToUsd: (ethAmount: number) => number;
  formatEthToUsd: (ethAmount: number) => string;
}

const EthPriceContext = createContext<EthPriceContextType | undefined>(undefined);

const FALLBACK_PRICE = 3500;
const REFRESH_INTERVAL = 300 * 1000; // Refresh every 60 seconds

export function EthPriceProvider({ children }: { children: React.ReactNode }) {
  const [ethPrice, setEthPrice] = useState<number>(FALLBACK_PRICE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/eth-price');
      const result = await response.json();

      if (result.success && result.data?.price) {
        setEthPrice(result.data.price);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid response from price API');
      }
    } catch (err) {
      console.error('Failed to fetch ETH price:', err);
      setError('Failed to fetch live price');
      // Keep the last known price or fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch price on mount
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(fetchPrice, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  // Convert ETH to USD
  const ethToUsd = useCallback(
    (ethAmount: number): number => {
      return ethAmount * ethPrice;
    },
    [ethPrice]
  );

  // Format ETH to USD string
  const formatEthToUsd = useCallback(
    (ethAmount: number): string => {
      const usdAmount = ethAmount * ethPrice;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdAmount);
    },
    [ethPrice]
  );

  return (
    <EthPriceContext.Provider
      value={{
        ethPrice,
        isLoading,
        error,
        lastUpdated,
        refreshPrice: fetchPrice,
        ethToUsd,
        formatEthToUsd,
      }}
    >
      {children}
    </EthPriceContext.Provider>
  );
}

export function useEthPrice() {
  const context = useContext(EthPriceContext);
  if (context === undefined) {
    throw new Error('useEthPrice must be used within an EthPriceProvider');
  }
  return context;
}