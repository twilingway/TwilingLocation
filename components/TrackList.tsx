import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationObject } from "expo-location";
import { exportTrackAsGPX } from "../utils/trackManager";
import emitter from "../utils/eventEmitter";

export default function TrackList() {
  const [tracks, setTracks] = useState<
    {
      name: string;
      points: number;
      start?: string;
      end?: string;
      size?: number;
    }[]
  >([]);

  const load = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const trackKeys = keys.filter((k) =>
      /^track_\d{4}-\d{2}-\d{2}_\d+$/.test(k)
    );

    const result = await Promise.all(
      trackKeys.map(async (key) => {
        const raw = await AsyncStorage.getItem(key);
        const data: LocationObject[] = raw ? JSON.parse(raw) : [];
        const size = new Blob([raw || ""]).size;

        return {
          name: key,
          points: data.length,
          start: data[0]?.timestamp
            ? new Date(data[0].timestamp).toLocaleTimeString()
            : "-",
          end: data[data.length - 1]?.timestamp
            ? new Date(data[data.length - 1].timestamp).toLocaleTimeString()
            : "-",
          size,
        };
      })
    );

    setTracks(
      result.sort((a, b) => {
        const t1 = a.end ?? 0;
        const t2 = b.end ?? 0;
        console.log("t1 :>> ", t1);
        return t2.toLowerCase().localeCompare(t1.toLowerCase());
      })
    );
  };

  const handleDelete = async (key: string) => {
    Alert.alert("Удалить трек", `Вы уверены, что хотите удалить ${key}?`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(key);
          load();
        },
      },
    ]);
  };

  useEffect(() => {
    load();
    const listener = () => load();
    emitter.on("trackUpdated", listener);
    return () => {
      emitter.off("trackUpdated", listener);
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Список треков:</Text>
      {tracks.map((t) => (
        <View key={t.name} style={styles.trackBox}>
          <Text style={styles.trackTitle}>📍 {t.name}</Text>
          <Text>Точек: {t.points}</Text>
          <Text>Начало: {t.start}</Text>
          <Text>Конец: {t.end}</Text>
          <Text>Размер: {(t.size! / 1024).toFixed(1)} КБ</Text>
          <View style={styles.buttons}>
            <Button title="📤 GPX" onPress={() => exportTrackAsGPX(t.name)} />
            <Button
              title="🗑 Удалить"
              color="#cc0000"
              onPress={() => handleDelete(t.name)}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 24 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  trackBox: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 12,
  },
  trackTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
