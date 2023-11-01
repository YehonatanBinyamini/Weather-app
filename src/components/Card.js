import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

const CardComponent = ({
  day,
  minTemperatureInC,
  maxTemperatureInC,
  minTemperatureInF,
  maxTemperatureInF,
  icon,
}) => {
  const units = useSelector((state) => state.units);

  return (
    <Card
      variant="outlined"
      style={classes.muiCard}
    >
      <CardContent
        style={classes.cardContent}
      >
        <Typography variant="h4" fontWeight={500} component="div">
          {day}
        </Typography>
        {units === "C" ? (
          <Typography color="text.secondary">
            {minTemperatureInC}°C - {maxTemperatureInC}°C
          </Typography>
        ) : (
          <Typography color="text.secondary">
            {minTemperatureInF}°F - {maxTemperatureInF}°F
          </Typography>
        )}
        <img
          src={icon}
          alt="Weather Icon"
          style={{ width: 140, marginTop: "1rem" }}
        />
      </CardContent>
    </Card>
  );
};

export default CardComponent;

const classes = {
  muiCard: {
    minWidth: 200,
    margin: 15,
    borderRadius: "15px",
    minHeight: 200,
    alignContent: "center",
    background: "#add8e6",
  },

cardContent: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}
}