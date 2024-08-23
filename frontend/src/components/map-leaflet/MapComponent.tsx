"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import io from "socket.io-client";
import { Button, Box } from "@mui/material";
import { useAllVehicles } from "@/services/api/useAllVehicles";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { Vehicle } from "@/services/api/types/vehicle";
import { useSnackbar } from "notistack";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [fetchedVehicleId, setFetchedVehicleId] = useState<
    string | number | null
  >(null);
  const [message, setMessage] = useState<number[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    string | number | null
  >(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState<string>("");
  const { vehicles } = useAllVehicles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

    socket.on("connect", () => {});

    socket.on("message_from_vehicle", (data) => {
      setFetchedVehicleId(data[0]);
      setMessage(data[1]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const initialCoords = [24.4539, 54.3773];

      mapInstance.current = L.map(mapRef.current).setView(
        [initialCoords[0], initialCoords[1]],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance.current);
    }
  }, []); // Run only once when the component is mounted

  useEffect(() => {
    if (mapInstance.current && message.length === 2) {
      if (selectedVehicleId === fetchedVehicleId) {
        const newCoords = [message[0], message[1]];
        if (markerRef.current) {
          markerRef.current.setLatLng([newCoords[0], newCoords[1]]);
          markerRef.current
            .bindPopup(`${selectedVehicleName} is located here!`)
            .openPopup();
        } else {
          markerRef.current = L.marker([newCoords[0], newCoords[1]])
            .addTo(mapInstance.current)
            .bindPopup(`${selectedVehicleName} is located here!`)
            .openPopup();
        }
      }
    }
  }, [message, selectedVehicleId, selectedVehicleName]);

  useEffect(() => {
    if (selectedVehicleId && message.length !== 2) {
      enqueueSnackbar(`Location data unavailable for ${selectedVehicleName}!`, {
        variant: "error",
      });
    } else if (selectedVehicleId && selectedVehicleId !== fetchedVehicleId) {
      enqueueSnackbar(`Location data unavailable for ${selectedVehicleName}!`, {
        variant: "error",
      });

      if (markerRef.current) {
        mapInstance.current?.removeLayer(markerRef.current); // Remove the marker from the map
        markerRef.current = null; // Reset marker reference
      }
    }
  }, [selectedVehicleId]);

  const handleButtonClick = (vehicle: {
    id: number | string;
    name: string;
  }) => {
    setSelectedVehicleId(vehicle.id);
    setSelectedVehicleName(vehicle.name);
    setFetchedVehicleId(vehicle.id);
  };

  return (
    <>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
      <Box mt={2} display="flex" justifyContent="flex-start" gap={2}>
        {vehicles.map((vehicle) => (
          <Button
            key={vehicle.id}
            variant="contained"
            sx={{ backgroundColor: "#0088c7", color: "#fff" }}
            onClick={() => handleButtonClick(vehicle)}
          >
            {vehicle.name}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default withPageRequiredAuth(MapComponent);
