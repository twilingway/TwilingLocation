import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import emitter from "../utils/eventEmitter";
import { getActiveTrackName } from "../utils/trackManager";

const LOCATION_TASK_NAME = "background-location-task";

interface LocationData {
  locations: Location.LocationObject[];
}

TaskManager.defineTask<LocationData>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.log("❌ Ошибка фоновой задачи:", error.message);
      return;
    }

    if (!data || !data.locations || data.locations.length === 0) {
      console.log("⚠️ Нет данных геолокации");
      return;
    }

    const { locations } = data;
    const trackName = await getActiveTrackName();
    if (!trackName) {
      console.log("⚠️ Нет активного трека, координаты не будут записаны");
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem(trackName);
      const existingTrack: Location.LocationObject[] = existingData
        ? JSON.parse(existingData)
        : [];

      const updatedTrack = [...existingTrack, ...locations];

      await AsyncStorage.setItem(trackName, JSON.stringify(updatedTrack));

      console.log(
        "📦 trackUpdated :>>",
        new Date().toISOString(),
        "| точек всего:",
        updatedTrack.length
      );

      emitter.emit("trackUpdated", updatedTrack);
    } catch (storageError) {
      console.error("❌ AsyncStorage error:", storageError);
    }
  }
);

export async function startLocationUpdates(): Promise<void> {
  console.log("📡 Пытаемся запустить фоновое отслеживание...");
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === Location.PermissionStatus.GRANTED) {
    await Location.startLocationUpdatesAsync("background-location-task", {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 10,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Геолокация активна",
        notificationBody: "Трекинг местоположения в фоне.",
      },
    });
    console.log("✅ Фоновая задача запущена");
  } else {
    console.error("❌ Нет разрешения на фоновую геолокацию");
  }
}
