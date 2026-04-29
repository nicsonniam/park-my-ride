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
import { useRouter } from "next/navigation";

export default function TopNav() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { label: "About", href: "/about" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar
        color="default"
        elevation={1}
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Park My Ride SG
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {links.map((link) => (
              <Button
                key={link.href}
                color="inherit"
                sx={{ textTransform: "none", ml: 2 }}
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            sx={{ display: { sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
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
