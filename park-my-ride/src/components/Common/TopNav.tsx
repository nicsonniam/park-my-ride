"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { COPY } from "@/app/constants/copy";

export default function TopNav() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { label: "About", href: "/about" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        color="default"
        elevation={1}
        sx={{
          backgroundColor: "secondary.contrastText",
          borderRadius: 16,
          boxShadow: "none",
          color: "black",
          mx: {
            xs: 1,
            sm: 3,
          },
          my: 2,
          width: {
            xs: "calc(100% - 16px)",
            sm: "calc(100% - 48px)",
          },
          overflow: "hidden",
        }}
      >
        <Toolbar
          sx={{
            pl: 1,
            justifyContent: "space-between",
          }}
        >
          <Box
            onClick={() => router.push("/")}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "secondary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TwoWheelerIcon sx={{ color: "secondary.contrastText" }} />
            </Box>

            <Typography variant="body1">{COPY.nav.appName}</Typography>
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            {links.map((link) => (
              <Button
                key={link.href}
                color="inherit"
                sx={{
                  ml: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              bgcolor: "background.paper",
              borderRadius: "50%",
              width: 40,
              height: 40,
              "&:hover": {
                bgcolor: "secondary.contrastText",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 24,
                height: 24,
              }}
            >
              <MenuIcon
                sx={{
                  position: "absolute",
                  inset: 0,
                  transition: "transform 250ms ease, opacity 250ms ease",
                  opacity: drawerOpen ? 0 : 1,
                  transform: drawerOpen
                    ? "rotate(-90deg) scale(0.75)"
                    : "rotate(0deg) scale(1)",
                }}
              />

              <CloseIcon
                sx={{
                  position: "absolute",
                  inset: 0,
                  transition: "transform 250ms ease, opacity 250ms ease",
                  opacity: drawerOpen ? 1 : 0,
                  transform: drawerOpen
                    ? "rotate(0deg) scale(1)"
                    : "rotate(90deg) scale(0.75)",
                }}
              />
            </Box>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
        }}
      >
        <Box sx={{ width: 240 }} role="presentation">
          <List>
            {links.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  onClick={() => {
                    router.push(link.href);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
