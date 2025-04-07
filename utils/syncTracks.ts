import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LocationObject } from "expo-location";

interface Track {
  date: string;
  coordinates: LocationObject[];
}

const API_URL = "https://your-api.com/sync";

export async function syncTracks(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log("keys :>> ", keys);
    const trackKeys = keys.filter((key) => key.startsWith("track_"));

    for (const key of trackKeys) {
      const data = await AsyncStorage.getItem(key);
      console.log("data :>> ", data?.length);
      if (data) {
        const track: Track = {
          date: key.replace("track_", ""),
          coordinates: JSON.parse(data),
        };
        // console.log("track :>> ", track);
        try {
          console.log("axios.post :>> ");
          await axios.post(API_URL, track);
        } catch (error) {
          console.log("error post :>> ", error);
        }
        await AsyncStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error("Ошибка синхронизации треков:", error);
  }
}
