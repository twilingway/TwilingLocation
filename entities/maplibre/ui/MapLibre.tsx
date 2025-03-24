"use dom";
import maplibregl from "maplibre-gl";
// import Map from "react-map-gl/maplibre";
// import ReactDOMServer from "react-dom/server";
import { useEffect, useRef } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import { StyleSheet, useWindowDimensions } from "react-native";

export default function MapLibreDOMComponent({
  name,
}: {
  dom: import("expo/dom").DOMProps;
} & { name: string }) {
  const mapContainer = useRef<maplibregl.Map | null>(null);
  const { height } = useWindowDimensions();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "mapLibre",
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=ur6WmMmPGdh2DPsVyqmN",
      center: [37.6173, 55.7558],
      zoom: 10,
    });

    return () => map.remove();
  }, []);

  return (
    <div
      id="mapLibre"
      ref={() => mapContainer}
      style={{ ...styles.container, height: height }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
