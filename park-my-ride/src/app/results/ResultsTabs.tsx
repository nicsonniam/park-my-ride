/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import {
  HDBCarpark,
  URACarpark,
  PrivateCarpark,
  MapCarpark,
} from "@/types/carpark";
import ParkingMapWrapper from "@/components/Map/ParkingMapWrapper";
import { mapCarparks } from "@/components/Map/MapCarparkMapper";
import { COPY } from "../constants/copy";

type Props = {
  hdbCarparks: HDBCarpark[];
  uraCarparks: URACarpark[];
  privateCarparks: PrivateCarpark[];
  toggleMap: boolean;
  lat: number;
  lon: number;
  openNavigation?: (cp: MapCarpark) => void;
  renderCard: (
    carpark: any,
    type: "HDB" | "URA" | "Private",
  ) => React.ReactNode;
};

export default function ResultsTabs({
  hdbCarparks,
  uraCarparks,
  privateCarparks,
  openNavigation,
  renderCard,
  toggleMap,
  lat,
  lon,
}: Props) {
  const [tab, setTab] = useState(0);

  const mapCarparkList = (type: "HDB" | "URA" | "Private" | "All") => {
    switch (type) {
      case "HDB":
        return mapCarparks(hdbCarparks, [], []);

      case "URA":
        return mapCarparks([], uraCarparks, []);

      case "Private":
        return mapCarparks([], [], privateCarparks);

      case "All":
      default:
        return mapCarparks(hdbCarparks, uraCarparks, privateCarparks);
    }
  };

  const renderList = (
    carparks: any[],
    type: "HDB" | "URA" | "Private",
    emptyMessage: string | null,
  ) =>
    carparks.length
      ? carparks.map((cp) => renderCard(cp, type))
      : emptyMessage && (
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 4,
              minHeight: "105px",
              padding: 2,
            }}
          >
            <Typography variant="h6">{emptyMessage}</Typography>
          </Box>
        );

  return (
    <>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label={COPY.carparks.types.all} />
        <Tab
          label={COPY.carparks.types.hdb}
          disabled={hdbCarparks.length === 0}
        />
        <Tab
          label={COPY.carparks.types.ura}
          disabled={uraCarparks.length === 0}
        />
        <Tab
          label={COPY.carparks.types.other}
          disabled={privateCarparks.length === 0}
        />
      </Tabs>

      <Box sx={{ mt: 1 }}>
        {tab === 0 && (
          <>
            {hdbCarparks.length === 0 &&
            uraCarparks.length === 0 &&
            privateCarparks.length === 0 ? (
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 4,
                  minHeight: "105px",
                  padding: 2,
                }}
              >
                <Typography variant="h6">
                  {COPY.carparks.noParking.noParkingFound}
                </Typography>
              </Box>
            ) : (
              <>
                {toggleMap &&
                (hdbCarparks.length > 0 ||
                  uraCarparks.length > 0 ||
                  privateCarparks.length > 0) ? (
                  <ParkingMapWrapper
                    spots={mapCarparkList("All")}
                    center={[lat, lon]}
                    zoom={18}
                    openNavigation={openNavigation}
                  />
                ) : (
                  <>
                    {renderList(hdbCarparks, "HDB", null)}
                    {renderList(uraCarparks, "URA", null)}
                    {renderList(privateCarparks, "Private", null)}
                  </>
                )}
              </>
            )}
          </>
        )}

        {tab === 1 &&
          (toggleMap && hdbCarparks.length > 0 ? (
            <ParkingMapWrapper
              spots={mapCarparkList("HDB")}
              center={[lat, lon]}
              zoom={18}
              openNavigation={openNavigation}
            />
          ) : (
            renderList(
              hdbCarparks,
              "HDB",
              COPY.carparks.noParking.noParkingFoundWithType.replace(
                "TYPE",
                COPY.carparks.types.hdb,
              ),
            )
          ))}

        {tab === 2 &&
          (toggleMap && uraCarparks.length > 0 ? (
            <ParkingMapWrapper
              spots={mapCarparkList("URA")}
              center={[lat, lon]}
              zoom={18}
              openNavigation={openNavigation}
            />
          ) : (
            renderList(
              uraCarparks,
              "URA",
              COPY.carparks.noParking.noParkingFoundWithType.replace(
                "TYPE",
                COPY.carparks.types.ura,
              ),
            )
          ))}

        {tab === 3 &&
          (toggleMap && privateCarparks.length > 0 ? (
            <ParkingMapWrapper
              spots={mapCarparkList("Private")}
              center={[lat, lon]}
              zoom={18}
              openNavigation={openNavigation}
            />
          ) : (
            renderList(
              privateCarparks,
              "Private",
              COPY.carparks.noParking.noParkingFoundWithType.replace(
                "TYPE",
                COPY.carparks.types.private,
              ),
            )
          ))}
      </Box>
    </>
  );
}
