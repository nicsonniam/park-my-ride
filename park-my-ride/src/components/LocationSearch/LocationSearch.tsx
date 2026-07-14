"use client";

import { Box, Button, Stack, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { COPY } from "@/app/constants/copy";

type Props = {
  searchVal: string;
  setSearchVal: (val: string) => void;
  loading: boolean;
  handleSearchClick: () => void;
  onUseCurrentLocation?: () => void;
};

export default function LocationSearch({
  loading,
  handleSearchClick,
  onUseCurrentLocation,
}: Props) {
  return (
    <Box
      sx={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: "flex",
        gap: 1.5,
        flexDirection: onUseCurrentLocation ? "column" : "row",
        height: 300,
        mt: 2,
        pt: 2,
        px: 2,
        width: "100%",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
          onClick={handleSearchClick}
          fullWidth
          sx={{
            color: "primary.contrastText",
            backgroundColor: "secondary.contrastText",
            minHeight: 44,
            justifyContent: "flex-start",
          }}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <SearchIcon sx={{ mr: 0.3 }} />
              {COPY.locationSearch.search}
            </>
          )}
        </Button>

        {onUseCurrentLocation && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={onUseCurrentLocation}
            fullWidth
            sx={{ minHeight: 44, justifyContent: "flex-start" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "text.primary",
                    borderRadius: 10,
                    mr: 1,
                    height: "44px",
                    width: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationOnOutlinedIcon
                    sx={{ color: "secondary.contrastText" }}
                  />
                </Box>
                {COPY.locationSearch.useCurrentLocation}
              </Box>
              <KeyboardArrowRightIcon />
            </Box>
          </Button>
        )}
      </Stack>
    </Box>
  );
}
