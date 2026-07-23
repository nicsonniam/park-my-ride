"use client";

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { OneMapResult } from "@/lib/onemap";
import { COPY } from "../constants/copy";
import { useState } from "react";

type RecentLocationsProps = {
  recentLocations: OneMapResult[];
  results: OneMapResult[];
  queryLength: number;
  handleResultClick: (r: OneMapResult) => void;
  clearRecent: () => void;
};

export default function LocationSearch({
  clearRecent,
  recentLocations,
  results,
  queryLength,
  handleResultClick,
}: RecentLocationsProps) {
  const [showAllRecent, setShowAllRecent] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        height: "100%",
        mt: 2,
      }}
    >
      {queryLength <= 3 && queryLength > 0 && (
        <>
          <Typography
            variant="body1"
            sx={{ textAlign: "center" }}
            className="med"
          >
            {COPY.general.tooManyResults}
          </Typography>
        </>
      )}

      {results.length !== 0 && queryLength > 3 && (
        <>
          <Typography variant="body2" sx={{ m: 0 }} gutterBottom>
            {COPY.general.results}
          </Typography>
          <Stack>
            <List>
              {results.map((r, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton
                    sx={{
                      px: 0,
                      py: "24px",
                      borderBottom: "1px solid",
                      borderColor: "text.secondary",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResultClick(r);
                    }}
                  >
                    <NearMeOutlinedIcon sx={{ mr: 2 }} />
                    <ListItemText primary={r.SEARCHVAL} secondary={r.ADDRESS} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
        </>
      )}

      {(results === null || results.length === 0) && queryLength > 3 && (
        <>
          <Stack direction="column">
            <Typography
              variant="body1"
              sx={{ textAlign: "center" }}
              className="med"
            >
              {COPY.general.noLocationsFound}
            </Typography>
          </Stack>
        </>
      )}

      {(results === null || results.length === 0) && queryLength === 0 && (
        <>
          {recentLocations.length > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">{COPY.general.recent}</Typography>
              <Box onClick={clearRecent}>
                <Typography variant="body2">{COPY.general.clear}</Typography>
              </Box>
            </Stack>
          )}
          <Stack direction="column">
            {recentLocations
              .slice(0, showAllRecent ? 15 : 10)
              .map((location) => (
                <Button
                  key={`${location.LATITUDE}-${location.LONGITUDE}`}
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
                  onClick={() => handleResultClick(location)}
                >
                  <HistoryIcon />

                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "left",
                      ml: 1,
                      maxHeight: "40px",
                      overflow: "hidden",
                    }}
                  >
                    {location.ADDRESS}
                  </Typography>
                </Button>
              ))}

            {!showAllRecent && recentLocations.length > 10 && (
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
                onClick={() => setShowAllRecent(true)}
              >
                <Typography
                  variant="body1"
                  className="med"
                  sx={{ textAlign: "center", width: "100%" }}
                >
                  {COPY.general.moreFromRecentHistory}
                </Typography>
              </Button>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}
