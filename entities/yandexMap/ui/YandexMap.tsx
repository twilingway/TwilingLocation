import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import YaMap, { CameraPosition, Marker, Point } from "react-native-yamap";
import cargps from "@/assets/images/cargpsalfa.png";

const yandexApi = process.env.EXPO_PUBLIC_YANDEX_MAP_API;
const mapKey = "yandex-map-instance";

YaMap.setLocale("ru_RU");
if (yandexApi) {
  YaMap.init(yandexApi);
}

type State = {
  marker?: Point;
  polyline: Point[];
  night: boolean;
  address?: string;
};
const initialState: State = {
  marker: undefined,
  polyline: [],
  night: false,
  address: undefined,
};

const YandexMap = memo(() => {
  const [isInitialized, setIsInitialized] = useState(false);
  const mapRef = useRef<YaMap | null>(null);
  const [region, setRegion] = useState({
    lat: 55.751244,
    lon: 37.618423,
    zoom: 10,
    azimuth: 0,
  });

  const getCurrentPosition = useCallback(async () => {
    return new Promise<CameraPosition>((resolve) => {
      if (mapRef.current) {
        mapRef.current.getCameraPosition((position) => {
          resolve(position);
        });
      }
    });
  }, []);

  //   useEffect(() => {
  //     if (!isInitialized) {
  //       YaMap.init(yandexApi).then(() => {
  //         setIsInitialized(true); // Устанавливаем флаг после инициализации
  //       });
  //       getCurrentPosition().then((res) => console.log("res :>> ", res));
  //     }
  //   }, [isInitialized]);

  //   useEffect(() => {
  //     if (mapRef.current) {
  //       mapRef.current.setCenter({
  //         lat: 55.751244,
  //         lon: 37.618423,
  //         zoom: 10,
  //       });
  //     }
  //   }, []);
  const handleMapLoaded = () => {};

  return (
    <View style={styles.container}>
      <YaMap
        key={mapKey}
        ref={mapRef}
        userLocationIcon={cargps}
        userLocationIconScale={0.1}
        showUserPosition
        // onMapLoaded={}
        nightMode
        followUser
        initialRegion={region}
        style={styles.container}
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
    </View>
  );
});

export default YandexMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
