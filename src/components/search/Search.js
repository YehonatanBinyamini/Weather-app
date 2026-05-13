import React, { useState, useRef } from "react";
import "./search.css"; // Import your CSS file
import { Search } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { getCitySuggestions } from "../../assets/WeatherApi";

export default function SearchComponent({
  onSearchChange,
  onSearchClick,
  isLoading,
}) {
  const flagImageUrl = (code) => {
    if (!code || typeof code !== "string" || code.length !== 2) return null;
    return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
  };
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef();

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    onSearchChange(value); 
    // debounce suggestions
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value && value.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        const list = await getCitySuggestions(value.trim(), 6);
        setSuggestions(list);
        setShowSuggestions(list.length > 0);
      }, 250);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    onSearchClick(inputValue); 
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchClick(inputValue);
    }
  };

  const handleSuggestionMouseDown = (suggestion) => {
    // use mouseDown to avoid input blur before click
    setInputValue(suggestion.displayName);
    // pass the plain city name to the parent to avoid format/country issues
    onSearchChange(suggestion.name);
    onSearchClick(suggestion.name);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // close suggestions shortly after blur to allow click
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className="search">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search City"
        onKeyDown={handleKeyDown}
      />

      <div className="search-icon" onClick={handleSearchClick}>
      {isLoading ? <CircularProgress className="progress" size={24} /> : <Search />}
      </div>
      {showSuggestions && (
        <ul className="search-suggestions" onBlur={handleBlur}>
          {suggestions.map((s, idx) => (
            <li
              key={s.Key + idx}
              className="search-suggestion-item"
              onMouseDown={() => handleSuggestionMouseDown(s)}
            >
              {s.countryCode ? (
                <img
                  src={flagImageUrl(s.countryCode)}
                  alt={s.countryCode}
                  className="flag-img"
                />
              ) : (
                <span className="flag-placeholder" />
              )}
              {s.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
