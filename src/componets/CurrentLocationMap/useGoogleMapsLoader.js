// useGoogleMapsLoader.js
import { useJsApiLoader } from "@react-google-maps/api";

export const useGoogleMapsLoader = () => {
  return useJsApiLoader({
    id: "google-maps-script", // consistent ID
    googleMapsApiKey: "AIzaSyBcKRuHdKbXpAetOYXk0c6aZaogPw3jTek",
    libraries: ["places"], // use consistent libraries across app
  });
};
