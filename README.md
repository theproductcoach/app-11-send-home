# Should I Send Money Home?

A simple, elegant web application that helps you decide the best time to make international money transfers based on exchange rates. The app compares current exchange rates with historical data to recommend whether you should transfer money now or wait for better rates.

## Features

- 🔄 Real-time exchange rate checking
- 📊 Comparison with 6-month historical average
- 🌍 Support for major currencies (GBP, USD, EUR, AUD, CAD, JPY, INR)
- 🎯 Smart recommendation system
- 🎉 Celebratory animation for favorable rates
- 📱 Responsive design that works on all devices

## How It Works

The app helps you make informed decisions about international money transfers by:

1. Fetching the current exchange rate for your selected currency pair
2. Calculating the average rate over the past 6 months
3. Comparing the current rate with the historical average
4. Recommending to "send now" if the current rate is at least 2% better than average
5. Displaying detailed information about the rates and the difference

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd should-i-send-money-home
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_BASE_URL=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select your source currency ("From Currency")
2. Select your target currency ("To Currency")
3. Click "Check Now"
4. The app will display either:
   - ✅ "Yes, send now!" with a celebration animation if the rate is favorable
   - ❌ "No, wait" if you should hold off
5. View the detailed explanation showing:
   - Current exchange rate
   - Comparison with the 6-month average
   - Percentage difference

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) - Celebration effects
- [Exchange Rate API](https://exchangerate.host) - Exchange rate data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Exchange rate data provided by [exchangerate.host](https://exchangerate.host)
- UI inspiration from modern fintech applications
- Built with ❤️ for international money transfer users
