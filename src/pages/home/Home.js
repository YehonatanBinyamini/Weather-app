import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { citiesActions } from "../../store/citiesData";
import "./home.css";
import Search from "../../components/search/Search";
import Card from "../../components/Card";
import ErrorModal from "../../components/ErrorModal";
import CurrentWeatherHome from "../../components/currentWeatherHome/CurrentWeatherHome";
import { getNextFourDays } from "../../assets/next4Days";
import { getAllData } from "../../assets/WeatherApi";

export default function Home() {

  const cities = useSelector((state) => state.cities.citiesList);
  const currentCity = useSelector((state) => state.cities.currentCity);
  const dispatch = useDispatch();

  const [nextFourDays, setNextFourDays] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleSearchClick = () => {
    if (searchValue.length > 0){
      setIsLoading(true);
      fetchData(searchValue.toLowerCase()).catch((error) => {
        setIsLoading(false);
        setError(error.message); 
      });
    }
  };

  useEffect(() => {
    const nextFourDaysData = getNextFourDays();
    setNextFourDays(nextFourDaysData);
  }, []);

  const fetchData = async (cityName) => {
    const hourInMS = 36 * 10 ** 5;
    const currentTimestamp = new Date().getTime();
    try {
      const cityIsAvailable = cities.some(
        (item) =>
          item.searchValue === cityName &&
          new Date(item.lastDateRequest).toLocaleDateString() ===
            new Date(currentTimestamp).toLocaleDateString()
      );

      if (cityIsAvailable) {
        const cityData = cities.filter((item) => item.searchValue === cityName);
        // check if need to replace current weather:
        if (cityData[0].lastDateRequest + hourInMS < currentTimestamp) {
          dispatch(citiesActions.changeCurrentWeatherOfCity(cityData[0].key));
        }
        setIsLoading(false);
        dispatch(citiesActions.setCurrentCity(cityData[0]));
      } else {
        const weatherData = await getAllData(cityName); // Pass the city to the data fetching function
        setIsLoading(false);
        dispatch(citiesActions.setCurrentCity(weatherData));
        dispatch(citiesActions.add(weatherData));
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="home-container">
      <div className="current-data">
        <Search
          onSearchChange={handleSearchChange}
          onSearchClick={handleSearchClick}
          isLoading={isLoading}
        />
        {currentCity && currentCity.fiveDaysData ? (
          <CurrentWeatherHome />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="five-days">
        {currentCity && currentCity.fiveDaysData ? (
          currentCity.fiveDaysData.map((item, index) => (
            <Card
              key={index}
              day={index === 0 ? "Today" : nextFourDays[index - 1]}
              minTemperatureInC={item.minTemperatureInC}
              maxTemperatureInC={item.maxTemperatureInC}
              minTemperatureInF={item.minTemperatureInF}
              maxTemperatureInF={item.maxTemperatureInF}
              icon={item.icon}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <ErrorModal
        isOpen={error !== null}
        onClose={() => setError(null)}
        errorMessage={error}
      />
    </div>
  );
}
