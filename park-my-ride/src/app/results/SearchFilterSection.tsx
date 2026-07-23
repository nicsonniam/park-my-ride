"use client";

import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import { OneMapResult, searchOnemap } from "@/lib/onemap";

import { Dispatch, SetStateAction } from "react";
import { useUIStore } from "@/stores/uiStore";
import { COPY } from "../constants/copy";

type Props = {
  lon?: number;
  lat?: number;
  collapsed: boolean;
  disableRadius: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  searchVal: string;
  setSearchVal: Dispatch<SetStateAction<string>>;
  setResults: Dispatch<SetStateAction<OneMapResult[]>>;
  setQueryLength: Dispatch<SetStateAction<number>>;
  radius: number;
  setRadius: Dispatch<SetStateAction<number>>;
  handleUseCurrentLocation?: () => void;
  clearSearch?: () => void;
  resultsLength: number;
  setResultsLength: Dispatch<SetStateAction<number>>;
};

const distRadiusOptions = [100, 200, 300, 500, 700, 1000];

export default function SearchFilterSection({
  clearSearch,
  lat,
  lon,
  collapsed,
  setCollapsed,
  searchVal,
  setSearchVal,
  setResults,
  setQueryLength,
  radius,
  setRadius,
  handleUseCurrentLocation,
  resultsLength,
  setResultsLength,
}: Props) {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const setToggleSearch = useUIStore((state) => state.setToggleSearch);
  const toggleSearch = useUIStore((state) => state.toggleSearch);

  const handleSearch = (value: string) => {
    setSearchVal(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      const query = value.trim();
      setQueryLength(query.length);

      if (query.length <= 3) {
        setResults([]);
        setResultsLength(0);
        return;
      }

      try {
        const json = await searchOnemap(query);

        if (json.results?.length > 0) {
          setResults(json.results);
          setResultsLength(json.results.length);
        } else {
          setResults([]);
          setResultsLength(0);
        }
      } catch (error) {
        console.error("OneMap search error:", error);
        setResults([]);
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="center"
        sx={{
          mb: 2,
          gap: 1.5,
        }}
      >
        <Box
          onClick={
            collapsed
              ? undefined
              : () => {
                  setCollapsed((prev) => !prev);
                  setToggleSearch(true);
                }
          }
          sx={{
            alignItems: "center",
            bgcolor: "secondary.contrastText",
            borderRadius: 30,
            display: "flex",
            cursor: collapsed ? "default" : "pointer",
            height: 64,
            justifyContent: collapsed ? "" : "center",
            overflow: "hidden",
            px: collapsed ? "25px" : 0,
            width: collapsed ? "100%" : 80,
            transition: (theme) =>
              theme.transitions.create(["width", "padding"], {
                duration: 300,
                easing: theme.transitions.easing.easeInOut,
              }),
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexShrink: 0,
              width: collapsed ? "100%" : "fit-content",
            }}
          >
            <SearchIcon
              sx={{
                color: "secondary.main",
                flexShrink: 0,
              }}
            />

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                overflow: "hidden",
                width: collapsed ? "100%" : 0,
                opacity: collapsed ? 1 : 0,
                transition: "width 300ms ease, opacity 150ms ease",
              }}
            >
              <TextField
                label={COPY.general.search}
                placeholder={COPY.general.typeToSearchLocation}
                fullWidth
                value={searchVal}
                onFocus={() => setToggleSearch(true)}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{
                  backgroundColor: "secondary.contrastText",
                  borderRadius: 20,
                }}
                slotProps={{
                  inputLabel: {
                    sx: {
                      "&.MuiInputLabel-shrink": {
                        display: "none",
                      },
                    },
                  },
                }}
              />
              {searchVal.length > 3 && clearSearch && (
                <Box
                  onClick={() => clearSearch()}
                  sx={{
                    p: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20px",
                    backgroundColor: "text.secondary",
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "secondary.contrastText",
                      height: "15px",
                      width: "15px",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          onClick={
            collapsed && lat && lon
              ? () => {
                  setCollapsed((prev) => !prev);
                  setToggleSearch(false);
                }
              : undefined
          }
          sx={{
            alignItems: "center",
            bgcolor: "secondary.main",
            borderRadius: 30,
            display: "flex",
            cursor: "pointer",
            height: 64,
            overflow: "hidden",
            justifyContent: collapsed ? "center" : "",
            px: collapsed ? 0 : "25px",
            width: collapsed ? 80 : "100%",
            transition: (theme) =>
              theme.transitions.create(["width", "padding"], {
                duration: 300,
                easing: theme.transitions.easing.easeInOut,
              }),
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexShrink: 0,
              width: collapsed ? "fit-content" : "100%",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 24,
                height: 24,
              }}
            >
              <MyLocationIcon
                sx={{
                  color: "secondary.contrastText",
                  position: "absolute",
                  inset: 0,
                  transition: "transform 250ms ease, opacity 250ms ease",
                  opacity: !lat || !lon ? 1 : toggleSearch ? 0 : 1,
                  transform: toggleSearch
                    ? "rotate(-90deg) scale(0.75)"
                    : "rotate(0deg) scale(1)",
                }}
              />

              <CloseIcon
                sx={{
                  color: "secondary.contrastText",
                  position: "absolute",
                  inset: 0,
                  transition: "transform 250ms ease, opacity 250ms ease",
                  opacity: !lat || !lon ? 0 : toggleSearch ? 1 : 0,
                  transform: toggleSearch
                    ? "rotate(0deg) scale(1)"
                    : "rotate(90deg) scale(0.75)",
                }}
              />
            </Box>

            <Box
              sx={{
                overflow: "hidden",
                width: collapsed ? 0 : "100%",
                opacity: collapsed ? 0 : 1,
                transition: "width 300ms ease, opacity 150ms ease",
              }}
            >
              <Select
                IconComponent={KeyboardArrowDownIcon}
                value={radius.toString()}
                onChange={(e) => setRadius(Number(e.target.value))}
                sx={{
                  width: "100%",
                  color: "secondary.contrastText",
                  "& .MuiSelect-icon": {
                    color: "secondary.contrastText",
                  },
                }}
              >
                {distRadiusOptions.map((r) => (
                  <MenuItem key={r} value={r}>
                    {COPY.general.within}{" "}
                    {r < 1000
                      ? `${r}${COPY.general.metre}`
                      : COPY.general.kilometre}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Box>
      </Stack>
      {resultsLength === 0 && toggleSearch && (
        <Stack>
          <Button
            color="inherit"
            sx={{
              borderBottom: "1px solid",
              borderColor: "text.secondary",
              borderRadius: 0,
              gap: "6px",
              justifyContent: "flex-start",
              pl: 0,
              py: "24px",
              textTransform: "none",
            }}
            onClick={handleUseCurrentLocation}
          >
            <PlaceOutlinedIcon />
            <Typography variant="h6">{COPY.general.useMyLocation}</Typography>
          </Button>
        </Stack>
      )}
    </>
  );
}
