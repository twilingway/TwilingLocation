"use dom";
import maplibregl from "maplibre-gl";
// import Map from "react-map-gl/maplibre";
// import ReactDOMServer from "react-dom/server";
import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { StyleSheet, useWindowDimensions } from "react-native";
import markerIcon from "../../../assets/images/cargps.png";

import "maplibre-gl/dist/maplibre-gl.css";

export default function MapLibreDOMComponent({
  location,
  iconUrl = markerIcon,
}: {
  dom: import("expo/dom").DOMProps;
} & { location: Location.LocationObject | null; iconUrl?: any }) {
  const { height } = useWindowDimensions();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  console.log("MapLibreDOMComponent :>> ", MapLibreDOMComponent);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      // Инициализация карты
      const coordinate: maplibregl.LngLatLike = location?.coords
        ? [location.coords.longitude, location.coords.latitude]
        : [37.6173, 55.7558];
      map.current = new maplibregl.Map({
        container: "mapLibre",
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=ur6WmMmPGdh2DPsVyqmN",
        center: coordinate,
        zoom: 10,
      });
    }

    // Добавление маркера с иконкой
    if (map.current && location && iconUrl) {
      // Создаем HTML-элемент для иконки
      console.log("iconUrl :>> ", iconUrl);
      const markerElement = document.createElement("div");
      markerElement.style.backgroundImage = `url(${markerIcon.uri})`;
      markerElement.style.width = "60px"; // Ширина иконки
      markerElement.style.height = "60px"; // Высота иконки
      markerElement.style.backgroundSize = "cover"; // Растягиваем изображение

      // Создаем маркер и добавляем его на карту
      new maplibregl.Marker({ element: markerElement })
        .setLngLat([location.coords.longitude, location.coords.latitude]) // Устанавливаем координаты
        .addTo(map.current); // Добавляем маркер на карту

      map.current.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          visualizeRoll: true,
          showZoom: true,
          showCompass: true,
        })
      );
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [location, iconUrl]);

  return (
    // <div style={styles.div}>
    <div
      id="mapLibre"
      ref={mapContainer}
      style={{ ...styles.container, height: height }}
    />
    // </div>
  );
}

const styles = StyleSheet.create({
  // div: {
  //   height: 500,
  // },
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  image: {
    position: "absolute",
    top: 100,
    left: 100,
    width: 100,
    height: 100,
  },
});
