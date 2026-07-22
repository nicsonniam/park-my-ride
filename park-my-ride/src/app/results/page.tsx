// app/results/page.tsx
"use client";

import { Suspense } from "react";
import SearchResultsPage from "./SearchResultsPage";
import { Box, CircularProgress } from "@mui/material";

export default function ResultsPageWrapper() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <SearchResultsPage />
    </Suspense>
  );
}
