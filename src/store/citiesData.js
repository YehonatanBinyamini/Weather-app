import { createSlice } from "@reduxjs/toolkit";
import { getCurrentWeather, getIconSrc } from "../assets/WeatherApi";
import { getAllData } from "../assets/WeatherApi";

const CITIES_KEY = "weatherApp.cities";
const CURRENT_KEY = "weatherApp.currentCity";

const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load from localStorage:", key, err);
    return null;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to save to localStorage:", key, err);
  }
};

let initialCurrentCity = loadFromStorage(CURRENT_KEY);
let initialCitiesList = loadFromStorage(CITIES_KEY);
if (!initialCurrentCity || !initialCitiesList) {
  try {
    const fetched = await getAllData("tel aviv");
    initialCurrentCity = initialCurrentCity || fetched;
    initialCitiesList = initialCitiesList || [initialCurrentCity];
  } catch (error) {
    console.error("Error in getAllData function:", error);
    throw error;
  }
}

const initialState = {
  citiesList: initialCitiesList,
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
      saveToStorage(CURRENT_KEY, state.currentCity);
    },
    setCurrentCity(state, action) {
      state.currentCity = action.payload;
      saveToStorage(CURRENT_KEY, state.currentCity);
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
      saveToStorage(CITIES_KEY, state.citiesList);
      saveToStorage(CURRENT_KEY, state.currentCity);
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
        saveToStorage(CITIES_KEY, state.citiesList);
        if (state.currentCity && state.currentCity.key === key) {
          state.currentCity = cityToUpdate;
          saveToStorage(CURRENT_KEY, state.currentCity);
        }
      }
    },
    add(state, action) {
      const currentCity = state.citiesList.find(
        (city) => city.key === action.payload.key
      );
      if (!currentCity) {
        state.citiesList.push(action.payload);
        saveToStorage(CITIES_KEY, state.citiesList);
      }
    },
    delete(state, action) {
      const updatedState = state.citiesList.filter(
        (item) => item.key !== action.payload
      );
      saveToStorage(CITIES_KEY, updatedState);
      // if currentCity was deleted, unset it or pick first
      if (state.currentCity && state.currentCity.key === action.payload) {
        state.currentCity = updatedState.length > 0 ? updatedState[0] : null;
        saveToStorage(CURRENT_KEY, state.currentCity);
      }
      return { citiesList: updatedState };
    },
  },
});

export const citiesActions = citiesSlice.actions;
export const citiesReducer = citiesSlice.reducer;
