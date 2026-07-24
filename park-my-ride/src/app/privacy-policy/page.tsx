import { Container, Typography, Box } from "@mui/material";

export const metadata = {
  title: "Privacy Policy - Park My Ride SG",
};

export default function PrivacyPolicyPage() {
  return (
    <Container sx={{ mt: 4, pb: 8 }}>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Privacy Policy
      </Typography>

      <Typography variant="body1">
        At Park My Ride SG, your privacy matters to us. This Privacy Policy
        outlines how we handle information while you use our service.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        1. Use of Geolocation
      </Typography>
      <Typography variant="body1" paragraph>
        Park My Ride uses your device’s built-in browser geolocation feature to
        provide accurate, location-based parking recommendations. This
        functionality requires your explicit consent through your browser’s
        permission system.
      </Typography>
      <Typography variant="body1" paragraph>
        Your location data is processed locally on your device and is{" "}
        <Box sx={{ textDecoration: "underline" }} component="span">
          not
        </Box>{" "}
        collected, stored, or transmitted to our servers. We do not log, track,
        or record your real-time or historical location information.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        2. Information We Do Not Collect
      </Typography>
      <Typography variant="body1" paragraph>
        We do not collect or store any personally identifiable information, such
        as names, email addresses, or phone numbers. The app uses browser
        storage to save recently viewed locations to improve your experience.
        This information remains on your device and is not collected, monitored,
        or stored by us.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        3. Third-Party Data Sources
      </Typography>
      <Typography variant="body1" paragraph>
        The parking data displayed within Park My Ride SG originates from
        publicly available HDB and URA datasets, as well as
        community-contributed information. We do not control or influence how
        these third parties manage their data or APIs.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        4. Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        Because we do not collect or retain personal data, there is minimal risk
        of data exposure. Nevertheless, we follow standard best practices to
        ensure that your browsing experience remains safe and private.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        5. Updates to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        This Privacy Policy may be updated from time to time to reflect changes
        in our app features or relevant data protection laws. Any updates will
        be published on this page with an updated “Last Updated” date.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        6. Contact
      </Typography>
      <Typography variant="body1" paragraph>
        If you have questions or concerns regarding this Privacy Policy, please
        contact us through our official communication channels.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: July 2026
        </Typography>
      </Box>
    </Container>
  );
}
