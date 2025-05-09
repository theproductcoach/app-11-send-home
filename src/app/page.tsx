"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

const CURRENCIES = [
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
];

export default function Home() {
  const [fromCurrency, setFromCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("AUD");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    decision: string;
    explanation: string;
  } | null>(null);
  const [shouldTriggerConfetti, setShouldTriggerConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (shouldTriggerConfetti && isClient) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107"],
      });
      setShouldTriggerConfetti(false);
    }
  }, [shouldTriggerConfetti, isClient]);

  const checkRate = async () => {
    setIsLoading(true);
    try {
      // Get current rate
      const currentResponse = await fetch(
        `/api/exchange-rates?from=${fromCurrency}&to=${toCurrency}`
      );

      if (!currentResponse.ok) {
        const errorData = await currentResponse.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${currentResponse.status}`
        );
      }

      const currentData = await currentResponse.json();

      if (currentData.error) {
        throw new Error(currentData.error);
      }

      const currentRate = currentData.rates[toCurrency];

      // Get historical rates for the last 6 months
      const historicalRates: number[] = [];
      const today = new Date();

      // Sample one rate per month for the last 6 months
      for (let i = 1; i <= 6; i++) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const historicalDate = date.toISOString().split("T")[0];

        const historicalResponse = await fetch(
          `/api/exchange-rates?from=${fromCurrency}&to=${toCurrency}&date=${historicalDate}`
        );

        if (!historicalResponse.ok) {
          const errorData = await historicalResponse.json();
          throw new Error(
            errorData.error ||
              `HTTP error! status: ${historicalResponse.status}`
          );
        }

        const historicalData = await historicalResponse.json();

        if (historicalData.error) {
          throw new Error(historicalData.error);
        }

        historicalRates.push(historicalData.rates[toCurrency]);
      }

      // Calculate average historical rate
      const averageHistoricalRate =
        historicalRates.reduce((a, b) => a + b, 0) / historicalRates.length;

      // Calculate percentage difference
      const percentageDifference =
        ((currentRate - averageHistoricalRate) / averageHistoricalRate) * 100;

      const shouldSend = percentageDifference >= 2;

      if (shouldSend) {
        setShouldTriggerConfetti(true);
      }

      setResult({
        decision: shouldSend ? "✅ Yes, send now!" : "❌ No, wait",
        explanation: `Current rate: ${currentRate.toFixed(
          4
        )} ${toCurrency}/${fromCurrency}
${
  shouldSend
    ? `This is ${percentageDifference.toFixed(
        1
      )}% above the 6-month average rate (${averageHistoricalRate.toFixed(4)})`
    : `This is only ${
        percentageDifference > 0
          ? percentageDifference.toFixed(1) + "% above"
          : Math.abs(percentageDifference).toFixed(1) + "% below"
      } the 6-month average rate (${averageHistoricalRate.toFixed(4)})`
}`,
      });
    } catch (error) {
      console.error("Error:", error);
      setResult({
        decision: "Error fetching exchange rates",
        explanation:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only render the full component on the client side
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Should I Send Money Home?
            <div className="inline-block ml-2 relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block text-gray-400 cursor-help"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <p className="mb-2">
                  The decision is based on comparing the current exchange rate
                  with the average rate over the last 6 months:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>We sample one rate per month for the last 6 months</li>
                  <li>Calculate the average of these historical rates</li>
                  <li>
                    If the current rate is 2% or more above this average, we
                    recommend sending money now
                  </li>
                  <li>Otherwise, we recommend waiting for a better rate</li>
                </ul>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
              </div>
            </div>
          </h1>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Should I Send Money Home?
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="fromCurrency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              From Currency
            </label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="toCurrency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              To Currency
            </label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={checkRate}
          disabled={isLoading || fromCurrency === toCurrency}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Checking..." : "Check Now"}
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            How is this calculated?
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            We compare the current exchange rate with the average rate over the
            last 6 months:
          </p>
          <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
            <li>We sample one rate per month for the last 6 months</li>
            <li>Calculate the average of these historical rates</li>
            <li>
              If the current rate is 2% or more above this average, we recommend
              sending money now
            </li>
            <li>Otherwise, we recommend waiting for a better rate</li>
          </ul>
        </div>

        {result && (
          <div
            className={`mt-6 p-4 rounded-md text-center font-medium ${
              result.decision.includes("✅")
                ? "bg-green-100 text-green-800"
                : result.decision.includes("❌")
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <div className="text-lg mb-2">{result.decision}</div>
            <div className="text-sm whitespace-pre-line opacity-90">
              {result.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
