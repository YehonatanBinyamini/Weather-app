import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./favorites.css";

import Favorite from "../../components/favorite/Favorite";
import { favoritesActions } from "../../store/favorites";
import { citiesActions } from "../../store/citiesData";
import { Typography } from "@mui/material";
import { SentimentNeutral } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Favorites() {
  const isSmallerScreen = useMediaQuery("(max-width:500px)");

  const favorites = useSelector((state) => state.favorites.favoritesList);
  const dispatch = useDispatch();

  function deleteHandler(key) {
    dispatch(favoritesActions.delete(key));
    dispatch(citiesActions.setIsFavorite(key));
  }

  return (
    <div className="favorites-container">
      {favorites.length === 0 ? (
        <>
          <Typography
            variant={isSmallerScreen ? "h6" : "h4"}
            fontWeight={500}
            component="div"
          >
            There Is No Favorites Cities
          </Typography>
          <SentimentNeutral size="60"></SentimentNeutral>
        </>
      ) : (
        favorites.map((favorite) => (
          <Favorite
            key={favorite.key}
            cityKey={favorite.key}
            city={favorite.cityName}
            temperatureInC={favorite.currentWeatherData.temperatureInC}
            temperatureInF={favorite.currentWeatherData.temperatureInF}
            icon={favorite.currentWeatherData.icon}
            description={favorite.currentWeatherData.description}
            onRemove={() => deleteHandler(favorite.key)}
          />
        ))
      )}
    </div>
  );
}
