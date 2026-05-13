// Switched from AccuWeather (paid) to Open-Meteo (free, no API key)

const getCity = async (city) => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city,
    )}&count=1&language=en`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data || !data.results || data.results.length === 0) return null;
    const r = data.results[0];
    return {
      Key: `${r.latitude},${r.longitude}`,
      LocalizedName: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
    };
  } catch (error) {
    console.error("Error in getCity function:", error);
    throw error;
  }
};

export const getCitySuggestions = async (query, limit = 5) => {
  try {
    if (!query || query.trim().length === 0) return [];
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query,
    )}&count=${limit}&language=en`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data || !data.results) return [];
    return data.results.map((r) => {
      let code = null;
      if (r.country_code) code = String(r.country_code).toUpperCase();
      else if (r.country && String(r.country).length === 2)
        code = String(r.country).toUpperCase();
      return {
        displayName: `${r.name}, ${r.country}`,
        Key: `${r.latitude},${r.longitude}`,
        latitude: r.latitude,
        longitude: r.longitude,
        name: r.name,
        country: r.country,
        countryCode: code,
      };
    });
  } catch (error) {
    console.error("Error in getCitySuggestions:", error);
    return [];
  }
};

const get5DaysWeather = async (latitude, longitude, withMetric) => {
  try {
    const unit = withMetric ? "celsius" : "fahrenheit";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=${unit}&forecast_days=5`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in get5DaysWeather function:", error);
    throw error;
  }
};

const _getCurrentWeatherRaw = async (latitude, longitude) => {
  try {
    const urlC = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&temperature_unit=celsius`;
    const urlF = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&temperature_unit=fahrenheit`;
    const [resC, resF] = await Promise.all([fetch(urlC), fetch(urlF)]);
    const [dataC, dataF] = await Promise.all([resC.json(), resF.json()]);
    return { metric: dataC.current_weather, imperial: dataF.current_weather };
  } catch (error) {
    console.error("Error in _getCurrentWeatherRaw function:", error);
    throw error;
  }
};

// Backwards-compatible getCurrentWeather: accepts either (key) where key === "lat,lon" or (lat, lon)
export const getCurrentWeather = async (a, b) => {
  try {
    let latitude;
    let longitude;
    if (typeof b === "undefined" && typeof a === "string" && a.includes(",")) {
      [latitude, longitude] = a.split(",").map(Number);
    } else {
      latitude = a;
      longitude = b;
    }
    const raw = await _getCurrentWeatherRaw(latitude, longitude);
    // return in a shape similar to previous AccuWeather response used by the app
    return {
      Temperature: {
        Metric: { Value: raw.metric.temperature },
        Imperial: { Value: raw.imperial.temperature },
      },
      WeatherText: weatherCodeDescriptions[raw.metric.weathercode] || "",
      WeatherIcon: raw.metric.weathercode,
    };
  } catch (error) {
    console.error("Error in getCurrentWeather wrapper:", error);
    throw error;
  }
};

const weatherCodeToIcon = (code) => {
  // Map Open-Meteo / WMO codes to a simple icon name
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly_cloudy";
  // 3 = overcast -> lighter clouds icon
  if (code === 3) return "light_clouds";
  if (code === 45 || code === 48) return "fog";
  // Drizzle and light rain
  if (code === 51 || code === 61 || code === 80) return "light_rain";
  // Moderate rain
  if (code === 53 || code === 63 || code === 81) return "rain";
  // Dense drizzle / heavy rain / violent showers
  if (code === 55 || code === 65 || code === 82) return "heavy_rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95 && code <= 99) return "thunder";
  return "cloudy";
};

export const getIconSrc = (weatherCode) => {
  if (typeof weatherCode === "string")
    return `/weather-icons/${weatherCode}.svg`;
  const name = weatherCodeToIcon(weatherCode);
  return `/weather-icons/${name}.svg`;
};

const weatherCodeDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export async function getAllData(cityName) {
  try {
    const cityData = await getCity(cityName);
    if (!cityData) {
      throw new Error(`Can't find the city ${cityName}`);
    }
    const { latitude, longitude } = cityData;
    const [weatherData_C, weatherData_F] = await Promise.all([
      get5DaysWeather(latitude, longitude, true),
      get5DaysWeather(latitude, longitude, false),
    ]);

    const daysCount = Math.min(5, weatherData_C.daily.time.length);
    const fiveDaysData = Array.from({ length: daysCount }).map((_, index) => {
      return {
        minTemperatureInC: Math.round(
          weatherData_C.daily.temperature_2m_min[index],
        ),
        maxTemperatureInC: Math.round(
          weatherData_C.daily.temperature_2m_max[index],
        ),
        minTemperatureInF: Math.round(
          weatherData_F.daily.temperature_2m_min[index],
        ),
        maxTemperatureInF: Math.round(
          weatherData_F.daily.temperature_2m_max[index],
        ),
        icon: getIconSrc(weatherData_C.daily.weathercode[index]),
      };
    });

    const currentWeatherDataFromApiRaw = await _getCurrentWeatherRaw(
      latitude,
      longitude,
    );

    // choose icon, but prefer wind icon when windspeed is high
    let iconKey = currentWeatherDataFromApiRaw.metric.weathercode;
    const windspeed = currentWeatherDataFromApiRaw.metric.windspeed;
    if (typeof windspeed === "number" && windspeed > 30) {
      iconKey = "wind";
    }
    const currentWeatherData = {
      temperatureInC: Math.round(
        currentWeatherDataFromApiRaw.metric.temperature,
      ),
      temperatureInF: Math.round(
        currentWeatherDataFromApiRaw.imperial.temperature,
      ),
      description:
        (iconKey === "wind"
          ? "Windy"
          : weatherCodeDescriptions[
              currentWeatherDataFromApiRaw.metric.weathercode
            ]) || "",
      icon: getIconSrc(iconKey),
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
