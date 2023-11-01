import React, { useEffect, useState } from "react";
import "./currentWeatherHome.css";
import { Star, StarBorder } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { citiesActions } from "../../store/citiesData";
import { favoritesActions } from "../../store/favorites";

export default function CurrentWeatherHome() {
  const currentCity = useSelector((state) => state.cities.currentCity);
    const units = useSelector((state) => state.units);
    const dispatch = useDispatch();

  const [isPressed, setIsPressed] = useState(currentCity.isFavorite);
  const starsStyle = { color: "#d4a50d", fontSize: 40, marginRight: "5" };

  useEffect(() => {
    setIsPressed(currentCity.isFavorite);
  }, [currentCity]);

  const handleStarClick = () => {
    setIsPressed(!isPressed);
    dispatch(citiesActions.setIsFavorite(currentCity.key));
    if (!isPressed) {
      dispatch(favoritesActions.add(currentCity));
    } else {
      dispatch(favoritesActions.delete(currentCity.key));
    }
  };

  return (
    <div className="mobile-container">
      <div className="current-weather-home-container">
        <label className="city-name">
          {isPressed ? (
            <Star style={starsStyle} onClick={handleStarClick} />
          ) : (
            <StarBorder style={starsStyle} onClick={handleStarClick} />
          )}
          {currentCity.cityName}
        </label>
        {units === "C" ? (
          <label className="label-temp">
            {currentCity.currentWeatherData.temperatureInC}°C
          </label>
        ) : (
          <label className="label-temp">
            {currentCity.currentWeatherData.temperatureInF}°F
          </label>
        )}
        <label className="label-description">
          {currentCity.currentWeatherData.description}
        </label>
      </div>
      <div className="CW-icon">
        <img
          className="icon-img"
          src={currentCity.currentWeatherData.icon}
          alt={"Current Weather Icon"}
        />
      </div>
    </div>
  );
}
