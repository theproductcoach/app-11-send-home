# Should I Send Money Home?

A simple web application that helps users decide whether it's a good time to send money home based on current exchange rates compared to historical averages.

## Features

- Compare current exchange rates with 6-month historical averages
- Support for multiple major currencies
- Clear visual feedback with color-coded results
- Celebration effect when rates are favorable
- Responsive design with a clean, modern interface

## How It Works

The application:

1. Fetches the current exchange rate for the selected currency pair
2. Samples one rate per month for the last 6 months
3. Calculates the average of these historical rates
4. Compares the current rate with the 6-month average
5. Recommends sending money if the current rate is 2% or more above the average

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Canvas Confetti for celebration effects

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app/page.tsx` - Main application component
- `src/app/api/exchange-rates/route.ts` - API route for fetching exchange rates
- `src/app/globals.css` - Global styles and Tailwind imports

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Exchange rate data provided by [@fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api) - A free, open-source currency exchange rate API
- UI inspiration from modern fintech applications
- Built with ❤️ for international money transfer users
