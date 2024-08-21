"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import io from "socket.io-client";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [message, setMessage] = useState<number[]>([]);

  useEffect(() => {
    const socket = io("http://192.168.50.208:3003"); // Change the port if needed

    socket.on("connect", () => {
      // console.log("Connected to WebSocket server");
    });

    socket.on("message_from_vehicle", (data) => {
      setMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const initialCoords = message.length === 2 ? message : [24.4539, 54.3773];

      mapInstance.current = L.map(mapRef.current).setView(
        [initialCoords[0], initialCoords[1]],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance.current);

      markerRef.current = L.marker([initialCoords[0], initialCoords[1]])
        .addTo(mapInstance.current)
        .bindPopup("AU Vehicle 1 is located here!")
        .openPopup();
    } else if (mapInstance.current && message.length === 2) {
      const newCoords = [message[0], message[1]];

      mapInstance.current.setView([newCoords[0], newCoords[1]], 13);

      if (markerRef.current) {
        markerRef.current.setLatLng([newCoords[0], newCoords[1]]);
      } else {
        markerRef.current = L.marker([newCoords[0], newCoords[1]])
          .addTo(mapInstance.current)
          .bindPopup("AU Vehicle 1 is located here!")
          .openPopup();
      }
    }

    // Cleanup function to remove the map instance
    return () => {
      if (mapInstance.current) {
        mapInstance.current.off();
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [message]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

export default MapComponent;
