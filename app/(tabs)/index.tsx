import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import TrackList from "../../components/TrackList";
import { startLocationUpdates } from "../../tasks/locationTask";
import emitter from "../../utils/eventEmitter";
import {
  clearActiveTrack,
  generateNextTrackName,
  getActiveTrackName,
  setActiveTrackName,
} from "../../utils/trackManager";

// стандартный импорт
import * as TaskManager from "expo-task-manager";
const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask("LocationTask", async () => {
  await startLocationUpdates();
});

export default function IndexScreen() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const init = async () => {
      const fg = await Location.requestForegroundPermissionsAsync();
      const bg = await Location.requestBackgroundPermissionsAsync();

      if (fg.status !== "granted" || bg.status !== "granted") return;

      const track = await getActiveTrackName();
      setActiveTrack(track);

      if (track) {
        const isRunning =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (!isRunning) await startLocationUpdates();
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 0,
        },
        (loc) => setCurrentLocation(loc)
      );
    };

    init();
    return () => subscription && subscription.remove();
  }, []);

  const handleStartNew = async () => {
    const name = await generateNextTrackName();
    await setActiveTrackName(name);
    setActiveTrack(name);

    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => {});
    await startLocationUpdates();
  };

  const handleStop = async () => {
    await clearActiveTrack();
    setActiveTrack(null);
  };

  const handleResume = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const validTracks = keys.filter((k) =>
      /^track_\d{4}-\d{2}-\d{2}_\d+$/.test(k)
    );
    const sorted = validTracks.sort((a, b) => b.localeCompare(a));
    const lastTrack = sorted[0];

    if (lastTrack) {
      await setActiveTrackName(lastTrack);
      setActiveTrack(lastTrack);
    } else {
      const name = await generateNextTrackName();
      await setActiveTrackName(name);
      setActiveTrack(name);
    }

    await new Promise((res) => setTimeout(res, 200));
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => {});
    await startLocationUpdates();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Button
          title="🚦 Остановить фоновый трекинг"
          color="#cc0000"
          onPress={() =>
            Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
              .then(() => {
                console.log("⏹ Фоновая задача остановлена");
              })
              .catch(console.warn)
          }
        />
        <Button
          title="🚀 Запустить фоновый трекинг"
          onPress={() =>
            Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
              .then(async (isRunning) => {
                if (!isRunning) {
                  await startLocationUpdates();
                  console.log("▶️ Фоновая задача запущена вручную");
                }
              })
              .catch(console.warn)
          }
        />
      </View>

      <Button
        title="🧹 Очистить всё"
        color="#cc0000"
        onPress={() => {
          (async () => {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(
              () => {}
            );
            await AsyncStorage.clear();

            const newTrack = await generateNextTrackName();
            await setActiveTrackName(newTrack);
            setActiveTrack(newTrack);

            emitter.emit("trackUpdated", []);
            console.log(
              "🧼 AsyncStorage очищен и новый трек создан:",
              newTrack
            );

            const fg = await Location.requestForegroundPermissionsAsync();
            const bg = await Location.requestBackgroundPermissionsAsync();
            if (fg.status === "granted" && bg.status === "granted") {
              await startLocationUpdates();
            }
          })();
        }}
      />

      <View style={styles.currentLocation}>
        <Text style={styles.title}>Текущее местоположение:</Text>
        {currentLocation ? (
          <>
            <Text selectable>
              Широта: {currentLocation.coords.latitude.toFixed(6)}
            </Text>
            <Text selectable>
              Долгота: {currentLocation.coords.longitude.toFixed(6)}
            </Text>
            <Text>
              Скорость: {(currentLocation.coords.speed ?? 0).toFixed(2)} м/с
            </Text>
            <Text>
              Обновлено:{" "}
              {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
              <Button
                title="📋 Копировать"
                onPress={() => {
                  const text = `${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}`;
                  require("expo-clipboard").setStringAsync(text);
                }}
              />
              <Button
                title="📤 Поделиться"
                onPress={() => {
                  const text = `Моё местоположение: https://maps.google.com/?q=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
                  require("expo-sharing").shareAsync(undefined, {
                    dialogTitle: "Поделиться координатами",
                    mimeType: "text/plain",
                    UTI: "public.plain-text",
                    message: text,
                  });
                }}
              />
            </View>
          </>
        ) : (
          <Text>Получение координат...</Text>
        )}
      </View>

      <View>
        <Text style={styles.title}>Активный трек: {activeTrack ?? "нет"}</Text>
        {activeTrack ? (
          <Button title="⏸ Остановить трек" onPress={handleStop} />
        ) : (
          <>
            <Button title="▶️ Начать новый трек" onPress={handleStartNew} />
            <Button title="🔁 Продолжить трек" onPress={handleResume} />
          </>
        )}
      </View>

      <TrackList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  currentLocation: { marginBottom: 16 },
  title: { fontSize: 16, fontWeight: "bold" },
});
