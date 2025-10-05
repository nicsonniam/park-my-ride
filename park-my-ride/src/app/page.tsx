"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { searchOnemap, OneMapResult } from "@/lib/onemap";

export default function Home() {
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OneMapResult[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const router = useRouter();
  const theme = useTheme();

  const logoSrc =
    theme.palette.mode === "dark"
      ? "/images/light-logo.png"
      : "/images/dark-logo.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    setLoading(true);
    setModalMessage(null);
    setResults([]);
    try {
      const json = await searchOnemap(searchVal, 1);

      if (json.totalNumPages > 1) {
        setModalMessage(
          "Too many results found. Please refine your search for a more precise location."
        );
      } else if (json.results && json.results.length > 0) {
        setResults(json.results);
      } else {
        setModalMessage("No results found. Please try a different search.");
      }

      setModalOpen(true);
    } catch (err) {
      console.error("OneMap error:", err);
      setModalMessage("Failed to fetch location. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setModalMessage("Geolocation not supported on this browser.");
      setModalOpen(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        router.push(`/results?lat=${latitude}&lon=${longitude}&address=null`);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setModalMessage("Unable to get your location.");
        setModalOpen(true);
      }
    );
  };

  const handleResultClick = (r: OneMapResult) => {
    setModalOpen(false);
    router.push(
      `/results?lat=${r.LATITUDE}&lon=${r.LONGITUDE}&address=${encodeURIComponent(
        r.ADDRESS
      )}`
    );
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
        px: 2,
        mt: { xs: "-80px", sm: "-80px" },
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          component="img"
          src={logoSrc}
          alt="Logo"
          sx={{
            display: "block",
            margin: "0 auto 16px auto",
            borderRadius: 2,
            maxHeight: 160,
            width: "auto",
          }}
        />

        <Typography variant="h5" gutterBottom>
          Find Nearby Motorcycle Parking
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: 2,
          }}
        >
          <TextField
            label="Search"
            placeholder="Address, keyword, or postal code"
            variant="outlined"
            fullWidth
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ mt: 1 }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ minHeight: 44 }}
            >
              {loading ? <CircularProgress size={20} /> : "Search"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleUseCurrentLocation}
              fullWidth
              sx={{ minHeight: 44 }}
            >
              Use Current Location
            </Button>
          </Stack>
        </Box>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="search-results-modal"
      >
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
          {modalMessage ? (
            <>
              <Typography color="error" gutterBottom>
                {modalMessage}
              </Typography>
              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(false)}
                  size="small"
                >
                  Close
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom id="search-results-modal">
                Select a location
              </Typography>
              <List>
                {results.map((r, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemButton onClick={() => handleResultClick(r)}>
                      <ListItemText primary={r.SEARCHVAL} secondary={r.ADDRESS} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ textAlign: "right", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(false)}
                  size="small"
                >
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
