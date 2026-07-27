/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Collapse from "@mui/material/Collapse";

import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import BlockIcon from "@mui/icons-material/Block";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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

  const [showRates, setShowRates] = useState(false);

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
                  cursor: isMobile ? "pointer" : "default",
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
                    maxWidth: { xs: 270, sm: "unset" },
                    cursor: isMobile ? "pointer" : "default",
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
          gap="5px"
        >
          {type === "HDB" && (
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                minWidth: isMobile ? 160 : 300,
                maxWidth: isMobile ? 160 : "unset",
              }}
              noWrap
            >
              <LocalParkingIcon
                sx={{
                  height: 16,
                  width: 16,
                }}
              />
              {isMobile
                ? sentenceCase(cp.car_park_type.replace(/car park/i, ""))
                : sentenceCase(cp.car_park_type)}
            </Typography>
          )}

          {type === "URA" && (
            <Typography
              variant="body2"
              sx={{
                cursor: "default",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                lineHeight: 1,
                minWidth: isMobile ? 160 : 300,
                maxWidth: isMobile ? 160 : "unset",
                textWrap: "wrap",
              }}
              noWrap
            >
              <LocalParkingIcon
                sx={{
                  height: 16,
                  width: 16,
                }}
              />

              {cp.parkingSystem === "C"
                ? isMobile
                  ? COPY.carparks.general.coupon.replace(/car park/i, "")
                  : COPY.carparks.general.coupon
                : isMobile
                  ? COPY.carparks.general.electronic.replace(/car park/i, "")
                  : COPY.carparks.general.electronic}
            </Typography>
          )}

          {type === "Private" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: isMobile ? 160 : 300,
                maxWidth: isMobile ? 160 : "unset",
              }}
            >
              {cp.rates === "Free Parking" ? (
                <>
                  <MoneyOffIcon
                    sx={{
                      width: 16,
                      height: 16,
                      color: "success.main",
                    }}
                  />
                  <Typography variant="body2">
                    {COPY.carparks.rates.freeParking}
                  </Typography>
                </>
              ) : cp.rates === "No Motorcycle Parking" ? (
                <>
                  <BlockIcon
                    sx={{
                      width: 16,
                      height: 16,
                      color: "error.main",
                    }}
                  />
                  <Typography variant="body2">
                    {COPY.carparks.rates.noParking}
                  </Typography>
                </>
              ) : (
                <>
                  <AttachMoneyIcon
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                  />

                  <Button
                    variant="text"
                    size="small"
                    disableRipple
                    onClick={() => setShowRates((prev) => !prev)}
                    endIcon={
                      <ExpandMoreIcon
                        sx={{
                          transition: "transform 0.25s ease",
                          transform: showRates
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    }
                    sx={{
                      fontSize: "0.875rem",
                      color: "primary.contrastText",
                      height: "fit-content",
                      width: {
                        xs: 130,
                        sm: 140,
                      },
                      minWidth: 0,
                      p: 0,
                      textTransform: "none",
                      justifyContent: "space-between",

                      "& .MuiButton-endIcon": {
                        marginLeft: 0,
                      },
                    }}
                  >
                    {`${isMobile ? COPY.general.tapTo : COPY.general.clickTo} ${
                      showRates
                        ? COPY.general.hideRates
                        : COPY.general.showRates
                    }`}
                  </Button>
                </>
              )}
            </Box>
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
        {type === "Private" &&
          cp.rates !== "Free Parking" &&
          cp.rates !== "No Motorcycle Parking" && (
            <Collapse in={showRates}>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "grey.100",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {cp.rates.replace(/\\n/g, "\n")}
                  <br></br>
                  <br></br>
                  {COPY.carparks.general.gracePeriod}
                  {Number(cp.grace_period) === 0
                    ? "No grace period"
                    : cp.grace_period + COPY.carparks.general.minutes}
                </Typography>
              </Box>
            </Collapse>
          )}
      </CardContent>
    </Card>
  );
}
