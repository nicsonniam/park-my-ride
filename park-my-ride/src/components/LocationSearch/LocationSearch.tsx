"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

type Props = {
  searchVal: string;
  setSearchVal: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onUseCurrentLocation?: () => void;
};

export default function LocationSearch({
  searchVal,
  setSearchVal,
  loading,
  onSubmit,
  onUseCurrentLocation,
}: Props) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
      sx={{
        display: "flex",
        flexDirection: onUseCurrentLocation ? "column" : "row",
        gap: 1.5,
        mt: 2,
        width: "100%"
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

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{ minHeight: 44 }}
        >
          {loading ? <CircularProgress size={20} /> : "Search"}
        </Button>
        {onUseCurrentLocation &&
          <Button
            type="button"
            variant="outlined"
            onClick={onUseCurrentLocation}
            fullWidth
            sx={{ minHeight: 44 }}
          >
            Use Current Location
          </Button>}
      </Stack>
    </Box>
  );
}
