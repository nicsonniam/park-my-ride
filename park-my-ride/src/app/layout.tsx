import type { Metadata } from "next";

import "./globals.css";

import { Box } from "@mui/material";

import TopNav from "@/components/Common/TopNav";
import BackToTopButton from "@/components/Common/BackToTopButton";

import Providers from "./providers";
import { clash } from "./fonts";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Park My Ride SG",
  description:
    "Park My Ride SG - Singapore's First dedicated motorcycle parking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clash.variable}>
      <body>
        <Providers>
          <TopNav />
          <Box sx={{ pt: 12 }}>
            {children}
            <BackToTopButton />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
