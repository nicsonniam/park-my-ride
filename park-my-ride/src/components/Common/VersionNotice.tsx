"use client";
import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function VersionNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 8,
        left: 8,
        right: 8,
        backgroundColor: "rgba(255, 152, 0, 0.9)",
        color: "white",
        px: 2,
        py: 1,
        borderRadius: 1,
        fontSize: "0.75rem",
        zIndex: 1000,
        boxShadow: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        wordBreak: "break-word",
      }}
    >
      <Typography variant="caption" sx={{ flexGrow: 1 }}>
        ⚠️ Alpha version 1.0.2 – data is still being collected; bugs or missing info may be present.
      </Typography>
      <IconButton
        size="small"
        onClick={() => setVisible(false)}
        sx={{ color: "white", p: 0.5 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
