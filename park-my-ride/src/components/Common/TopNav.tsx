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
import { useUIStore } from "@/stores/uiStore";

export default function TopNav() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { label: "About", href: "/about" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const setToggleSearch = useUIStore((state) => state.setToggleSearch);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
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
          margin: "16px 8px",
          maxWidth: "calc(100% - 16px)",
          overflow: "hidden",
        }}
      >
        <Toolbar sx={{ paddingLeft: "8px", justifyContent: "space-between" }}>
          <Box
            onClick={() => router.push("/")}
            sx={{ display: "flex", gap: "8px", alignItems: "center" }}
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
            <Typography variant="body1" sx={{ cursor: "pointer" }}>
              {COPY.nav.appName}
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {links.map((link) => (
              <Button
                key={link.href}
                color="inherit"
                sx={{
                  textTransform: "none",
                  ml: 2,
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
            sx={{
              bgcolor: "background.paper",
              borderRadius: "50%",
              display: { sm: "none" },
              height: 40,
              width: 40,
              "&:hover": {
                bgcolor: "secondary.contrastText",
              },
            }}
            onClick={() => {
              if (toggleSearch) {
                setToggleSearch(false);
              } else {
                handleDrawerToggle();
              }
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
                  opacity: toggleSearch ? 0 : 1,
                  transform: toggleSearch
                    ? "rotate(-90deg) scale(0.75)"
                    : "rotate(0deg) scale(1)",
                }}
              />

              <CloseIcon
                sx={{
                  inset: 0,
                  opacity: toggleSearch ? 1 : 0,
                  position: "absolute",
                  transition: "transform 250ms ease, opacity 250ms ease",
                  transform: toggleSearch
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
        sx={{ display: { sm: "none" } }}
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
