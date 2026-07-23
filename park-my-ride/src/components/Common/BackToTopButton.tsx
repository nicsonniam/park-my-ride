"use client";

import { useEffect, useState } from "react";
import { Fab, Fade } from "@mui/material";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';

type Props = {
  threshold?: number;
};

export default function BackToTopButton({
  threshold = 300,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={visible}>
      <Fab
        onClick={scrollToTop}
        aria-label="back to top"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1200,
          backgroundColor: "secondary.main",
          color: "secondary.contrastText",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "secondary.main",
            boxShadow: "none",
          },
        }}
      >
        <ArrowUpwardOutlinedIcon />
      </Fab>
    </Fade>
  );
}
