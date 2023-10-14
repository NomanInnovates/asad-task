"use client";
import React, { useState } from "react";
import "./Search.css";

export default function SearchCountries() {
  const [query, setQuery] = useState("pak");
  const [country, setCountry] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const handleQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {});
      const token = cookies.token;

      if (!token) {
        alert("Unauthorized. Please login first.");
        window.location.href = "/";
        return;
      }

      const response = await fetch(
        `http://localhost:8000/getCountryInfo?name=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        const parsedData = await response.json();
        setCountry(parsedData);
      } else {
        alert("Request failed");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderCountryInfo = (country) => (
    <div className="country-info-container">
      <h1>{country.fullName}</h1>
      <p>Population: {country.population}</p>
      <p>Euro conversion rate: {country.conversionRate}</p>
      <h2>Currencies:</h2>
      <ol>
        {country.currencies.map((currency, index) => (
          <li key={index}>
            <p>Currency Code: {currency.currencyCode}</p>
            <p>Name: {currency.name}</p>
            <p>Symbol: {currency.symbol}</p>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="search-container">
      <h1>Search Countries Information</h1>
      <div className="flex">
        <input
          type="text"
          placeholder="Enter Country Name"
          value={query}
          onChange={handleQuery}
          className="search-input"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading ? "Searching.." : "Search"}
        </button>
      </div>
      {isLoading ? "Searching Country.." : country && renderCountryInfo(country)}
    </div>
  );
}