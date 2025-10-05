"use client";

import { useState } from "react";
import {
  Container,
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { searchOnemap } from "../lib/onemap";

export default function Home() {
  const [searchVal, setSearchVal] = useState("");
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const logoSrc = theme.palette.mode === "dark" ? "/images/light-logo.png" : "/images/dark-logo.png";

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    setLoading(true);
    try {
      const data = await searchOnemap(searchVal);
      console.log(data);
      
      setResult(data);
      setOpen(true);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          component="img"
          src={logoSrc}
          alt="placeholder"
          sx={{
            display: "block",
            margin: "0 auto 20px auto",
            borderRadius: 2,
            maxHeight: 200,
            width: "auto",
          }}
        />
        <Typography variant="h5" gutterBottom>
          Search
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </Box>

      {/* Modal for results */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          {result?.results?.length ? (
            result.results.map((item, idx) => (
              <Box key={idx} sx={{ mb: 2, textAlign: "left" }}>
                <Typography variant="subtitle1">{item.SEARCHVAL}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.ADDRESS}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Lat: {item.LATITUDE}, Lng: {item.LONGITUDE}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No results found</Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
