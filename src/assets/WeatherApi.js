import { api_key } from "./api_key";

const getCity = async (city) => {
  try {
    const baseUrl =
      "https://dataservice.accuweather.com/locations/v1/cities/autocomplete";
    const query = `?apikey=${api_key}&q=${city}`;
    const url = baseUrl + query;
    const res = await fetch(url);
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error("Error in getCity function:", error);
    throw error;
  }
};

export const getCurrentWeather = async (locationKey) => {
  try {
    const baseUrl = "https://dataservice.accuweather.com/currentconditions/v1/";
    const query = `${locationKey}?apikey=${api_key}`;
    const url = baseUrl + query;
    const res = await fetch(url);
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error("Error in getCurrentWeather function:", error);
    throw error;
  }
};

const get5DaysWeather = async (locationKey, withMetric) => {
  try {
    const baseUrl =
      "https://dataservice.accuweather.com/forecasts/v1/daily/5day/";
    const query = withMetric
      ? `${locationKey}?apikey=${api_key}&metric=true`
      : `${locationKey}?apikey=${api_key}`;
    const url = baseUrl + query;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in get5DaysWeather function:", error);
    throw error;
  }
};

export const getIconSrc = (iconNumber) => {
  if (iconNumber < 10) {
    iconNumber = "0" + iconNumber;
  }
  const baseUrl = "https://developer.accuweather.com/sites/default/files/";
  const query = `${iconNumber}-s.png`;
  return baseUrl + query;
};

export async function getAllData(cityName) {
  try {
    const cityData = await getCity(cityName);
    if (!cityData) {
      throw new Error(`Can't find the city ${cityName}`);
    }
    const weatherData_C = await get5DaysWeather(cityData.Key, true);
    const weatherData_F = await get5DaysWeather(cityData.Key, false);
    const fiveDaysData = weatherData_C.DailyForecasts.slice(0, 5).map(
      (day, index) => {
        return {
          minTemperatureInC: Math.round(day.Temperature.Minimum.Value),
          maxTemperatureInC: Math.round(day.Temperature.Maximum.Value),
          minTemperatureInF: Math.round(
            weatherData_F.DailyForecasts[index].Temperature.Minimum.Value
          ),
          maxTemperatureInF: Math.round(
            weatherData_F.DailyForecasts[index].Temperature.Maximum.Value
          ),
          icon: getIconSrc(day.Day.Icon),
        };
      }
    );
    const currentWeatherDataFromApi = await getCurrentWeather(cityData.Key);
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

    return {
      cityName: cityData.LocalizedName,
      searchValue: cityName,
      fiveDaysData,
      currentWeatherData,
      key: cityData.Key,
      lastDateRequest: new Date().getTime(),
      isFavorite: false,
    };
  } catch (error) {
    console.error("Error in getAllData function:", error);
    throw error;
  }
}
