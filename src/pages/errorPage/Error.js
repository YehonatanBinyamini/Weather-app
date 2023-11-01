import React from "react";
import Header from "../../components/header/Header";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useMediaQuery from "@mui/material/useMediaQuery";

const ErrorPage = ({ errorMessage }) => {
  const isSmallerScreen = useMediaQuery("(max-width:500px)");

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "4rem",
          height: "100vh",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: "red" }} />
        <Typography
          variant="h4"
          sx={{ marginTop: 2, fontSize: isSmallerScreen ? "1rem" : "2rem" }}
        >
          {errorMessage || "Oops! Something went wrong..."}
        </Typography>
      </Box>
    </>
  );
};

export default ErrorPage;
