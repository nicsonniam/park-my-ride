"use client";

import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import { OneMapResult } from "@/lib/onemap";

type Props = {
  open: boolean;
  onClose: () => void;
  results: OneMapResult[];
  message: string | null;
  resultsPageLength: number;
  onSelect: (r: OneMapResult) => void;
};

export default function ResultsModal({
  open,
  onClose,
  results,
  message,
  resultsPageLength,
  onSelect,
}: Props) {
  return (
    <Modal open={open} onClose={onClose}>
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
        {message ? (
          <>
            <Typography color="error" gutterBottom>
              {message}
            </Typography>

            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button variant="contained" onClick={onClose} size="small">
                Close
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Select a location
            </Typography>

            <List>
              {results.map((r, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton onClick={() => onSelect(r)}>
                    <ListItemText
                      primary={r.SEARCHVAL}
                      secondary={r.ADDRESS}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {resultsPageLength > 1 && (
              <Typography color="error" gutterBottom>
                Note: Only the first page of results is shown. Please refine your search.
              </Typography>
            )}

            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button variant="contained" onClick={onClose} size="small">
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
