import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import YaMap, {
  Animation,
  CameraPosition,
  Marker,
  Point,
} from "react-native-yamap";
import cargps from "@/assets/images/cargpsalfa.png";
import * as Location from "expo-location";

const yandexApi = process.env.EXPO_PUBLIC_YANDEX_MAP_API;
const mapKey = "yandex-map-instance";

if (yandexApi) {
  // YaMap.setLocale("ru_RU");
  YaMap.init(yandexApi);
}

// if (yandexApi) {
//   YaMap.setLocale("ru_RU");
//   YaMap.init(yandexApi);
// }

// type State = {
//   marker?: Point;
//   polyline: Point[];
//   night: boolean;
//   address?: string;
// };
// const initialState: State = {
//   marker: undefined,
//   polyline: [],
//   night: false,
//   address: undefined,
// };

interface IYandexMapProps {
  location: Location.LocationObject | null;
}

const YandexMap = ({ location }: IYandexMapProps) => {
  // const [isInitialized, setIsInitialized] = useState(false);
  const mapRef = useRef<YaMap | null>(null);
  const [previousPosition, setPreviousPosition] = useState<Point | null>(null);

  const calculateAzimuth = (prev: Point, current: Point): number => {
    const { lat: lat1, lon: lon1 } = prev;
    const { lat: lat2, lon: lon2 } = current;

    const deltaLon = lon2 - lon1;
    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    let azimuth = Math.atan2(y, x) * (180 / Math.PI);

    // Корректируем до 0-360 градусов
    azimuth = (azimuth + 360) % 360;
    return Math.round(azimuth);
  };

  const handleOnPress = () => {
    if (location) {
      const { latitude, longitude, heading } = location.coords;
      const currentPosition = { lat: latitude, lon: longitude };
      // Рассчитываем азимут (курс)
      if (previousPosition) {
        const azimuth = heading !== null ? heading : 0;

        // Поворачиваем карту
        if (mapRef.current && azimuth !== null) {
          mapRef.current.setCenter(
            { ...currentPosition },
            14,
            azimuth,
            45,
            5,
            Animation.LINEAR
          );
        }
      }
      // Обновляем предыдущую позицию
      setPreviousPosition(currentPosition);
    }
  };

  useEffect(() => {
    if (location) {
      handleOnPress();
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <YaMap
        key={mapKey}
        ref={mapRef}
        nightMode={true}
        showUserPosition={true}
        followUser={true} // Включить отслеживание
        onMapLoaded={() => console.log("Карта загружена")} // Правильный обработчик
        style={styles.container}
        initialRegion={{
          lat: 54.1527,
          lon: 48.2646,
          zoom: 14,
          azimuth: 0,
          tilt: 45,
        }}
      >
        {/* <Marker
            children={
              <Image
                style={{ width: 100, height: 100 }}
                // src={cargps}
                source={cargps}
              />
            }
            point={{ lat: 55.751244, lon: 37.618423 }}
          /> */}
      </YaMap>

      <Text onPress={handleOnPress} style={styles.button}>
        ПОзиция
      </Text>
      <Text onPress={handleOnPress} style={styles.speed}>
        Скорость: {location?.coords.speed?.toFixed(2)}
      </Text>
    </View>
  );
};

export default YandexMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // eslint-disable-next-line react-native/no-color-literals
  button: {
    position: "absolute",
    color: "green",
    right: 16,
    bottom: 106,
  },
  speed: {
    position: "absolute",
    color: "red",
    right: 16,
    bottom: 206,
  },
});
