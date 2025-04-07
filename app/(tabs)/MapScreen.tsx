import React from "react";
import Mapbox from "@rnmapbox/maps";
import { StyleSheet, View } from "react-native";

// Обязательно указать accessToken, для MapLibre можно использовать любой непустой токен
Mapbox.setAccessToken("ur6WmMmPGdh2DPsVyqmN");

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL="https://api.maptiler.com/maps/29f9c299-e494-494b-bcf8-953bbeabe523/style.json?key=ur6WmMmPGdh2DPsVyqmN"
      >
        <Mapbox.Camera
          zoomLevel={12}
          centerCoordinate={[37.6173, 55.7558]} // Пример: Москва
        />
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
