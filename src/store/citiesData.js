import { createSlice } from "@reduxjs/toolkit";
import { getCurrentWeather, getIconSrc } from "../assets/WeatherApi";
import { getAllData } from "../assets/WeatherApi";

let initialCurrentCity;
try {
  initialCurrentCity = await getAllData("tel aviv");
} catch (error) {
  console.error("Error in getAllData function:", error);
  throw error;
}
const initialState = {
  citiesList: [initialCurrentCity],
  currentCity: initialCurrentCity,
};
const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setCurrentCityByKey(state, action) {
      const newCurrentCity = state.citiesList.find(
        (city) => city.key === action.payload
      );
      state.currentCity = newCurrentCity;
    },
    setCurrentCity(state, action) {
      state.currentCity = action.payload;
    },
    setIsFavorite(state, action) {
      const updatedCity = state.citiesList.find(
        (city) => city.key === action.payload
      );

      if (updatedCity) {
        updatedCity.isFavorite = !updatedCity.isFavorite;
      }
      if (updatedCity.key === state.currentCity.key) {
        state.currentCity.isFavorite = updatedCity.isFavorite;
      }
    },
    async changeCurrentWeatherOfCity(state, action) {
      const key = action.payload;
      const cityToUpdate = state.citiesList.find((city) => city.key === key);

      if (cityToUpdate) {
        cityToUpdate.lastDateRequest = new Date().getTime();
        const currentWeatherDataFromApi = await getCurrentWeather(key);
        const currentWeatherData = {
          temperatureInC: Math.round(
            currentWeatherDataFromApi.Temperature.Metric.Value
          ),
          temperatureInF: Math.round(
            currentWeatherDataFromApi.Temperature.Imperial.Value
          ),
          description: currentWeatherDataFromApi.WeatherText,
          icon: getIconSrc(currentWeatherDataFromApi.WeatherIcon),
        };
        cityToUpdate.currentWeatherData = currentWeatherData;
      }
    },
    add(state, action) {
      const currentCity = state.citiesList.find(
        (city) => city.key === action.payload.key
      );
      if (!currentCity) {
        state.citiesList.push(action.payload);
      }
    },
    delete(state, action) {
      const updatedState = state.citiesList.filter(
        (item) => item.key !== action.payload
      );
      return { citiesList: updatedState };
    },
  },
});

export const citiesActions = citiesSlice.actions;
export const citiesReducer = citiesSlice.reducer;
