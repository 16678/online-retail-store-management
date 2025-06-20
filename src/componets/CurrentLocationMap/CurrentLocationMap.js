import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

// Moved useJsApiLoader to separate shared component
import { useGoogleMapsLoader } from "./useGoogleMapsLoader"; // Create this hook (shown below)

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 17.385044, // Hyderabad
  lng: 78.486671,
};

const destination = {
  lat: 17.4375, // HITEC City
  lng: 78.4483,
};

const CurrentLocationMap = () => {
  const [currentPosition, setCurrentPosition] = useState(centerDefault);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const { isLoaded, loadError } = useGoogleMapsLoader();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const directionsCallback = (response) => {
    if (response && response.status === "OK") {
      setDirectionsResponse(response);
    } else {
      console.error("Directions request failed:", response);
    }
  };

  if (loadError) {
    return <p>Map cannot be loaded. Please check API key and billing settings.</p>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition}
      zoom={14}
    >
      {!directionsResponse && (
        <DirectionsService
          options={{
            origin: currentPosition,
            destination: destination,
            travelMode: "DRIVING",
          }}
          callback={directionsCallback}
        />
      )}

      {directionsResponse && (
        <DirectionsRenderer
          options={{ directions: directionsResponse }}
        />
      )}

      <Marker position={currentPosition} />
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default CurrentLocationMap;
