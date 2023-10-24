import React from "react";
import { api_key } from "../assets/api_key";

export default function Weather() {
  const getCity = async (city) => {
    const baseUrl = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete";
    const query = `?apikey=${api_key}&q=${city}`;
    const url = baseUrl + query;
    const res = await fetch(url);
    const data = await res.json();
    return data[0];
  };

  const getCurrentWeather = async (locationKey) => {
    const baseUrl = "http://dataservice.accuweather.com/currentconditions/v1/";
    const query = `${locationKey}?apikey=${api_key}`;
    const url = baseUrl + query;
    const res = await fetch(url);
    const data = await res.json();
    return data[0];
  }

  const get5DaysWeather = async (locationKey) => {
    const baseUrl =
      "http://dataservice.accuweather.com/forecasts/v1/daily/5day/";
    const query = `${locationKey}?apikey=${api_key}&metric=true`;
    const url = baseUrl + query;
    const res = await fetch(url);
    const data = await res.json();

    return data;
  };

  getCity("tel aviv")
    .then((data) => {
      console.log(data.Key);
      get5DaysWeather(data.Key).then((data) => console.log(data));
      getCurrentWeather(data.Key).then((data) => console.log(data));
    })
    .catch((err) => console.log(err));

  return <div>Weather</div>;
}
