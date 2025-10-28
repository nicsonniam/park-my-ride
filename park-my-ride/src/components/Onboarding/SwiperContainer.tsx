import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Box, Container, Typography, Button } from "@mui/material";
import Image from "next/image";

interface OnboardingSwiperProps {
  getStarted: () => void;
}

const welcomeSlideData = [
  {
    title: "Welcome to Park My Ride SG 🏍️",
    desc: "Find motorcycle parking anywhere in Singapore — fast and easy.",
    img: "/images/welcome_slide_motorcycle.png",
    img_alt: "Graphic of a motorcycle",
    cta: null,
  },
  {
    title: "Smart Search 🔎",
    desc: "Prefer typing? Search by address, keyword, or postal code for precise results.",
    img: "/images/welcome_slide_search.png",
    img_alt: "Graphic of a magnifying glass",
    cta: null,
  },
  {
    title: "Live Location Access 📍",
    desc: "Enable location to automatically detect your current area and show nearby parking spaces.",
    img: "/images/welcome_slide_location.png",
    img_alt: "Graphic of a location pin",
    cta: "Get Started",
  }
];

export default function OnboardingSwiper( { getStarted }: OnboardingSwiperProps ) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        px: 2,
        paddingLeft: 0,
        paddingRight: 0,
        mt: { xs: "-80px", sm: "-80px" },
      }}
    >
      <Container
        sx={{
          height:"100%"
        }}>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          style={{ overflow: "hidden" }}
        >
          {welcomeSlideData.map((data, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  height: "70vh",
                  bgcolor: "none",
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "left",
                  px: 2,
                  fontSize: 24,
                }}
              >
                <Image
                  src={data.img}
                  alt={data.img_alt}
                  width={200}
                  height={200}
                />
                <Box
                  sx={{ mt: 8 }}
                >
                  <Typography variant="h5" gutterBottom>
                    {data.title}
                  </Typography>
                  <Typography variant="body2">{data.desc}</Typography>
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    {data.cta && (
                      <Button variant="contained" onClick={getStarted}>
                        {data.cta ? data.cta : "Next"}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Container>
  );
} 
