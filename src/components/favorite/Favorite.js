import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { citiesActions } from "../../store/citiesData";

const Favorite = ({
  cityKey,
  city,
  temperatureInC,
  temperatureInF,
  icon,
  description,
  onRemove,
}) => {
  const units = useSelector((state) => state.units);
  const dispatch = useDispatch();

  const isSmallerScreen = useMediaQuery("(max-width:500px)");
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onRemove();
  };

  const handleFavoriteClick = () => {
    dispatch(citiesActions.setCurrentCityByKey(cityKey));
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "80%",
        height: "4.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#b4c4c4",
        marginBottom: "1rem",
        "&:hover": {
          backgroundColor: "#aad5f5",
        },
        "@media (max-width:500px)": {
          height: "auto",
          "& .description-typo": {
            display: "none",
          },
        },
      }}
      onClick={handleFavoriteClick}
    >
      <Typography
        className="city-typo"
        variant="h1"
        sx={{
          flex: 2, // Takes up 2/7 of the space (28.57%)
          fontWeight: 600,
          fontSize: isSmallerScreen ? "1rem" : "2rem",
        }}
      >
        {city}
      </Typography>
      {units === "C" ? (
        <Typography
          className="temperature-typo"
          variant="h3"
          sx={{
            flex: 2, // Takes up 1/7 of the space (14.29%)
            textAlign: "center",
            fontSize: isSmallerScreen ? "1rem" : "2rem",
          }}
        >
          {temperatureInC}°C
        </Typography>
      ) : (
        <Typography
          className="temperature-typo"
          variant="h3"
          sx={{
            flex: 2, // Takes up 1/7 of the space (14.29%)
            textAlign: "center",
            fontSize: isSmallerScreen ? "1rem" : "2rem",
          }}
        >
          {temperatureInF}°F
        </Typography>
      )}
      <Typography
        className="description-typo"
        variant="body1"
        sx={{
          flex: 2, // Takes up 2/7 of the space (28.57%)
          textAlign: "center",
          fontSize: "1.5rem",
        }}
      >
        {description}
      </Typography>
      <Box
        sx={{
          flex: 2, // Takes up 2/7 of the space (28.57%)
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <img src={icon} alt="Weather Icon" style={{ width: "4rem" }} />
      </Box>
      <IconButton
        sx={{
          color: "red",
          flex: 1,
          borderRadius: "50%",
          "&:hover": {
            background: "none",
          },
        }}
        onClick={handleDeleteClick}
      >
        <DeleteIcon
          sx={{
            "&:hover": {
              color: "#cc0000",
            },
          }}
        />
      </IconButton>
    </Box>
  );
};

export default Favorite;
