"use client";

import {
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  message: string | null;
};

export default function MessageModal({ open, onClose, message }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2.5,
          width: "90%",
          maxWidth: 360,
          maxHeight: "70vh",
          overflowY: "auto",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            my: 2,
          }}
        >
          <Typography
            variant="h6"
            color="error"
            sx={{
              textAlign: "center",
              mb: 4,
            }}
            gutterBottom
          >
            {message}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                width: "100%",
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
