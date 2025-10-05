// app/results/page.tsx
import { Suspense } from "react";
import ResultsPage from "./ResultsPage";
import { Box, CircularProgress } from "@mui/material";

export default function ResultsPageWrapper() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      <ResultsPage />
    </Suspense>
  );
}
