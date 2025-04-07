"use client";

import { useState, useEffect } from "react";

const CURRENCIES = [
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
];

const API_KEY = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = "http://api.exchangerate.host";

export default function Home() {
  const [result, setResult] = useState<{
    decision: string;
    explanation: string;
    isPositive: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fromCurrency, setFromCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("AUD");
  const [shouldTriggerConfetti, setShouldTriggerConfetti] = useState(false);

  // Handle confetti effect
  useEffect(() => {
    if (shouldTriggerConfetti) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107"],
        });
      });
      setShouldTriggerConfetti(false);
    }
  }, [shouldTriggerConfetti]);

  const checkRate = async () => {
    setIsLoading(true);
    try {
      // Get current rate
      const currentResponse = await fetch(
        `${API_BASE_URL}/live?access_key=${API_KEY}&source=${fromCurrency}&currencies=${toCurrency}&format=1`
      );
      const currentData = await currentResponse.json();

      if (!currentData.success) {
        throw new Error(
          currentData.error?.info || "Failed to fetch current rate"
        );
      }

      const currentRate = currentData.quotes[`${fromCurrency}${toCurrency}`];

      // Get historical data for the past 6 months
      const dates = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().split("T")[0];
      });

      const historicalRates = await Promise.all(
        dates.map(async (date) => {
          const response = await fetch(
            `${API_BASE_URL}/historical?access_key=${API_KEY}&date=${date}&source=${fromCurrency}&currencies=${toCurrency}&format=1`
          );
          const data = await response.json();

          if (!data.success) {
            throw new Error(
              data.error?.info || "Failed to fetch historical rate"
            );
          }

          return data.quotes[`${fromCurrency}${toCurrency}`];
        })
      );

      // Calculate average rate
      const averageRate =
        historicalRates.reduce((sum, rate) => sum + rate, 0) /
        historicalRates.length;

      // Compare rates
      const percentageDifference =
        ((currentRate - averageRate) / averageRate) * 100;

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
      )}% above the 6-month average of ${averageRate.toFixed(4)}`
    : `This is only ${
        percentageDifference > 0
          ? percentageDifference.toFixed(1) + "% above"
          : Math.abs(percentageDifference).toFixed(1) + "% below"
      } the 6-month average of ${averageRate.toFixed(4)}`
}`,
        isPositive: shouldSend,
      });
    } catch (error) {
      console.error("Error:", error);
      setResult({
        decision: "Error fetching exchange rates",
        explanation:
          error instanceof Error ? error.message : "Unknown error occurred",
        isPositive: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        {result && (
          <div
            className={`mt-6 p-4 rounded-md text-center font-medium ${
              result.isPositive
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
