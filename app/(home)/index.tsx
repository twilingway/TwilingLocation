import { useSetAtom } from "jotai";
import { StyleSheet, Text, View } from "react-native";
import { logoutAtom } from "../../entities/auth/model/auth.state";
import { Button } from "../../shared/Button/Button";
import WebView from "react-native-webview";
import MapLibreDOMComponent from "../../entities/maplibre/ui/MapLibre";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";
import Mapbox from "@rnmapbox/maps";
import YaMap from "react-native-yamap";

const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
console.log("token :>> ", token);
if (token) {
  Mapbox.setAccessToken(token);
}

export default function MyCourses() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    (async () => {
      try {
        // Запрашиваем разрешение на использование геолокации
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg(
            "Разрешение на использование геолокации не предоставлено"
          );
          return;
        }

        // Подписываемся на обновления геолокации
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000, // Обновление каждые 5 секунд
            distanceInterval: 10, // Минимальное расстояние между обновлениями
          },
          (newLocation) => {
            console.log("Новое местоположение:", newLocation);
            setLocation(newLocation);
          }
        );
      } catch (error) {
        console.error("Ошибка при получении геолокации:", error);
      }
    })();

    // Очищаем подписку при размонтировании компонента
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  let text = "Ожидание...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords);
    console.log("location :>> ", location);
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map} />

      <YaMap
        userLocationIcon={{
          uri: "https://www.clipartmax.com/png/middle/180-1801760_pin-png.png",
        }}
        initialRegion={{
          lat: 55.751244,
          lon: 37.618423,
          zoom: 10,
          azimuth: 0,
          // tilt: 100,
        }}
        style={{ flex: 1 }}
      />
      <Text>Координаты: {text}</Text>
      {location && location.timestamp && (
        <Text>Время: {new Date(location?.timestamp).toLocaleString()}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // text: {
  //   color: "#ff0000",
  // },
  container: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
  },
  map: {
    flex: 1,
  },
});
