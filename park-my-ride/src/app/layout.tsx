import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VersionNotice from "@/components/Common/VersionNotice";
import { Box } from "@mui/material";
import TopNav from "@/components/Common/TopNav";
import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Park My Ride SG",
  description: "Park My Ride SG - Singapore's First dedicated motorcycle parking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopNav />
        <Box sx={{ mt: 10 }}>{children}</Box>
        {/* <VersionNotice /> */}
      </body>
    </html>
  );
}
