/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";

import LocalParkingIcon from "@mui/icons-material/LocalParking";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpIcon from "@mui/icons-material/Help";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import BlockIcon from "@mui/icons-material/Block";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { COPY } from "../constants/copy";

type ParkingType = "HDB" | "URA" | "Private";

type ParkingCardProps = {
  cp: any;
  type: ParkingType;
  isMobile: boolean;
  openNavigation: (cp: any) => void;
  sentenceCase: (text: string) => string;
};

export default function CarparkCard({
  cp,
  type,
  isMobile,
  openNavigation,
  sentenceCase,
}: ParkingCardProps) {
  const tooltipProps = {
    slotProps: {
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [80, -20],
            },
          },
        ],
      },
    },
  };

  const title =
    type === "HDB"
      ? cp.car_park_no
      : type === "URA"
        ? cp.ppCode
        : cp.location_name;

  const subtitle =
    type === "HDB" ? cp.address : type === "URA" ? cp.ppName : cp.address;

  return (
    <Card sx={{ mb: 1, borderRadius: 4, boxShadow: "none" }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Box sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
            <Tooltip
              title={type === "Private" ? cp.location_name : null}
              {...tooltipProps}
            >
              <Typography
                variant="h6"
                className="med"
                sx={{
                  textTransform: "uppercase",
                  maxWidth: { xs: 250, sm: "unset" },
                  cursor: type === "Private" ? "pointer" : "default",
                }}
                noWrap
              >
                {title}
              </Typography>
            </Tooltip>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Tooltip
                title={type === "Private" ? cp.address : null}
                {...tooltipProps}
              >
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    maxWidth: { xs: 280, sm: "unset" },
                    cursor: "pointer",
                  }}
                  noWrap
                >
                  {subtitle}
                </Typography>
              </Tooltip>

              {/* {type === "Private" && (
                <Tooltip title={cp.verified ? "Verified" : "Not Verified"}>
                  <CheckCircleIcon
                    fontSize="small"
                    sx={{
                      color: cp.verified ? "success.main" : "gray",
                    }}
                  />
                </Tooltip>
              )} */}
            </Box>
          </Box>

          {(type === "HDB" ||
            type === "URA" ||
            (type === "Private" && !cp.isNoParking)) && (
            <Button
              sx={{
                minWidth: 0,
                width: 42,
                height: 42,
                backgroundColor: "primary.contrastText",
              }}
              onClick={() => openNavigation(cp)}
            >
              <ArrowOutwardIcon
                sx={{
                  color: "secondary.contrastText",
                }}
              />
            </Button>
          )}
        </Stack>

        <Stack
          sx={{ mt: "11px" }}
          direction="row"
          alignItems="center"
          spacing={1}
          gap="24px"
        >
          {type === "HDB" && (
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                minWidth: 140,
              }}
              noWrap
            >
              <LocalParkingIcon
                sx={{
                  height: 16,
                  width: 16,
                }}
              />
              {sentenceCase(cp.car_park_type.replace(/car park/i, ""))}
            </Typography>
          )}

          {type === "URA" && (
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 140,
              }}
              noWrap
            >
              {cp.vehCat === "Motorcycle" ? (
                <CheckCircleIcon
                  sx={{
                    height: 16,
                    width: 16,
                    color: "success.main",
                  }}
                />
              ) : (
                <HelpIcon
                  sx={{
                    height: 16,
                    width: 16,
                    color: "warning.main",
                  }}
                />
              )}

              {cp.vehCat === "Motorcycle"
                ? "Available"
                : "Unknown availability"}
            </Typography>
          )}

          {type === "Private" && (
            <Tooltip
              title={cp.rates}
              {...tooltipProps}
              leaveDelay={isMobile ? 10000 : 0}
            >
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 140,
                }}
                noWrap
              >
                {cp.rates === "Free Parking" ? (
                  <MoneyOffIcon
                    sx={{
                      height: 16,
                      width: 16,
                      color: "success.main",
                    }}
                  />
                ) : cp.rates === "No Motorcycle Parking" ? (
                  <BlockIcon
                    sx={{
                      height: 16,
                      width: 16,
                      color: "error.main",
                    }}
                  />
                ) : (
                  <AttachMoneyIcon
                    sx={{
                      height: 16,
                      width: 16,
                    }}
                  />
                )}

                {cp.rates === "Free Parking"
                  ? COPY.carparks.rates.freeParking
                  : cp.rates === "No Motorcycle Parking"
                    ? COPY.carparks.rates.noParking
                    : `${isMobile ? COPY.general.tapAndHold : COPY.general.hover} ${COPY.carparks.rates.forRates}`}
              </Typography>
            </Tooltip>
          )}

          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            color="primary.contrastText"
          >
            <PlaceOutlinedIcon
              sx={{
                height: 16,
                width: 16,
              }}
            />
            {Math.round(cp.distance)}
            {COPY.general.distAway}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
