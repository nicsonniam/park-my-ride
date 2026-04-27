"use client";

import OnboardingSwiper from "@/components/Onboarding/SwiperContainer";
import TitleFade from "@/components/Common/TitleFade";
import LocationSearch from "@/components/LocationSearch/LocationSearch";
import ResultsModal from "@/components/LocationSearch/ResultsModal";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { searchOnemap, OneMapResult } from "@/lib/onemap";

export default function Home() {
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OneMapResult[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [resultsPageLength, setResultsPageLength] = useState(1);

  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasCookie = document.cookie.includes("hasSeenWelcome=true");
      setShowWelcome(!hasCookie);
      setShowLanding(hasCookie);
      document.cookie = "hasSeenWelcome=true; path=/; max-age=31536000";
    } else {
      setShowLanding(true);
      setShowWelcome(false);
    }
  }, []);

  const getStarted = () => {
    setShowWelcome(false);
    setShowLanding(true);
  };

  const logoSrc =
    theme.palette.mode === "dark"
      ? "/images/light-logo.png"
      : "/images/dark-logo.png";

  const handleSubmit = async (
    e: React.FormEvent,
    pageNum: number = 1
  ) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    setLoading(true);
    setModalMessage(null);
    setResults([]);

    try {
      const json = await searchOnemap(searchVal, pageNum);

      if (json.results?.length > 0) {
        setResults(json.results);
        setResultsPageLength(json.totalNumPages || 1);
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
        router.push(
          `/results?lat=${latitude}&lon=${longitude}&address=null`
        );
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

  if (showLanding === false && showWelcome === true) {
    return <OnboardingSwiper getStarted={getStarted} />;
  }

  if (showLanding === true && showWelcome === false) {
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

          <TitleFade
            firstTitle={
              <>
                SG&apos;s <strong>FIRST</strong> dedicated motorcycle parking app
              </>
            }
            secondTitle="Find Nearby Motorcycle Parking"
            textAlign="center"
            delay={3000}
          />

          <LocationSearch
            searchVal={searchVal}
            setSearchVal={setSearchVal}
            loading={loading}
            onSubmit={handleSubmit}
            onUseCurrentLocation={handleUseCurrentLocation}
          />
        </Box>

        <ResultsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          results={results}
          message={modalMessage}
          resultsPageLength={resultsPageLength}
          onSelect={handleResultClick}
        />
      </Container>
    );
  }

  return null;
}
