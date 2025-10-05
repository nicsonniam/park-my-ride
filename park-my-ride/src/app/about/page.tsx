import { Container, Typography } from "@mui/material";

export const metadata = {
  title: "About - Park My Ride",
};

export default function AboutPage() {
  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Welcome to Park My Ride
      </Typography>

      <Typography variant="body1" paragraph>
        Ever searched for “Where to park at _” and ended up on a page that only talks about car parking for cars? Motorcyclists often face a lack of centralized, accurate information on where they can park safely and conveniently.
      </Typography>

      <Typography variant="body1" paragraph>
        Park My Ride solves this by pulling publicly available HDB and URA carpark data and recommending the nearest motorcycle parking spots based on your geolocation.
      </Typography>

      <Typography variant="body1" paragraph>
        In addition, private motorcycle parking data is crowdsourced from forums and community chat groups to help you find hidden or lesser-known parking options.
      </Typography>
    </Container>
  );
}
