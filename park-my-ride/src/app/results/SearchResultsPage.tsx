/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter, notFound } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { OneMapResult } from "@/lib/onemap";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Stack,
  Drawer,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import SearchFilterSection from "./SearchFilterSection";
import { HDBCarpark, URACarpark, PrivateCarpark } from "@/types/carpark";
import MessageModal from "@/components/Common/MessageModal";
import ResultsTabs from "./ResultsTabs";
import theme from "@/theme";
import NavigationButtons from "./NavigationButtons";
import CarparkCard from "./CarparkCard";
import LocationSearch from "./LocationSearch";
import { sentenceCase } from "../constants/helpers";
import { useUIStore } from "@/stores/uiStore";
import IOSSwitch from "@/components/Common/IOSSwitch";
import { COPY } from "../constants/copy";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToggleSearch = useUIStore((state) => state.setToggleSearch);
  const toggleSearch = useUIStore((state) => state.toggleSearch);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const searchQuery = searchParams.get("search");

  const address =
    searchParams.get("address") === "null" ? null : searchParams.get("address");

  const [radius, setRadius] = useState<number>(200);
  const [loading, setLoading] = useState(false);

  const [searchVal, setSearchVal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [queryLength, setQueryLength] = useState(0);
  const [results, setResults] = useState<OneMapResult[]>([]);
  const [resultsLength, setResultsLength] = useState(0);

  const [hdbCarparks, setHdbCarparks] = useState<HDBCarpark[]>([]);
  const [uraCarparks, setUraCarparks] = useState<URACarpark[]>([]);
  const [privateCarparks, setPrivateCarparks] = useState<PrivateCarpark[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [toggleMap, setToggleMap] = useState(false);

  const [selectedCarpark, setSelectedCarpark] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [recentLocations, setRecentLocations] = useState<OneMapResult[]>([]);

  const fetchCarparks = async (lat: string, lon: string, radius: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/nearestCarparks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon, radius }),
      });

      const data = await res.json();

      setHdbCarparks(data.hdbCarparks || []);
      setUraCarparks(data.uraCarparks || []);
      setPrivateCarparks(
        ((data.privateCarparks as PrivateCarpark[]) || [])
          .map((cp) => ({
            _id: cp._id,
            location_name: cp.location_name || COPY.carparks.rates.unknown,
            address: cp.address || COPY.carparks.rates.unknown,
            rates: cp.rates || COPY.carparks.rates.noParking,
            distance: cp.distance,
            isNoParking: cp.isNoParking || false,
            verified: cp.verified ?? false,
            latitude: cp.latitude,
            longitude: cp.longitude,
          }))
          .sort((a, b) => Number(a.isNoParking) - Number(b.isNoParking)),
      );

      setToggleSearch(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch carparks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("recentLocations");
    if (stored) {
      setRecentLocations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (lat && lon) fetchCarparks(lat, lon, radius);
  }, [lat, lon, radius]);

  useEffect(() => {
    if (searchQuery !== null) {
      setCollapsed(true);
      setToggleSearch(true);
    }
  }, [searchQuery, setToggleSearch]);

  if ((!lat || !lon) && searchQuery === null) {
    notFound();
  }

  const clearRecent = () => {
    localStorage.removeItem("recentLocations");
    setRecentLocations([]);
  };

  const handleResultClick = (r: OneMapResult) => {
    setToggleSearch(false);
    setLoading(true);

    const key = "recentLocations";
    const recent: OneMapResult[] = JSON.parse(
      localStorage.getItem(key) ?? "[]",
    );

    const filtered = recent.filter(
      (item) => item.LATITUDE !== r.LATITUDE || item.LONGITUDE !== r.LONGITUDE,
    );

    const updatedRecent = [r, ...filtered].slice(0, 15);

    localStorage.setItem(key, JSON.stringify(updatedRecent));
    setRecentLocations(updatedRecent);

    setModalOpen(false);

    router.push(
      `/results?lat=${r.LATITUDE}&lon=${r.LONGITUDE}&address=${encodeURIComponent(
        r.ADDRESS,
      )}`,
    );
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setModalMessage(COPY.locationSearch.geolocationNotSupported);
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
        setModalMessage(COPY.locationSearch.unableToGetYourLocation);
        setModalOpen(true);
      },
    );
  };

  const openNavigation = (cp: any) => {
    setSelectedCarpark(cp);
    setDrawerOpen(true);
  };

  const renderCard = (cp: any, type: "HDB" | "URA" | "Private") => (
    <CarparkCard
      key={cp._id}
      cp={cp}
      type={type}
      isMobile={isMobile}
      openNavigation={openNavigation}
      sentenceCase={sentenceCase}
    />
  );

  const clearSearch = () => {
    setSearchVal("");
    setResults([]);
    setResultsLength(0);
    setQueryLength(0);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 1, pb: 6 }}>
      <SearchFilterSection
        clearSearch={clearSearch}
        lat={Number(lat)}
        lon={Number(lon)}
        collapsed={collapsed}
        disableRadius={!results}
        setCollapsed={setCollapsed}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        setResults={setResults}
        setQueryLength={setQueryLength}
        radius={radius}
        resultsLength={resultsLength}
        setRadius={setRadius}
        setResultsLength={setResultsLength}
        handleUseCurrentLocation={handleUseCurrentLocation}
      />
      {toggleSearch && (
        <LocationSearch
          clearRecent={clearRecent}
          recentLocations={recentLocations}
          results={results}
          queryLength={queryLength}
          handleResultClick={handleResultClick}
        />
      )}

      {!toggleSearch && (
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Stack
            alignItems="center"
            direction="row"
            gap="8px"
            justifyContent="flex-start"
          >
            <MyLocationIcon
              sx={{
                color: "primary.contrastText",
              }}
            />
            <Typography variant="h6" className="med">
              {isMobile
                ? COPY.locationSearch.nearYouMobile
                : COPY.locationSearch.nearYouDesktop}
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            gap="8px"
            justifyContent="flex-end"
          >
            <Typography variant="h6" className="med">
              {COPY.general.map}
            </Typography>
            <IOSSwitch
              checked={toggleMap}
              onChange={() => setToggleMap((prev) => !prev)}
            />
          </Stack>
        </Stack>
      )}

      {!toggleSearch &&
        (loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : error ? (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        ) : (
          <ResultsTabs
            toggleMap={toggleMap}
            hdbCarparks={hdbCarparks}
            uraCarparks={uraCarparks}
            privateCarparks={privateCarparks}
            renderCard={renderCard}
            lat={Number(lat)}
            lon={Number(lon)}
            openNavigation={openNavigation}
          />
        ))}

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              p: 2,
              pb: 8,
            },
          },
        }}
      >
        {selectedCarpark && (
          <NavigationButtons selectedCarpark={selectedCarpark} />
        )}
      </Drawer>

      <MessageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />
    </Container>
  );
}
