import { Container, Typography, Box } from "@mui/material";

export const metadata = {
  title: "Terms & Conditions - Park My Ride",
};

export default function TermsPage() {
  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Terms & Conditions
      </Typography>

      <Typography variant="body1" paragraph>
        Welcome to <strong>Park My Ride SG</strong>. By accessing or using our platform, you agree to the following Terms & Conditions. Please read them carefully before using the service.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        1. General Information
      </Typography>
      <Typography variant="body1" paragraph>
        Park My Ride SG provides information about motorcycle parking locations across Singapore. The data displayed on this site is sourced from publicly available HDB and URA datasets, as well as community-contributed or crowdsourced sources. While we make every effort to ensure accuracy, the information provided may not always reflect the most current conditions.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        2. Accuracy and Liability
      </Typography>
      <Typography variant="body1" paragraph>
        We do not guarantee the accuracy, completeness, or reliability of any parking information presented. Users are strongly encouraged to verify all parking details on-site or through official channels before parking.
      </Typography>
      <Typography variant="body1" paragraph>
        Park My Ride SG shall not be held responsible for any inconvenience, fines, or loss arising from inaccurate data, misinterpretation of parking rules, or situations where riders get lost or park incorrectly due to the information provided on the site.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        3. Crowdsourced Information
      </Typography>
      <Typography variant="body1" paragraph>
        Some data, such as private or lesser-known parking spots, are submitted by users and community members. Such information is provided on a best-effort basis and may not be verified. Park My Ride SG reserves the right to remove, edit, or reject submitted information at its discretion.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        4. Use of Service
      </Typography>
      <Typography variant="body1" paragraph>
        You agree to use Park My Ride responsibly and solely for its intended purpose—to locate motorcycle parking. Any misuse of the platform, including attempts to upload false information or misuse location data, is strictly prohibited.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        5. Changes to These Terms
      </Typography>
      <Typography variant="body1" paragraph>
        Park My Ride SG reserves the right to modify these Terms & Conditions at any time without prior notice. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms.
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        6. Contact
      </Typography>
      <Typography variant="body1" paragraph>
        For feedback, corrections, or data contribution requests, please contact us via our official communication channels.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: October 2025
        </Typography>
      </Box>
    </Container>
  );
}
