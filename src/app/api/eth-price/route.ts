import { NextResponse } from 'next/server';

// Cache the price for 60 seconds to avoid rate limiting
let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    // Check if we have a valid cached price
    if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: {
          price: cachedPrice.price,
          currency: 'USD',
          cached: true,
        },
      });
    }

    // Fetch from CoinGecko API (free, no API key required)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Next.js cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const ethPrice = data.ethereum?.usd;

    if (typeof ethPrice !== 'number') {
      throw new Error('Invalid price data from CoinGecko');
    }

    // Update cache
    cachedPrice = {
      price: ethPrice,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: {
        price: ethPrice,
        currency: 'USD',
        cached: false,
      },
    });
  } catch (error) {
    console.error('[ETH Price API] Error fetching price:', error);

    // Return cached price if available, even if stale
    if (cachedPrice) {
      return NextResponse.json({
        success: true,
        data: {
          price: cachedPrice.price,
          currency: 'USD',
          cached: true,
          stale: true,
        },
      });
    }

    // Fallback price if everything fails
    return NextResponse.json({
      success: true,
      data: {
        price: 3500, // Fallback price
        currency: 'USD',
        fallback: true,
      },
    });
  }
}