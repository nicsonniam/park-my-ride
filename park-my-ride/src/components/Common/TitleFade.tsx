"use client";

import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

type FadeTitleProps = {
  firstTitle: ReactNode;
  secondTitle: ReactNode;
  delay?: number; // default: 4000ms
  textAlign?: "left" | "center" | "right";
};

export default function FadeTitle({
  firstTitle,
  secondTitle,
  delay = 4000,
  textAlign = "left",
}: FadeTitleProps) {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFirst(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box sx={{ position: "relative", height: "40px" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          position: "absolute",
          width: "100%",
          opacity: showFirst ? 1 : 0,
          transition: "opacity 1s ease",
          textAlign,
        }}
      >
        {firstTitle}
      </Typography>

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          position: "absolute",
          width: "100%",
          opacity: showFirst ? 0 : 1,
          transition: "opacity 1s ease",
          textAlign,
        }}
      >
        {secondTitle}
      </Typography>
    </Box>
  );
}
