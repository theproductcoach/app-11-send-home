import { NextResponse } from 'next/server';

const API_BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');
    const date = searchParams.get('date');

    console.log('Request params:', { fromCurrency, toCurrency, date });

    if (!fromCurrency || !toCurrency) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Format the date as YYYY-MM-DD if it exists
    let formattedDate = date;
    if (date) {
      const dateObj = new Date(date);
      formattedDate = dateObj.toISOString().split('T')[0];
    }

    // Use the date-specific URL if a date is provided
    const baseUrl = date 
      ? `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formattedDate}/v1`
      : API_BASE_URL;

    const url = `${baseUrl}/currencies/${fromCurrency.toLowerCase()}.json`;

    console.log('Fetching from URL:', url);

    const response = await fetch(url);
    const data = await response.json();
    
    console.log('API Response status:', response.status);
    console.log('API Response text:', data);

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    // Get the rate for the target currency
    const rate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];

    if (!rate) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }

    // Return the rate in the format our frontend expects
    return NextResponse.json({
      success: true,
      rates: {
        [toCurrency]: rate
      }
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch exchange rate' },
      { status: 500 }
    );
  }
} 