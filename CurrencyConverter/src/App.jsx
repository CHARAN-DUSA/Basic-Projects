import React, { useEffect, useState } from "react";

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  // Fetch available currencies
  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((res) => res.json())
      .then((data) => setCurrencies(data));
  }, []);

  const convertCurrency = () => {
    if (fromCurrency === toCurrency) {
      setResult(amount);
      return;
    }

    fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    )
      .then((res) => res.json())
      .then((data) => setResult(data.rates[toCurrency]));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          💱 Currency Converter
        </h1>

        {/* Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 rounded text-black"
          placeholder="Enter amount"
        />

        {/* From Currency */}
        <div className="mb-4">
          <label className="block mb-1">From:</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 rounded text-black"
          >
            {Object.keys(currencies).map((cur) => (
              <option key={cur} value={cur}>
                {cur} — {currencies[cur]}
              </option>
            ))}
          </select>
        </div>

        {/* To Currency */}
        <div className="mb-4">
          <label className="block mb-1">To:</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-2 rounded text-black"
          >
            {Object.keys(currencies).map((cur) => (
              <option key={cur} value={cur}>
                {cur} — {currencies[cur]}
              </option>
            ))}
          </select>
        </div>

        {/* Convert Button */}
        <button
          onClick={convertCurrency}
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold"
        >
          Convert
        </button>

        {/* Result */}
        {result !== null && (
          <div className="mt-4 p-2 bg-gray-700 rounded-lg text-center">
            {amount} {fromCurrency} = <b>{result.toFixed(2)} {toCurrency}</b>
          </div>
        )}
      </div>
    </div>
  );
}
