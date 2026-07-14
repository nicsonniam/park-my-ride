"use client";

import LocationSearch from "@/components/LocationSearch/LocationSearch";
import MessageModal from "@/components/Common/MessageModal";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Container, Box, Typography, Slide, Fade } from "@mui/material";

import { COPY } from "@/app/constants/copy";
import { useUIStore } from "@/stores/uiStore";

export default function Home() {
  const setToggleSearch = useUIStore((state) => state.setToggleSearch);

  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setModalMessage(COPY.locationSearch.geolocationNotSupported);
      setModalOpen(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setToggleSearch(false);
        const { latitude, longitude } = pos.coords;
        router.push(`/results?lat=${latitude}&lon=${longitude}&address=null`);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setModalMessage(COPY.locationSearch.unableToGetYourLocation);
        setModalOpen(true);
      },
    );
  };

  const handleSearchClick = () => {
    setModalOpen(false);
    router.push("/results?search=");
  };

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          backgroundImage: 'url("/images/bike2.png")',
          backgroundPosition: "center",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          maxHeight: "calc(100vh - 100px)",
          overflow: "hidden",
          px: 0,
        }}
      >
        <Fade in={true} timeout={800}>
          <Typography
            variant="h2"
            className="med"
            sx={{
              textAlign: "left",
              fontWeight: 500,
              lg: "100px",
              marginTop: {
                md: "80px",
                sm: "32px",
                xs: "32px",
              },
              px: 2,
              typography: {
                xs: "h2",
                sm: "h1",
              },
            }}
          >
            {COPY.main.title}
          </Typography>
        </Fade>
        <Slide direction="up" in timeout={900}>
          <Box
            sx={{
              width: "100%",
            }}
          >
            <LocationSearch
              searchVal={searchVal}
              setSearchVal={setSearchVal}
              loading={loading}
              handleSearchClick={handleSearchClick}
              onUseCurrentLocation={handleUseCurrentLocation}
              showDisclaimer={true}
            />
          </Box>
        </Slide>
        <MessageModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          message={modalMessage}
        />
      </Container>
    </>
  );
}
