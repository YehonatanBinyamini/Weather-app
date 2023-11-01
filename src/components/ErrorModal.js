import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          borderRadius: 4,
          width: "13rem",
          height: "8rem",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Error Occurred
        </Typography>
        <Typography variant="body1" gutterBottom color="WindowText" style={{justifyContent:"center", textAlign:"center"}}>
          {errorMessage === "Failed to fetch" ? "The Accuweather's api is blocked" : errorMessage}
        </Typography>
        <Button onClick={onClose} variant="contained" style={{justifyContent: "flex-end", position: "absolute",
         bottom: "0",
          left: "50%",
          transform: "translate(-50%, -50%)",}} color="primary">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
