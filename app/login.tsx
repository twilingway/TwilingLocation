/* eslint-disable react-native/no-inline-styles */
import { useScreenOrientation } from "@/shared/hooks/useScreenOrientation";
import { router } from "expo-router";
import { Orientation } from "expo-screen-orientation";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import cargps from "../assets/images/cargps.png";
import { loginAtom } from "../entities/auth/model/auth.state";
import { Button } from "../shared/Button/Button";
import { CustomLink } from "../shared/CustomLink/CustomLink";
import { ErrorNotification } from "../shared/ErrorNotification/ErrorNotification";
import { Input } from "../shared/Input/Input";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

// Типизация данных геолокации
type LocationData = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

// Фоновая задача
TaskManager.defineTask<Location.LocationData>(
  LOCATION_TASK_NAME,
  ({ data, error }) => {
    if (error) {
      console.error("Ошибка фоновой задачи:", error);
      return;
    }
    if (data) {
      const { latitude, longitude } = data.locations[0].coords;
      const locationData: LocationData = {
        latitude,
        longitude,
        timestamp: Date.now(),
      };
      // Сохраняем данные в AsyncStorage
      AsyncStorage.getItem("locations")
        .then((value) => {
          const locations = value ? JSON.parse(value) : [];
          locations.push(locationData);
          return AsyncStorage.setItem("locations", JSON.stringify(locations));
        })
        .catch((err) => console.error("Ошибка сохранения:", err));
    }
  }
);

export default function Login() {
  // const token2 = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  // console.log("token2 :>> ", token2);
  const [status, setStatus] = React.useState<string>("");

  const [localError, setLocalError] = useState<string | undefined>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [{ accessToken, isLoading, error }, login] = useAtom(loginAtom);

  const orientation = useScreenOrientation();

  // const alert = () => {
  //   setError("неверный логин или пароль");
  //   setTimeout(() => {
  //     setError(undefined);
  //   }, 3500);
  // };

  const submit = () => {
    if (!email) {
      setLocalError("Не введен email");
      return;
    }
    if (!password) {
      setLocalError("Не введен пароль");
      return;
    }
    login({ email, password });
  };

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  useEffect(() => {
    const startBackgroundLocation = async () => {
      try {
        // Запрос разрешений
        const { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== "granted") {
          setStatus("Разрешение на геолокацию отклонено");
          return;
        }

        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
          setStatus("Разрешение на фоновую геолокацию отклонено");
          return;
        }

        // Запуск фонового отслеживания
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Каждые 5 секунд
          distanceInterval: 10, // Каждые 10 метров
          foregroundService: {
            notificationTitle: "GPS активен",
            notificationBody: "Приложение работает в фоне",
          },
        });
        setStatus("Отслеживание запущено");
      } catch (error) {
        setStatus(`Ошибка: ${error.message}`);
      }
    };

    startBackgroundLocation();
  }, []);

  useEffect(() => {
    if (accessToken) {
      router.replace("/(home)");
    }
  }, [accessToken]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ErrorNotification message={localError} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <Text style={styles.logoTitle}>Twiling Location</Text>
          <Image source={cargps} style={styles.logo} resizeMode="cover" />
          <View style={styles.form}>
            <View
              style={{
                ...styles.inputs,
                flexDirection:
                  orientation === Orientation.PORTRAIT_UP ||
                  orientation === Orientation.UNKNOWN
                    ? "column"
                    : "row",
              }}
            >
              <Input
                styleView={{
                  width:
                    orientation === Orientation.PORTRAIT_UP ||
                    orientation === Orientation.UNKNOWN
                      ? "auto"
                      : Dimensions.get("window").width / 2 - 16 - 24,
                }}
                placeholder="E-mail"
                onChangeText={setEmail}
                value={email}
              />
              <Input
                styleView={{
                  width:
                    orientation === Orientation.PORTRAIT_UP ||
                    orientation === Orientation.UNKNOWN
                      ? "auto"
                      : Dimensions.get("window").width / 2 - 16 - 24,
                }}
                placeholder="Пароль"
                isPassword
                onChangeText={setPassword}
                value={password}
              />
            </View>

            <Button title="ВОЙТИ2" onPress={submit} isLoading={isLoading} />
          </View>
          <CustomLink href={"/restore"} text="Восстановить пароль" />
          {/* <CustomLink href={"/(home)/course/ts"} text="Course" />
        <CustomLink href={"/(home)"} text="App" /> */}
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Это важно для корректного поведения ScrollView
    // justifyContent: "center",
    // alignItems: "center",
    // flex: 1,
  },
  container: {
    justifyContent: "center",
    // alignItems: "center",
    flex: 1,
    padding: 32,
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 500,
  },
  content: {
    alignItems: "center",
    gap: 12,
  },
  form: {
    alignSelf: "stretch",
    gap: 16,
  },
  inputs: {
    gap: 16,
    // flexDirection: "column",
  },
  // input: {
  //   // width: "auto",
  //   flex: 1,
  // },
  // inputPortrait: {
  //   width: Dimensions.get("window").width / 2 - 16,
  // },
});
